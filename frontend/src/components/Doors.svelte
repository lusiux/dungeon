<script lang="ts">
    import type { Doors } from "src/types";

    export let doors: Doors
</script>

<div>
    <h2>Doors</h2>
    <div>(what you see...)</div>
    <button disabled={doors.north === undefined}>North</button>
    <button disabled={doors.east === undefined}>East</button>
    <button disabled={doors.south === undefined}>South</button>
    <button disabled={doors.west === undefined}>West</button>
</div>