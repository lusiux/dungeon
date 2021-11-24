import { get, writable } from 'svelte/store'
import type { Game } from 'src/types'

const game: Game = {
  id: '',
  roomId: ''
}

export function getGameId (): string {
  return get(store).id
}

export function getRoomId (): string {
  return get(store).roomId
}

const store = writable<Game>(game)

export default store
