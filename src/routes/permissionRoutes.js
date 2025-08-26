import express from "express"
import PermissionController from '../controllers/permissionController.js'
import { authenticateToken, hasPermission } from "../middlewares/authMiddleware.js"
import { permissionValidator } from "../validations/permissionValidator.js"
import { handleValidationError } from '../middlewares/handleValidationsError.js'

// isntanciar Router
const permissionRouter = express.Router()

// rutas de permisos
permissionRouter.get('/',
    authenticateToken,
    hasPermission('read:permissions'),
    PermissionController.getAll)

permissionRouter.get('/:id',
    authenticateToken,
    hasPermission('read:permissions'),
    PermissionController.getById)

permissionRouter.post('/',
    authenticateToken,
    hasPermission('add:permission'),
    permissionValidator,
    handleValidationError,
    PermissionController.create)

permissionRouter.put('/:id',
    authenticateToken,
    hasPermission('update:permission'),
    permissionValidator,
    handleValidationError,
    PermissionController.update)

permissionRouter.delete('/:id',
    authenticateToken,
    hasPermission('delete:permission'),
    PermissionController.delete)

// export permissionRouter
export default permissionRouter