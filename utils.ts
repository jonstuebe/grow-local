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

export function rgbaToHex(colorStr: string) {
  // Check if the input string contains '/'
  const hasSlash = colorStr.includes("/");

  if (hasSlash) {
    // Extract the RGBA values from the input string
    const rgbaValues = colorStr.match(/(\d+)\s+(\d+)\s+(\d+)\s+\/\s+([\d.]+)/);

    if (!rgbaValues) {
      return colorStr; // Return the original string if it doesn't match the expected format
    }

    const [red, green, blue, alpha] = rgbaValues.slice(1, 5).map(parseFloat);

    // Convert the RGB values to hexadecimal format
    const redHex = red.toString(16).padStart(2, "0");
    const greenHex = green.toString(16).padStart(2, "0");
    const blueHex = blue.toString(16).padStart(2, "0");

    // Convert alpha to a hexadecimal format (assuming it's already a decimal value in the range [0, 1])
    const alphaHex = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");

    // Combine the hexadecimal values to form the final hex color string
    return `#${redHex}${greenHex}${blueHex}${alphaHex}`;
  } else {
    // Handle comma-separated rgba format
    return (
      "#" +
      colorStr
        .replace(/^rgba?\(|\s+|\)$/g, "") // Get's rgba / rgb string values
        .split(",") // splits them at ","
        .map((string) => parseFloat(string)) // Converts them to numbers
        .map((number, index) =>
          index === 3 ? Math.round(number * 255) : number
        ) // Converts alpha to 255 number
        .map((number) => number.toString(16)) // Converts numbers to hex
        .map((string) => (string.length === 1 ? "0" + string : string)) // Adds 0 when length of one number is 1
        .join("")
    );
  }
}

/**
 * Converts a hex color value to an RGBA color string.
 *
 * @param hex - The hex color value (with or without '#'). Can be short (3-4 chars) or full (6-8 chars) hex.
 * @param alpha - Optional alpha value (0-1)
 * @returns An RGBA color string
 */
export function hexToRgba(hex: string, alpha?: number): string {
  // Remove hash if present
  const hashlessHex = hex.charAt(0) === "#" ? hex.slice(1) : hex;

  // Determine if it's a short hex (3 or 4 chars)
  const isShort = hashlessHex.length === 3 || hashlessHex.length === 4;

  // Expand short hex to full hex
  const twoDigitHexR = isShort
    ? `${hashlessHex.slice(0, 1)}${hashlessHex.slice(0, 1)}`
    : hashlessHex.slice(0, 2);
  const twoDigitHexG = isShort
    ? `${hashlessHex.slice(1, 2)}${hashlessHex.slice(1, 2)}`
    : hashlessHex.slice(2, 4);
  const twoDigitHexB = isShort
    ? `${hashlessHex.slice(2, 3)}${hashlessHex.slice(2, 3)}`
    : hashlessHex.slice(4, 6);
  const twoDigitHexA =
    (isShort
      ? `${hashlessHex.slice(3, 4)}${hashlessHex.slice(3, 4)}`
      : hashlessHex.slice(6, 8)) || "ff";

  // Convert hex to decimal
  const r = parseInt(twoDigitHexR, 16);
  const g = parseInt(twoDigitHexG, 16);
  const b = parseInt(twoDigitHexB, 16);
  const defaultAlpha = +(parseInt(twoDigitHexA, 16) / 255).toFixed(2);

  // Use provided alpha or default to parsed alpha
  const a = alpha !== undefined ? alpha : defaultAlpha;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
