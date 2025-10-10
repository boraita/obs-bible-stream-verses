export function hexToRgba(hex, alpha) {
  const cleanHex = hex.replace(/^#/, '');

  const red = parseInt(cleanHex.substring(0, 2), 16);
  const green = parseInt(cleanHex.substring(2, 4), 16);
  const blue = parseInt(cleanHex.substring(4, 6), 16);

  const validAlpha = parseFloat(alpha);
  const finalAlpha = isNaN(validAlpha) || validAlpha < 0 || validAlpha > 1 ? 1 : validAlpha;

  return `rgba(${red}, ${green}, ${blue}, ${finalAlpha})`;
}