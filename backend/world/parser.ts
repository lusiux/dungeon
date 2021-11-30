import { readFile } from 'fs/promises'
import path from 'path'
import { v4 as uuid } from 'uuid'

import Papa from 'papaparse'
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

import { Item, Room, Workbench } from '../src/types'

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
  const recipeFileContent = await readFile('recipes.csv', 'utf8')
  const recipeList = (await Papa.parse(recipeFileContent))
  parseRecipes(recipeList.data as string[][])

  const fileContent = await readFile(path.join(__dirname, '/dungeon.json'), 'utf8')
  const parsed = JSON.parse(fileContent) as Dungeon

  const roomLayer = parsed.layers.find(layer => layer.name === 'Rooms')
  const roomTileset: RoomsTileset = parsed.tilesets.find(tileset => tileset.name === 'Dungeon') as RoomsTileset
  const parsedRoomTileset = parseTileset(roomTileset)
  const parsedRooms = parseRooms(roomLayer?.objects as LayerObject[], parsedRoomTileset)
  updateDoors(parsedRooms)

  const chestLayer = parsed.layers.find(layer => layer.name === 'Chests')
  parseChests(chestLayer?.objects as LayerObject[], parsedRooms)

  const socketLayer = parsed.layers.find(layer => layer.name === 'Sockets')
  parseSockets(socketLayer?.objects as LayerObject[], parsedRooms)

  const workbenchLayer = parsed.layers.find(layer => layer.name === 'Workbench')
  parseWorkbenches(workbenchLayer?.objects as LayerObject[], parsedRooms)

  const spawnLayer = parsed.layers.find(layer => layer.name === 'Spawn')
  const spawnRoomId = parseSpawnPoint(spawnLayer?.objects as LayerObject[], parsedRooms)

  console.log(JSON.stringify({ rooms, start: spawnRoomId }))
}

function parseSpawnPoint (objects: LayerObject[], rooms: Room[]): string {
  if (objects.length !== 1) {
    throw new Error('No or more than one spawnpoint present on Spawn layer')
  }

  const { x, y } = parseCoordinates(objects[0])
  const spawnRoomId = roomIdLookupTable[`${x}x${y}`]

  if (spawnRoomId === undefined) {
    throw new Error(`No room found for spawnpoint at ${x}x${y}`)
  }

  return spawnRoomId
}

function updateDoors (rooms: Room[]): void {
  for (const room of rooms) {
    if (room.doors.north !== undefined) {
      room.doors.north = roomIdLookupTable[room.doors.north]
    }
    if (room.doors.east !== undefined) {
      room.doors.east = roomIdLookupTable[room.doors.east]
    }
    if (room.doors.south !== undefined) {
      room.doors.south = roomIdLookupTable[room.doors.south]
    }
    if (room.doors.west !== undefined) {
      room.doors.west = roomIdLookupTable[room.doors.west]
    }
  }
}

function parseSockets (objects: LayerObject[], rooms: Room[]): void {
  for (const object of objects) {
    const properties = listToRecord(object.properties)
    const { id } = parseCoordinates(object)

    const room = roomLookupTable[id]
    if (room === undefined) {
      throw new Error(`No room found for socket with id ${object.id}`)
    }
    if (room.socket !== undefined) {
      throw new Error(`Socket already exists for room with id ${id}`)
    }

    const targetRoomId = properties.destination.toString()
    const targetRoom = roomLookupTable[targetRoomId]
    if (targetRoom === undefined) {
      throw new Error(`Can't find target room for socket with id ${object.id}`)
    }

    room.socket = {
      item: {
        name: properties.item,
        quantity: properties.quantity
      },
      targetRoom: roomIdLookupTable[targetRoomId],
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

    const room = roomLookupTable[id]
    if (room === undefined) {
      throw new Error(`No room found for chest with id ${object.id}`)
    }
    if (room.chest !== undefined) {
      throw new Error(`Chest already exists for room with id ${id}`)
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

const recipes: Recipes = {}

function cellToItem (cell: string): Item {
  const [quantity, ...nameArray] = cell.trim().split(' ')
  const name = nameArray.join(' ')

  return {
    name,
    quantity: parseFloat(quantity)
  }
}

function parseRecipes (recipeList: string[][]): void {
  for (const row of recipeList) {
    const outputItemCell = row.shift()
    if (outputItemCell === undefined || outputItemCell.length < 2) {
      continue
    }
    if (outputItemCell.trim() === '') {
      continue
    }

    const outputItem = cellToItem(outputItemCell)
    const recipe: Workbench = {
      inputs: [],
      output: outputItem
    }

    for (const inputItemCell of row) {
      if (inputItemCell.trim() === '') {
        continue
      }
      recipe.inputs.push(cellToItem(inputItemCell))
    }

    recipes[recipe.output.name] = recipe
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

    const room = roomLookupTable[id]
    if (room === undefined) {
      throw new Error(`No room found for workbench with id ${object.id}`)
    }
    if (room.workbench !== undefined) {
      throw new Error(`Workbench already exists for room with id ${id}`)
    }

    room.workbench = recipe
  }
}

const roomLookupTable: Record<string, Room> = {}
const roomIdLookupTable: Record<string, string> = {}
const rooms: Record<string, Room> = {}
const mnemonicLookup: Record<string, boolean> = {}

function parseRooms (objects: LayerObject[], tiles: ParsedTile[]): Room[] {
  return objects.map(object => {
    const tile = tiles.find(tile => tile.gid === object.gid)
    const { x, y, id } = parseCoordinates(object)
    const properties = listToRecord(object.properties)

    const mnemonic: string = uniqueNamesGenerator({
      separator: ' ',
      dictionaries: [adjectives, animals]
    });

    if (mnemonicLookup[mnemonic] !== undefined) {
      // this should never happen and I'm too lazy to make a loop to find a unique mnemonic
      throw new Error(`mnemonic ${mnemonic} already exists`)
    }

    mnemonicLookup[mnemonic] = true

    const room = {
      doors: {
        north: tile?.properties?.north !== undefined ? `${x}x${y - 1}` : undefined,
        east: tile?.properties?.east !== undefined ? `${x + 1}x${y}` : undefined,
        south: tile?.properties?.south !== undefined ? `${x}x${y + 1}` : undefined,
        west: tile?.properties?.west !== undefined ? `${x - 1}x${y}` : undefined
      },
      description: properties.description,
      mnemonic: mnemonic.toLowerCase()
    }

    const uid = uuid()
    roomLookupTable[id] = room
    roomLookupTable[object.id.toString()] = room
    roomIdLookupTable[id] = uid
    roomIdLookupTable[object.id.toString()] = uid
    rooms[uid] = room

    return room
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
