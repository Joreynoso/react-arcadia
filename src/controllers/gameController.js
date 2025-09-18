import gameService from "../services/gameService.js"
import FavoriteGame from "../models/FavoriteGame.js"
import { query } from "express-validator"
import VideoGame from "../models/VideoGame.js"

class GameController {
  constructor() {}

  // --> cargar todos los juegos
  async loadGames(req, res) {
    try {
      const listGames = await gameService.loadAllGames()

      if (!listGames || listGames.length === 0) {
        return res.status(404).json({ succes: false, message: "No hay juegos cargados" })
      }

      res.status(200).json({ succes: true, message: "Juegos Cargados", listGames })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({ succes: false, message: error.message })
    }
  }

  // --> generar descripción con ia
  async generateSummary(req, res) {
    try {
      const { id } = req.params
      const result = await gameService.generateSummary(id)

      if (!result) {
        return res.status(404).json({ success: false, message: "Juego no encontrado" })
      }

      return res.status(200).json({
        success: true,
        ...result,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  // --> lista de juegos
  async getAll(req, res) {
    try {
      // 1️⃣ Extraemos los query params de la URL (ej: /api/games?page=2&genre=Action)
      //    Si no vienen, asignamos valores por defecto.
      const { page = 1, limit = 20, genre, platform, sort = "desc" } = req.query

      // 2️⃣ Llamamos al servicio, que construye los filtros, orden y paginación
      //    Convertimos page y limit a número porque req.query los trae como string.
      const { games, total } = await gameService.getAllGames({
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        genre,
        platform,
        sort,
      })

      // 3️⃣ Si no se encontraron juegos, devolvemos un 404
      if (!games || games.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No se encontraron juegos",
        })
      }

      // 4️⃣ Si hay resultados, devolvemos:
      //    - success → para indicar que salió bien
      //    - page → página actual
      //    - total → cantidad total de juegos
      //    - totalPages → número total de páginas (total / limit redondeado hacia arriba)
      //    - count → cuántos juegos trae esta página
      //    - games → el array con los juegos
      return res.status(200).json({
        success: true,
        message: "Lista de juegos",
        page: Number(page),
        total,
        totalPages: Math.ceil(total / limit),
        count: games.length,
        games,
      })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  // --> lista de generos
  async getAllGenres(req, res) {
    try {
      const totalGenres = await gameService.getAllGenres()

      if (totalGenres.length === 0 || !totalGenres) {
        return res.status(404).json({ succes: false, message: "No hay generos" })
      }

      return res.status(200).json({ succes: true, totalGenres })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({ succes: false, message: error.message })
    }
  }

  // --> lista de plataformas
  async getAllPlatforms(req, res) {
    try {
      const totalPlatforms = await gameService.getAllPlatforms()

      if (totalPlatforms.length === 0 || !totalPlatforms) {
        return res.status(404).json({ succes: false, message: "No hay generos" })
      }

      return res.status(200).json({ succes: true, totalPlatforms })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({ succes: false, message: error.message })
    }
  }

  // --> buscar un juego por id
  async getById(req, res) {
    try {
      const { id } = req.params

      const gameExist = await gameService.getGameById(id)

      if (!gameExist) {
        return res.status(404).json({ succes: false, message: "Juego no encontrado" })
      }

      res.status(200).json({ succes: true, message: "Juego encontrado", game: gameExist })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({ succes: false, message: error.message })
    }
  }

  // --> buscar un juego por nombre
  async search(req, res) {
    const { q } = req.query
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25

    try {
      const { games, total } = await gameService.searchGames(q, page, limit)

      if (!games || games.length === 0) {
        return res.status(404).json({ succes: false, message: "No se encontraron juegos" })
      }

      res.status(200).json({
        succes: true,
        message: `Resultados de búsqueda para "${q}"`,
        page,
        total,
        totalPages: Math.ceil(total / limit),
        count: games.length,
        games,
      })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({ succes: false, message: error.message })
    }
  }

  // --> crear un nuevo juego
  async create(req, res) {
    try {
      const { name } = req.body.name
      const gameData = req.body

      const gameExist = await gameService.getGameByName(name)

      if (gameExist) {
        return res.status(200).json({ succes: false, message: "El juego ya existe" })
      }

      const newGame = await gameService.createGame(gameData)

      res.status(201).json({ succes: true, message: "Juego creado", game: newGame })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({ succes: false, message: error.message })
    }
  }

  // --> actualizar un juego
  async update(req, res) {
    try {
      const { id } = req.params
      const gameData = req.body

      console.log("cuerpo de la solicitud", gameData)
      const gameUpdated = await gameService.updateGame(id, gameData)

      if (!gameUpdated) {
        return res.status(404).json({ succes: false, message: "Juego no encontrado" })
      }

      res.status(200).json({ succes: true, message: "Juego actualizado", game: gameUpdated })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({ succes: false, message: error.message })
    }
  }

  // --> eliminar un juego
  async delete(req, res) {
    try {
      const { id } = req.params

      const gameDeleted = await gameService.deleteGame(id)

      if (!gameDeleted) {
        return res.status(404).json({ succes: false, message: "Juego no encontrado" })
      }

      await FavoriteGame.deleteMany({ game: id })

      res.status(200).json({ succes: true, message: "Juego eliminado", game: gameDeleted })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({ succes: false, message: error.message })
    }
  }
}

export default new GameController()
