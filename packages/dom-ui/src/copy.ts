import { formatDecimal } from "../../i18n/src/en";

export function answerCopyText(
  operation: string,
  canonical: string,
  locale: string,
): string {
  const formatted = formatDecimal(canonical, locale);
  return operation === "ratio" || operation === "discount-percent"
    ? `${formatted}%`
    : formatted;
}
