<script lang="ts">
  import { plugItem } from "../Facade"
  import socketStore from "../stores/Socket"
</script>

{#if $socketStore !== undefined}
<div class="control-container">
  <h3>Power socket</h3>
  <p>Plug {$socketStore.item.quantity} {$socketStore.item.name} here</p>
  <button disabled={! $socketStore.pluggable} on:click={plugItem}>Plug</button>
</div>
{/if}
