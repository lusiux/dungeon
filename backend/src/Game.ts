import { Room } from '../types'
import { Inventory } from './Inventory'
import { v4 as uuid } from 'uuid'
import clone from 'clone'

export class Game {
  private readonly inventory: Inventory
  private readonly id: string
  private readonly rooms: Room[]

  constructor (rooms: Room[]) {
    this.rooms = clone(rooms)
    this.id = uuid()
    this.inventory = new Inventory()
  }

  public getId (): string {
    return this.id
  }

  public getRoom (roomId: string): Room {
    const room = this.rooms.find(room => room.id === roomId)
    if (room === undefined) {
      throw new Error(`Room with id ${roomId} not found in game ${this.id}`)
    }
    return room
  }

  public getInventory (): Inventory {
    return this.inventory
  }
}
