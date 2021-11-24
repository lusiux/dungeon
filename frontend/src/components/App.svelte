<script lang="ts">
	import gameStore from "../stores/Game";
	import { newGame as startNewGame, resumeGame, startUp } from "../Facade";
	import Game from "./Game.svelte";

	let newGameId: string;
</script>

{#if $gameStore.id === ""}
	<div class="main">
		<div>
			<button on:click={startNewGame}>Start new game</button>
		</div>
		<div>
				<h3>Resume existing game</h3>
				id: <input type="text" bind:value={newGameId} />
				<button disabled={newGameId === undefined || newGameId === ""} on:click={() => resumeGame(newGameId)}>
					Resume game
				</button>
		</div>
	</div>
{:else}
	<Game />
{/if}

<style>
	div.main {
		margin: auto;
		width: 30%;
		height: 300px;
		max-width: 1024px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	div.main div {
		margin: 1rem;
		text-align: center;
	}
</style>
