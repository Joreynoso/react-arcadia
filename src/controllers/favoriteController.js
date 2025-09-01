import FavoriteService from "../services/favoriteService.js"

class FavoriteController {
    async addFavorite(req, res) {
        try {
            const { gameid } = req.body
            const userId = req.user.id

            if (!gameid) return res.status(400).json({ success: false, message: 'El campo gameid es obligatorio' })

            const newFavorite = await FavoriteService.addFavorite(userId, gameid)

            if (!newFavorite) {
                return res.status(200).json({ success: true, message: 'El juego ya está en favoritos' })
            }

            res.status(201).json({
                success: true,
                message: 'Juego agregado a favoritos',
                favorite: { id: newFavorite.game, user: userId }
            })
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        }
    }

    async removeFavorite(req, res) {
        try {
            const { gameid } = req.body
            const userid = req.user.id

            if (!gameid) return res.status(400).json({ success: false, message: 'El campo gameid es obligatorio' })

            const gamedeleted = await FavoriteService.removeFavorite(userid, gameid)

            res.status(200).json({
                success: true,
                message: 'Juego eliminado de favoritos',
                game: { id: gamedeleted.game, user: userid }
            })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    async getFavorites(req, res) {
        try {
            const listOfFavorites = await FavoriteService.getFavorites(req.user.id)

            res.status(200).json({
                success: true,
                message: listOfFavorites.length ? 'Lista de favoritos' : 'No se encontraron favoritos',
                favorites: listOfFavorites
            })
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        }
    }

    async getFavorite(req, res) {
        try {
            const { gameid } = req.params
            const userId = req.user.id

            const favorite = await FavoriteService.getFavorite(userId, gameid)

            if (!favorite) return res.status(404).json({ success: false, message: 'Favorito no encontrado' })

            res.status(200).json({ success: true, favorite })
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        }
    }
}

export default new FavoriteController()
