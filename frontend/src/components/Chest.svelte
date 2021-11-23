<script lang="ts">
  import { pickChest } from "../Facade"
  import roomStore from "../stores/Room"
</script>

{#if $roomStore.chest !== undefined}
<div class="control-container">
  <h3>Chest</h3>
  <div>Contains {$roomStore.chest.item.quantity} {$roomStore.chest.item.name}</div>
  <button disabled={$roomStore.chest.item.quantity === 0} on:click={pickChest}>
    Pick 1 item
  </button>
</div>
{/if}
