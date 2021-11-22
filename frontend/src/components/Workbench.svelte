<script lang="ts">
  import { craftItem } from "../Facade";

  import type { Item, Workbench } from "../types";
  import inventoryStore from "../stores/Inventory";

  export let workbench: Workbench;

  function craftable(inventory: Item[]): boolean {
    for (const inputItem of workbench.inputs) {
      const item = inventory.find((item) => item.name === inputItem.name);
      if (!item) {
        return false;
      }

      if (item.quantity < inputItem.quantity) {
        return false;
      }
    }

    return true;
  }

  $: canBeCrafted = craftable($inventoryStore);

  function craft() {
    craftItem();
  }
</script>

<div class="control-container">
  <h3>Workbench</h3>
  <div>
    <h4>Recipe</h4>
    <h5>Ingredients</h5>
    <ul>
      {#each workbench.inputs as item}
        <li>{item.quantity}x {item.name}</li>
      {/each}
    </ul>
    <h5>Output</h5>
    <ul>
      <li>
        {workbench.output.quantity}x {workbench.output.name}
      </li>
    </ul>
    <button disabled={!canBeCrafted} on:click={craft}>Craft!</button>
  </div>
</div>

<style>
  h4,
  h5 {
    margin-bottom: 0.3rem;
    margin-top: 0;
  }
  ul {
    margin: 0;
  }
</style>
