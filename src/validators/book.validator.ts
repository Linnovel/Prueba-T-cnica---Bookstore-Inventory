import { body, param, query } from "express-validator"
import { isValidIsbn } from "../utils/isbn"

export const bookIdValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("id must be a positive integer")
    .toInt(),
]

export const listBooksValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100")
    .toInt(),
]

export const createBookValidation = [
  body("title").isString().trim().notEmpty().withMessage("title is required"),
  body("author").isString().trim().notEmpty().withMessage("author is required"),
  body("isbn")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("isbn is required")
    .custom((value) => isValidIsbn(value))
    .withMessage("isbn must be a valid ISBN-10 or ISBN-13"),
  body("cost_usd")
    .isFloat({ gt: 0 })
    .withMessage("cost_usd must be greater than 0")
    .toFloat(),
  body("stock_quantity")
    .isInt({ min: 0 })
    .withMessage("stock_quantity cannot be negative")
    .toInt(),
  body("category")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("category is required"),
  body("supplier_country")
    .isString()
    .trim()
    .isLength({ min: 2, max: 2 })
    .withMessage("supplier_country must be a 2-letter country code")
    .toUpperCase(),
]

export const updateBookValidation = [
  body("title")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("title cannot be empty"),
  body("author")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("author cannot be empty"),
  body("isbn")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("isbn cannot be empty")
    .custom((value) => isValidIsbn(value))
    .withMessage("isbn must be a valid ISBN-10 or ISBN-13"),
  body("cost_usd")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("cost_usd must be greater than 0")
    .toFloat(),
  body("stock_quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("stock_quantity cannot be negative")
    .toInt(),
  body("category")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("category cannot be empty"),
  body("supplier_country")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 2 })
    .withMessage("supplier_country must be a 2-letter country code")
    .toUpperCase(),
]
