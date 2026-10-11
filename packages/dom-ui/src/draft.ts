export function decimalMark(locale: string): string {
  return (
    new Intl.NumberFormat(locale)
      .formatToParts(1.1)
      .find((part) => part.type === "decimal")?.value ?? "."
  );
}

/** Locale decimal mark only. No grouping, so the draft stays editable. */
export function canonicalToDraft(canonical: string, locale: string): string {
  const mark = decimalMark(locale);
  if (mark === ".") return canonical;
  return canonical.replace(".", mark);
}

export function toggleSign(raw: string): string {
  if (raw.startsWith("-")) return raw.slice(1);
  if (raw.startsWith("+")) return `-${raw.slice(1)}`;
  return `-${raw}`;
}
