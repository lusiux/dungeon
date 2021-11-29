<script>
  import Chest from "./Chest.svelte";
  import Socket from "./Socket.svelte";
  import Workbench from "./Workbench.svelte";
  import roomStore from "../stores/Room";
  import gameStore from "../stores/Game";
</script>

<h1>Room</h1>
<h6>id: {$gameStore.roomId.substr(0, 4)}</h6>

{#if $roomStore.description}
  <p>{@html ($roomStore.description).replaceAll("\n", "<br>")}</p>
{/if}

{#if $roomStore.chest || $roomStore.workbench || $roomStore.socket}
  <hr>
{/if}

<div>
  <Chest />
  <Workbench />
  <Socket />
</div>

<style type="text/scss">
  @import '../style/vars.scss';

  hr {
    width: 70%;
    border: 0;
    height: 0.2rem;
    background: $col-dark-grey;
    margin: 1.6rem auto;
  }

  p {
    margin: 1.2rem 0;
  }
</style>
