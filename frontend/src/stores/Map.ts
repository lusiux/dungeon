import type { Doors } from 'src/types'
import { writable } from 'svelte/store'

export interface RoomCoord {
  x: number
  y: number
  id: string
  type: 'unknown' | 'visited'
}

export const currentPositionStore = writable<{x: number, y: number}>({ x: 0, y: 0 })

const store = writable<RoomCoord[]>([
  {
    x: 0,
    y: 0,
    id: 'foo',
    type: 'unknown'
  },
  {
    x: 1,
    y: 2,
    id: 'foo',
    type: 'unknown'
  },
  {
    x: 2,
    y: 0,
    id: 'foo',
    type: 'unknown'
  },
  {
    x: 3,
    y: 0,
    id: 'foo',
    type: 'unknown'
  }

])
export default store

export function addRoom (coords: RoomCoord): void {
  store.update(rooms => {
    rooms.push(coords)
    return rooms
  })
}

export function visitRoom (id: string, doors: Doors | undefined): void {
  store.update(rooms => {
    let room = rooms.find(room => room.id === id)
    if (room !== undefined) {
      room.type = 'visited'
    } else {
      room = {
        id: id,
        x: 0,
        y: 0,
        type: 'visited'
      }
      rooms = [room]
    }

    currentPositionStore.set({
      x: room.x,
      y: room.y
    })

    if (doors?.north !== undefined && (rooms.find(room => room.id === doors.north) === undefined)) {
      rooms.push({
        x: room.x,
        y: room.y - 1,
        id: doors.north,
        type: 'unknown'
      })
    }
    if (doors?.east !== undefined && (rooms.find(room => room.id === doors.east) === undefined)) {
      rooms.push({
        x: room.x + 1,
        y: room.y,
        id: doors.east,
        type: 'unknown'
      })
    }
    if (doors?.south !== undefined && (rooms.find(room => room.id === doors.south) === undefined)) {
      rooms.push({
        x: room.x,
        y: room.y + 1,
        id: doors.south,
        type: 'unknown'
      })
    }
    if (doors?.west !== undefined && (rooms.find(room => room.id === doors.west) === undefined)) {
      rooms.push({
        x: room.x - 1,
        y: room.y,
        id: doors.west,
        type: 'unknown'
      })
    }
    return rooms
  })
}
