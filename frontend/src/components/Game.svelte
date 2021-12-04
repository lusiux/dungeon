<script lang="ts">
  import { navigate } from 'svelte-navigator'

  import Inventory from './Inventory.svelte'
  import Room from './Room.svelte'
  import Doors from './Doors.svelte'

  import roomStore from '../stores/Room'
  import gameStore from '../stores/Game'
  import AppMeta from './AppMeta.svelte'

  $: gameId = $gameStore.id
  $: shortGameId = gameId !== undefined ? gameId.substring(0, 4) : ''

  let revealCompleteId = false
</script>

<main>
  {#if $gameStore.id !== ""}
    <div class="box game">
      <div class="game-id" on:click={() => revealCompleteId = !revealCompleteId}> 
        <h1>Game</h1>

        {#if revealCompleteId}
          Game-Id: {gameId} (click to hide)
        {:else}
          Game-Id: {shortGameId}... (click to reveal)
        {/if}
      </div>

      <button on:click={() => navigate('/hall-of-fame')}>Hall of Fame</button>
      <button on:click={() => navigate('/')}>Back</button>
    </div>

    <div class="details">
      {#if $roomStore !== undefined}
        <div class="box room">
          <Room />
        </div>
      {/if}

      <div class="doors-inventory">
        <div class="box">
          <Doors />
        </div>
        <div class="box">
          <Inventory />
        </div>
      </div>
    </div>
  {/if}

  <AppMeta />
</main>

<style lang="scss">
  @import "../style/vars.scss";

  .details {
    @media (min-width: $breakpoint-medium) {
      display: flex;
      flex-direction: row;
      width: 100%;

      .room {
        width: 60%;
      }

      .doors-inventory {
        width: 40%;
      }
    }
  }

  .game-id {
    cursor: pointer;
    font-size: 13px;
  }

  .game {
    display: flex;
    flex-wrap: wrap;

    .game-id {
      flex-grow: 1;
    }

    button {
      white-space: nowrap;
      min-width: 12rem;
      margin-left: 0.5rem;
    }
  }
</style>