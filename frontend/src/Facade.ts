import type { Game, Room } from './types'
import roomStore, { reset as resetRoomStore } from './stores/Room'
import inventoryStore, { reset as resetInventoryStore } from './stores/Inventory'
import gameStore, { getGameId, getRoomId } from './stores/Game'

async function updateRoom (): Promise<void> {
  const gameId = getGameId()
  const roomId = getRoomId()
  const room: Room = await (await fetch(`/api/game/${gameId}/room/${roomId}`)).json()
  roomStore.set(room)
}

export async function moveToRoom (roomId: string | undefined): Promise<void> {
  if (roomId === undefined) {
    return
  }
  const gameId = getGameId()
  const room: Room = await (await fetch(`/api/game/${gameId}/room/${roomId}`)).json()
  roomStore.set(room)
  gameStore.set({ id: gameId, roomId })
}

export async function pickChest (): Promise<void> {
  const gameId = getGameId()
  const roomId = getRoomId()
  const { inventory } = await (await fetch(`/api/game/${gameId}/room/${roomId}/pickChest`, { method: 'POST' })).json()
  await updateRoom()
  inventoryStore.set(inventory)
}

export async function craftItem (): Promise<void> {
  const gameId = getGameId()
  const roomId = getRoomId()
  const { inventory } = await (await fetch(`/api/game/${gameId}/room/${roomId}/craft`, { method: 'POST' })).json()
  inventoryStore.set(inventory)
}

async function updateInventory (): Promise<void> {
  const gameId = getGameId()
  const { inventory } = await (await fetch(`/api/game/${gameId}/inventory`)).json()
  inventoryStore.set(inventory)
}

export async function newGame (): Promise<void> {
  const { id, roomId } = await (await fetch('/api/game', { method: 'POST' })).json()
  gameStore.set({ id, roomId })

  await startUp()
}

async function getGame (id: string): Promise<Game> {
  return await (await fetch(`/api/game/${id}`)).json()
}

export async function plugItem (): Promise<void> {
  const gameId = getGameId()
  const roomId = getRoomId()
  const { id } = await (await fetch(`/api/game/${gameId}/room/${roomId}/plug`, { method: 'POST' })).json()
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
}

export async function leaveGame (): Promise<void> {
  resetRoomStore()
  resetInventoryStore()

  gameStore.set({ id: '', roomId: '' })
}
