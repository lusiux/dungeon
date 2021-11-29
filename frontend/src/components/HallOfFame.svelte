<script lang="ts">
  import hofStore from "../stores/HallOfFame";
</script>

<h3>Hall of Fame</h3>
<table>
  <tr>
  <th>Nick</th>
  <th>Items plugged</th>
  <th>Actions performed</th>
  <th>Time elapsed [minutes]</th>
</tr>
  {#each $hofStore as entry}
    <tr>
      <td>{entry.nickName}</td>
      <td class="right">{entry.plugs}</td>
      <td class="right">{entry.actions}</td>
      <td class="right">{(entry.time/60).toFixed(1)}</td>
    </tr>
  {/each}
</table>

<style>
	h3 {
		margin-top: 3rem;
		margin-bottom: 1rem;
	}

  td.right {
    text-align: right;
  }
</style>
