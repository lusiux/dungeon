<script lang="ts">
  import { moveToRoom } from "../Facade"
  import roomStore from "../stores/Room"
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
