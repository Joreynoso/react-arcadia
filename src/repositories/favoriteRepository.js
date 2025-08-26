import FavoriteGame from "../models/FavoriteGame.js"

class FavoriteGameRepository {

    async addFavorite(userId, gameId) {
        return FavoriteGame.create({ user: userId, game: gameId })
    }

    async removeFavorite(userId, gameId) {
        return FavoriteGame.findOneAndDelete({ user: userId, game: gameId })
    }

    async getFavoritesByUser(userId) {
        return FavoriteGame.find({ user: userId }).populate({
            path: 'game',
            select: 'name platforms genres released background_image _id'
        })
    }

    async getFavorite(userId, gameId) {
        return FavoriteGame.findOne({ user: userId, game: gameId })
    }
}

export default new FavoriteGameRepository()