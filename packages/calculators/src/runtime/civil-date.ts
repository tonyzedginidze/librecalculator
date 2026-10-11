/** Proleptic Gregorian dates 0001-01-01 through 9999-12-31, independent of timezone. */
export function civilDate(
  raw: string | undefined,
): { year: number; month: number; day: number; ordinal: number } | null {
  if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const year = Number(raw.slice(0, 4)),
    month = Number(raw.slice(5, 7)),
    day = Number(raw.slice(8, 10));
  if (year < 1 || month < 1 || month > 12) return null;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const lengths = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day < 1 || day > (lengths[month - 1] ?? 0)) return null;
  const prior = year - 1;
  const ordinal =
    365 * prior +
    Math.floor(prior / 4) -
    Math.floor(prior / 100) +
    Math.floor(prior / 400) +
    lengths.slice(0, month - 1).reduce((a, b) => a + b, 0) +
    day;
  return { year, month, day, ordinal };
}
