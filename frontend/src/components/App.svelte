<script lang="ts">
	import { Router, Route } from "svelte-navigator";

	import gameStore from "../stores/Game";

	import Startscreen from './Startscreen.svelte'
	import Game from "./Game.svelte";
	import HallOfFame from "./HallOfFame.svelte";
	import Debug from "./Debug.svelte";

	import '../style/reset.scss'
	import '../style/general.scss'
</script>

<Router>
	<Route component={Startscreen} />
	<Route path="/hall-of-fame" component={HallOfFame} />
	<Route path="/game">
		{#if $gameStore.id === ''}
			No active Game
		{:else}
			<Game />
		{/if}
	</Route>
</Router>

<Debug />