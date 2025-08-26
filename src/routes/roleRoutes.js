import express from "express"
import RoleController from "../controllers/roleController.js"
import { authenticateToken, hasPermission } from "../middlewares/authMiddleware.js"

// instanciar Router
const roleRouter = express.Router()

// rutas de los roles
roleRouter.get("/", authenticateToken, hasPermission("read:roles"), RoleController.getAll)
roleRouter.get("/:id", authenticateToken, hasPermission("read:roles"), RoleController.getById)
roleRouter.put("/:id/role", RoleController.assignRole)
roleRouter.post("/", authenticateToken, hasPermission("add:role"), RoleController.create)
roleRouter.put("/:id", authenticateToken, hasPermission("update:role"), RoleController.update)
roleRouter.delete("/:id", authenticateToken, hasPermission("delete:role"), RoleController.delete)

// export roleRouter
export default roleRouter
