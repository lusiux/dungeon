import express, { Request, Response } from 'express'
import cors from 'cors'
import * as bodyParser from 'body-parser'

const app = express()
const port = 3000

app.listen(port, () => {
  console.log(`backend is running on port ${port}.`)
})

app.use(cors())
app.use(bodyParser.json())
app.get('/api/game/:gameId/room/:roomId', (req: Request, res: Response) => {
  console.log({ gameId: req.params.gameId, roomId: req.params.roomId })
  res.json({
    doors: {
      north: '123',
      east: '123123'
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
    },
    chest: {
      item: {
        name: 'Iron',
        quantity: 1
      }
    },
    socket: {
      powered: false
    }
  })
})
app.get('/api/game/:gameId/inventory', (req: Request, res: Response) => {
  console.log({ gameId: req.params.gameId })
  res.json({
    inventory: [
      { name: 'Iron', quantity: 10 },
      { name: 'Copper', quantity: 2 }
    ]
  })
})
