<script lang="ts">
  import inventoryStore from "../stores/Inventory";
</script>

<div class="control-container">
  <h2>Inventory</h2>
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
</div>
