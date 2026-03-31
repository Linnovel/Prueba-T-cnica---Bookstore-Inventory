import { Request, Response } from "express"
import { bookStore } from "../models/book.store"
import { CreateBookInput, UpdateBookInput } from "../models/book.model"
import { calculateSuggestedPrice } from "../services/price.service"
import { ExchangeRateError } from "../services/exchangeRate.service"

function getBookId(req: Request): number {
  return Number(req.params.id)
}

export function createBook(req: Request, res: Response): void {
  const payload = req.body as CreateBookInput

  if (bookStore.isDuplicateIsbn(payload.isbn)) {
    res.status(400).json({ message: "A book with this ISBN already exists" })
    return
  }

  const book = bookStore.create(payload)
  res.status(201).json(book)
}

export function listBooks(req: Request, res: Response): void {
  const page = req.query.page ? Number(req.query.page) : undefined
  const limit = req.query.limit ? Number(req.query.limit) : undefined

  const result = bookStore.getAll(page, limit)

  res.status(200).json({
    data: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  })
}

export function getBookById(req: Request, res: Response): void {
  const id = getBookId(req)
  const book = bookStore.getById(id)

  if (!book) {
    res.status(404).json({ message: "Book not found" })
    return
  }

  res.status(200).json(book)
}

export function updateBook(req: Request, res: Response): void {
  const id = getBookId(req)
  const payload = req.body as UpdateBookInput

  const existingBook = bookStore.getById(id)
  if (!existingBook) {
    res.status(404).json({ message: "Book not found" })
    return
  }

  if (payload.isbn && bookStore.isDuplicateIsbn(payload.isbn, id)) {
    res.status(400).json({ message: "A book with this ISBN already exists" })
    return
  }

  const updatedBook = bookStore.update(id, payload)
  res.status(200).json(updatedBook)
}

export function deleteBook(req: Request, res: Response): void {
  const id = getBookId(req)
  const removed = bookStore.remove(id)

  if (!removed) {
    res.status(404).json({ message: "Book not found" })
    return
  }

  res.status(204).send()
}

export async function calculateBookPrice(
  req: Request,
  res: Response,
): Promise<void> {
  const id = getBookId(req)
  const book = bookStore.getById(id)

  if (!book) {
    res.status(404).json({ message: "Book not found" })
    return
  }

  try {
    const calculation = await calculateSuggestedPrice(
      book.cost_usd,
      book.supplier_country,
    )

    bookStore.updateSellingPrice(id, calculation.selling_price_local)

    res.status(200).json({
      book_id: book.id,
      cost_usd: book.cost_usd,
      exchange_rate: calculation.exchange_rate,
      cost_local: calculation.cost_local,
      margin_percentage: calculation.margin_percentage,
      selling_price_local: calculation.selling_price_local,
      currency: calculation.currency,
      calculation_timestamp: calculation.calculation_timestamp,
      used_fallback_rate: calculation.used_fallback_rate,
    })
  } catch (error) {
    if (error instanceof ExchangeRateError) {
      res.status(error.statusCode).json({ message: error.message })
      return
    }

    res
      .status(500)
      .json({ message: "Unexpected error while calculating price" })
  }
}
