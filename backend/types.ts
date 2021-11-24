export interface Item {
  name: string
  quantity: number
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
  id: string
  description?: string
  doors: Doors
  workbench?: Workbench
  chest?: Chest
  socket?: Socket
}

export function getWorkbench (room: Room): Workbench {
  if (room.workbench === undefined) {
    throw new Error(`No workbench found in room with id ${room.id}`)
  }
  return room.workbench
}

export function getSocket (room: Room): Socket {
  if (room.socket === undefined) {
    throw new Error(`No socket foundin room with id ${room.id}`)
  }
  return room.socket
}

export function getChest (room: Room): Chest {
  if (room.chest === undefined) {
    throw new Error(`No chest foundin room with id ${room.id}`)
  }
  return room.chest
}
