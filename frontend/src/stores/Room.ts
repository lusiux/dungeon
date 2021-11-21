import { writable } from "svelte/store";

import type { Room } from "src/types";

const room : Room = {
    doors: {},
}

export default writable<Room>(room)