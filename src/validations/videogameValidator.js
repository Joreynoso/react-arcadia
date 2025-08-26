import { body } from "express-validator"

export const gameValidator = [
  body("id_rawg")
    .optional()
    .isInt()
    .withMessage("El id_rawg debe ser un número entero"),

  body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isString()
    .withMessage("El nombre debe ser texto"),

  body("background_image").optional().isURL().withMessage("La imagen debe ser una URL válida"),

  body("genres").isArray({ min: 1 }).withMessage("Debe haber al menos un género"),

  body("genres.*.id").isInt().withMessage("El id de cada género debe ser un número"),

  body("genres.*.name").isString().withMessage("El nombre de cada género debe ser texto"),

  body("platforms").isArray({ min: 1 }).withMessage("Debe haber al menos una plataforma"),

  body("platforms.*").isString().withMessage("Cada plataforma debe ser texto"),

  body("released")
    .optional()
    .isISO8601()
    .withMessage("La fecha de lanzamiento debe tener un formato válido (YYYY-MM-DD)"),
]
