<script>
    import Chest from "./Chest.svelte";
    import Doors from "./Doors.svelte";
    import Socket from "./Socket.svelte";
    import Workbench from "./Workbench.svelte";
    import roomStore from "../stores/Room";
</script>

<div>
    <Doors doors={$roomStore.doors}/>
    {#if $roomStore.chest}
    <Chest chest={$roomStore.chest}/>
    {/if}
    {#if $roomStore.workbench}
    <Workbench workbench={$roomStore.workbench}/>
    {/if}
    {#if $roomStore.socket}
        <Socket socket={$roomStore.socket}/>
    {/if}
</div>

<style>
    div {
        display: flex;
        justify-content: space-between;
    }
</style>
