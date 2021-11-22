import { writable } from 'svelte/store'
import type { Item } from 'src/types'

export function reset (): void {
  store.set([])
}

const store = writable<Item[]>([])
export default store
