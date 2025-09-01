import FavoriteRepository from '../repositories/favoriteRepository.js'
import mongoose from 'mongoose'

class FavoriteGameService {
    async addFavorite(userId, gameId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error('ID de usuario inválido')
        if (!mongoose.Types.ObjectId.isValid(gameId)) throw new Error('ID del juego inválido')

        const existing = await FavoriteRepository.existsFavorite(userId, gameId)
        if (existing) return null

        return FavoriteRepository.addFavorite(userId, gameId)
    }

    async removeFavorite(userId, gameId) {
        const removed = await FavoriteRepository.removeFavorite(userId, gameId)
        if (!removed) throw new Error("No se encontró el juego en favoritos")
        return removed
    }

    async getFavorites(userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error("ID de usuario inválido")

        const favoritesListUser = await FavoriteRepository.getFavoritesByUser(userId)

        // mapear para que el front reciba solo lo necesario
        return favoritesListUser.map(fav => ({
            id: fav.game._id,
            name: fav.game.name,
            platforms: fav.game.platforms,
            genres: fav.game.genres,
            released: fav.game.released,
            background_image: fav.game.background_image
        }))
    }

    async getFavorite(userId, gameId) {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(gameId)) return null

        const fav = await FavoriteRepository.getFavorite(userId, gameId)
        if (!fav) return null

        return {
            id: fav.game._id,
            name: fav.game.name,
            platforms: fav.game.platforms,
            genres: fav.game.genres,
            released: fav.game.released,
            background_image: fav.game.background_image
        }
    }
}

export default new FavoriteGameService()