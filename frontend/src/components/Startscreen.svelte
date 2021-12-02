<script lang="ts">
	import { navigate } from "svelte-navigator";

	import { newGame, resumeGame } from "../Facade";
	import { onEnter } from "../util/onEnter";

	import AppMeta from "./AppMeta.svelte";

	import gameStore from "../stores/Game";

	let resumeGameId: string
	let nickName: string

	async function resumeExistingGame(gameId: string) {
		await resumeGame(gameId)

		navigate('/game')
	}

	async function startNewGame() {
		if (nickName === undefined || nickName === '') {
			return
		}

		await newGame(nickName)
		nickName = ''

		navigate('/game')
	}
</script>

<main>
    <h1>Welcome!</h1>

	{#if $gameStore.id !== ''}
		<h3>Resume current game</h3>

		<button on:click={() => resumeExistingGame($gameStore.id)}>
			Game-Id: {$gameStore.id.substr(0, 4)}...
		</button>
	{/if}

	<h3>Enter your name to start a new game</h3>
	<input type="text" bind:value={nickName} on:keypress={onEnter(startNewGame)} placeholder="Nickname" />
	<button disabled={nickName === undefined || nickName === ""} on:click={startNewGame}>Start new game</button>

    <h3>Resume existing game</h3>
    <input type="text" placeholder="Game-ID" bind:value={resumeGameId} />

    <button disabled={resumeGameId === undefined || resumeGameId === ""} on:click={() => resumeExistingGame(resumeGameId)}>
        Resume game
    </button>

	<hr>

	<button on:click={() => navigate('/hall-of-fame')}>
        Hall of Fame
    </button>

	<AppMeta />
</main>

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

	hr {
		margin-top: 2rem;
		margin-bottom: 3rem;
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