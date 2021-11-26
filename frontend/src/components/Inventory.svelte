<script lang="ts">
  import inventoryStore from "../stores/Inventory";
</script>

<!-- todo: show nothing if no inventory -->

<h2>Inventory</h2>
{#if $inventoryStore.length > 0}
  <table>
    <tr>
      <th>Item</th>
      <th>Quantity</th>
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