import type { Doors, Room } from 'src/types'
import { writable } from 'svelte/store'

export interface RoomCoord {
  x: number
  y: number
  id: string
  type: 'unknown' | 'visited'
}

export const currentPositionStore = writable<{x: number, y: number}>({ x: 0, y: 0 })
export const workbenchStore = writable<Array<{ x: number, y: number }>>([])
export const chestStore = writable<Array<{ x: number, y: number }>>([])
export const plugStore = writable<Array<{ x: number, y: number }>>([])

const store = writable<RoomCoord[]>([])
export default store

export function visitRoom (id: string, doors: Doors | undefined, roomInfo: Room): void {
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
      currentPositionStore.set({ x: 0, y: 0 })
      workbenchStore.set([])
      chestStore.set([])
      plugStore.set([])
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

    if (roomInfo.workbench !== undefined) {
      workbenchStore.update(workbenches => {
        if (room !== undefined) {
          const workbench = workbenches.find(workbench => workbench.x === room.x && workbench.y === room.y)

          if (workbench === undefined) {
            workbenches.push({ x: room.x, y: room.y })
          }
        }
        return workbenches
      })
    }

    if (roomInfo.chest !== undefined) {
      chestStore.update(chests => {
        if (room !== undefined) {
          const chest = chests.find(chest => chest.x === room.x && chest.y === room.y)

          if (chest === undefined) {
            chests.push({ x: room.x, y: room.y })
          }
        }
        return chests
      })
    }

    if (roomInfo.socket !== undefined) {
      plugStore.update(sockets => {
        if (room !== undefined) {
          const socket = sockets.find(socket => socket.x === room.x && socket.y === room.y)

          if (socket === undefined) {
            sockets.push({ x: room.x, y: room.y })
          }
        }
        return sockets
      })
    }

    return rooms
  })
}
