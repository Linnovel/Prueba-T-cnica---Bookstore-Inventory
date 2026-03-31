import { env } from "../config/env"
import {
  getUsdToCurrencyRate,
  mapCountryToCurrency,
} from "./exchangeRate.service"

export interface PriceCalculationResult {
  exchange_rate: number
  cost_local: number
  margin_percentage: number
  selling_price_local: number
  currency: string
  calculation_timestamp: string
  used_fallback_rate: boolean
}

function roundMoney(value: number): number {
  return Number(value.toFixed(2))
}

export async function calculateSuggestedPrice(
  costUsd: number,
  supplierCountry: string,
): Promise<PriceCalculationResult> {
  const currency = mapCountryToCurrency(supplierCountry, env.localCurrency)
  const { rate, usedFallback } = await getUsdToCurrencyRate(currency)

  const costLocal = roundMoney(costUsd * rate)
  const sellingPriceLocal = roundMoney(
    costLocal * (1 + env.marginPercentage / 100),
  )

  return {
    exchange_rate: rate,
    cost_local: costLocal,
    margin_percentage: env.marginPercentage,
    selling_price_local: sellingPriceLocal,
    currency,
    calculation_timestamp: new Date().toISOString(),
    used_fallback_rate: usedFallback,
  }
}
