<script lang="ts">
  import Inventory from "./Inventory.svelte";
  import Room from "./Room.svelte";
  import Doors from "./Doors.svelte";
  import Debug from "./Debug.svelte";

  import roomStore from "../stores/Room";
  import gameStore from "../stores/Game";
  import { leaveGame } from "../Facade";

  $: gameId = $gameStore.id
  $: shortGameId = gameId !== undefined ? gameId.substring(0, 4) : ''

  let revealCompleteId = false
</script>

<Debug />

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
      {#if $roomStore !== undefined}
        <div class="box room">
          <Room />
        </div>
      {/if}

      <div class="box doors">
          <Doors />
      </div>

      <div class="box player">
        <Inventory />
      </div>
    </div>
  {/if}
</main>

<style lang="scss">
  @import "../style/vars.scss";

  .details {
    @media (min-width: $breakpoint-medium) {
      display: flex;
      flex-direction: row;
      width: 100%;

      .player {
        width: 25%;
      }

      .doors {
        width: 30%;
      }

      .room {
        width: 45%;
      }
    }
  }

  .game-id {
    cursor: pointer;
  }
</style>