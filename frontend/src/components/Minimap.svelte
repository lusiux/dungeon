<script lang="ts">
  import mapStore, { chestStore, currentPositionStore, plugStore, workbenchStore } from "../stores/Map"

  const roomSize = 30

  function calculateViewBox(position: {x: number, y: number}) {
    const offsetX = position.x * roomSize
    const offsety = position.y * roomSize
    return `${-160+offsetX} ${-160+offsety} 320 320`
  }
</script>

<svg width="320" height="320" viewBox={calculateViewBox($currentPositionStore)}>
  {#each $mapStore as room}
    <rect x={room.x * roomSize} y="{room.y*roomSize}" width="{roomSize}" height="{roomSize}" rx="4" ry="4" fill="{room.type === 'unknown' ? "black" : "grey"}" />
  {/each}

  {#each $workbenchStore as workbench}
    <rect x={workbench.x * roomSize + roomSize/2 - 1} y="{workbench.y*roomSize + roomSize/2 - 1}" width="{roomSize/2-2}" height="{roomSize/2-2}" fill="brown" />
  {/each}

  {#each $chestStore as chest}
    <rect x={chest.x * roomSize + 1} y="{chest.y*roomSize + 1}" width="{roomSize/2-2}" height="{roomSize/2-2}" fill="orange" />
  {/each}

  {#each $plugStore as plug}
    <rect x={plug.x * roomSize + roomSize/2 - 1} y="{plug.y*roomSize + 1}" width="{roomSize/2-2}" height="{roomSize/2-2}" fill="white" />
  {/each}

  <circle cx="{$currentPositionStore.x*roomSize + roomSize/2}" cy="{$currentPositionStore.y*roomSize + roomSize/2}" r="5" fill="black" />
</svg>
