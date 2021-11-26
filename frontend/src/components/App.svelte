<script lang="ts">
	import gameStore from "../stores/Game";
	import { newGame, resumeGame } from "../Facade";
	import Game from "./Game.svelte";
	import HallOfFame from "./HallOfFame.svelte";

	let newGameId: string;
	let nickName: string

	async function resumeExistingGame() {
		await resumeGame(newGameId)
		newGameId = ''
	}

	async function startNewGame() {
		await newGame(nickName)
		nickName = ''
	}
</script>

{#if $gameStore.id === ""}
	<main>
		<h1>Welcome!</h1>

		<div>Enter your name to start the game</div>
		<input type="text" bind:value={nickName} placeholder="Nickname" />
		<button disabled={nickName === undefined || nickName === ""} on:click={startNewGame}>Start new game</button>

		<h3>Resume existing game</h3>

		<input type="text" placeholder="id" bind:value={newGameId} />

		<button disabled={newGameId === undefined || newGameId === ""} on:click={resumeExistingGame}>
			Resume game
		</button>

		<HallOfFame />
	</main>
{:else}
	<Game />
{/if}

<style type="text/scss">
	main {
		border: 1px solid red;
		margin: 0 auto;
		width: 40%;
		max-width: 1024px;
		text-align: center;
	}

	h1 {
		margin: 3rem 0;
	}

	h3 {
		margin-top: 3rem;
		margin-bottom: 1rem;
	}

	input {
		padding: 1rem;
		margin-bottom: 1rem;
		width: 100%;
	}

	button {
		margin-bottom: 1rem;
	}

</style>
