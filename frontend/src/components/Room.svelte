<script>
  import Chest from "./Chest.svelte";
  import Doors from "./Doors.svelte";
  import Socket from "./Socket.svelte";
  import Workbench from "./Workbench.svelte";
  import roomStore from "../stores/Room";
</script>

<h1>Room</h1>
<h5>id: {$roomStore.id}</h5>
{#if $roomStore.description}
  <p>{$roomStore.description}</p>
{/if}
<div>
  <Doors />
  <Chest />
  <Workbench />
  <Socket />
</div>

<style>
  div {
    display: flex;
  }
</style>
