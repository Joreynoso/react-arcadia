import VideoGame from "../models/VideoGame.js"

class GameRepository {
  async saveGamesToDb(game) {
    return VideoGame.findOneAndUpdate(
      { id_rawg: game.id_rawg },
      { $set: game },
      { upsert: true, new: true }
    )
  }

  async getAll() {
    return VideoGame.find({})
  }

  async getById(id) {
    return VideoGame.findById(id)
  }

  async getByRawgId(id_rawg) {
    return VideoGame.findOne({ id_rawg })
  }

  async getByName(name) {
    return VideoGame.findOne({ name })
  }

  async create(data) {
    return VideoGame.create(data)
  }

  async update(id, data) {
    return VideoGame.findByIdAndUpdate(id, data, { new: true })
  }

  async delete(id) {
    return VideoGame.findByIdAndDelete(id)
  }
}

export default new GameRepository()
