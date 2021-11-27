import { Game } from './Game'
import clone from 'clone'
import { GameState } from './types'
import validator from 'validator'

const games: Game[] = []

const GameController = {
  startNewGame: async (world: any, nickName: string): Promise<GameState> => {
    const game = new Game(clone(world.rooms), world.start, nickName)
    games.push(game)
    await game.persist()

    return {
      id: game.getId(),
      roomId: game.getCurrentRoomId()
    }
  },

  getGameState: async (gameId: string): Promise<GameState> => {
    const game = await GameController.getGameById(gameId)

    return {
      id: game.getId(),
      roomId: game.getCurrentRoomId()
    }
  },

  getGameById: async (gameId: string): Promise<Game> => {
    if (validator.isUUID(gameId, 4) === false) {
      throw new Error(`Game id ${gameId} is not a valid gameId`)
    }

    const game = games.find(game => game.getId() === gameId)
    if (game !== undefined) {
      return game
    }

    try {
      const game = await Game.fromFile(gameId)
      games.push(game)
      return game
    } catch (_) {
      throw new Error(`Game with id ${gameId} not found`)
    }
  }
}

export default GameController
