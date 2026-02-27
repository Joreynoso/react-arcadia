import VideoGame from "../models/VideoGame.js"

class GameRepository {
  async saveGamesToDb(game) {
    return VideoGame.findOneAndUpdate(
      { id_rawg: game.id_rawg },
      { $set: game },
      { upsert: true, new: true }
    )
  }

  async updateSummary(id, summary) {
    return VideoGame.findByIdAndUpdate(id, { summary }, { new: true })
  }

  async getAll({ filter = {}, sortOption = {}, skip = 0, limit = 20 }) {
    const games = await VideoGame.find(filter).sort(sortOption).skip(skip).limit(limit)
    const total = await VideoGame.countDocuments(filter)

    return { games, total }
  }

  async findAll({ filter, sortOption, skip, limit }) {
    return VideoGame.find(filter).sort(sortOption).skip(skip).limit(limit)
  }

  async getAllGenres() {
    const totalGenres = await VideoGame.distinct("genres")
    return totalGenres
  }

  async getAllPlatforms() {
    const totalPlatforms = await VideoGame.distinct("platforms")
    return totalPlatforms
  }

  async getById(id) {
    return VideoGame.findById(id)
  }

  async getByRawgId(id_rawg) {
    return VideoGame.findOne({ id_rawg })
  }

  async getByName(name) {
    return VideoGame.findOne({ name: name })
  }

  async search(q, page, limit) {
    const skip = (page - 1) * limit

    // Búsqueda case-insensitive por nombre
    const query = { name: { $regex: q, $options: "i" } }

    const games = await VideoGame.find(query).skip(skip).limit(limit)

    const total = await VideoGame.countDocuments(query)

    return { games, total }
  }

  async create(data) {
    return VideoGame.create(data)
  }

  async update(id, data) {
    // siempre resetear summary
    data.summary = ""

    return VideoGame.findByIdAndUpdate(id, data, { new: true })
  }

  async delete(id) {
    return VideoGame.findByIdAndDelete(id)
  }
}

export default new GameRepository()
