import type { Result } from "../../../../calculators/src/baking-ratios";
import { formatDecimal } from "../../../../i18n/src/en";
import { messageText } from "../../lesson-text";

/** Grams and percentages read to one decimal; working keeps full digits. */
export const DIGITS = 1;

export const shown = (value: string, locale: string) =>
  formatDecimal(value, locale, { fractionDigits: DIGITS });

export function answerText(
  result: Result,
  locale: string,
  messages: Readonly<Record<string, string>>,
): string {
  const unit = messageText(messages, result.unitKey);
  return result.operation === "baker-percent"
    ? `${shown(result.answer.value, locale)}${unit}`
    : `${shown(result.answer.value, locale)} ${unit}`;
}
