import { get, writable } from 'svelte/store'
import type { Room } from 'src/types'

const room: Room = {
  id: '',
  doors: {}
}

export function getRoomId (): string {
  return get(store).id
}

const store = writable<Room>(room)

export default store
