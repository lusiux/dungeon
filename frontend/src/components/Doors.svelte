<script lang="ts">
  import { moveToRoom } from "../Facade"
  import roomStore from "../stores/Room"

  function moveNorth() {
    if ( $roomStore.doors.north === undefined ) {
      return
    }

    moveToRoom($roomStore.doors.north)
  }

  function moveEast() {
    if ( $roomStore.doors.east === undefined ) {
      return
    }

    moveToRoom($roomStore.doors.east)
  }

  function moveSouth() {
    if ( $roomStore.doors.south === undefined ) {
      return
    }

    moveToRoom($roomStore.doors.south)
  }

  function moveWest() {
    if ( $roomStore.doors.west === undefined ) {
      return
    }

    moveToRoom($roomStore.doors.west)
  }
</script>

<style>
  .buttons div {
    text-align: center;
  }

  .buttons button {
    margin: 0.4rem;
  }
</style>

<div class="control-container">
  <h3>Doors</h3>
  <div class="buttons">
    <div>
      <button disabled={$roomStore.doors.north === undefined} on:click={moveNorth}>North</button>
    </div>
    <div>
      <button disabled={$roomStore.doors.west === undefined} on:click={moveWest}>West</button>
      <button disabled={$roomStore.doors.east === undefined} on:click={moveEast}>East</button>
    </div>
    <div>
      <button disabled={$roomStore.doors.south === undefined} on:click={moveSouth}>South</button>
    </div>
  </div>
</div>
