import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import * as bodyParser from 'body-parser'
import clone from 'clone'
import { getChest, getSocket, getWorkbench, Room } from '../types'
import { Game } from './Game'

const app = express()
const port = 3000

app.listen(port, () => {
  console.log(`backend is running on port ${port}.`)
})

const rooms: Room[] = [{ id: '1x0', tid: '25', doors: { south: '1x1', west: '0x0' }, chest: { item: { name: 'Copper', quantity: 10 } } }, { id: '1x1', tid: '27', doors: { north: '1x0', west: '0x1' }, socket: { item: { name: 'Toaster', quantity: 1 }, targetRoom: '3x0', powered: true }, workbench: { inputs: [{ name: 'Copper', quantity: 2 }, { name: 'Bronze', quantity: 1 }, { name: 'Tin', quantity: 1 }], output: { name: 'Toaster', quantity: 1 } } }, { id: '3x0', tid: '37', doors: {}, description: 'You won!' }, { id: '0x0', tid: '40', doors: { east: '1x0', south: '0x1' }, description: 'Welcome stranger!' }, { id: '0x3', tid: '41', doors: { north: '0x2', east: '1x3' } }, { id: '2x3', tid: '44', doors: { west: '1x3' } }, { id: '1x3', tid: '46', doors: { east: '2x3', west: '0x3' } }, { id: '3x3', tid: '47', doors: { north: '3x2' } }, { id: '2x0', tid: '49', doors: { south: '2x1' } }, { id: '2x1', tid: '50', doors: { north: '2x0', east: '3x1', south: '2x2' } }, { id: '3x1', tid: '52', doors: { west: '2x1' } }, { id: '3x2', tid: '53', doors: { south: '3x3', west: '2x2' } }, { id: '0x1', tid: '54', doors: { north: '0x0', east: '1x1', south: '0x2' }, chest: { item: { name: 'Tin', quantity: 10 } }, workbench: { inputs: [{ name: 'Copper', quantity: 1 }, { name: 'Tin', quantity: 1 }], output: { name: 'Bronze', quantity: 1 } } }, { id: '0x2', tid: '55', doors: { north: '0x1', east: '1x2', south: '0x3' } }, { id: '1x2', tid: '56', doors: { east: '2x2', west: '0x2' } }, { id: '2x2', tid: '60', doors: { north: '2x1', east: '3x2', west: '1x2' } }]

app.use(cors())
app.use(bodyParser.json())
app.get('/api/game/:gameId/room/:roomId', (req: Request, res: Response) => {
  const game = getGameById(req.params.gameId)
  const room = clone(game.getRoom(req.params.roomId))

  if (room.socket !== undefined) {
    delete room.socket.targetRoom
  }

  res.json(room)
})

app.get('/api/game/:gameId/inventory', (req: Request, res: Response, next: NextFunction) => {
  const game = getGameById(req.params.gameId)

  res.json({ inventory: game?.getInventory().getItems() })
})

app.post('/api/game/:gameId/room/:roomId/pickChest', (req: Request, res: Response, next: NextFunction) => {
  const game = getGameById(req.params.gameId)
  const inventory = game.getInventory()
  const room = game.getRoom(req.params.roomId)
  const chest = getChest(room)

  if (chest.item.quantity > 0) {
    inventory.addItem({ ...chest.item, quantity: 1 })
    chest.item.quantity -= 1
  }
  res.json({ inventory: inventory.getItems() })
})

app.post('/api/game/:gameId/room/:roomId/craft', (req: Request, res: Response, next: NextFunction) => {
  const game = getGameById(req.params.gameId)
  const inventory = game.getInventory()
  const room = game.getRoom(req.params.roomId)
  const workbench = getWorkbench(room)

  inventory.removeItemsOrThrow(workbench.inputs)
  inventory.addItem(workbench.output)

  res.json({ inventory: inventory.getItems() })
})

app.post('/api/game/:gameId/room/:roomId/plug', (req: Request, res: Response, next: NextFunction) => {
  const game = getGameById(req.params.gameId)
  const room = game.getRoom(req.params.roomId)
  const socket = getSocket(room)

  game.getInventory().removeItemOrThrow(socket.item)

  res.json({ id: socket.targetRoom })
})

const games: Game[] = []

function getGameById (gameId: string): Game {
  const game = games.find(game => game.getId() === gameId)
  if (game === undefined) {
    throw new Error(`Game with id ${gameId} not found`)
  }
  return game
}

app.post('/api/game', (req: Request, res: Response) => {
  const game = new Game(clone(rooms))
  games.push(game)

  res.json({
    id: game.getId()
  })
})
