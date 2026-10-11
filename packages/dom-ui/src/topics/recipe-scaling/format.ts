import type { Result } from "../../../../calculators/src/recipe-scaling";
import { formatDecimal } from "../../../../i18n/src/en";
import { messageText } from "../../lesson-text";

/** Amounts and factors read best with at most two decimals; working keeps full digits. */
export const DIGITS = 2;

export const shown = (value: string, locale: string) =>
  formatDecimal(value, locale, { fractionDigits: DIGITS });

export const factorText = (
  value: string,
  locale: string,
  messages: Readonly<Record<string, string>>,
) =>
  `${messageText(messages, "recipe-scaling.answer.factor")}${shown(value, locale)}`;

/** The answer as a person would write it: "375" for an amount, "×1.5" for a factor. */
export function answerText(
  result: Result,
  locale: string,
  messages: Readonly<Record<string, string>>,
): string {
  return result.operation === "recipe-factor"
    ? factorText(result.answer.value, locale, messages)
    : shown(result.answer.value, locale);
}
