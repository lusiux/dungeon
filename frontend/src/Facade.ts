import type { Room } from './types'
import roomStore, { getRoomId } from './stores/Room'
import inventoryStore from './stores/Inventory'

async function updateRoom (roomId: string = '1'): Promise<void> {
  const room: Room = await (await fetch(`http://localhost:3000/api/game/1/room/${roomId}`)).json()
  roomStore.set(room)
}

export async function moveToRoom (roomId: string): Promise<void> {
  const room: Room = await (await fetch(`http://localhost:3000/api/game/1/room/${roomId}`)).json()
  roomStore.set(room)
}

export async function pickChest (): Promise<void> {
  const roomId = getRoomId()
  const { inventory } = await (await fetch(`http://localhost:3000/api/game/1/room/${roomId}/pickChest`)).json()
  await updateRoom(roomId)
  inventoryStore.set(inventory)
}

export async function craftItem (): Promise<void> {
  const roomId = getRoomId()
  const { inventory } = await (await fetch(`http://localhost:3000/api/game/1/room/${roomId}/craft`)).json()
  inventoryStore.set(inventory)
}

async function updateInventory (): Promise<void> {
  const { inventory } = await (await fetch('http://localhost:3000/api/game/1/inventory')).json()
  inventoryStore.set(inventory)
}

export async function startUp (): Promise<void> {
  await updateRoom()
  await updateInventory()
}
