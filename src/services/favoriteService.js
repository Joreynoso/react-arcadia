import FavoriteRepository from "../repositories/favoriteRepository.js"
import mongoose from "mongoose"

class FavoriteGameService {
  // helper para formatear los favoritos al front
  formatGame(fav) {
    return {
      id: fav.game._id,
      name: fav.game.name,
      platforms: fav.game.platforms,
      genres: fav.game.genres,
      released: fav.game.released,
      background_image: fav.game.background_image,
    }
  }

  async existsFavorite(userId, gameId) {
    return await FavoriteRepository.existsFavorite(userId, gameId)
  }

  async listFavorites(userId) {
    const favorites = await FavoriteRepository.getFavoritesByUser(userId)
    return favorites.map((fav) => this.formatGame(fav))
  }

  async createFavorite(userId, gameId) {
    const exists = await FavoriteRepository.findFavorite(userId, gameId)
    if (exists) throw new Error("El juego ya está en favoritos")

    const newFav = await FavoriteRepository.addFavorite(userId, gameId)
    await newFav.populate("game")
    return this.formatGame(newFav)
  }

  async deleteFavorite(userId, gameId) {
    const deleted = await FavoriteRepository.removeFavorite(userId, gameId)
    if (!deleted) throw new Error("No se encontró el juego en favoritos")

    await deleted.populate("game")
    return this.formatGame(deleted)
  }
}

export default new FavoriteGameService()
