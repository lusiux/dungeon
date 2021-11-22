<script>
	import Inventory from "./Inventory.svelte";
	import Room from "./Room.svelte";

	import roomStore from "../stores/Room"
	import gameStore from "../stores/Game"
	import { newGame, startUp } from "../Facade";

	function reloadState() {
		startUp()
	}

  function startNewGame() {
    newGame()
  }
</script>

<div>
  <div>
    id: {$gameStore.id}
    <button on:click={startNewGame}>Start new game</button>
    <button on:click={reloadState}>Reload</button>
  </div>
	{#if $gameStore.id !== ''}
		{#if $roomStore !== undefined}
		<Room />
		{/if}
		<h1>Player</h1>
		<Inventory />
	{/if}
</div>

<style>
	div {
		max-width: 1024px;
	}

	:global(div.control-container) {
		margin-right: 1.3rem;
	}
</style>
