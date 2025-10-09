import gameRepository from "../repositories/gameRepository.js"
import GameRepository from "../repositories/gameRepository.js"
import { fetchExternalGames } from "../services/gameFetch.js"
import { getSummaryFromAi } from "./genAiService.js"
import mongoose from "mongoose"

class GameService {
  MAX_GAMES = 500
  PAGE_SIZE = 40

  // --> poblar la base de datos con juegos de RAWG
  async loadAllGames() {
    let allGames = []
    let page = 1

    while (allGames.length < this.MAX_GAMES) {
      const { games } = await fetchExternalGames(page, this.PAGE_SIZE)
      if (!games || games.length === 0) break

      allGames.push(...games)

      if (games.length < this.PAGE_SIZE) break // no hay más páginas
      page++
    }

    // limitar a 500 juegos
    allGames = allGames.slice(0, this.MAX_GAMES)

    // guardar o actualizar en MongoDB
    for (const game of allGames) {
      await GameRepository.saveGamesToDb(game)
    }

    console.log(`Se cargaron ${allGames.length} juegos en la base de datos`)
    return allGames.length
  }

  // --> generar descripción con google gen ai
  async generateSummary(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Id no valido")
    }

    let game = await GameRepository.getById(id)
    if (!game) throw new Error("Juego no encontrado")

    // Si no tiene summary, generamos y actualizamos
    if (!game.summary) {
      const summary = await getSummaryFromAi({ name: game.name, released: game.released })
      if (summary) {
        game = await GameRepository.updateSummary(id, summary)
      }
    }

    // devolvemos solo name y summary
    return {
      name: game.name,
      summary: game.summary,
    }
  }

  // --> mostrar la lista de juegos
  async getAllGames({ page = 1, limit = 20, genre, platform, sort = "desc", q }) {
    const skip = (page - 1) * limit
    const filter = {}

    // filtros dinámicos
    if (genre) filter.genre = genre
    if (platform) filter.platform = platform

    // búsqueda por nombre (regex, insensible a mayúsculas)
    if (q) filter.name = { $regex: q, $options: "i" }

    const sortOption = {}
    if (sort === "asc") sortOption.released = 1
    if (sort === "desc") sortOption.released = -1

    return GameRepository.getAll({ filter, sortOption, skip, limit })
  }

  // --> mostrar la lista de generos
  async getAllGenres() {
    return GameRepository.getAllGenres()
  }

  // --> mostrar la lista de plataformas
  async getAllPlatforms() {
    return GameRepository.getAllPlatforms()
  }

  // --> buscar un juego por id
  async getGameById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("El id no es valido")
    }

    const game = await GameRepository.getById(id)
    return game
  }

  // --> buscar un juego por nombre exacto
  async getGameByName(name) {
    return GameRepository.getByName(name)
  }

  // --> buscar por nombre
  async searchGames(q, page, limit) {
    return GameRepository.search(q, page, limit)
  }

  // --> crear un nuevo juego
  async createGame(data) {
    // si viene id_rawg, verificamos si ya existe
    if (data.id_rawg) {
      const existing = await GameRepository.getByRawgId(data.id_rawg)
      if (existing) {
        throw new Error("El juego con ese id_rawg ya existe")
      }
    }

    const gameExist = await gameRepository.getByName(data.name)

    if (gameExist) {
      throw new Error("El juego con ese nombre ya existe")
    }

    // crear juego nuevo
    return GameRepository.create(data)
  }

  // --> actualizar un juego
  async updateGame(id, data) {
    const gameUpdated = await GameRepository.update(id, data)

    console.log(gameUpdated)

    if (!gameUpdated) {
      throw new Error("El juego que intentas actualizar no existe")
    }

    return gameUpdated
  }

  // --> eliminar un juego
  async deleteGame(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("El id no es valido")
    }

    const game = await GameRepository.delete(id)
    return game
  }
}

export default new GameService()
