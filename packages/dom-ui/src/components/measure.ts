/** Display digits for a metric measurement: 2 decimals, more for small values. */
export function measureDigits(canonical: string): number | undefined {
  const n = Math.abs(Number(canonical));
  if (!Number.isFinite(n) || n >= 0.1) return 2;
  if (n >= 0.001) return 4;
  return undefined;
}
