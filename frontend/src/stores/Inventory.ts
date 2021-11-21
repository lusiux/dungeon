import { writable } from "svelte/store";

import type { Item } from "src/types";

export default writable<Item[]>([])