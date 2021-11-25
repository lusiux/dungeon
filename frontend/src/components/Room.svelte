<script>
  import Chest from "./Chest.svelte";
  import Doors from "./Doors.svelte";
  import Socket from "./Socket.svelte";
  import Workbench from "./Workbench.svelte";
  import roomStore from "../stores/Room";
  import gameStore from "../stores/Game";
</script>

<h1>Room</h1>
<h6>id: {$gameStore.roomId}</h6>
{#if $roomStore.description}
  <p>{@html ($roomStore.description).replaceAll("\n", "<br>")}</p>
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
