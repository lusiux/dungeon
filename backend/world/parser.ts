import { readFile } from 'fs/promises'

import { Doors, Room } from '../types'

interface Tile {
    id: number
    properties?: {name: string, value: string | boolean | number}[]
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
}

interface Layer {
    name: string
    objects: LayerObject[]
}

interface Dungeon {
    tilesets: Tileset<string>[]
    layers: Layer[]
}

async function run() {
    const fileContent = await readFile (__dirname + '/dungeon.json', 'utf8')
    const parsed = JSON.parse(fileContent) as Dungeon
    
    const roomLayer = parsed.layers.find(layer => layer.name === 'Rooms')
    const roomTileset: RoomsTileset = parsed.tilesets.find(tileset => tileset.name === 'Rooms') as RoomsTileset
    const parsedRoomTileset = parseTileset(roomTileset)
    const parsedRooms = parseRooms(roomLayer?.objects as LayerObject[], parsedRoomTileset)
    
    
}

function parseRooms(objects: LayerObject[], tiles: ParsedTile[]): Room[] {
    return objects.map(object => {
        const tile = tiles.find(tile => tile.gid === object.gid)

        const x = object.x / 32
        const y = (object.y / 32) - 1
        const id = `${x}x${y}`

        return {
            id,
            x,
            y,
            doors: {
                north: tile?.properties?.north ? `${x}x${y - 1}` : undefined,
                east: tile?.properties?.east ? `${x + 1}x${y}` : undefined,
                south: tile?.properties?.south ? `${x}x${y + 1}` : undefined,
                west: tile?.properties?.west ? `${x - 1}x${y}` : undefined
            }
        }
    })
}

function parseTileset(tileset: Tileset<string>): ParsedTile[] {
    const firstgid = tileset.firstgid

    return tileset.tiles.map(tile => {
        const gid = tile.id + firstgid
        let properties = {}
        
        if (tile.properties !== undefined) {
            properties = tile.properties.reduce((acc, prop) => {
                acc[prop.name] = prop.value
                return acc
            }, {})
        }

        return { gid, properties }
    })
}

run()