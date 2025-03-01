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

export function hexToRgba(hex: string) {
  return hex.replace(/^#/, "");
}
