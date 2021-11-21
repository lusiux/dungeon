
export type Item = {
    name: string
    quantity: number
}

export type Doors = {
    north?: string
    east?: string
    south?: string
    west?: string
}

export type Workbench = {
    input: Item
    output: Item
}

export type Chest = {
    item: Item
}

export type Socket = {
    powered: boolean
}

export type Room = {
    doors: Doors
    workbench?: Workbench
    chest?: Chest
    socket?: Socket
}
