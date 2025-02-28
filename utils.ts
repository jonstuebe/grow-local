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

export function rgbToHex(rgb: string | undefined) {
  if (!rgb) return undefined;
  return rgb.replace(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/, "#$1$2$3");
}
