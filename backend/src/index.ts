import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import * as bodyParser from 'body-parser'
import { Room } from '../types'
import { Inventory } from './Inventory'
import { Game } from './Game'

const app = express()
const port = 3000

app.listen(port, () => {
  console.log(`backend is running on port ${port}.`)
})

const room1: Room = {
  id: '1',
  description: 'Welcome stranger!',
  doors: {
    east: '2',
    south: '3'
  },
  chest: {
    item: {
      name: 'Tin',
      quantity: 10
    }
  }
}

const room2: Room = {
  id: '2',
  doors: {
    west: '1',
    south: '4'
  },
  chest: {
    item: {
      name: 'Copper',
      quantity: 10
    }
  }
}

const room3: Room = {
  id: '3',
  doors: {
    north: '1',
    east: '4'
  },
  workbench: {
    inputs: [{
      name: 'Copper',
      quantity: 1
    }, {
      name: 'Tin',
      quantity: 1
    }],
    output: {
      name: 'Bronze',
      quantity: 1
    }
  }
}

const room4: Room = {
  id: '4',
  doors: {
    north: '2',
    west: '3'
  },
  socket: {
    powered: false
  }
}

const rooms: Room[] = [room1, room2, room3, room4]

app.use(cors())
app.use(bodyParser.json())
app.get('/api/game/:gameId/room/:roomId', (req: Request, res: Response) => {
  const game = games.find(game => game.getId() === req.params.gameId)

  const roomId = req.params.roomId
  const room = game?.getRoom(roomId)
  res.json(room)
})

// Inventory routes

app.get('/api/game/:gameId/inventory', (req: Request, res: Response, next: NextFunction) => {
  const game = games.find(game => game.getId() === req.params.gameId)
  if (game === undefined) {
    return next(new Error('game undefined'))
  }

  res.json({ inventory: game?.getInventory().getItems() })
})

app.get('/api/game/:gameId/room/:roomId/pickChest', (req: Request, res: Response, next: NextFunction) => {
  const game = games.find(game => game.getId() === req.params.gameId)
  const room = game?.getRoom(req.params.roomId)

  if (game === undefined || room === undefined || room.chest === undefined) {
    return next(new Error('game, room or chest undefined'))
  }

  const inventory = game.getInventory()
  if (room.chest.item.quantity > 0) {
    inventory.addItem({ ...room.chest.item, quantity: 1 })
    room.chest.item.quantity -= 1
  }
  res.json({ inventory: inventory.getItems() })
})

app.get('/api/game/:gameId/room/:roomId/craft', (req: Request, res: Response, next: NextFunction) => {
  const game = games.find(game => game.getId() === req.params.gameId)
  const room = game?.getRoom(req.params.roomId)

  if (game === undefined || room === undefined || room.workbench === undefined) {
    return next(new Error('game, room or workbench undefined'))
  }

  const inventory = game.getInventory()
  if (inventory.removeItems(room.workbench.inputs)) {
    inventory.addItem(room.workbench.output)
  }

  res.json({ inventory: inventory.getItems() })
})

const games: Game[] = []

app.post('/api/game', (req: Request, res: Response) => {
  const game = new Game([...rooms])
  games.push(game)

  res.json({
    id: game.getId()
  })
})
