import type { Result } from "../../../../calculators/src/calories-per-serving";
import { formatDecimal } from "../../../../i18n/src/en";
import { messageText } from "../../lesson-text";

/** Food energy reads in whole kilocalories; weights to one decimal. */
export const KCAL_DIGITS = 0;
export const GRAM_DIGITS = 1;

export const kcal = (value: string, locale: string) =>
  formatDecimal(value, locale, { fractionDigits: KCAL_DIGITS });
export const grams = (value: string, locale: string) =>
  formatDecimal(value, locale, { fractionDigits: GRAM_DIGITS });

export function answerText(
  result: Result,
  locale: string,
  messages: Readonly<Record<string, string>>,
): string {
  return `${kcal(result.answer.value, locale)} ${messageText(messages, result.unitKey)}`;
}
