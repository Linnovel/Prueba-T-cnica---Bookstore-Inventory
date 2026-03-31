import { Router } from "express"
import {
  calculateBookPrice,
  createBook,
  deleteBook,
  getBookById,
  listBooks,
  updateBook,
} from "../controllers/book.controller"
import {
  bookIdValidation,
  createBookValidation,
  listBooksValidation,
  updateBookValidation,
} from "../validators/book.validator"
import { validateRequest } from "../middlewares/validateRequest"

const bookRouter = Router()

bookRouter.post("/", createBookValidation, validateRequest, createBook)
bookRouter.get("/", listBooksValidation, validateRequest, listBooks)
bookRouter.get("/:id", bookIdValidation, validateRequest, getBookById)
bookRouter.put(
  "/:id",
  [...bookIdValidation, ...updateBookValidation],
  validateRequest,
  updateBook,
)
bookRouter.delete("/:id", bookIdValidation, validateRequest, deleteBook)
bookRouter.post(
  "/:id/calculate-price",
  bookIdValidation,
  validateRequest,
  calculateBookPrice,
)

export { bookRouter }
