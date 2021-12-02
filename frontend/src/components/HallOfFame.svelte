<script lang="ts">
  import { onMount } from 'svelte/internal'
  import { navigate } from "svelte-navigator";

  import hofStore from "../stores/HallOfFame";
  import { updateHallOfFame } from '../Facade';

  import formatTime from "../util/formatTime";

  onMount(updateHallOfFame)
</script>

<main>
  <h3>Hall of Fame</h3>

  <table>
    <tr>
    <th>nick</th>
    <th># plugged</th>
    <th>actions</th>
    <th>time </th>
  </tr>
    {#each $hofStore as entry}
      <tr>
        <td>{entry.nickName}</td>
        <td class="right">{entry.plugs}</td>
        <td class="right">{entry.actions}</td>
        <td class="right time">{formatTime(entry.time)}</td>
      </tr>
    {/each}
  </table>

  <button on:click={() => navigate(-1)}>Back</button>
</main>

<style lang="scss">
	h3 {
    text-align: center;
		margin-top: 3rem;
		margin-bottom: 1rem;
	}

  main {
    margin: 0 auto;
    padding: 0 3rem;
    width: 80%;
    max-width: 800px;

    table {
      margin: 0 auto;
    }
  }

  td.right {
    text-align: right;
  }

  td.time {
    padding-left: 1rem;
  }

  button {
    display: block;
    width: 60%;
    margin: 3rem auto;
  }
</style>
