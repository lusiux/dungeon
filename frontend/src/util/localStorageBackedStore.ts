import { writable, Writable, get } from 'svelte/store'

function localStorageBackedStore<T> (key: string, initialValue: T): Writable<T> {
  const store = writable(initialValue)
  const { subscribe, set } = store

  const json = localStorage.getItem(key)

  if (json !== null) {
    set(JSON.parse(json))
  }

  const myStore = {
    set (value: T) {
      localStorage.setItem(key, JSON.stringify(value))
      set(value)
    },

    update (cb: (current: T) => T) {
      const value = cb(get(store))
      myStore.set(value)
    },

    subscribe
  }

  return myStore
}

export default localStorageBackedStore
