import { Book, CreateBookInput, UpdateBookInput } from "./book.model"
import { normalizeIsbn } from "../utils/isbn"

class BookStore {
  private books: Book[] = []

  private nextId = 1

  getAll(
    page?: number,
    limit?: number,
  ): { data: Book[]; total: number; page?: number; limit?: number } {
    const sorted = [...this.books].sort((a, b) => a.id - b.id)

    if (!page || !limit) {
      return { data: sorted, total: sorted.length }
    }

    const start = (page - 1) * limit
    const end = start + limit

    return {
      data: sorted.slice(start, end),
      total: sorted.length,
      page,
      limit,
    }
  }

  getById(id: number): Book | undefined {
    return this.books.find((book) => book.id === id)
  }

  findByIsbn(isbn: string): Book | undefined {
    const normalized = normalizeIsbn(isbn)
    return this.books.find((book) => normalizeIsbn(book.isbn) === normalized)
  }

  isDuplicateIsbn(isbn: string, ignoreBookId?: number): boolean {
    const normalized = normalizeIsbn(isbn)
    return this.books.some((book) => {
      if (ignoreBookId && book.id === ignoreBookId) {
        return false
      }

      return normalizeIsbn(book.isbn) === normalized
    })
  }

  create(payload: CreateBookInput): Book {
    const now = new Date().toISOString()

    const book: Book = {
      id: this.nextId,
      title: payload.title,
      author: payload.author,
      isbn: payload.isbn,
      cost_usd: payload.cost_usd,
      selling_price_local: null,
      stock_quantity: payload.stock_quantity,
      category: payload.category,
      supplier_country: payload.supplier_country,
      created_at: now,
      updated_at: now,
    }

    this.books.push(book)
    this.nextId += 1

    return book
  }

  update(id: number, payload: UpdateBookInput): Book | undefined {
    const book = this.getById(id)

    if (!book) {
      return undefined
    }

    Object.assign(book, payload)
    book.updated_at = new Date().toISOString()

    return book
  }

  updateSellingPrice(id: number, sellingPrice: number): Book | undefined {
    const book = this.getById(id)

    if (!book) {
      return undefined
    }

    book.selling_price_local = sellingPrice
    book.updated_at = new Date().toISOString()

    return book
  }

  remove(id: number): boolean {
    const index = this.books.findIndex((book) => book.id === id)

    if (index === -1) {
      return false
    }

    this.books.splice(index, 1)
    return true
  }
}

export const bookStore = new BookStore()
