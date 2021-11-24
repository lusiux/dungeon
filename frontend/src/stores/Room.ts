import { get, writable } from 'svelte/store'
import type { Room } from '../types'

const room: Room = {
  id: '1',
  doors: {}
}

export function getRoomId (): string {
  return get(store).id
}

export function reset (): void {
  store.set(room)
}

const store = writable<Room>(room)

export default store
