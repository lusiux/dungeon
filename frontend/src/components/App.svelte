<script>
	import Inventory from "./Inventory.svelte";
	import Room from "./Room.svelte";
</script>

<div>
	<h1>Room</h1>
	<Room />
	<h1>Player</h1>
	<Inventory />
</div>

<style>
	div {
		max-width: 1024px;
	}
</style>
