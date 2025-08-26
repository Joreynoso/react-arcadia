import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const RAWG_BASE_URL = "https://api.rawg.io/api"
const API_KEY = process.env.RAWG_API_KEY

export const fetchExternalGames = async (page = 1, pageSize = 40) => {
  try {
    const res = await axios.get(`${RAWG_BASE_URL}/games`, {
      params: {
        key: API_KEY,
        page,
        page_size: pageSize,
        dates: "1990-01-01,2010-12-31",
        ordering: "-added",
      },
    })

    return {
      games: res.data.results.map((game) => ({
        id_rawg: game.id,
        name: game.name,
        released: game.released,
        background_image: game.background_image,
        platforms: game.platforms?.map((p) => p.platform.name) || [],
        genres: game.genres?.map(g => g.name) || []
      }))
    }

  } catch (error) {
    console.error(`Error fetching page ${page} from RAWG:`, error.message)
    return { games: [], totalPages: 0 }
  }
}
