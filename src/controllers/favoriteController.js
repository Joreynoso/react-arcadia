import FavoriteService from "../services/favoriteService.js"

class FavoriteController {
    // agregar un juego a favoritos
    async addFavorite(req, res) {
        try {
            console.log('1. entrando al controlador...')
            const { userid, gameid } = req.body
            const favorite = await FavoriteService.addFavorite(userid, gameid)

            console.log('2. cuerpo solicitud', userid + gameid)

            if (!favorite) {
                return res.status(404).json({ success: false, error: 'Juego o usuario no encontrado' })
            }
            res.status(201).json({ succes: true, message: "Juego agregado a favoritos", game: favorite })
        } catch (error) {
            res.status(400).json({ succes: false, message: error.message })
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
            const { userid, gameid } = req.body

            const gamedeleted = await FavoriteService.removeFavorite(userid, gameid)

            if (!gamedeleted) {
                return res.status(404).json({ success: false, error: 'Favorito no encontrado' })
            }

            res.status(200).json({ succes: true, message: "Juego eliminado de favoritos", game: gamedeleted })
        } catch (error) {
            res.status(400).json({ succes: false, message: error.message })
        }
    }
}

export default new FavoriteController()
