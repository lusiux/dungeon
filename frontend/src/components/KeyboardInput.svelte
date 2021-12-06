<script>
    import socketStore from "../stores/Socket"
    import workbenchStore from "../stores/Workbench"
    import roomStore from "../stores/Room"

    import { plugItem, craftItem, pickChest, moveToRoom } from "../Facade"

    function handleSpace() {
        if ($socketStore === undefined && $workbenchStore === undefined && $roomStore.chest !== undefined) {
            pickChest()
        } else if ($socketStore === undefined && $workbenchStore !== undefined && $roomStore.chest === undefined) {
            craftItem()
        } else if ($socketStore !== undefined && $workbenchStore === undefined && $roomStore.chest === undefined) {
            plugItem()
        }
    }

    const keyboardBindings = {
        'ArrowUp': () => moveToRoom($roomStore.doors.north),
        'ArrowDown': () => moveToRoom($roomStore.doors.south),
        'ArrowLeft': () => moveToRoom($roomStore.doors.west),
        'ArrowRight': () => moveToRoom($roomStore.doors.east),
        'KeyW': () => moveToRoom($roomStore.doors.north),
        'KeyS': () => moveToRoom($roomStore.doors.south),
        'KeyA': () => moveToRoom($roomStore.doors.west),
        'KeyD': () => moveToRoom($roomStore.doors.east),
        'KeyH': () => moveToRoom($roomStore.doors.west),
        'KeyJ': () => moveToRoom($roomStore.doors.south),
        'KeyK': () => moveToRoom($roomStore.doors.north),
        'KeyL': () => moveToRoom($roomStore.doors.east),
        'Space': handleSpace
    }

    function handleKeydown(event) {
        if (keyboardBindings[event.code] === undefined) return

        event.preventDefault()
        event.stopPropagation()

        keyboardBindings[event.code]()
    }
</script>

<svelte:window on:keydown={handleKeydown}/>
