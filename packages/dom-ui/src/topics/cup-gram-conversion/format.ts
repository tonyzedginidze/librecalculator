import type { Result } from "../../../../calculators/src/cup-gram-conversion";
import { formatDecimal } from "../../../../i18n/src/en";
import { messageText } from "../../lesson-text";

/** Cups read to two decimals, grams to one; working keeps full digits. */
export const CUP_DIGITS = 2;
export const GRAM_DIGITS = 1;

export const cupsText = (
  value: string,
  locale: string,
  messages: Readonly<Record<string, string>>,
) => {
  const shown = formatDecimal(value, locale, { fractionDigits: CUP_DIGITS });
  const unit =
    shown === formatDecimal("1", locale)
      ? "cup-gram-conversion.answer.cup"
      : "cup-gram-conversion.answer.cups";
  return `${shown} ${messageText(messages, unit)}`;
};

export const gramsText = (
  value: string,
  locale: string,
  messages: Readonly<Record<string, string>>,
) =>
  `${formatDecimal(value, locale, { fractionDigits: GRAM_DIGITS })} ${messageText(messages, "cup-gram-conversion.answer.gram")}`;

export const answerDigits = (result: Result) =>
  result.operation === "grams-to-cups" ? CUP_DIGITS : GRAM_DIGITS;

export function answerText(
  result: Result,
  locale: string,
  messages: Readonly<Record<string, string>>,
): string {
  return result.operation === "grams-to-cups"
    ? cupsText(result.answer.value, locale, messages)
    : gramsText(result.answer.value, locale, messages);
}
