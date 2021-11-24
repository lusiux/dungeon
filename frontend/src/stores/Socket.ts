import type { Item, Socket } from '../types'
import { derived } from 'svelte/store'
import inventoryStore from './Inventory'
import roomStore from './Room'

export interface ExtendedSocket extends Socket {
  pluggable: boolean
}

function pluggable (inventory: Item[], socket: Socket): boolean {
  if (!socket.powered) {
    return false
  }

  const item = inventory.find((item) => item.name === socket.item.name)
  if (item === undefined) {
    return false
  }

  if (item.quantity < socket.item.quantity) {
    return false
  }

  return true
}

export default derived([inventoryStore, roomStore], ([$inventoryStore, $roomStore]) => {
  if ($roomStore.socket === undefined) {
    return undefined
  }

  const workbench: ExtendedSocket = {
    ...$roomStore.socket,
    pluggable: pluggable($inventoryStore, $roomStore.socket)
  }
  return workbench
})
