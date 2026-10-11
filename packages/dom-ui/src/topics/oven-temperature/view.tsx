import type {
  ErrorCode,
  Result,
} from "../../../../calculators/src/oven-temperature";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import {
  DualScale,
  fillMessage,
  NumberLine,
  VizFigure,
} from "../../components/viz";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { adapter } from "./adapter";
import { answerText, DIGITS, degrees } from "./format";

const toF = (c: number) => (c * 9) / 5 + 32;

/** Smallest of 1, 2, 2.5, 5 × 10^n that is at least `raw`. */
function niceStep(raw: number) {
  const base = 10 ** Math.floor(Math.log10(raw));
  return (
    [1, 2, 2.5, 5, 10].map((f) => f * base).find((s) => s >= raw) ?? base * 10
  );
}

/** Celsius window: the usual 100–260 °C oven range, widened to fit the readings. */
function celsiusRange(values: readonly number[]) {
  const lo = Math.min(100, Math.floor((Math.min(...values) - 30) / 50) * 50);
  const hi = Math.max(260, Math.ceil((Math.max(...values) + 30) / 50) * 50);
  return { lo, hi };
}

function ticksBetween(lo: number, hi: number) {
  const step = niceStep((hi - lo) / 6);
  const out: number[] = [];
  for (let t = Math.ceil(lo / step) * step; t <= hi + 1e-9; t += step)
    out.push(Math.round(t * 100) / 100);
  return out;
}

export default function TopicView({
  title,
  description,
  messages,
  locale,
}: TopicViewProps) {
  const controller = useCalculator<Result, ErrorCode>({ adapter, locale });
  const m = (key: string) => messageText(messages, key);
  const tickLabel = (n: number) =>
    Math.abs(n) < 1e15 ? formatDecimal(String(n), locale) : "";
  return (
    <CalculatorPanel<Result, ErrorCode>
      title={title}
      description={description}
      topicId="oven-temperature"
      controller={controller}
      operations={adapter.descriptors.map((d) => ({
        id: d.id,
        label: m(d.labelKey),
      }))}
      messages={messages}
      locale={locale}
      getCopyText={(e) =>
        e.status === "ok" ? answerText(e.outcome.result, locale, messages) : ""
      }
      renderAnswer={(e) => (
        <div className="oc-answer" aria-live="polite">
          <p className="oc-kicker">{ui["ui.answer.label"]}</p>
          <p className="oc-answer-value">
            {e.status === "ok" ? (
              <NumText text={answerText(e.outcome.result, locale, messages)} />
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
        const v = e.outcome.result.visual;
        if (v.celsius !== undefined && v.fahrenheit !== undefined) {
          const c = Number(v.celsius);
          const { lo, hi } = celsiusRange([c]);
          const at = (cel: number) => (cel - lo) / (hi - lo);
          const vars = {
            celsius: degrees(v.celsius, locale),
            fahrenheit: degrees(v.fahrenheit, locale),
          };
          return (
            <VizFigure
              caption={m("oven-temperature.visual.caption.convert")}
              summary={fillMessage(
                m("oven-temperature.visual.summary.convert"),
                vars,
              )}
            >
              <DualScale
                fraction={at(c)}
                top={{
                  unit: m("oven-temperature.answer.celsius"),
                  display: vars.celsius,
                  ticks: ticksBetween(lo, hi).map((t) => ({
                    at: at(t),
                    label: tickLabel(t),
                  })),
                }}
                bottom={{
                  unit: m("oven-temperature.answer.fahrenheit"),
                  display: vars.fahrenheit,
                  ticks: ticksBetween(toF(lo), toF(hi)).map((t) => ({
                    at: (t - toF(lo)) / (toF(hi) - toF(lo)),
                    label: tickLabel(t),
                  })),
                }}
              />
            </VizFigure>
          );
        }
        const conventional = Number(v.conventional ?? "0");
        const fan = Number(v.fan ?? "0");
        const { lo, hi } = celsiusRange([conventional, fan]);
        const vars = {
          conventional: degrees(v.conventional ?? "0", locale),
          fan: degrees(v.fan ?? "0", locale),
          reduction: degrees(v.reduction ?? "0", locale),
        };
        const unit = m("oven-temperature.answer.celsius");
        return (
          <VizFigure
            caption={m("oven-temperature.visual.caption.fan")}
            summary={fillMessage(
              m("oven-temperature.visual.summary.fan"),
              vars,
            )}
          >
            <NumberLine
              min={lo}
              max={hi}
              ticks={ticksBetween(lo, hi).map((t) => ({
                value: t,
                label: tickLabel(t),
              }))}
              markers={[
                {
                  value: conventional,
                  label: m("oven-temperature.visual.conventional"),
                  display: `${vars.conventional} ${unit}`,
                  tone: "muted",
                },
                {
                  value: fan,
                  label: m("oven-temperature.visual.fan"),
                  display: `${vars.fan} ${unit}`,
                },
              ]}
              range={{
                from: fan,
                to: conventional,
                label: fillMessage(
                  m("oven-temperature.visual.reduction"),
                  vars,
                ),
              }}
            />
          </VizFigure>
        );
      }}
    />
  );
}
