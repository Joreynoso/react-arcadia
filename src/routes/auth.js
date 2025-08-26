import express from "express"
import authController from "../controllers/authController.js"
import { loginValidator, registerValidator } from "../validations/authValidator.js"
import { handleValidationError } from "../middlewares/handleValidationsError.js"

// instanciar router
const authRouter = express.Router()

// rutas de aunteticación
authRouter.post("/register", registerValidator, handleValidationError, authController.userRegister)
authRouter.post("/login", loginValidator, handleValidationError, authController.userLogin)

// export authRouter
export default authRouter
