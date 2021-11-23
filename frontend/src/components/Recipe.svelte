<script lang="ts">
  import type { Item } from "src/types";

  export let inputs: Item[];
  export let output: Item;
</script>

<div>
  <h4>Recipe</h4>
  <h5>Ingredients</h5>
  <ul>
    {#each inputs as item}
      <li>{item.quantity}x {item.name}</li>
    {/each}
  </ul>
  <h5>Output</h5>
  <ul>
    <li>
      {output.quantity}x {output.name}
    </li>
  </ul>
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
