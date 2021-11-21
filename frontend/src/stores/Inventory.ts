import { writable } from "svelte/store";

import type { Item } from "src/types";

export default writable<Item[]>([
    {name: 'Iron', quantity: 10},
    {name: 'Copper', quantity: 2}
])