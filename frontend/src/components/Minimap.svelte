<script lang="ts">
  import roomStore, { currentPositionStore } from "../stores/Map"

  const roomSize = 30

  function calculateViewBox(position: {x: number, y: number}) {
    const offsetX = position.x * roomSize
    const offsety = position.y * roomSize
    return `${-160+offsetX} ${-160+offsety} 320 320`
  }
</script>


<h1>Minimap</h1>
<svg width="320" height="320" viewBox={calculateViewBox($currentPositionStore)}>
  {#each $roomStore as room}
    <rect x={room.x * roomSize} y="{room.y*roomSize}" width="{roomSize}" height="{roomSize}" rx="6" ry="6" fill="{room.type === 'unknown' ? "#474441" : "#747682"}" />
    {#if room.chest}
    <rect x={room.x * roomSize + 4} y="{room.y*roomSize + 4}" width="{roomSize/2-4}" height="{roomSize/2-4}" fill="#bd9067" />
    {/if}
    {#if room.workbench}
      <rect x={room.x * roomSize + roomSize/2} y="{room.y*roomSize + roomSize/2}" width="{roomSize/2-4}" height="{roomSize/2-4}" fill="#5b4c3b" />
    {/if}
    {#if room.socket}
      <rect x={room.x * roomSize + roomSize/2} y="{room.y*roomSize+4}" width="{roomSize/2-4}" height="{roomSize/2-4}" fill="#d7d6df" />
    {/if}
  {/each}

  <circle cx="{$currentPositionStore.x*roomSize + roomSize/2}" cy="{$currentPositionStore.y*roomSize + roomSize/2}" r="8" fill="black" />
</svg>
