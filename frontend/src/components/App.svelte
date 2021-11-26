<script lang="ts">
	import gameStore from "../stores/Game";
	
	import Startscreen from './Startscreen.svelte'
	import Game from "./Game.svelte";

	import '../style/reset.scss'
	import '../style/general.scss'
</script>

{#if $gameStore.id === ""}
	<Startscreen />
{:else}
	<Game />
{/if}
