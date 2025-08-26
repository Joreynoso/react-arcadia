import FavoriteRepository from '../repositories/favoriteRepository.js'
import mongoose from 'mongoose'

class FavoriteGameService {
    // agregar un juego a favoritos
    async addFavorite(userId, gameId) {
        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            throw new Error('ID del juego invalido')
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('ID del usuario invalido')
        }

        const existing = await FavoriteRepository.getFavorite(userId, gameId)
        if (existing) {
            throw new Error("El juego ya está en favoritos")
        }

        return FavoriteRepository.addFavorite(userId, gameId)
    }

    // eliminar un juego de favoritos
    async removeFavorite(userId, gameId) {
        const removed = await FavoriteRepository.removeFavorite(userId, gameId)
        if (!removed) {
            throw new Error("No se encontró el juego en favoritos")
        }
        return removed
    }

    // obtener todos los favoritos de un usuario
    async getFavorites(userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("No se encontró el usuario")
        }
        
        const favoritesListUser = await FavoriteRepository.getFavoritesByUser(userId)

        return favoritesListUser
    }
}

export default new FavoriteGameService()