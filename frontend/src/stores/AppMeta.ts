import { writable } from 'svelte/store'

interface AppMeta {
    loading: boolean
    error?: string
}

const game: AppMeta = {
  loading: false
}

export default writable<AppMeta>(game)