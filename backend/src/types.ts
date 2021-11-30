export interface Item {
  name: string
  quantity: number
}

export interface Inventory {
  inventory: Item[]
}

export interface Doors {
  north?: string
  east?: string
  south?: string
  west?: string
}

export interface Workbench {
  inputs: Item[]
  output: Item
}

export interface Chest {
  item: Item
}

export interface Socket {
  powered: boolean
  item: Item
  targetRoom: string
}

export interface Room {
  mnemonic?: string
  description?: string
  doors: Doors
  workbench?: Workbench
  chest?: Chest
  socket?: Socket
}

export interface GameState {
  id: string
  roomId: string
}

export function getWorkbench (room: Room): Workbench {
  if (room.workbench === undefined) {
    throw new Error('No workbench found')
  }
  return room.workbench
}

export function getSocket (room: Room): Socket {
  if (room.socket === undefined) {
    throw new Error('No socket found in room')
  }
  return room.socket
}

export function getChest (room: Room): Chest {
  if (room.chest === undefined) {
    throw new Error('No chest foundin room')
  }
  return room.chest
}
