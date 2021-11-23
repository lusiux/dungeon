<script lang="ts">
  import { craftItem } from "../Facade"

  import type { Item, Workbench } from "../types"
  import inventoryStore from "../stores/Inventory"
  import roomStore from "../stores/Room"
  import Recipe from "./Recipe.svelte";

  function craftable(inventory: Item[], workbench: Workbench): boolean {
    for (const inputItem of workbench.inputs) {
      const item = inventory.find((item) => item.name === inputItem.name);
      if (item === undefined) {
        return false
      }

      if (item.quantity < inputItem.quantity) {
        return false
      }
    }

    return true
  }
</script>

{#if $roomStore.workbench !== undefined}
<div class="control-container">
  <h3>Workbench</h3>
  <Recipe inputs={$roomStore.workbench.inputs} output={$roomStore.workbench.output}/>
  <button disabled={!craftable($inventoryStore, $roomStore.workbench)} on:click={craftItem}>Craft!</button>
</div>
{/if}

<style>

</style>
