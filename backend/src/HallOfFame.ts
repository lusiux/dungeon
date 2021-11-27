import { Game } from './Game'

export interface HallOfFameEntry {
  nickName: string
  time: number
  actions: number
  plugs: number
}

export default class HallOfFame {
  private readonly entries: HallOfFameEntry[] = []

  public async addEntryFromGame (game: Game): Promise<void> {
    const stats = game.getStats()
    const entry: HallOfFameEntry = {
      nickName: `${stats.nickName}.${stats.id.substr(0, 4)}`,
      time: (Date.now() - stats.started) / 1000,
      actions: stats.actions,
      plugs: stats.plugs
    }

    this.entries.push(entry)
  }

  public async getEntries (): Promise<HallOfFameEntry[]> {
    return this.entries
  }
}
