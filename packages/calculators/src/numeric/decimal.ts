import Decimal from "decimal.js";

export const DecimalValue = Decimal.clone({
  precision: 50,
  rounding: Decimal.ROUND_HALF_UP,
});
export const MAX_INPUT_SIGNIFICANT_DIGITS = 30;
export const MAX_INPUT_TEXT_LENGTH = 256;
export const MAX_INPUT_ADJUSTED_EXPONENT = 100;
export const MAX_OUTPUT_ADJUSTED_EXPONENT = 100;

export type ParseError =
  | "empty"
  | "invalid-number"
  | "exponent-not-allowed"
  | "too-precise"
  | "too-long"
  | "out-of-range";
export type ParseResult =
  | { ok: true; value: InstanceType<typeof DecimalValue>; canonical: string }
  | { ok: false; error: ParseError };

/** Parse canonical, ungrouped decimal input. Locale-aware text normalization belongs in the UI/i18n edge. */
export function parseCanonicalDecimal(text: string): ParseResult {
  if (text.length > MAX_INPUT_TEXT_LENGTH)
    return { ok: false, error: "too-long" };
  if (text.length === 0 || text.trim() === "")
    return { ok: false, error: "empty" };
  if (/[eE]/.test(text)) return { ok: false, error: "exponent-not-allowed" };
  if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(text))
    return { ok: false, error: "invalid-number" };
  const digits = text.replace(/^[+-]/, "").replace(".", "").replace(/^0+/, "");
  if (digits.length > MAX_INPUT_SIGNIFICANT_DIGITS)
    return { ok: false, error: "too-precise" };
  const value = new DecimalValue(text);
  if (
    !value.isFinite() ||
    (!value.isZero() && Math.abs(value.e) > MAX_INPUT_ADJUSTED_EXPONENT)
  )
    return { ok: false, error: "out-of-range" };
  return { ok: true, value, canonical: value.toFixed() };
}

export function decimalOutput(
  value: InstanceType<typeof DecimalValue>,
): string | null {
  if (
    !value.isFinite() ||
    (!value.isZero() && Math.abs(value.e) > MAX_OUTPUT_ADJUSTED_EXPONENT)
  )
    return null;
  return value.toFixed();
}
