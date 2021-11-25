import { Item } from './types'

export class Inventory {
  public items: Item[] = []

  public addItem (item: Item): void {
    const inventoryItem = this.items.find(inventoryItem => inventoryItem.name === item.name)

    if (inventoryItem === undefined) {
      this.items.push({ ...item })
    } else {
      inventoryItem.quantity += item.quantity
    }
  }

  public removeItem (item: Item): boolean {
    const inventoryItem = this.getItem(item.name)
    if (inventoryItem === undefined) {
      return false
    }

    if (inventoryItem.quantity < item.quantity) {
      return false
    }

    inventoryItem.quantity -= item.quantity
    this.items = this.items.filter(item => item.quantity > 0)
    return true
  }

  public removeItems (items: Item[]): boolean {
    for (const item of items) {
      const inventoryItem = this.getItem(item.name)
      if (inventoryItem === undefined) {
        return false
      }

      if (inventoryItem.quantity < item.quantity) {
        return false
      }
    }

    for (const item of items) {
      this.removeItem(item)
    }
    return true
  }

  public removeItemOrThrow (item: Item): void {
    const itemRemoved = this.removeItem(item)
    if (!itemRemoved) {
      throw new Error(`Item with name ${item.name} and quantity ${item.quantity} can't be removed from inventory`)
    }
  }

  public removeItemsOrThrow (items: Item[]): void {
    const itemsRemoved = this.removeItems(items)
    if (!itemsRemoved) {
      throw new Error('Removal of items failed')
    }
  }

  public getItems (): Item[] {
    return this.items
  }

  public getItem (name: string): Item | undefined {
    return this.items.find(item => item.name === name)
  }

  public getItemOrThrow (name: string): Item {
    const item = this.getItem(name)
    if (item === undefined) {
      throw new Error(`Item with name ${name} not found in inventory`)
    }
    return item
  }
}
