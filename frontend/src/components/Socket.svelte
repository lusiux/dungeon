<script lang="ts">
  import type { Socket } from "src/types";

  export let socket: Socket;
</script>

<div>
  <h3>Power socket</h3>
  <button disabled={!socket.powered}>Plug</button>
</div>
