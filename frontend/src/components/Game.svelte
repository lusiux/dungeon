<script lang="ts">
  import Inventory from "./Inventory.svelte";
  import Room from "./Room.svelte";

  import roomStore from "../stores/Room";
  import gameStore from "../stores/Game";
  import { leaveGame } from "../Facade";

  $: gameId = $gameStore.id
  $: shortGameId = gameId !== undefined ? gameId.substring(0, 4) : ''

  let revealCompleteId = false
</script>

{#if gameId !== ""}
  <div>
    <h1>Game</h1>
    <div class="game-id" on:click={() => revealCompleteId = true}> 
      {#if revealCompleteId}
        Game-Id: {gameId}
      {:else}
        Game-Id: {shortGameId}... (click to reveal)
      {/if}
    </div>

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
  .game-id {
    cursor: pointer;
  }

  div {
    max-width: 1024px;
  }

  :global(div.control-container) {
    margin-right: 1.3rem;
  }
</style>
