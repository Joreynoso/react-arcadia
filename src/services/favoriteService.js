import FavoriteRepository from '../repositories/favoriteRepository.js'
import mongoose from 'mongoose'

class FavoriteGameService {
    // Fagregar un juego a favoritosF
    async addFavorite(userId, gameId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('ID de usuario inválido')
        }
        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            throw new Error('ID del juego inválido')
        }

        // 🔹 Verificar si ya existe
        const existing = await FavoriteRepository.existsFavorite(userId, gameId)
        if (existing) {
            // devolver null si ya existe
            return null
        }

        // si no existe, agregar
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