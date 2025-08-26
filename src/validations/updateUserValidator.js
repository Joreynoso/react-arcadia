import { body } from "express-validator"

export const updateUserValidator = [
  body("username")
    .optional()
    .isString()
    .withMessage("El nombre de usuario debe ser texto")
    .isLength({ min: 4 })
    .withMessage("El nombre de usuario debe tener al menos 4 caracteres"),

  body("email").optional().isEmail().withMessage("El email no es válido"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("role").optional().isMongoId().withMessage("El rol debe ser un ObjectId válido"),
]
