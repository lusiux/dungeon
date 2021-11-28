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
	<div class="main">
		<div class="start">
			<div>Enter your name to start the game</div>
			<div><input type="text" bind:value={nickName} placeholder="Nickname" /></div>
			<button disabled={nickName === undefined || nickName === ""}  on:click={startNewGame}>Start new game</button>
		</div>
		<div class="resume">
				<h3>Resume existing game</h3>
				id: <input type="text" bind:value={newGameId} />
				<button disabled={newGameId === undefined || newGameId === ""} on:click={resumeExistingGame}>
					Resume game
				</button>
		</div>
	</div>
	<HallOfFame />
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

	div.main > div {
		margin: 1rem;
		text-align: center;
		border: 2px solid black;
		padding: 1.5rem;
	}
</style>
