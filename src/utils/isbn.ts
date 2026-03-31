export function normalizeIsbn(rawIsbn: string): string {
  return rawIsbn.replace(/[-\s]/g, "").toUpperCase()
}

export function isValidIsbn(rawIsbn: string): boolean {
  const isbn = normalizeIsbn(rawIsbn)

  if (/^\d{9}[\dX]$/.test(isbn)) {
    return validateIsbn10(isbn)
  }

  if (/^\d{13}$/.test(isbn)) {
    return validateIsbn13(isbn)
  }

  return false
}

function validateIsbn10(isbn10: string): boolean {
  let sum = 0

  for (let i = 0; i < 9; i += 1) {
    sum += (i + 1) * Number(isbn10[i])
  }

  const checksum = isbn10[9] === "X" ? 10 : Number(isbn10[9])
  sum += 10 * checksum

  return sum % 11 === 0
}

function validateIsbn13(isbn13: string): boolean {
  let sum = 0

  for (let i = 0; i < 12; i += 1) {
    const digit = Number(isbn13[i])
    sum += i % 2 === 0 ? digit : digit * 3
  }

  const checkDigit = (10 - (sum % 10)) % 10
  return checkDigit === Number(isbn13[12])
}
