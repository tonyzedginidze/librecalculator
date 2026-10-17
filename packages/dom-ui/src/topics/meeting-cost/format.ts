import type { Result } from "../../../../calculators/src/meeting-cost";
import { formatDecimal } from "../../../../i18n/src/en";
import { fillMessage } from "../../components/viz";
import { messageText } from "../../lesson-text";
import { financeFormat } from "../finance-format";

/** The answer line: a dollar amount per meeting, or whole minutes for a budget. */
export function answerText(
  result: Result,
  messages: Readonly<Record<string, string>>,
  locale: string,
): string {
  const f = financeFormat(messages, locale);
  return fillMessage(
    messageText(messages, `meeting-cost.answer.value.${result.operation}`),
    {
      amount: f.usd(result.answer.value),
      minutes: formatDecimal(result.answer.value, locale),
    },
  );
}
