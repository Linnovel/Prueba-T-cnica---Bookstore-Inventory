import dotenv from "dotenv"

dotenv.config()

function numberFromEnv(name: string, fallback: number): number {
  const rawValue = process.env[name]
  if (!rawValue) {
    return fallback
  }

  const parsed = Number(rawValue)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const env = {
  port: numberFromEnv("PORT", 3000),
  localCurrency: process.env.LOCAL_CURRENCY ?? "EUR",
  defaultExchangeRate: numberFromEnv("DEFAULT_EXCHANGE_RATE", 0.85),
  marginPercentage: numberFromEnv("MARGIN_PERCENTAGE", 40),
}
