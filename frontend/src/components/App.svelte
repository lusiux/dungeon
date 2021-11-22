<script>
	import Inventory from "./Inventory.svelte";
	import Room from "./Room.svelte";

	import roomStore from "../stores/Room"
	import { startUp } from "../Facade";

	function reloadState() {
		startUp()
	}
</script>

<div>
	<div>
		<button on:click={reloadState}>Reload</button>
	</div>
	{#if $roomStore !== undefined}
	<Room />
	{/if}
	<h1>Player</h1>
	<Inventory />
</div>

<style>
	div {
		max-width: 1024px;
	}
</style>
