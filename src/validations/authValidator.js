import { body } from "express-validator"

export const registerValidator = [
  body("email")
    .isEmail()
    .withMessage("El email no es válido")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .trim(),

  body("username")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
]

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("El email no es válido")
    .notEmpty()
    .withMessage("El email es obligatorio"),

  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
]
