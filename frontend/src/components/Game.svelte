<script lang="ts">
  import Inventory from "./Inventory.svelte";
  import Room from "./Room.svelte";

  import roomStore from "../stores/Room";
  import gameStore from "../stores/Game";
  import { leaveGame } from "../Facade";
</script>

{#if $gameStore.id !== ""}
  <div>
    <h1>Game</h1>
    id: {$gameStore.id}
    <button on:click={leaveGame}>Leave game</button>
  </div>
  <div>
    {#if $roomStore !== undefined}
      <Room />
    {/if}
    <h1>Player</h1>
    <Inventory />
  </div>
{/if}

<style>
  div {
    max-width: 1024px;
  }

  :global(div.control-container) {
    margin-right: 1.3rem;
  }
</style>
