<script lang="ts">
  import { craftItem } from "../Facade"
  import workbenchStore from "../stores/Workbench"
  import Recipe from "./Recipe.svelte"
</script>

{#if $workbenchStore !== undefined}
  <div class="control-container">
    <h3>Workbench</h3>
    <Recipe inputs={$workbenchStore.inputs} output={$workbenchStore.output} />
    <button disabled={!$workbenchStore.craftable} on:click={craftItem}>
      Craft!
    </button>
  </div>
{/if}
