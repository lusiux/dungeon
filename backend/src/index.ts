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
  { rooms: { '83448584-e558-4877-8d72-8810754133bc': { doors: { north: '00c9c42b-27db-4d8e-b3fe-9f7bdfa3e67e', east: 'd7796c1c-2dc5-4e95-8752-ba697db9c12c' } }, '9e08ffc0-dc62-49f8-998d-1d8b97894b36': { doors: { west: 'd7796c1c-2dc5-4e95-8752-ba697db9c12c' } }, 'd7796c1c-2dc5-4e95-8752-ba697db9c12c': { doors: { east: '9e08ffc0-dc62-49f8-998d-1d8b97894b36', west: '83448584-e558-4877-8d72-8810754133bc' } }, '7373ec33-1170-46a9-849b-ac1e10ce6e8d': { doors: { north: '5cc4dcff-a0ef-4db4-88f0-82eedb4f3fc2' } }, 'ff9e5672-67e0-4ce5-bdba-30b39aef0402': { doors: { west: '92d515a7-4e7c-48a4-af17-4ba7289732e6' } }, '5cc4dcff-a0ef-4db4-88f0-82eedb4f3fc2': { doors: { south: '7373ec33-1170-46a9-849b-ac1e10ce6e8d', west: '50fb85ca-70e8-480b-a45c-9f1e3a3d1320' } }, '00c9c42b-27db-4d8e-b3fe-9f7bdfa3e67e': { doors: { north: 'b5af98cf-9870-4e49-b979-e246f403b825', east: '9765fc88-2e5d-46d1-9713-b2d5b17a9de4', south: '83448584-e558-4877-8d72-8810754133bc' } }, '9765fc88-2e5d-46d1-9713-b2d5b17a9de4': { doors: { east: '50fb85ca-70e8-480b-a45c-9f1e3a3d1320', west: '00c9c42b-27db-4d8e-b3fe-9f7bdfa3e67e' } }, '50fb85ca-70e8-480b-a45c-9f1e3a3d1320': { doors: { north: '92d515a7-4e7c-48a4-af17-4ba7289732e6', east: '5cc4dcff-a0ef-4db4-88f0-82eedb4f3fc2', west: '9765fc88-2e5d-46d1-9713-b2d5b17a9de4' }, description: 'You completed the tutorial...\n\nWe will now leave you alone in the dungon. Try to escape!' }, '3fd6cebe-06af-49cf-a29e-06d32a38f6df': { doors: { east: '4c6f1485-5600-4572-ad27-aeac84e36aad' }, description: "Welcome Stranger!\n\nYou just awoke here and can't remember who you are and where you are.\n\nFollow the path east to find out how this strange place behaves.\n\nTake the time and read the Safety Moment: Be aware of power sockets!" }, '0332342b-f4f4-4e25-97ff-3b9f847343cc': { doors: { west: '65fd5e5f-fcb2-49a0-9848-7959876a7d02' }, description: 'Looks like the power cord of the toaster fits the power socket. Maybe you should try to plug the toaster into the socket... What might happen?!?', socket: { item: { name: 'Toaster', quantity: 1 }, targetRoom: '50fb85ca-70e8-480b-a45c-9f1e3a3d1320', powered: true } }, '4c6f1485-5600-4572-ad27-aeac84e36aad': { doors: { east: '830738c4-2bce-41d2-bd55-a04ad0411e04', west: '3fd6cebe-06af-49cf-a29e-06d32a38f6df' }, description: 'This room contains a chest. Look into it and take all items with you.', chest: { item: { name: 'Copper', quantity: 3 } } }, '830738c4-2bce-41d2-bd55-a04ad0411e04': { doors: { east: '5b2ef51b-eadf-4c7d-876c-3d13b5756226', west: '4c6f1485-5600-4572-ad27-aeac84e36aad' }, description: 'This room contains another chest. Look into it and take all items with you.', chest: { item: { name: 'Tin', quantity: 2 } } }, '5b2ef51b-eadf-4c7d-876c-3d13b5756226': { doors: { east: '65fd5e5f-fcb2-49a0-9848-7959876a7d02', west: '830738c4-2bce-41d2-bd55-a04ad0411e04' }, description: 'Looks like here is another kind of object in the room: a workbench. Have a look at the recipe and craft as many items as possible.', workbench: { inputs: [{ name: 'Copper', quantity: 1 }, { name: 'Tin', quantity: 1 }], output: { name: 'Bronze', quantity: 1 } } }, '65fd5e5f-fcb2-49a0-9848-7959876a7d02': { doors: { east: '0332342b-f4f4-4e25-97ff-3b9f847343cc', west: '5b2ef51b-eadf-4c7d-876c-3d13b5756226' }, description: 'Ups, no more copper available for the toaster receipe. Maybe it is not wise to follow all instructions written here by the dungon developers... Use the "Leave game" button to start over again. When you reach the bronze workbench only craft one bronze and return to this room. Craft one toaster.', workbench: { inputs: [{ name: 'Copper', quantity: 2 }, { name: 'Bronze', quantity: 1 }, { name: 'Tin', quantity: 1 }], output: { name: 'Toaster', quantity: 1 } } }, 'b5af98cf-9870-4e49-b979-e246f403b825': { doors: { east: '99c117ee-664c-4474-a0a7-b61df45eb6fa', south: '00c9c42b-27db-4d8e-b3fe-9f7bdfa3e67e' } }, '99c117ee-664c-4474-a0a7-b61df45eb6fa': { doors: { west: 'b5af98cf-9870-4e49-b979-e246f403b825' } }, '92d515a7-4e7c-48a4-af17-4ba7289732e6': { doors: { east: 'ff9e5672-67e0-4ce5-bdba-30b39aef0402', south: '50fb85ca-70e8-480b-a45c-9f1e3a3d1320' } } }, start: '3fd6cebe-06af-49cf-a29e-06d32a38f6df' }

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
