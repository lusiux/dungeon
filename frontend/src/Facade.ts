import type { Game, HallOfFameEntry, Room } from './types'
import roomStore, { reset as resetRoomStore } from './stores/Room'
import inventoryStore, { reset as resetInventoryStore } from './stores/Inventory'
import gameStore, { getGameId, getRoomId } from './stores/Game'
import hofStore from './stores/HallOfFame'
import appMetaStore from './stores/AppMeta'

export async function initiate() {
  const gameId = getGameId() // from local storage
  if (gameId === '') {
    return
  }

  await startUp()
}

async function updateRoom (): Promise<void> {
  const gameId = getGameId()
  const roomId = getRoomId()
  const room = await _get<Room>(`/api/game/${gameId}/room/${roomId}`)
  roomStore.set(room)
}

export async function moveToRoom (roomId: string | undefined): Promise<void> {
  if (roomId === undefined) {
    return
  }
  const gameId = getGameId()
  const room = await _get<Room>(`/api/game/${gameId}/room/${roomId}`)
  roomStore.set(room)
  gameStore.set({ id: gameId, roomId })
}

export async function pickChest (): Promise<void> {
  const gameId = getGameId()
  const roomId = getRoomId()
  const { inventory } = await _post<any>(`/api/game/${gameId}/room/${roomId}/pickChest`)
  await updateRoom()
  inventoryStore.set(inventory)
}

export async function craftItem (): Promise<void> {
  const gameId = getGameId()
  const roomId = getRoomId()
  const { inventory } = await _post<any>(`/api/game/${gameId}/room/${roomId}/craft`)
  inventoryStore.set(inventory)
}

async function updateInventory (): Promise<void> {
  const gameId = getGameId()
  const { inventory } = await _get<any>(`/api/game/${gameId}/inventory`)
  inventoryStore.set(inventory)
}

export async function newGame (nickname: string): Promise<void> {
  const { id, roomId } = await _post<any>('/api/game', { nickname })
  gameStore.set({ id, roomId })

  await startUp()
}

async function getGame (id: string): Promise<Game> {
  return await _get<Game>(`/api/game/${id}`)
}

export async function plugItem (): Promise<void> {
  const gameId = getGameId()
  const roomId = getRoomId()
  const { id } = await _post<any>(`/api/game/${gameId}/room/${roomId}/plug`)
  await updateInventory()
  await moveToRoom(id)
}

export async function resumeGame (gameId: string): Promise<void> {
  const game = await getGame(gameId)
  gameStore.set({ id: gameId, roomId: game.roomId })

  await startUp()
}

export async function startUp (): Promise<void> {
  await updateRoom()
  await updateInventory()
  await updateHallOfFame()
}

export async function leaveGame (): Promise<void> {
  resetRoomStore()
  resetInventoryStore()

  gameStore.set({ id: '', roomId: '' })

  await updateHallOfFame()
}

async function getHallOfFame (): Promise<HallOfFameEntry[]> {
  return await _get<HallOfFameEntry[]>('/api/halloffame')
}

export async function updateHallOfFame (): Promise<void> {
  const hofEntries = await getHallOfFame()

  hofEntries.sort((a: HallOfFameEntry, b: HallOfFameEntry): number => {
    if ( a.plugs !== b.plugs ) {
      return b.plugs - a.plugs
    }

    if ( a.time !== b.time ) {
      return a.time - b.time
    }

    return a.actions - b.actions
  })

  hofEntries.splice(30)

  hofStore.set(hofEntries)
}

function loadingState(loading: boolean) {
  appMetaStore.update(state => ({ ...state, loading }))
}

function errorState(errorMessage: string) {
  appMetaStore.update(state => ({ ...state, error: errorMessage }))

  setTimeout(() => {
    appMetaStore.update(state => ({ ...state, error: undefined }))
  }, 5000)
}

async function _get<T> (url: string): Promise<T> {
  return __execute<T>(url)
}

async function _post<T> (url: string, data?: any): Promise<T> {
  return __execute<T>(url, 'POST', data)
}

async function __execute<T>(url: string, method: 'GET' | 'PUT' | 'POST' = 'GET', bodyData?: any): Promise<T> {
  loadingState(true)

  const body = method === 'GET' || bodyData === undefined ? undefined : JSON.stringify(bodyData)
  const headers = { 
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  const response = await fetch(url, { method, headers, body })
  if (!response.ok) {
    const errorMessage = await response.text()

    errorState(errorMessage)
    loadingState(false)
    throw new Error(errorMessage)
  }

  const jsonResult = await response.json()
  loadingState(false)

  return jsonResult
}