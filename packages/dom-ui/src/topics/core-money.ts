import type {
  WorkingArgument,
  WorkingStep,
} from "../../../calculators/src/contracts";
import { parseUsdCents } from "../../../calculators/src/numeric/money";
import { formatDecimal, renderWorkingStep } from "../../../i18n/src/en";
import type { ExamplePresenter } from "../example-presentation";
import { messageText } from "../lesson-text";
import type { TopicAdapter } from "../topic";

/**
 * USD amounts for the core money calculators: always two decimals ($59.00), locale
 * grouping and separators. The engine's exact cent string is passed to Intl as a
 * decimal string, so no binary floating point is involved.
 */
export function formatUsdCents(cents: string | bigint, locale: string): string {
  const value = BigInt(cents);
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  const fraction = (absolute % 100n).toString().padStart(2, "0");
  const dollars = absolute / 100n;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .formatToParts(negative ? -dollars : dollars)
    .map((part) => (part.type === "fraction" ? fraction : part.value))
    .join("");
}

/**
 * Presents the listed decimal working arguments as USD (two decimals) while every
 * other argument keeps the engine's full precision.
 */
export function withUsdArguments(
  step: WorkingStep,
  keys: readonly string[],
  locale: string,
): WorkingStep {
  const args: Record<string, WorkingArgument> = { ...step.args };
  for (const key of keys) {
    const arg = args[key];
    if (arg?.kind !== "decimal") continue;
    const cents = parseUsdCents(arg.value);
    if (!cents.ok) continue;
    args[key] = {
      kind: "text",
      value: formatUsdCents(cents.cents, locale),
    };
  }
  return { ...step, args };
}

/**
 * Lesson example presenter for the core USD calculators: money inputs and the answer
 * use two decimals, rates show a percent sign, choices show their label.
 */
export function usdExamplePresenter<
  R extends {
    answer: { cents: string };
    working: readonly WorkingStep[];
  },
>(
  adapter: TopicAdapter<R>,
  moneyArguments: readonly string[],
): ExamplePresenter {
  return (example, locale, messages) => {
    const descriptor = adapter.descriptors.find(
      (d) => d.id === example.operation,
    );
    if (!descriptor) return { ok: false, reason: "unsupported-operation" };
    const calculation = adapter.calculate(example.operation, {
      ...example.inputs,
    });
    if (!calculation.ok) return { ok: false, reason: "engine-failed" };
    const result = calculation.result;
    const fields = descriptor.fields.map((field) => {
      const raw = example.inputs[field.id] ?? "";
      const cents = parseUsdCents(raw);
      const choice = field.choices?.find((c) => c.id === raw);
      const value = choice
        ? messageText(messages, choice.labelKey)
        : field.unitKey === "unit.usd" && cents.ok
          ? formatUsdCents(cents.cents, locale)
          : field.unitKey === "unit.percent"
            ? `${formatDecimal(raw, locale)}%`
            : field.input === "integer"
              ? raw
              : formatDecimal(raw, locale);
      return {
        id: field.id,
        label: messageText(messages, field.labelKey),
        value,
      };
    });
    return {
      ok: true,
      fields,
      answer: formatUsdCents(result.answer.cents, locale),
      working: result.working.map((step) =>
        renderWorkingStep(withUsdArguments(step, moneyArguments, locale), {
          locale,
          messages,
        }),
      ),
    };
  };
}
