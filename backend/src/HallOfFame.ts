import { plainToInstance } from 'class-transformer'
import { readFileSync } from 'fs'
import { writeFile } from 'fs/promises'
import { Game } from './Game'

export interface HallOfFameEntry {
  nickName: string
  time: number
  actions: number
  plugs: number
}

const filename = 'games/hall-of-fame.json'

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

    const existingEntry = this.entries.find(hofEntry => hofEntry.nickName === entry.nickName)
    if ( existingEntry !== undefined ) {
      Object.assign(existingEntry, entry)
    } else {
      this.entries.push(entry)
    }

    await this.persist()
  }

  static fromFile (): HallOfFame {
    const fileContent = readFileSync(filename)
    const hofJson = JSON.parse(fileContent.toString())

    return plainToInstance(HallOfFame, hofJson)
  }

  public async persist (): Promise<void> {
    await writeFile(filename, JSON.stringify(this))
  }

  public async getEntries (): Promise<HallOfFameEntry[]> {
    return this.entries
  }
}
