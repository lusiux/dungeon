<script lang="ts">
  import inventoryStore from "../stores/Inventory"
  import type { Item, Socket } from "../types"
  import { plugItem } from "../Facade"
  import roomStore from "../stores/Room"

  function pluggable(inventory: Item[], socket: Socket): boolean {
    if ( socket.powered === false ) {
      return false
    }

    const item = inventory.find((item) => item.name === socket.item.name);
    if (item === undefined) {
      return false
    }

    if (item.quantity < socket.item.quantity) {
      return false
    }

    return true
  }
</script>

{#if $roomStore.socket !== undefined}
<div class="control-container">
  <h3>Power socket</h3>
  <p>Plug {$roomStore.socket.item.quantity} {$roomStore.socket.item.name} here</p>
  <button disabled={!pluggable($inventoryStore, $roomStore.socket)} on:click={plugItem}>Plug</button>
</div>
{/if}
