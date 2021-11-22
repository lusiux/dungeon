<script lang="ts">
  import { moveToRoom } from "../Facade";
  import type { Doors } from "../types";

  export let doors: Doors

  function moveNorth() {
    if ( doors.north === undefined ) {
      return
    }

    moveToRoom(doors.north)
  }

  function moveEast() {
    if ( doors.east === undefined ) {
      return
    }

    moveToRoom(doors.east)
  }
  function moveSouth() {
    if ( doors.south === undefined ) {
      return
    }

    moveToRoom(doors.south)
  }
  function moveWest() {
    if ( doors.west === undefined ) {
      return
    }

    moveToRoom(doors.west)
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

<div>
  <h2>Doors</h2>
  <div class="buttons">
    <div>
      <button disabled={doors.north === undefined} on:click={moveNorth}>North</button>
    </div>
    <div>
      <button disabled={doors.west === undefined} on:click={moveWest}>West</button>
      <button disabled={doors.east === undefined} on:click={moveEast}>East</button>
    </div>
    <div>
      <button disabled={doors.south === undefined} on:click={moveSouth}>South</button>
    </div>
  </div>
</div>
