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
  workbench: {
    inputs: [
      {
        name: 'Copper',
        quantity: 2
      },
      {
        name: 'Bronze',
        quantity: 1
      },
      {
        name: 'Tin',
        quantity: 1
      }
    ],
    output: {
      name: 'Toaster',
      quantity: 1
    }
  },
  socket: {
    powered: true,
    item: {
      name: 'Toaster',
      quantity: 1
    },
    targetRoom: '5'
  }
}

const room5: Room = {
  id: '5',
  doors: {},
  description: 'You won!'
}

const rooms: Room[] = [room1, room2, room3, room4, room5]

app.use(cors())
app.use(bodyParser.json())
app.get('/api/game/:gameId/room/:roomId', (req: Request, res: Response) => {
  const game = getGameById(req.params.gameId)
  const room = clone(game.getRoom(req.params.roomId))

  if (room.socket !== undefined) {
    room.socket.targetRoom = ''
  }

  res.json(room)
})

app.get('/api/game/:gameId/inventory', (req: Request, res: Response, next: NextFunction) => {
  const game = getGameById(req.params.gameId)

  res.json({ inventory: game?.getInventory().getItems() })
})

app.get('/api/game/:gameId/room/:roomId/pickChest', (req: Request, res: Response, next: NextFunction) => {
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

app.get('/api/game/:gameId/room/:roomId/craft', (req: Request, res: Response, next: NextFunction) => {
  const game = getGameById(req.params.gameId)
  const inventory = game.getInventory()
  const room = game.getRoom(req.params.roomId)
  const workbench = getWorkbench(room)

  inventory.removeItemsOrThrow(workbench.inputs)
  inventory.addItem(workbench.output)

  res.json({ inventory: inventory.getItems() })
})

app.get('/api/game/:gameId/room/:roomId/plug', (req: Request, res: Response, next: NextFunction) => {
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
