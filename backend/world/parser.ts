import { readFile } from 'fs/promises'
import path from 'path'

import { Room, Workbench } from '../types'

interface Tile {
  id: number
  properties?: Array<{name: string, value: string | boolean | number}>
}

interface ParsedTile {
  gid: number
  properties: Record<string, any>
}

interface Tileset<Name extends string> {
  firstgid: number
  name: Name
  tiles: Tile[]
}
type RoomsTileset = Tileset<'Rooms'>

interface LayerObject {
  id: number
  gid: number
  x: number
  y: number
  properties?: Array<{name: string, value: string | boolean | number}>
}

interface Layer {
  name: string
  objects: LayerObject[]
}

interface Dungeon {
  tilesets: Array<Tileset<string>>
  layers: Layer[]
}

async function run (): Promise<void> {
  const fileContent = await readFile(path.join(__dirname, '/dungeon.json'), 'utf8')
  const parsed = JSON.parse(fileContent) as Dungeon

  const roomLayer = parsed.layers.find(layer => layer.name === 'Rooms')
  const roomTileset: RoomsTileset = parsed.tilesets.find(tileset => tileset.name === 'Dungeon') as RoomsTileset
  const parsedRoomTileset = parseTileset(roomTileset)
  const parsedRooms = parseRooms(roomLayer?.objects as LayerObject[], parsedRoomTileset)

  const chestLayer = parsed.layers.find(layer => layer.name === 'Chests')
  parseChests(chestLayer?.objects as LayerObject[], parsedRooms)

  const socketLayer = parsed.layers.find(layer => layer.name === 'Sockets')
  parseSockets(socketLayer?.objects as LayerObject[], parsedRooms)

  const workbenchLayer = parsed.layers.find(layer => layer.name === 'Workbench')
  parseWorkbenches(workbenchLayer?.objects as LayerObject[], parsedRooms)

  console.log(JSON.stringify(parsedRooms))
}

function parseSockets (objects: LayerObject[], rooms: Room[]): void {
  for (const object of objects) {
    const properties = listToRecord(object.properties)
    const { id: roomId } = parseCoordinates(object)

    const room = rooms.find(room => room.id === roomId)
    if (room === undefined) {
      throw new Error(`No room found for socket with id ${object.id}`)
    }
    if (room.socket !== undefined) {
      throw new Error(`Socket already exists for room with id ${room.id}`)
    }

    const targetRoom = rooms.find(room => room.tid === properties.destination.toString())
    if (targetRoom === undefined) {
      throw new Error(`Can't find target room for socket with id ${object.id}`)
    }

    room.socket = {
      item: {
        name: properties.item,
        quantity: properties.quantity
      },
      targetRoom: targetRoom.id,
      powered: true
    }
  }
}

function parseChests (objects: LayerObject[], rooms: Room[]): void {
  for (const object of objects) {
    const properties = listToRecord(object.properties)
    const { id } = parseCoordinates(object)

    if (properties.name === undefined || properties.quantity === undefined) {
      throw new Error(`name and/or quantity is missing in properties of objec ${object.id}`)
    }

    const room = rooms.find(room => room.id === id)
    if (room === undefined) {
      throw new Error(`No room found for chest with id ${object.id}`)
    }
    if (room.chest !== undefined) {
      throw new Error(`Chest already exists for room with id ${room.id}`)
    }

    room.chest = {
      item: {
        name: properties.name,
        quantity: properties.quantity
      }
    }
  }
}

type Recipes = Record<string, Workbench>

const recipes: Recipes = {
  Bronze: {
    inputs: [{
      name: 'Copper',
      quantity: 1
    }, {
      name: 'Tin',
      quantity: 1
    }],
    output: {
      name: 'Bronze',
      quantity: 1
    }
  },
  Toaster: {
    inputs: [
      {
        name: 'Copper',
        quantity: 2
      },
      {
        name: 'Bronze',
        quantity: 1
      },
      {
        name: 'Tin',
        quantity: 1
      }
    ],
    output: {
      name: 'Toaster',
      quantity: 1
    }
  }
}

function parseWorkbenches (objects: LayerObject[], rooms: Room[]): void {
  for (const object of objects) {
    const properties = listToRecord(object.properties)
    const { id } = parseCoordinates(object)

    if (properties.recipe === undefined) {
      throw new Error(`Recipe not defined for ${object.id}`)
    }

    const recipe = recipes[properties.recipe]
    if (recipe === undefined) {
      throw new Error(`matching recipe for ${properties.recipe} not found`)
    }

    const room = rooms.find(room => room.id === id)
    if (room === undefined) {
      throw new Error(`No room found for workbench with id ${object.id}`)
    }
    if (room.workbench !== undefined) {
      throw new Error(`Workbench already exists for room with id ${room.id}`)
    }

    room.workbench = recipe
  }
}

function parseRooms (objects: LayerObject[], tiles: ParsedTile[]): Room[] {
  return objects.map(object => {
    const tile = tiles.find(tile => tile.gid === object.gid)
    const { x, y, id } = parseCoordinates(object)
    const properties = listToRecord(object.properties)

    return {
      id,
      tid: object.id.toString(),
      doors: {
        north: tile?.properties?.north !== undefined ? `${x}x${y - 1}` : undefined,
        east: tile?.properties?.east !== undefined ? `${x + 1}x${y}` : undefined,
        south: tile?.properties?.south !== undefined ? `${x}x${y + 1}` : undefined,
        west: tile?.properties?.west !== undefined ? `${x - 1}x${y}` : undefined
      },
      description: properties.description
    }
  })
}

function parseCoordinates (object: LayerObject): {x: number, y: number, id: string } {
  const x = object.x / 32
  const y = (object.y / 32) - 1
  const id = `${x}x${y}`

  return { x, y, id }
}

function listToRecord (list: Array<Record<string, any>> | undefined): Record<string, any> {
  if (list === undefined) {
    return {}
  }

  return list.reduce((acc, prop) => {
    acc[prop.name] = prop.value
    return acc
  }, {})
}

function parseTileset (tileset: Tileset<string>): ParsedTile[] {
  const firstgid = tileset.firstgid

  return tileset.tiles.map(tile => {
    const gid = tile.id + firstgid

    return { gid, properties: listToRecord(tile.properties) }
  })
}

run().finally(() => true)
