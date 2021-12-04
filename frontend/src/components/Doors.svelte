<script lang="ts">
  import { moveToRoom } from '../Facade'
  import roomStore from '../stores/Room'
</script>

<style lang="scss">
  @import '../style/vars.scss';

  .control-container div {
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

  div.hint {
    white-space: normal;
    font-size: 0.6rem;
    margin-top: 0.8rem;
  }
</style>

<div class="control-container">
  <h1>Doors</h1>
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
  <div class="hint">
    Hint: You can also use the arrow keys on your keyboard
  </div>
</div>
