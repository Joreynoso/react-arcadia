import { body } from "express-validator"

export const permissionValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 4, max: 60 })
    .withMessage("El nombre debe tener entre 4 y 60 caracteres"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ min: 4, max: 60 })
    .withMessage("El nombre debe tener entre 4 y 60 caracteres"),
]
