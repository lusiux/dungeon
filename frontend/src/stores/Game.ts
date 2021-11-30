import { get } from 'svelte/store'

import type { Game } from '../types'
import localStorageBackedStore from '../util/localStorageBackedStore'

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

const store = localStorageBackedStore<Game>('game', game)

export default store
