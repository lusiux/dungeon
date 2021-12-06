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

    const listOfKeys = [
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'KeyW', 'KeyS', 'KeyA', 'KeyD',
        'Space'
    ]

    function handleKeydown(event) {
        if (listOfKeys.includes(event.code)) {
            event.preventDefault()
            event.stopPropagation()
        }

        if (event.code === 'Space') {
            return handleSpace()
        } else if (event.code === 'ArrowUp' || event.code === 'KeyW') {
            moveToRoom($roomStore.doors.north)
        } else if (event.code === 'ArrowDown' || event.code === 'KeyS') {
            moveToRoom($roomStore.doors.south)
        } else if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
            moveToRoom($roomStore.doors.west)
        } else if (event.code === 'ArrowRight' || event.code === 'KeyD') {
            moveToRoom($roomStore.doors.east)
        }
    }
</script>

<svelte:window on:keydown={handleKeydown}/>