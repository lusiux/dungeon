import type { Room } from './types'
import roomStore from './stores/Room'
import inventoryStore from './stores/Inventory'

async function updateRoom() : Promise<void> {
  const room : Room = await (await fetch('http://localhost:3000/api/game/1/room/1')).json()
  roomStore.set(room)
}

async function updateInventory() : Promise<void> {
    const { inventory } = await (await fetch('http://localhost:3000/api/game/1/inventory')).json()
    inventoryStore.set(inventory)
}

export async function startUp() {
    updateRoom()
    updateInventory()
}