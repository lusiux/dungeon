<script lang="ts">
  import hofStore from "../stores/HallOfFame";

  import formatTime from "../util/formatTime";
</script>

<div>
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
</div>

<style lang="scss">
	h3 {
    text-align: center;
		margin-top: 3rem;
		margin-bottom: 1rem;
	}

  div {
    margin: 0 auto;
    padding: 0 3rem;
    width: 60%;

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
</style>
