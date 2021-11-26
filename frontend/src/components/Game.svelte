<script lang="ts">
  import Inventory from "./Inventory.svelte";
  import Room from "./Room.svelte";
  import Doors from "./Doors.svelte";

  import roomStore from "../stores/Room";
  import gameStore from "../stores/Game";
  import { leaveGame } from "../Facade";

  $: gameId = $gameStore.id
  $: shortGameId = gameId !== undefined ? gameId.substring(0, 4) : ''

  let revealCompleteId = false
</script>

<main>
  {#if $gameStore.id !== ""}
    <div class="box game">
      <h1>Game</h1>

      <div class="game-id" on:click={() => revealCompleteId = !revealCompleteId}> 
        {#if revealCompleteId}
          Game-Id: {gameId} (click to hide)
        {:else}
          Game-Id: {shortGameId}... (click to reveal)
        {/if}
      </div>

      <button on:click={leaveGame}>Leave game</button>
    </div>

    <div class="details">
      <div class="box player">
        <h1>Player</h1>
        <Inventory />
      </div>

      <div class="box doors">
          <Doors />
      </div>

      {#if $roomStore !== undefined}
        <div class="box room">
          <Room />
        </div>
      {/if}
    </div>
  {/if}
</main>

<style lang="scss">
  .game-id {
    cursor: pointer;
  }

  .details {
    display: flex;
    flex-direction: row;
    width: 100%;

    .player {
      width: 20%;
    }

    .doors {
      width: 25%;
    }

    .room {
      width: 55%;
    }
  }
</style>
