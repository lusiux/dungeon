import { Room, Inventory as ApiInventory, getChest, getWorkbench, getSocket } from './types'
import { Inventory } from './Inventory'
import { v4 as uuid } from 'uuid'
import clone from 'clone'
import { writeFile, readFile } from 'fs/promises'
import { plainToInstance } from 'class-transformer'
export class Game {
  private inventory: Inventory
  private readonly id: string
  private readonly rooms: Record<string, Room>

  constructor (rooms: Record<string, Room>, private currentRoomId: string) {
    this.rooms = clone(rooms)
    this.id = uuid()
    this.inventory = new Inventory()
  }

  private setInventory (inventory: Inventory): void {
    this.inventory = inventory
  }

  public static async fromFile (gameId: string): Promise<Game> {
    const fileContent = await readFile(`games/game-${gameId}.json`)
    const gameJson = JSON.parse(fileContent.toString())

    const game = plainToInstance(Game, gameJson)
    game.setInventory(plainToInstance(Inventory, gameJson.inventory))

    return game
  }

  public async persist (): Promise<void> {
    await writeFile(`games/game-${this.id}.json`, JSON.stringify(this))
  }

  public async updateCurrentRoom (roomId: string): Promise<void> {
    this.currentRoomId = roomId
    await this.persist()
  }

  public getCurrentRoomId (): string {
    return this.currentRoomId
  }

  public getId (): string {
    return this.id
  }

  public getRoom (roomId: string): Room {
    const room = this.rooms[roomId]
    if (room === undefined) {
      throw new Error(`Room with id ${roomId} not found in game ${this.id}`)
    }
    return room
  }

  public getInventory (): Inventory {
    return this.inventory
  }

  public async moveToRoom (roomId: string): Promise<Room> {
    const room: Room = clone(this.getRoom(roomId))
    await this.updateCurrentRoom(roomId)

    if (room.socket !== undefined) {
      room.socket.targetRoom = ''
    }

    return room
  }

  public async getItems (): Promise<ApiInventory> {
    return { inventory: this.inventory.getItems() }
  }

  public async pickChest (roomId: string): Promise<ApiInventory> {
    const room = this.getRoom(roomId)
    const chest = getChest(room)

    if (chest.item.quantity > 0) {
      this.inventory.addItem({ ...chest.item, quantity: 1 })
      chest.item.quantity -= 1
    }

    await this.persist()

    return { inventory: this.inventory.getItems() }
  }

  public async craft (roomId: string): Promise<ApiInventory> {
    const room = this.getRoom(roomId)
    const workbench = getWorkbench(room)

    this.inventory.removeItemsOrThrow(workbench.inputs)
    this.inventory.addItem(workbench.output)

    await this.persist()
    return { inventory: this.inventory.getItems() }
  }

  public async plug (roomId: string): Promise<{id: string}> {
    const room = this.getRoom(roomId)
    const socket = getSocket(room)

    this.inventory.removeItemOrThrow(socket.item)

    await this.persist()
    return { id: socket.targetRoom }
  }
}
