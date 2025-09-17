import express from "express"
import gameController from "../controllers/gameController.js"
import { authenticateToken, hasPermission } from "../middlewares/authMiddleware.js"
import { handleValidationError } from "../middlewares/handleValidationsError.js"
import { gameValidator, paginationValidator, searchValidator, releasedValidator } from "../validations/videogameValidator.js"

// instanciar router
const gameRouter = express.Router()

// rutas de aunteticación
gameRouter.get("/",
    authenticateToken,
    hasPermission('read:games'),
    paginationValidator,
    handleValidationError,
    gameController.getAll)

gameRouter.post("/load",
    authenticateToken,
    authenticateToken,
    hasPermission("load:games"),
    gameController.loadGames)

gameRouter.post("/summary/:id",
    gameController.generateSummary)

gameRouter.get("/search",
    authenticateToken,
    hasPermission('read:games'),
    searchValidator,
    handleValidationError,
    gameController.search)

gameRouter.get("/released",
    authenticateToken,
    hasPermission('read:games'),
    releasedValidator,
    handleValidationError,
    gameController.searchByReleased)

gameRouter.get("/genre",
    authenticateToken,
    hasPermission('read:games'),
    gameController.searchByGenre)

gameRouter.get("/platform",
    authenticateToken,
    hasPermission('read:games'),
    gameController.searchByPlatform)

gameRouter.get("/all-platforms",
    authenticateToken,
    hasPermission('read:games'),
    gameController.getAllPlatforms)

gameRouter.get("/all-genres",
    authenticateToken,
    hasPermission('read:games'),
    gameController.getAllGenres)

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
    gameValidator,
    handleValidationError,
    gameController.update)

gameRouter.delete("/:id",
    authenticateToken,
    hasPermission('delete:game'),
    gameController.delete)

// export authRouter
export default gameRouter
