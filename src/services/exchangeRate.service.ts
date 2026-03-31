import axios from "axios"
import { env } from "../config/env"

interface ExchangeRateApiResponse {
  rates: Record<string, number>
}

export interface ExchangeRateResult {
  rate: number
  usedFallback: boolean
}

export class ExchangeRateError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 503) {
    super(message)
    this.name = "ExchangeRateError"
    this.statusCode = statusCode
  }
}

export async function getUsdToCurrencyRate(
  currency: string,
): Promise<ExchangeRateResult> {
  try {
    const response = await axios.get<ExchangeRateApiResponse>(
      "https://api.exchangerate-api.com/v4/latest/USD",
      {
        timeout: 5000,
      },
    )

    const rate = response.data.rates[currency]

    if (!rate || rate <= 0) {
      throw new Error("Rate not available for requested currency")
    }

    return { rate, usedFallback: false }
  } catch {
    if (env.defaultExchangeRate <= 0) {
      throw new ExchangeRateError(
        "Exchange rate service unavailable and fallback rate is invalid.",
      )
    }

    return {
      rate: env.defaultExchangeRate,
      usedFallback: true,
    }
  }
}

export function mapCountryToCurrency(
  countryCode: string,
  defaultCurrency: string,
): string {
  const map: Record<string, string> = {
    AR: "ARS",
    CL: "CLP",
    CO: "COP",
    ES: "EUR",
    GB: "GBP",
    MX: "MXN",
    PE: "PEN",
    US: "USD",
  }

  return map[countryCode.toUpperCase()] ?? defaultCurrency
}
