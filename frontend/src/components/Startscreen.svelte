<script lang="ts">
	import { newGame, resumeGame } from "../Facade";
	import { onEnter } from "../util/onEnter";

	import HallOfFame from "./HallOfFame.svelte";
	import AppMeta from "./AppMeta.svelte";

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

<main>
    <h1>Welcome!</h1>

	<h3>Enter your name to start the game</h3>
	<input type="text" bind:value={nickName} on:keypress={onEnter(startNewGame)} placeholder="Nickname" />
	<button disabled={nickName === undefined || nickName === ""} on:click={startNewGame}>Start new game</button>

    <h3>Resume existing game</h3>

    <input type="text" placeholder="Game-ID" bind:value={newGameId} />

    <button disabled={newGameId === undefined || newGameId === ""} on:click={resumeExistingGame}>
        Resume game
    </button>

	<AppMeta />
</main>

<HallOfFame />

<style lang="scss">
	main {
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