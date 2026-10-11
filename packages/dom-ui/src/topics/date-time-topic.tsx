import type { ReactNode } from "react";
import type { FieldDescriptor } from "../../../calculators/src/contracts";
import { civilDate } from "../../../calculators/src/runtime/civil-date";
import type {
  NumericError,
  NumericResult,
} from "../../../calculators/src/runtime/numeric-result";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../i18n/src/en";
import { ui } from "../../../i18n/src/ui";
import { CalculatorPanel } from "../components/calculator";
import { NumText } from "../components/num-text";
import { fillMessage } from "../components/viz";
import type { ExamplePresenter } from "../example-presentation";
import { messageText } from "../lesson-text";
import type { TopicAdapter } from "../topic";
import { useCalculator } from "../use-calculator";
import type { TopicViewProps } from "../view-contract";

/**
 * Shared view for the date-time pack. Like NumericTopic, but the answer and the
 * diagram also see the canonical inputs the engine received, so dates and clock
 * times can be shown as readable dates next to the engine's numbers.
 */
export type DateTimeContext = {
  result: NumericResult;
  inputs: Readonly<Record<string, string>>;
  operationId: string;
  messages: Readonly<Record<string, string>>;
  locale: string;
  /** Formats a canonical decimal at the answer's display precision. */
  show: (value: string) => string;
  /** Looks up a topic message and fills its placeholders. */
  text: (key: string, values?: Readonly<Record<string, string>>) => string;
};

type Adapter = TopicAdapter<NumericResult, NumericError>;

function contextFor(
  result: NumericResult,
  inputs: Readonly<Record<string, string>>,
  operationId: string,
  messages: Readonly<Record<string, string>>,
  locale: string,
  fractionDigits: number,
): DateTimeContext {
  return {
    result,
    inputs,
    operationId,
    messages,
    locale,
    show: (value) => formatDecimal(value, locale, { fractionDigits }),
    text: (key, values = {}) => fillMessage(messageText(messages, key), values),
  };
}

export function DateTimeTopic({
  adapter,
  fractionDigits = 0,
  answer,
  visual,
  ...props
}: TopicViewProps & {
  adapter: Adapter;
  fractionDigits?: number;
  answer: (context: DateTimeContext) => string;
  visual: (context: DateTimeContext) => ReactNode;
}) {
  const { title, description, messages, locale } = props;
  const controller = useCalculator({ adapter, locale });
  const context = (e: {
    canonical: Record<string, string>;
    outcome: { result: NumericResult };
  }) =>
    contextFor(
      e.outcome.result,
      e.canonical,
      controller.operationId,
      messages,
      locale,
      fractionDigits,
    );
  return (
    <CalculatorPanel
      title={title}
      description={description}
      topicId={adapter.id}
      controller={controller}
      operations={adapter.descriptors.map((d) => ({
        id: d.id,
        label: messageText(messages, d.labelKey),
      }))}
      messages={messages}
      locale={locale}
      getCopyText={(e) => (e.status === "ok" ? answer(context(e)) : "")}
      renderAnswer={(e) => (
        <div className="oc-answer" aria-live="polite">
          <p className="oc-kicker">{ui["ui.answer.label"]}</p>
          <div className="oc-answer-scroll">
            <p className="oc-answer-value">
              {e.status === "ok" ? (
                <NumText text={answer(context(e))} />
              ) : (
                ui["ui.answer.empty"]
              )}
            </p>
          </div>
          {e.status === "ok" &&
          isRoundedForDisplay(e.outcome.result.answer.value, fractionDigits) ? (
            <p>{ui["ui.answer.rounded"]}</p>
          ) : null}
        </div>
      )}
      renderWorking={(e) =>
        e.status !== "ok" ? null : (
          <div className="oc-working">
            <h2 className="oc-kicker">{ui["ui.working.heading"]}</h2>
            {e.outcome.result.working.map((s) => (
              <p key={s.id}>
                <NumText text={renderWorkingStep(s, { locale, messages })} />
              </p>
            ))}
          </div>
        )
      }
      renderVisual={(e) => (e.status === "ok" ? visual(context(e)) : null)}
    />
  );
}

/** Lesson examples: readable dates and choice labels, the same answer wording. */
export function dateTimeExamples(
  adapter: Adapter,
  answer: (context: DateTimeContext) => string,
  fractionDigits = 0,
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
    const value = (field: FieldDescriptor) => {
      const raw = example.inputs[field.id] ?? "";
      const choice = field.choices?.find((c) => c.id === raw);
      if (choice) return messageText(messages, choice.labelKey);
      if (field.input === "text" && civilDate(raw))
        return formatCivilDate(raw, locale);
      return raw;
    };
    return {
      ok: true,
      fields: descriptor.fields.map((f) => ({
        id: f.id,
        label: messageText(messages, f.labelKey),
        value: value(f),
      })),
      answer: answer(
        contextFor(
          calculation.result,
          example.inputs,
          example.operation,
          messages,
          locale,
          fractionDigits,
        ),
      ),
      working: calculation.result.working.map((step) =>
        renderWorkingStep(step, { locale, messages }),
      ),
    };
  };
}

/** "2026-10-11" as a readable date ("Oct 11, 2026") without any timezone shift. */
export function formatCivilDate(canonical: string, locale: string): string {
  const date = civilDate(canonical);
  if (!date) return canonical;
  const instant = new Date(0);
  instant.setUTCFullYear(date.year, date.month - 1, date.day);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(instant);
}

/**
 * Month or year boundaries strictly inside a span of civil dates, as fractions of
 * the span, thinned to at most `limit` markers so labels stay legible on phones.
 */
export function calendarMarkers(
  from: string,
  to: string,
  locale: string,
  limit = 5,
): { at: number; label: string }[] {
  const a = civilDate(from),
    b = civilDate(to);
  if (!a || !b || b.ordinal <= a.ordinal) return [];
  const span = b.ordinal - a.ordinal;
  const months: { year: number; month: number; ordinal: number }[] = [];
  let year = a.year,
    month = a.month;
  while (months.length < 2400) {
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
    const day = civilDate(
      `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-01`,
    );
    if (!day || day.ordinal >= b.ordinal) break;
    months.push({ year, month, ordinal: day.ordinal });
  }
  const label = (y: number, m: number, unit: "month" | "year") => {
    const instant = new Date(0);
    instant.setUTCFullYear(y, m - 1, 1);
    return new Intl.DateTimeFormat(
      locale,
      unit === "year"
        ? { year: "numeric", timeZone: "UTC" }
        : { month: "short", timeZone: "UTC" },
    ).format(instant);
  };
  const useYears = months.length > 12;
  const candidates = useYears
    ? months
        .filter((m) => m.month === 1)
        .map((m) => ({ ...m, text: label(m.year, 1, "year") }))
    : months.map((m) => ({
        ...m,
        text:
          m.month === 1
            ? label(m.year, 1, "year")
            : label(m.year, m.month, "month"),
      }));
  const step = Math.max(1, Math.ceil(candidates.length / limit));
  return candidates
    .filter((_, i) => (i + 1) % step === 0 || step === 1)
    .map((m) => ({ at: (m.ordinal - a.ordinal) / span, label: m.text }))
    .filter((m) => m.at > 0.06 && m.at < 0.94);
}

/** Picks the singular message for exactly one, otherwise the plural one. */
export function countKey(value: string, one: string, other: string): string {
  return value === "1" || value === "-1" ? one : other;
}
