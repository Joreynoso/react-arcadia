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

  async getAll(page, limit) {
    const skip = (page - 1) * limit
    const games = await VideoGame.find({}).skip(skip).limit(limit)

    const total = await VideoGame.countDocuments({})

    return { games, total }
  }

  async getAllGenres() {
    const totalGenres = await VideoGame.distinct('genres')
    return totalGenres
  }

  async getAllPlatforms() {
    const totalPlatforms = await VideoGame.distinct('platforms')
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

  async searchByReleased(page, limit, sort = "desc") {
    const skip = (page - 1) * limit

    const games = await VideoGame.find()
      .sort({ released: sort === "desc" ? -1 : 1 }) // ordena por string ISO
      .skip(skip)
      .limit(limit)

    const total = await VideoGame.countDocuments()

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

  async searchByGender(page, limit, genre) {
    const skip = (page - 1) * limit

    const query = {}

    if (genre) {
      query.genres = genre // filtrar solo un genero
    }

    const games = await VideoGame.find(query)
      .skip(skip)
      .limit(limit)

    const total = await VideoGame.countDocuments(query)

    return { games, total }
  }

  async searchByPlatform(page, limit, platform) {
    const skip = (page - 1) * limit

    const query = {}

    if (platform) {
      query.platforms = platform // filtrar solo un genero
    }

    const games = await VideoGame.find(query)
      .skip(skip)
      .limit(limit)

    const total = await VideoGame.countDocuments(query)

    return { games, total }
  }
}

export default new GameRepository()
