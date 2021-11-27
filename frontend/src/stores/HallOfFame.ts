import { writable } from 'svelte/store'
import type { HallOfFameEntry } from '../types'

export default writable<HallOfFameEntry[]>([])
