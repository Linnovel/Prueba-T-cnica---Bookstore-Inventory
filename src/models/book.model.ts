export interface Book {
  id: number
  title: string
  author: string
  isbn: string
  cost_usd: number
  selling_price_local: number | null
  stock_quantity: number
  category: string
  supplier_country: string
  created_at: string
  updated_at: string
}

export interface CreateBookInput {
  title: string
  author: string
  isbn: string
  cost_usd: number
  stock_quantity: number
  category: string
  supplier_country: string
}

export type UpdateBookInput = Partial<CreateBookInput>
