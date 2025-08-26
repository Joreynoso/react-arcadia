import express from "express"
import gameController from "../controllers/gameController.js"
import { authenticateToken, hasPermission } from "../middlewares/authMiddleware.js"
import { handleValidationError } from "../middlewares/handleValidationsError.js"
import { gameValidator } from "../validations/videogameValidator.js"

// instanciar router
const gameRouter = express.Router()

// rutas de aunteticación
gameRouter.get("/",
    authenticateToken,
    hasPermission('read:games'),
    gameController.getAll)

gameRouter.post("/load",
    authenticateToken,
    hasPermission(''),
    gameController.loadGames)

gameRouter.get("/search",
    authenticateToken,
    hasPermission('read:games'),
    gameController.getByName)

gameRouter.get("/:id",
    authenticateToken,
    hasPermission('read:games'),
    gameController.getById)

gameRouter.post("/",
    authenticateToken,
    hasPermission('add:game'),
    gameValidator,
    handleValidationError,
    gameController.create)

gameRouter.put("/:id",
    authenticateToken,
    hasPermission('update:game'),
    gameController.update)

gameRouter.delete("/:id",
    authenticateToken,
    hasPermission('delete:game'),
    gameController.delete)

// export authRouter
export default gameRouter
