import { get, writable } from 'svelte/store'
import type { Game } from 'src/types'

const game: Game = {
  id: ''
}

export function getGameId (): string {
  return get(store).id
}

const store = writable<Game>(game)

export default store
