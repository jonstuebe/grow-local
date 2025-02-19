import currency from "currency.js";

export function formatCurrency(value: string | number) {
  const c = currency(value);

  if (c.cents() === 0) {
    return currency(value, { precision: 0 }).format();
  }

  return currency(value, { precision: 2 }).format();
}

export function isFunction(value: any): value is Function {
  return typeof value === "function";
}

export function dollarsToCents(value: number) {
  return value * 100;
}

export function centsToDollars(value: number) {
  return value / 100;
}
