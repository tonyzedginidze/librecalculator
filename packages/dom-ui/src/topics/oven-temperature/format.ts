import type { Result } from "../../../../calculators/src/oven-temperature";
import { formatDecimal } from "../../../../i18n/src/en";
import { messageText } from "../../lesson-text";

/** Oven dials work in whole degrees; the working keeps full digits. */
export const DIGITS = 0;

export const degrees = (value: string, locale: string) =>
  formatDecimal(value, locale, { fractionDigits: DIGITS });

export function answerText(
  result: Result,
  locale: string,
  messages: Readonly<Record<string, string>>,
): string {
  return `${degrees(result.answer.value, locale)} ${messageText(messages, result.unitKey)}`;
}
