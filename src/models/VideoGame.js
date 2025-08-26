import mongoose from "mongoose"

const videoGameSchema = new mongoose.Schema(
  {
    id_rawg: { type: Number },
    name: { type: String, required: true },
    summary: { type: String, default: "" }, // <-- aqui se almacenará la repuesta de google gen ai
    released: { type: String },
    platforms: [{ type: String }],
    genres: [{ type: String }], // <-- ahora es un array de strings, sin objetos ni _id
    background_image: { type: String },
  },
  { timestamps: true }
)

const VideoGame = mongoose.model("VideoGame", videoGameSchema)
export default VideoGame
