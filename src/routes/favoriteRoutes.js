import express from "express"
import favoriteController from '../controllers/favoriteController.js'
import { authenticateToken, hasPermission } from "../middlewares/authMiddleware.js"


// instanciar router
const favoriteRouter = express.Router()

favoriteRouter.get("/",
    authenticateToken,
    hasPermission('read:favorites'),
    favoriteController.getFavorites)

favoriteRouter.post("/add",
    authenticateToken,
    hasPermission('add:favorite'),
    favoriteController.addFavorite)

favoriteRouter.delete("/remove",
    authenticateToken,
    hasPermission('delete:favorite'),
    favoriteController.removeFavorite)


// export authRouter
export default favoriteRouter
