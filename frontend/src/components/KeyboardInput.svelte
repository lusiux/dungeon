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

    function handleKeydown(event) {
        if (event.code === 'Space') {
            return handleSpace()
        }
        
        if (event.key === 'ArrowUp' && $roomStore.doors.north !== undefined) {
            moveToRoom($roomStore.doors.north)
        }

        if (event.key === 'ArrowDown' && $roomStore.doors.south !== undefined) {
            moveToRoom($roomStore.doors.south)
        }

        if (event.key === 'ArrowLeft' && $roomStore.doors.west !== undefined) {
            moveToRoom($roomStore.doors.west)
        }

        if (event.key === 'ArrowRight' && $roomStore.doors.east !== undefined) {
            moveToRoom($roomStore.doors.east)
        }
    }
</script>

<svelte:window on:keydown={handleKeydown}/>