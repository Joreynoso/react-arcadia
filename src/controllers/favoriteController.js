import FavoriteService from "../services/favoriteService.js"

class FavoriteController {
  async getFavorites(req, res) {
    try {
      const favorites = await FavoriteService.listFavorites(req.user.id)
      res.status(200).json({
        success: true,
        message: favorites.length ? "Lista de favoritos" : "No se encontraron favoritos",
        favorites,
      })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  async addFavorite(req, res) {
    try {
      const { gameId } = req.body
      if (!gameId)
        return res.status(400).json({ success: false, message: "El campo gameId es obligatorio" })

      const alreadyExists = await FavoriteService.existsFavorite(req.user.id, gameId)
      if (alreadyExists) {
        return res.status(200).json({
          success: true,
          message: "El juego ya está en favoritos",
        })
      }

      // agregar el favorito
      const game = await FavoriteService.createFavorite(req.user.id, gameId)
      res.status(201).json({
        success: true,
        message: "Juego agregado a favoritos",
        game,
      })
    } catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  async removeFavorite(req, res) {
    try {
      const { gameId } = req.body
      if (!gameId)
        return res.status(400).json({ success: false, message: "El campo gameId es obligatorio" })

      const game = await FavoriteService.deleteFavorite(req.user.id, gameId)
      res.status(200).json({
        success: true,
        message: "Juego eliminado de favoritos",
        game,
      })
    } catch (err) {
      res.status(400).json({ success: false, message: err.message })
    }
  }
}

export default new FavoriteController()
