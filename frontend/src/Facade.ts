import type { Room } from './types'
import roomStore, { getRoomId } from './stores/Room'
import inventoryStore from './stores/Inventory'
import gameStore, { getGameId } from './stores/Game'

async function updateRoom (): Promise<void> {
  const gameId = getGameId()
  const roomId = getRoomId()
  const room: Room = await (await fetch(`/api/game/${gameId}/room/${roomId}`)).json()
  roomStore.set(room)
}

export async function moveToRoom (roomId: string): Promise<void> {
  const gameId = getGameId()
  const room: Room = await (await fetch(`/api/game/${gameId}/room/${roomId}`)).json()
  roomStore.set(room)
}

export async function pickChest (): Promise<void> {
  const gameId = getGameId()
  const roomId = getRoomId()
  const { inventory } = await (await fetch(`/api/game/${gameId}/room/${roomId}/pickChest`)).json()
  await updateRoom()
  inventoryStore.set(inventory)
}

export async function craftItem (): Promise<void> {
  const gameId = getGameId()
  const roomId = getRoomId()
  const { inventory } = await (await fetch(`/api/game/${gameId}/room/${roomId}/craft`)).json()
  inventoryStore.set(inventory)
}

async function updateInventory (): Promise<void> {
  const gameId = getGameId()
  const { inventory } = await (await fetch(`/api/game/${gameId}/inventory`)).json()
  inventoryStore.set(inventory)
}

export async function newGame (): Promise<void> {
  const { id } = await (await fetch('/api/game', { method: 'POST' })).json()
  gameStore.set({ id })
  await updateRoom()
  await updateInventory()
}

export async function startUp (): Promise<void> {
  await updateRoom()
  await updateInventory()
}
