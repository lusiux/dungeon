import type { Item, Workbench } from 'src/types'
import { derived } from 'svelte/store'
import inventoryStore from './Inventory'
import roomStore from './Room'

export interface ExtendedWorkbench extends Workbench {
  craftable: boolean
}

function craftable (inventory: Item[], workbench: Workbench): boolean {
  for (const inputItem of workbench.inputs) {
    const item = inventory.find((item) => item.name === inputItem.name)
    if (item === undefined) {
      return false
    }

    if (item.quantity < inputItem.quantity) {
      return false
    }
  }

  return true
}

export default derived([inventoryStore, roomStore], ([$inventoryStore, $roomStore]) => {
  if ($roomStore.workbench === undefined) {
    return undefined
  }

  const workbench: ExtendedWorkbench = {
    ...$roomStore.workbench,
    craftable: craftable($inventoryStore, $roomStore.workbench)
  }
  return workbench
})
