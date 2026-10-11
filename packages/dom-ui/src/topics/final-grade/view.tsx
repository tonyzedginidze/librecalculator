import type {
  ErrorCode,
  Result,
} from "../../../../calculators/src/final-grade";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import {
  fillMessage,
  NumberLine,
  VizFigure,
  type VizTone,
} from "../../components/viz";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { adapter } from "./adapter";

/** Course percentages read at one decimal; the working keeps every digit. */
const DIGITS = 1;

/** A percent scale that always shows 100 and zooms in on where the values sit. */
function scale(values: readonly number[]) {
  const finite = values.filter(Number.isFinite);
  const low = Math.min(...finite);
  const high = Math.max(...finite);
  const min =
    low < 0
      ? Math.floor(low / 10) * 10 - 10
      : Math.max(0, Math.floor(low / 10) * 10 - 10);
  const max = Math.max(100, Math.ceil(high / 10) * 10);
  const span = max - min;
  const step =
    span <= 60
      ? 10
      : span <= 120
        ? 20
        : span <= 300
          ? 50
          : 10 ** Math.floor(Math.log10(span));
  const ticks: number[] = [];
  for (let t = Math.ceil(min / step) * step; t <= max; t += step) ticks.push(t);
  return { min, max, ticks };
}

export default function TopicView({
  title,
  description,
  messages,
  locale,
}: TopicViewProps) {
  const controller = useCalculator<Result, ErrorCode>({ adapter, locale });
  const m = (key: string) => messageText(messages, key);
  const percent = (value: string) =>
    `${formatDecimal(value, locale, { fractionDigits: DIGITS })}${m("final-grade.answer.percent")}`;
  return (
    <CalculatorPanel<Result, ErrorCode>
      title={title}
      description={description}
      topicId="final-grade"
      controller={controller}
      operations={adapter.descriptors.map((d) => ({
        id: d.id,
        label: m(d.labelKey),
      }))}
      messages={messages}
      locale={locale}
      getCopyText={(e) =>
        e.status === "ok" ? percent(e.outcome.result.answer.value) : ""
      }
      renderAnswer={(e) => (
        <div className="oc-answer" aria-live="polite">
          <p className="oc-kicker">{ui["ui.answer.label"]}</p>
          <p className="oc-answer-value">
            {e.status === "ok" ? (
              <NumText text={percent(e.outcome.result.answer.value)} />
            ) : (
              ui["ui.answer.empty"]
            )}
          </p>
          {e.status === "ok" &&
          isRoundedForDisplay(e.outcome.result.answer.value, DIGITS) ? (
            <p>{ui["ui.answer.rounded"]}</p>
          ) : null}
        </div>
      )}
      renderWorking={(e) =>
        e.status === "ok" ? (
          <div className="oc-working">
            <h2 className="oc-kicker">{ui["ui.working.heading"]}</h2>
            {e.outcome.result.working.map((step) => (
              <p key={step.id}>
                <NumText text={renderWorkingStep(step, { locale, messages })} />
              </p>
            ))}
          </div>
        ) : null
      }
      renderVisual={(e) => {
        if (e.status !== "ok") return null;
        const { operation, visual } = e.outcome.result;
        const d = visual.dimensions;
        const vars: Record<string, string> = {};
        for (const [key, value] of Object.entries(d))
          vars[key] = formatDecimal(value, locale);
        vars.answer = formatDecimal(visual.answer, locale, {
          fractionDigits: DIGITS,
        });
        const marker = (
          labelKey: string,
          value: string | undefined,
          tone: VizTone,
          display?: string,
        ) => ({
          label: m(`final-grade.visual.${labelKey}`),
          value: Number(value),
          display: display ?? percent(value ?? "0"),
          tone,
        });
        const answerMark = (labelKey: string) =>
          marker(labelKey, visual.answer, "accent", percent(visual.answer));
        const markers =
          operation === "final-required"
            ? [
                marker("current", d.current, "muted"),
                marker("target", d.target, "ink"),
                answerMark("needed"),
              ]
            : operation === "final-projected"
              ? [
                  marker("coursework", d.current, "muted"),
                  marker("final", d.finalScore, "muted"),
                  answerMark("course"),
                ]
              : [
                  marker("final", d.finalScore, "muted"),
                  marker("target", d.target, "ink"),
                  answerMark("needed"),
                ];
        const { min, max, ticks } = scale(markers.map((k) => k.value));
        const answer = Number(visual.answer);
        const note =
          operation !== "final-projected" && answer > 100
            ? m("final-grade.visual.over")
            : operation !== "final-projected" && answer < 0
              ? m("final-grade.visual.under")
              : undefined;
        const ends = markers
          .filter((k) => k.tone !== "ink")
          .map((k) => k.value);
        return (
          <VizFigure
            caption={m(`final-grade.visual.caption.${operation}`)}
            summary={fillMessage(
              m(`final-grade.visual.summary.${operation}`),
              vars,
            )}
            note={note}
          >
            <NumberLine
              min={min}
              max={max}
              ticks={ticks.map((t) => ({
                value: t,
                label: formatDecimal(String(t), locale),
              }))}
              markers={markers}
              range={{ from: Math.min(...ends), to: Math.max(...ends) }}
            />
          </VizFigure>
        );
      }}
    />
  );
}
