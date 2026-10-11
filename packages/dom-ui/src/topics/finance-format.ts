import type { WorkingStep } from "../../../calculators/src/contracts";
import { formatDecimal, renderWorkingStep } from "../../../i18n/src/en";
import { fillMessage } from "../components/viz";
import type { ExamplePresenter } from "../example-presentation";
import { messageText } from "../lesson-text";
import type { TopicAdapter } from "../topic";

/** Formatters shared by the finance pack views; every visible string is a message. */
export function financeFormat(
  messages: Readonly<Record<string, string>>,
  locale: string,
) {
  // formatDecimal drops trailing zeros; money with cents always shows two digits
  // ("$1,896.20"), whole-dollar amounts show none ("$5,000").
  const zero = formatDecimal("0", locale);
  const separator = formatDecimal("0.5", locale).replace(/\p{Nd}/gu, "");
  const money = (canonical: string) => {
    const text = formatDecimal(canonical, locale, {
      fractionDigits: 2,
    });
    const at = separator ? text.lastIndexOf(separator) : -1;
    return at >= 0 && text.length - at - separator.length === 1
      ? `${text}${zero}`
      : text;
  };
  const usd = (canonical: string) =>
    canonical.startsWith("-")
      ? fillMessage(messageText(messages, "finance.money.negative"), {
          amount: money(canonical.slice(1)),
        })
      : fillMessage(messageText(messages, "finance.money"), {
          amount: money(canonical),
        });
  const percent = (canonical: string, digits = 2) =>
    fillMessage(messageText(messages, "finance.percent"), {
      value: formatDecimal(canonical, locale, { fractionDigits: digits }),
    });
  return { usd, percent, amount: money };
}

/**
 * Working steps keep full precision, but whole-cent money arguments are shown with
 * both cent digits ("1,896.20", not "1,896.2"). Non-money arguments are untouched.
 */
export function renderFinanceWorking(
  step: WorkingStep,
  moneyArgs: readonly string[],
  messages: Readonly<Record<string, string>>,
  locale: string,
): string {
  const { amount } = financeFormat(messages, locale);
  const args = Object.fromEntries(
    Object.entries(step.args).map(([name, arg]) => [
      name,
      arg.kind === "decimal" &&
      moneyArgs.includes(name) &&
      /^-?\d+(\.\d{1,2})?$/.test(arg.value)
        ? { kind: "text" as const, value: amount(arg.value) }
        : arg,
    ]),
  );
  return renderWorkingStep({ ...step, args }, { locale, messages });
}

/** Lesson example presenter: entered values as typed, answer as the page shows it. */
export function financeExamplePresenter<
  R extends { answer: { value: string }; working: readonly WorkingStep[] },
>(
  adapter: TopicAdapter<R, string>,
  answerText: (
    result: R,
    operationId: string,
    format: ReturnType<typeof financeFormat>,
    messages: Readonly<Record<string, string>>,
  ) => string,
  moneyArgs: readonly string[] = [],
): ExamplePresenter {
  return (example, locale, messages) => {
    const descriptor = adapter.descriptors.find(
      (d) => d.id === example.operation,
    );
    if (!descriptor) return { ok: false, reason: "unsupported-operation" };
    const output = adapter.calculate(example.operation, { ...example.inputs });
    if (!output.ok) return { ok: false, reason: "engine-failed" };
    return {
      ok: true,
      fields: descriptor.fields.map((f) => ({
        id: f.id,
        label: messageText(messages, f.labelKey),
        value: formatDecimal(example.inputs[f.id] ?? "", locale),
      })),
      answer: answerText(
        output.result,
        example.operation,
        financeFormat(messages, locale),
        messages,
      ),
      working: output.result.working.map((step) =>
        renderFinanceWorking(step, moneyArgs, messages, locale),
      ),
    };
  };
}
