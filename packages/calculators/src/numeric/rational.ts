export const MAX_RATIONAL_INPUT_DIGITS = 1000;
export const MAX_RATIONAL_OUTPUT_DIGITS = 2001;

export type Rational = {
  numerator: bigint;
  denominator: bigint;
};

export type RationalIntegerError = "invalid-integer" | "integer-too-large";
export type RationalIntegerResult =
  | { ok: true; value: bigint }
  | { ok: false; error: RationalIntegerError };

export function parseRationalInteger(text: string): RationalIntegerResult {
  if (text.length > MAX_RATIONAL_INPUT_DIGITS + 1)
    return { ok: false, error: "integer-too-large" };
  if (!/^[+-]?\d+$/.test(text)) return { ok: false, error: "invalid-integer" };
  const digits = text.replace(/^[+-]/, "").replace(/^0+/, "");
  if (digits.length > MAX_RATIONAL_INPUT_DIGITS)
    return { ok: false, error: "integer-too-large" };
  return { ok: true, value: BigInt(text) };
}

export function greatestCommonDivisor(left: bigint, right: bigint): bigint {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

export function normalizeRational(
  numerator: bigint,
  denominator: bigint,
): Rational {
  if (denominator === 0n) throw new RangeError("Rational denominator is zero");
  if (numerator === 0n) return { numerator: 0n, denominator: 1n };
  const sign = denominator < 0n ? -1n : 1n;
  const divisor = greatestCommonDivisor(numerator, denominator);
  return {
    numerator: (numerator / divisor) * sign,
    denominator: (denominator / divisor) * sign,
  };
}

export function addRationals(left: Rational, right: Rational): Rational {
  const common = greatestCommonDivisor(left.denominator, right.denominator);
  const leftScale = right.denominator / common;
  const rightScale = left.denominator / common;
  return normalizeRational(
    left.numerator * leftScale + right.numerator * rightScale,
    left.denominator * leftScale,
  );
}

export function subtractRationals(left: Rational, right: Rational): Rational {
  return addRationals(left, {
    numerator: -right.numerator,
    denominator: right.denominator,
  });
}

export function multiplyRationals(left: Rational, right: Rational): Rational {
  const firstCancellation = greatestCommonDivisor(
    left.numerator,
    right.denominator,
  );
  const secondCancellation = greatestCommonDivisor(
    right.numerator,
    left.denominator,
  );
  return normalizeRational(
    (left.numerator / firstCancellation) *
      (right.numerator / secondCancellation),
    (left.denominator / secondCancellation) *
      (right.denominator / firstCancellation),
  );
}

export function divideRationals(left: Rational, right: Rational): Rational {
  if (right.numerator === 0n)
    throw new RangeError("Cannot divide by a zero rational");
  const firstCancellation = greatestCommonDivisor(
    left.numerator,
    right.numerator,
  );
  const secondCancellation = greatestCommonDivisor(
    right.denominator,
    left.denominator,
  );
  return normalizeRational(
    (left.numerator / firstCancellation) *
      (right.denominator / secondCancellation),
    (left.denominator / secondCancellation) *
      (right.numerator / firstCancellation),
  );
}

export function rationalMagnitudeDigits(value: bigint): number {
  const magnitude = value < 0n ? -value : value;
  return magnitude.toString().length;
}

export function compareRationalToInteger(
  value: Rational,
  integer: bigint,
): -1 | 0 | 1 {
  const difference = value.numerator - integer * value.denominator;
  return difference < 0n ? -1 : difference > 0n ? 1 : 0;
}
