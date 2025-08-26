import mongoose from "mongoose"

const favoriteGameSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VideoGame",
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
)

const FavoriteGame = mongoose.model("FavoriteGame", favoriteGameSchema)
export default FavoriteGame
