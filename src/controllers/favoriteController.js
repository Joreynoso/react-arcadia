import FavoriteService from "../services/favoriteService.js"

class FavoriteController {
    // agregar un juego a favoritos
    async addFavorite(req, res) {
        try {
            const { gameid } = req.body
            const userId = req.user.id

            // comprobar si ya existe
            const existing = await FavoriteService.getFavorites(userId, gameid)

            if (existing) {
                return res.status(200).json({
                    success: true,
                    message: 'El juego ya está en favoritos',
                })
            }

            // si no existe, lo agrega
            const newFavorite = await FavoriteService.addFavorite(userId, gameid)

            res.status(201).json({
                success: true,
                message: 'Juego agregado a favoritos',
                favorite: newFavorite
            })
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        }
    }

    // obtener todos los favoritos de un usuario
    async getFavorites(req, res) {
        try {
            console.log('1. entrando a getFavorites')
            console.log('2. id del middleware', req.user.id)

            const listOfFavorites = await FavoriteService.getFavorites(req.user.id)

            if (!listOfFavorites || listOfFavorites.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: 'No se encontraron favoritos',
                    favorites: []
                })
            }

            res.status(200).json({
                success: true,
                message: 'Lista de favoritos',
                favorites: listOfFavorites
            })
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        }
    }


    // eliminar un juego de favoritos
    async removeFavorite(req, res) {
        try {
            const { gameid } = req.body
            const userid = req.user.id  // ✅ tomar id del token

            if (!gameid) {
                return res.status(400).json({ success: false, message: 'El campo gameid es obligatorio' })
            }

            const gamedeleted = await FavoriteService.removeFavorite(userid, gameid)

            if (!gamedeleted) {
                return res.status(404).json({ success: false, message: 'Favorito no encontrado' })
            }

            res.status(200).json({ success: true, message: "Juego eliminado de favoritos", game: gamedeleted })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }
}

export default new FavoriteController()
