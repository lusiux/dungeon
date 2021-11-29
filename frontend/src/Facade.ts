import type { Game, HallOfFameEntry, Room } from './types'
import roomStore, { reset as resetRoomStore } from './stores/Room'
import inventoryStore, { reset as resetInventoryStore } from './stores/Inventory'
import gameStore, { getGameId, getRoomId } from './stores/Game'
import hofStore from './stores/HallOfFame'

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
  await updateHallOfFame()

  gameStore.set({ id: '', roomId: '' })
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

async function _get<T> (url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(await response.text())
  }

  return await response.json()
}

async function _post<T> (url: string, body?: any): Promise<T> {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }

  const response = await fetch(url, requestOptions)

  if (!response.ok) {
    throw new Error(await response.text())
  }

  return await response.json()
}
