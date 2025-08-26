import express from "express"
import UserController from "../controllers/userController.js"
import { authenticateToken, hasPermission } from "../middlewares/authMiddleware.js"

// instanciar Router
const userRouter = express.Router()

// rutas de los usuarios
userRouter.get("/", authenticateToken, hasPermission("read:users"), UserController.getAll)
userRouter.get("/profile", authenticateToken, hasPermission("read:profile"), UserController.getOwnProfile)
userRouter.get("/:id", authenticateToken, hasPermission("read:users"), UserController.getById)
userRouter.delete("/:id", authenticateToken, hasPermission("delete:user"), UserController.delete)

// export userRouter
export default userRouter
