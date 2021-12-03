<script lang="ts">
  import { craftItem } from '../Facade'
  import workbenchStore from '../stores/Workbench'
  import Recipe from './Recipe.svelte'
</script>

{#if $workbenchStore !== undefined}
  <h3>Workbench</h3>
  <Recipe inputs={$workbenchStore.inputs} output={$workbenchStore.output} />

  {#if $workbenchStore.craftable}  
    <div class="action-container">
      <button on:click={craftItem}>
        Craft!
      </button>
    </div>
  {:else}
    <div class="sorry-man">Ingredients missing! :(</div>
  {/if}
{/if}
