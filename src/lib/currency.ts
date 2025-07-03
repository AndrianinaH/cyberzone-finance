const DEFAULT_EXCHANGE_RATES: { [key: string]: number } = {
  MGA: 1,
  RMB: 613,
  EUR: 5180,
  USD: 4400,
  AED: 1195,
};

export function calculateAmountMGA(
  amount: number,
  currency: string,
  exchangeRate?: number,
): number {
  const rate = exchangeRate ?? DEFAULT_EXCHANGE_RATES[currency] ?? 1;
  return currency === "MGA" ? amount : amount * rate;
}

export { DEFAULT_EXCHANGE_RATES };
