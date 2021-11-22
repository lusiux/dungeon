import express, { Request, Response } from 'express'
import cors from 'cors'
import * as bodyParser from 'body-parser'
import { Room } from '../types'
import { Inventory } from './Inventory'

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
      name: 'Iron',
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
    input: {
      name: 'Iron',
      quantity: 1
    },
    output: {
      name: 'Copper',
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
  console.log({ gameId: req.params.gameId, roomId: req.params.roomId })
  const roomId = req.params.roomId
  res.json(rooms[parseInt(roomId) - 1])
})

// Inventory routes

const inventory = new Inventory()

app.get('/api/game/:gameId/inventory', (req: Request, res: Response) => {
  console.log({ gameId: req.params.gameId })
  res.json({ inventory: inventory.getItems() })
})

app.get('/api/game/:gameId/room/:roomId/pickChest', (req: Request, res: Response) => {
  const roomId = req.params.roomId
  const room = rooms[parseInt(roomId) - 1]
  if (room.chest !== undefined && room.chest.item.quantity > 0) {
    inventory.addItem({ ...room.chest.item, quantity: 1 })
    room.chest.item.quantity -= 1
  }
  res.json({ inventory: inventory.getItems() })
})

app.get('/api/game/:gameId/room/:roomId/craft', (req: Request, res: Response) => {
  const roomId = req.params.roomId
  const room = rooms[parseInt(roomId) - 1]
  if (room.workbench !== undefined) {
    if (inventory.removeItem(room.workbench.input)) {
      inventory.addItem(room.workbench.output)
    }
  }
  res.json({ inventory: inventory.getItems() })
})
