import { DecimalValue, parseCanonicalDecimal } from "./decimal";
import { greatestCommonDivisor } from "./rational";

export const MAX_USD_CENTS = 999_999_999_999_999_999n;

export type UsdInputError =
  | "invalid-number"
  | "out-of-range"
  | "negative"
  | "zero"
  | "fractional-cent";

export type UsdCentsInput =
  | { ok: true; cents: bigint; dollars: InstanceType<typeof DecimalValue> }
  | { ok: false; error: UsdInputError };

/** Parse exact, nonnegative USD text into bounded integer cents without Number conversion. */
export function parseUsdCents(
  text: string,
  options: { positive?: boolean } = {},
): UsdCentsInput {
  const parsed = parseCanonicalDecimal(text);
  if (!parsed.ok)
    return {
      ok: false,
      error:
        parsed.error === "out-of-range" ? "out-of-range" : "invalid-number",
    };
  if (parsed.value.isNegative() && !parsed.value.isZero())
    return { ok: false, error: "negative" };
  if (options.positive && parsed.value.isZero())
    return { ok: false, error: "zero" };

  const exactCents = parsed.value.mul(100);
  if (!exactCents.isInteger()) return { ok: false, error: "fractional-cent" };
  const cents = BigInt(exactCents.toFixed(0));
  if (cents > MAX_USD_CENTS) return { ok: false, error: "out-of-range" };
  return { ok: true, cents, dollars: parsed.value };
}

/** Settle a dollar-valued Decimal to bounded integer cents using half-up rounding. */
export function roundUsdToCents(
  dollars: InstanceType<typeof DecimalValue>,
): bigint | null {
  return roundCents(dollars.mul(100));
}

/** Settle a Decimal already measured in cents to bounded integer cents. */
export function roundCents(
  cents: InstanceType<typeof DecimalValue>,
): bigint | null {
  if (!cents.isFinite()) return null;
  const settled = cents.toDecimalPlaces(0, DecimalValue.ROUND_HALF_UP);
  if (settled.isNegative() || settled.gt(MAX_USD_CENTS.toString())) return null;
  return BigInt(settled.toFixed(0));
}

/** Settle one month's interest exactly from nominal annual percentage text and integer cents. */
export function settleMonthlyInterestCents(
  balanceCents: bigint,
  annualRatePercent: string,
): bigint | null {
  if (balanceCents < 0n) return null;
  const factor = exactMonthlyGrowthFactor(annualRatePercent);
  if (factor === null) return null;
  return roundPositiveRatio(
    balanceCents * (factor.numerator - factor.denominator),
    factor.denominator,
  );
}

/** Calculate the exact cent-valued level payment, rounded half-up once. */
export function calculateRegularPaymentCents(
  principalCents: bigint,
  annualRatePercent: string,
  months: number,
): bigint | null {
  if (
    principalCents < 0n ||
    !Number.isInteger(months) ||
    months < 1 ||
    months > 1200
  )
    return null;
  const factor = exactMonthlyGrowthFactor(annualRatePercent);
  if (factor === null) return null;
  if (factor.numerator === factor.denominator)
    return roundPositiveRatio(principalCents, BigInt(months));

  const periods = BigInt(months);
  const numeratorPower = factor.numerator ** periods;
  const denominatorPower = factor.denominator ** periods;
  const paymentNumerator =
    principalCents * (factor.numerator - factor.denominator) * numeratorPower;
  const paymentDenominator =
    factor.denominator * (numeratorPower - denominatorPower);
  return roundPositiveRatio(paymentNumerator, paymentDenominator);
}

function exactMonthlyGrowthFactor(
  annualRatePercent: string,
): { numerator: bigint; denominator: bigint } | null {
  if (annualRatePercent.length > 256) return null;
  const unsignedRate = annualRatePercent.startsWith("+")
    ? annualRatePercent.slice(1)
    : annualRatePercent;
  const negative = unsignedRate.startsWith("-");
  const rateText = negative ? unsignedRate.slice(1) : unsignedRate;
  const [whole = "", fraction = ""] = rateText.split(".");
  if (!/^\d+$/.test(whole) || (fraction !== "" && !/^\d+$/.test(fraction)))
    return null;
  if (negative && /[1-9]/.test(rateText)) return null;

  const decimalDenominator = 10n ** BigInt(fraction.length);
  const rateNumerator = BigInt(`${whole}${fraction}`);
  if (rateNumerator > 100n * decimalDenominator) return null;
  const factorNumerator = 1200n * decimalDenominator + rateNumerator;
  const factorDenominator = 1200n * decimalDenominator;
  const divisor = greatestCommonDivisor(factorNumerator, factorDenominator);
  return {
    numerator: factorNumerator / divisor,
    denominator: factorDenominator / divisor,
  };
}

function roundPositiveRatio(
  numerator: bigint,
  denominator: bigint,
): bigint | null {
  if (numerator < 0n || denominator <= 0n) return null;
  const quotient = numerator / denominator;
  const remainder = numerator % denominator;
  const rounded = quotient + (remainder * 2n >= denominator ? 1n : 0n);
  return rounded <= MAX_USD_CENTS ? rounded : null;
}

export function usdCentsToDecimal(
  cents: bigint,
): InstanceType<typeof DecimalValue> {
  return new DecimalValue(cents.toString()).div(100);
}

export function usdCentsToString(cents: bigint): string {
  return usdCentsToDecimal(cents).toFixed();
}
