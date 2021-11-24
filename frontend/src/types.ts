
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
}

export interface Room {
  id: string
  description?: string
  doors: Doors
  workbench?: Workbench
  chest?: Chest
  socket?: Socket
}

export interface Game {
  id: string
  roomId: string
}
