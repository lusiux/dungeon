<script lang="ts">
  import { craftItem } from "../Facade"
  import workbenchStore from "../stores/Workbench"
  import Recipe from "./Recipe.svelte"
</script>

{#if $workbenchStore !== undefined}
  <h3>Workbench</h3>
  <Recipe inputs={$workbenchStore.inputs} output={$workbenchStore.output} />

  {#if $workbenchStore.craftable}  
    <button on:click={craftItem}>
      Craft!
    </button>
  {:else}
    <div class="sorry-man">Insufficent inventory! :(</div>
  {/if}
{/if}
