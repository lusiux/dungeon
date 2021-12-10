import type { Doors, Room } from 'src/types'
import { writable } from 'svelte/store'

export interface RoomCoord {
  x: number
  y: number
  id: string
  type: 'unknown' | 'visited'
  chest: boolean
  workbench: boolean
  socket: boolean
}

export const currentPositionStore = writable<{x: number, y: number}>({ x: 0, y: 0 })

const store = writable<RoomCoord[]>([])
export default store

function getRoom (rooms: RoomCoord[], id: string): RoomCoord {
  const room = rooms.find(room => room.id === id)

  if (room === undefined) {
    throw new Error('Room unknown')
  }

  return room
}

function updateCurrentPosition (room: RoomCoord): void {
  currentPositionStore.set({
    x: room.x,
    y: room.y
  })
}

function addNeighbor (rooms: RoomCoord[], room: RoomCoord, neighborId: string | undefined, [offsetX, offsetY]: [number, number]): void {
  if (neighborId === undefined) {
    return
  }
  if (rooms.find(room => room.id === neighborId) !== undefined) {
    return
  }

  rooms.push({
    x: room.x + offsetX,
    y: room.y + offsetY,
    id: neighborId,
    type: 'unknown',
    chest: false,
    workbench: false,
    socket: false
  })
}

function addNeighborRooms (rooms: RoomCoord[], room: RoomCoord, doors: Doors): void {
  addNeighbor(rooms, room, doors.north, [0, -1])
  addNeighbor(rooms, room, doors.east, [1, 0])
  addNeighbor(rooms, room, doors.south, [0, 1])
  addNeighbor(rooms, room, doors.west, [-1, 0])
}

function updateRoom (rooms: RoomCoord[], room: RoomCoord, roomInfo: Room): void {
  room.type = 'visited'
  updateCurrentPosition(room)
  addNeighborRooms(rooms, room, roomInfo.doors)
  room.chest = (roomInfo.chest !== undefined)
  room.workbench = (roomInfo.workbench !== undefined)
  room.socket = (roomInfo.socket !== undefined)
}

export function visitRoom (id: string, roomInfo: Room): void {
  store.update(rooms => {
    try {
      updateRoom(rooms, getRoom(rooms, id), roomInfo)
    } catch (e) {
      const newRoom: RoomCoord = {
        id: id,
        x: 0,
        y: 0,
        type: 'unknown',
        chest: false,
        workbench: false,
        socket: false
      }
      currentPositionStore.set({ x: 0, y: 0 })
      const newRooms = [newRoom]
      updateRoom(newRooms, newRoom, roomInfo)
      return newRooms
    }

    return rooms
  })
}
