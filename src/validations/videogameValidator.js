import { body, query } from "express-validator"

export const gameValidator = [
  body("id_rawg").optional().isInt().withMessage("El id_rawg debe ser un número entero"),

  body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isString()
    .withMessage("El nombre debe ser texto"),

  body("background_image").optional().isURL().withMessage("La imagen debe ser una URL válida"),
  body("genres").isArray({ min: 1 }).withMessage("Debe haber al menos un género"),
  body("genres.*").isString().withMessage("Cada género debe ser texto"),
  body("platforms").isArray({ min: 1 }).withMessage("Debe haber al menos una plataforma"),
  body("platforms.*").isString().withMessage("Cada plataforma debe ser texto"),

  body("released")
    .optional()
    .isISO8601()
    .withMessage("La fecha de lanzamiento debe tener un formato válido (YYYY-MM-DD)"),
]

export const paginationValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La página debe ser un número entero mayor o igual a 1")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("El límite debe ser un número entre 1 y 50")
    .toInt(),
]

export const searchValidator = [
  query("q").notEmpty().withMessage("La búsqueda no puede estar vacía").trim(),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La página debe ser un número entero mayor o igual a 1")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El límite debe ser un número entre 1 y 100")
    .toInt(),
]

export const releasedValidator = [
  query("sort")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("El parámetro sort debe ser 'asc' o 'desc'")
    .default("desc"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La página debe ser un número entero mayor o igual a 1")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El límite debe ser un número entre 1 y 100")
    .toInt(),
]
