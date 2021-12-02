<script lang="ts">
	import gameStore from "../stores/Game";

	import Startscreen from './Startscreen.svelte'
	import Game from "./Game.svelte";
	import HallOfFame from "./HallOfFame.svelte";

  import { Router, Route } from "svelte-routing";

	import '../style/reset.scss'
	import '../style/general.scss'
</script>

<Router>
	<Route path="/hall-of-fame" component="{HallOfFame}" />
	<Route>
		{#if $gameStore.id === ""}
			<Startscreen />
		{:else}
			<Game />
		{/if}
	</Route>
</Router>
