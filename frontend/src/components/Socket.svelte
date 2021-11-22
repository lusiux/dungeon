<script lang="ts">
  import inventoryStore from "../stores/Inventory";
  import type { Item, Socket } from "../types";
  import { plugItem } from "../Facade";

  function pluggable(inventory: Item[]): boolean {
    if ( socket.powered === false ) {
      return false
    }

    const item = inventory.find((item) => item.name === 'Toaster');
    if (item === undefined) {
      return false;
    }

    if (item.quantity < 1) {
      return false;
    }

    return true;
  }

  $: isPluggableItemInInventory = pluggable($inventoryStore);

  export let socket: Socket;
</script>

<div class="control-container">
  <h3>Power socket</h3>
  <p>Plug a {socket.item.name} here</p>
  <button disabled={!isPluggableItemInInventory} on:click={plugItem}>Plug</button>
</div>
