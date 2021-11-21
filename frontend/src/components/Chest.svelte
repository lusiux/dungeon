<script lang="ts">
    import type { Chest, Item } from "src/types";
    import inventoryStore from "../stores/Inventory";

    export let chest: Chest

    function lootable() : boolean {
        if ( chest.item.quantity <= 0 ) {
            return false
        }

        const item = $inventoryStore.find(item => item.name === chest.item.name)
        if ( item === undefined ) {
            return true
        }

        if ( item.quantity >= 10 ) {
            return false
        }

        return true
    }
</script>

<div>
    <h3>Chest</h3>
    <div>Contains {chest.item.quantity} {chest.item.name}</div>
    <button disabled={! lootable()}>Pick 1 item</button>
</div>