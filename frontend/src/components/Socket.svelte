<script lang="ts">
  import { plugItem } from "../Facade"
  import socketStore from "../stores/Socket"
</script>

{#if $socketStore !== undefined}
  <h3>Power socket</h3>
  <p>Plug {$socketStore.item.quantity} {$socketStore.item.name} here</p>

  {#if $socketStore.pluggable}
    <button disabled={!$socketStore.pluggable} on:click={plugItem}>Plug</button>
  {:else}
    <div class="sorry-man">No fitting item :(</div>
  {/if}
{/if}

<style>
  p {
    margin: 2rem 0;
  }
</style>