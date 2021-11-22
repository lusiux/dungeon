<script lang="ts">
  import { pickChest } from "../Facade";

  import type { Chest } from "src/types";

  export let chest: Chest;

  function loot() {
    pickChest()
  }
</script>

<div class="control-container">
  <h3>Chest</h3>
  <div>Contains {chest.item.quantity} {chest.item.name}</div>
  <button disabled={chest.item.quantity === 0} on:click={loot}>
    Pick 1 item
  </button>
</div>
