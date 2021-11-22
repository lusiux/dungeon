<script lang="ts">
    import { craftItem } from "../Facade";

    import type { Item, Workbench } from "../types";
    import inventoryStore from "../stores/Inventory"

    export let workbench: Workbench

    function craftable(inventory: Item[]) : boolean {
        const item = inventory.find(item => item.name === workbench.input.name)
        if ( ! item ) {
            return false
        }

        if ( item.quantity < workbench.input.quantity ) {
            return false
        }

        return true
    }

    $: canBeCrafted = craftable($inventoryStore)

    function craft() {
        craftItem()
    }
</script>

<div>
    <h3>Workbench</h3>
    <div>
        <h4>Recipe</h4>
        <div>{workbench.input.quantity} {workbench.input.name} to {workbench.output.quantity} {workbench.output.name}</div>
        <button disabled={!canBeCrafted} on:click={craft}>Craft!</button>
    </div>
</div>