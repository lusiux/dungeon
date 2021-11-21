import { writable } from "svelte/store";

import type { Room } from "src/types";

const room : Room = {
    doors: {
        north: '123',
        south: '123123'
    },
    workbench: {
        input: {
            name: 'Iron',
            quantity: 1,
        },
        output: {
            name: 'Copper',
            quantity: 1
        }
    },
    chest: {
        item: {
            name: 'Iron',
            quantity: 1,
        }
    },
    socket: {
        powered: false
    }
}

export default writable<Room>(room)