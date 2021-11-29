<script lang="ts">
  import { moveToRoom } from "../Facade"
  import roomStore from "../stores/Room"
</script>

<style type="text/scss">
  @import '../style/vars.scss';

  .buttons div {
    text-align: center;
  }

  button {
    margin: 0.4rem;
    width: 12rem;
    min-width: 12rem;

    @media (min-width: $breakpoint-medium) {
        width: 7rem;
        min-width: 7rem;
    }
  }

  div {
    white-space: nowrap;
  }
</style>

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
