import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import * as bodyParser from 'body-parser'
import { GameState, Inventory, Room } from './types'
import GameController from './GameController'
import world from './world'

const app = express()
const port = 3000

app.listen(port, () => {
  console.log(`backend is running on port ${port}.`)
})

function asyncWrapper<T> (handler: (req?: Request, res?: Response, next?: NextFunction) => Promise<T>) {
  return function wrappedFn (req: Request, res: Response, next: NextFunction) {
    handler(req, res, next).then(
      async (result: any) => res.json(result),
      next
    )
  }
}

app.use(cors())
app.use(bodyParser.json())

app.get('/api/game/:gameId/room/:roomId', asyncWrapper<Room>(async (req: Request) => {
  const game = await GameController.getGameById(req.params.gameId)
  return await game.moveToRoom(req.params.roomId)
}))

app.get('/api/game/:gameId/inventory', asyncWrapper<Inventory>(async (req: Request) => {
  const game = await GameController.getGameById(req.params.gameId)
  return await game.getItems()
}))

app.post('/api/game/:gameId/room/:roomId/pickChest', asyncWrapper<Inventory>(async (req: Request) => {
  const game = await GameController.getGameById(req.params.gameId)
  return await game.pickChest(req.params.roomId)
}))

app.post('/api/game/:gameId/room/:roomId/craft', asyncWrapper<Inventory>(async (req: Request) => {
  const game = await GameController.getGameById(req.params.gameId)
  return await game.craft(req.params.roomId)
}))

app.post('/api/game/:gameId/room/:roomId/plug', asyncWrapper<{id: string}>(async (req: Request) => {
  const game = await GameController.getGameById(req.params.gameId)
  return await game.plug(req.params.roomId)
}))

app.post('/api/game', asyncWrapper<GameState>(async () => {
  return await GameController.startNewGame(world)
}))

app.get('/api/game/:gameId', asyncWrapper<GameState>(async (req: Request) => {
  return await GameController.getGameState(req.params.gameId)
}))
