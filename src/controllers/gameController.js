import gameService from "../services/gameService.js"
import FavoriteGame from "../models/FavoriteGame.js"
import { query } from 'express-validator'
import VideoGame from '../models/VideoGame.js'

class GameController {
  constructor() { }

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
      const { page = 1, limit = 10 } = req.query // valores por defecto

      const { games, total } = await gameService.getAllGames(page, limit)

      if (!games || games.length === 0) {
        return res.status(404).json({ succes: false, message: "No hay juegos" })
      }

      res.status(200).json({
        succes: true,
        message: "Lista de juegos",
        page: Number(page), // --> pág actual convertida a num
        total, // --> total juegos
        totalPages: Math.ceil(total / limit), // --> total juegos posibles x pág
        count: games.length,
        games,
      })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({ succes: false, message: error.message })
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
  async getAllGenres(req, res) {
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

  // --> buscar juegos por fecha de lanzamiento
  async searchByReleased(req, res) {
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const sort = req.query.sort || "desc" // valor por defecto

    try {
      const { games, total } = await gameService.searchByReleased(page, limit, sort)

      if (!games || games.length === 0) {
        return res
          .status(404)
          .json({ succes: false, message: "No se encontraron juegos ordenados por fecha" })
      }

      res.status(200).json({
        succes: true,
        message: `Resultados de juegos ordenados por fecha (${sort})`,
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

  // --> buscar juegos por género
  async searchByGenre(req, res) {
    const { genre } = req.query   // ej: ?genre=Action
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25

    try {
      const { games, total } = await gameService.searchByGender(page, limit, genre)

      if (!games || games.length === 0) {
        return res.status(404).json({
          succes: false,
          message: "No se encontraron juegos"
        })
      }

      res.status(200).json({
        succes: true,
        message: genre ? `Resultados de búsqueda para género "${genre}"` : "Lista de juegos",
        page,
        total,
        totalPages: Math.ceil(total / limit),
        count: games.length,
        games,
      })

    } catch (error) {
      console.error(error.message)
      return res.status(500).json({
        succes: false,
        message: error.message
      })
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
