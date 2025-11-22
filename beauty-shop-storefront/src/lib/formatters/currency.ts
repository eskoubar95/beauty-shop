interface FormatCurrencyOptions {
  currencyDisplay?: "symbol" | "code" | "name"
}

export const formatCurrencyDKK = (
  amount: number,
  options: FormatCurrencyOptions = {}
) => {
  const { currencyDisplay = "symbol" } = options

  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
    currencyDisplay,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}


