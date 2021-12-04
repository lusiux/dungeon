<script lang="ts">
  import inventoryStore from '../stores/Inventory'
</script>

<style>
  tr td:first-of-type, tr th:first-of-type {
    text-align: right;
    padding-right: 0.5rem;
  }

  th {
    text-align: left;
  }
</style>

<h1>Inventory</h1>
{#if $inventoryStore.length > 0}
  <table>
    <tr>
      <th>qty</th>
      <th>item</th>
    </tr>

    {#each $inventoryStore as item}
      <tr>
        <td>{item.quantity}</td>
        <td>{item.name}</td>
      </tr>
    {/each}

  </table>
{:else}
  ---
{/if}