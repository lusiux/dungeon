import { writable } from 'svelte/store'
import type { Room } from '../types'

const room: Room = {
  doors: {}
}

export function reset (): void {
  store.set(room)
}

const store = writable<Room>(room)

export default store
