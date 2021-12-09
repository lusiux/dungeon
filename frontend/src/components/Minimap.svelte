<script lang="ts">
  import mapStore, { currentPositionStore } from "../stores/Map"

  const roomSize = 20
</script>

<svg width="320" height="320" viewBox="-160 -160 320 320">

  {#each $mapStore as room}
    <rect x={room.x * roomSize} y="{room.y*roomSize}" width="{roomSize}" height="{roomSize}" rx="4" ry="4" fill="{room.type === 'unknown' ? "grey" : "yellow"}" />
  {/each}
  <circle cx="{$currentPositionStore.x*roomSize + roomSize/2}" cy="{$currentPositionStore.y*roomSize + roomSize/2}" r="5" fill="black" />
</svg>
