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

const world: { rooms: Record<string, Room>, start: string} =
  { rooms: { '299c520c-4d79-4c95-bf67-ed96d2131985': { doors: { south: 'f6c6f95c-bd48-4699-8b99-2b0c183cb415', west: 'fb7847d0-4c9a-4b6b-8f05-f50d2563f9fd' }, chest: { item: { name: 'Copper', quantity: 10 } } }, 'f6c6f95c-bd48-4699-8b99-2b0c183cb415': { doors: { north: '299c520c-4d79-4c95-bf67-ed96d2131985', west: 'e9342f02-61ed-4dfb-98a4-51f1ae1c1b7d' }, socket: { item: { name: 'Toaster', quantity: 1 }, targetRoom: '37558dce-bbdf-49c0-bb92-492208646cdb', powered: true }, workbench: { inputs: [{ name: 'Copper', quantity: 2 }, { name: 'Bronze', quantity: 1 }, { name: 'Tin', quantity: 1 }], output: { name: 'Toaster', quantity: 1 } } }, '37558dce-bbdf-49c0-bb92-492208646cdb': { doors: {}, description: 'You won!' }, 'fb7847d0-4c9a-4b6b-8f05-f50d2563f9fd': { doors: { east: '299c520c-4d79-4c95-bf67-ed96d2131985', south: 'e9342f02-61ed-4dfb-98a4-51f1ae1c1b7d' }, description: 'Welcome stranger!' }, '67baad86-b986-4c5f-8b5f-c88aa856410e': { doors: { north: 'd669bc9c-de61-4a8d-9cd2-e7b14dc973e8', east: '802b4e6a-a81f-4f79-af42-9036c8854b21' } }, 'ec3319bc-bba7-4b4c-b706-64618bbcc604': { doors: { west: '802b4e6a-a81f-4f79-af42-9036c8854b21' } }, '802b4e6a-a81f-4f79-af42-9036c8854b21': { doors: { east: 'ec3319bc-bba7-4b4c-b706-64618bbcc604', west: '67baad86-b986-4c5f-8b5f-c88aa856410e' } }, '0b0a2e38-2789-4155-81a1-55b784de2c41': { doors: { north: '5b1bfc41-df1b-44a1-a6c9-2ba89033a015' } }, '602468c4-7127-490b-a862-150700d00604': { doors: { south: '117f463e-7fa6-420e-94c1-19ab64c1d660' } }, '117f463e-7fa6-420e-94c1-19ab64c1d660': { doors: { north: '602468c4-7127-490b-a862-150700d00604', east: 'ad95fc77-cc22-459e-8634-73949d0dd004', south: 'ba22c831-1a2e-439c-b677-38d3ff5c7773' } }, 'ad95fc77-cc22-459e-8634-73949d0dd004': { doors: { west: '117f463e-7fa6-420e-94c1-19ab64c1d660' } }, '5b1bfc41-df1b-44a1-a6c9-2ba89033a015': { doors: { south: '0b0a2e38-2789-4155-81a1-55b784de2c41', west: 'ba22c831-1a2e-439c-b677-38d3ff5c7773' } }, 'e9342f02-61ed-4dfb-98a4-51f1ae1c1b7d': { doors: { north: 'fb7847d0-4c9a-4b6b-8f05-f50d2563f9fd', east: 'f6c6f95c-bd48-4699-8b99-2b0c183cb415', south: 'd669bc9c-de61-4a8d-9cd2-e7b14dc973e8' }, chest: { item: { name: 'Tin', quantity: 10 } }, workbench: { inputs: [{ name: 'Copper', quantity: 1 }, { name: 'Tin', quantity: 1 }], output: { name: 'Bronze', quantity: 1 } } }, 'd669bc9c-de61-4a8d-9cd2-e7b14dc973e8': { doors: { north: 'e9342f02-61ed-4dfb-98a4-51f1ae1c1b7d', east: '067448da-d9c4-432f-a457-a92b4e44ed4c', south: '67baad86-b986-4c5f-8b5f-c88aa856410e' } }, '067448da-d9c4-432f-a457-a92b4e44ed4c': { doors: { east: 'ba22c831-1a2e-439c-b677-38d3ff5c7773', west: 'd669bc9c-de61-4a8d-9cd2-e7b14dc973e8' } }, 'ba22c831-1a2e-439c-b677-38d3ff5c7773': { doors: { north: '117f463e-7fa6-420e-94c1-19ab64c1d660', east: '5b1bfc41-df1b-44a1-a6c9-2ba89033a015', west: '067448da-d9c4-432f-a457-a92b4e44ed4c' } } }, start: 'fb7847d0-4c9a-4b6b-8f05-f50d2563f9fd' }

app.use(cors())
app.use(bodyParser.json())
app.get('/api/game/:gameId/room/:roomId', (req: Request, res: Response) => {
  const game = getGameById(req.params.gameId)
  const roomId = req.params.roomId
  const room = clone(game.getRoom(roomId))
  game.updateCurrentRoom(roomId)

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
  const game = new Game(clone(world.rooms), world.start)
  games.push(game)

  res.json({
    id: game.getId(),
    roomId: game.getCurrentRoomId()
  })
})

app.get('/api/game/:gameId', (req: Request, res: Response) => {
  const game = getGameById(req.params.gameId)

  res.json({
    id: game.getId(),
    roomId: game.getCurrentRoomId()
  })
})
