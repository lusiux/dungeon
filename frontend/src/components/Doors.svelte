<script lang="ts">
  import { moveToRoom } from "../Facade"
  import roomStore from "../stores/Room"

	function handleKeydown(event: any) {
    if (event.keyCode < 37 || event.keyCode > 40) {
      return
    }

    event.preventDefault()
    
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

<style lang="scss">
  @import '../style/vars.scss';

  .buttons div {
    text-align: center;
  }

  button {
    margin: 0.4rem;
    width: 40%;
    min-width: 6rem;
  }

  div {
    white-space: nowrap;
  }
</style>

<svelte:window on:keydown={handleKeydown}/>

<div class="control-container">
  <h1>Doors</h1>
  <div class="buttons">
    <div>
      <button disabled={$roomStore.doors.north === undefined} on:click={() => moveToRoom($roomStore.doors.north)}>North</button>
    </div>
    <div>
      <button disabled={$roomStore.doors.west === undefined} on:click={() => moveToRoom($roomStore.doors.west)}>West</button>
      <button disabled={$roomStore.doors.east === undefined} on:click={() => moveToRoom($roomStore.doors.east)}>East</button>
    </div>
    <div>
      <button disabled={$roomStore.doors.south === undefined} on:click={() => moveToRoom($roomStore.doors.south)}>South</button>
    </div>
  </div>
</div>
