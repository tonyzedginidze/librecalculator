import type {
  ErrorCode,
  Result,
} from "../../../../calculators/src/cup-gram-conversion";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import { DualScale, fillMessage, VizFigure } from "../../components/viz";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { adapter } from "./adapter";
import { answerDigits, answerText, CUP_DIGITS, GRAM_DIGITS } from "./format";

/** Cup ruler: quarter cups up to one cup, then whole (or wider) steps. */
function cupScale(cups: number) {
  if (!(cups > 1)) return { max: 1, step: 0.25 };
  const max = Math.floor(cups) + 1;
  const step =
    max <= 6 ? 1 : max <= 12 ? 2 : 10 ** Math.floor(Math.log10(max / 2));
  return { max: Math.ceil(max / step) * step, step };
}

export default function TopicView({
  title,
  description,
  messages,
  locale,
}: TopicViewProps) {
  const controller = useCalculator<Result, ErrorCode>({ adapter, locale });
  const m = (key: string) => messageText(messages, key);
  return (
    <CalculatorPanel<Result, ErrorCode>
      title={title}
      description={description}
      topicId="cup-gram-conversion"
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
          isRoundedForDisplay(
            e.outcome.result.answer.value,
            answerDigits(e.outcome.result),
          ) ? (
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
        const cups = Number(v.cups);
        const perCup = Number(v.gramsPerCup);
        const { max, step } = cupScale(cups);
        const marks: number[] = [];
        for (let k = 0; k <= max + 1e-9; k += step) marks.push(k);
        const label = (n: number, digits: number) => {
          const rounded = Math.round(n * 10 ** digits) / 10 ** digits;
          return Number.isFinite(rounded) && Math.abs(rounded) < 1e15
            ? formatDecimal(String(rounded), locale)
            : "";
        };
        const vars = {
          cups: formatDecimal(v.cups, locale, { fractionDigits: CUP_DIGITS }),
          grams: formatDecimal(v.grams, locale, {
            fractionDigits: GRAM_DIGITS,
          }),
          gramsPerCup: formatDecimal(v.gramsPerCup, locale, {
            fractionDigits: GRAM_DIGITS,
          }),
        };
        return (
          <VizFigure
            caption={m("cup-gram-conversion.visual.caption")}
            summary={fillMessage(m("cup-gram-conversion.visual.summary"), vars)}
          >
            <DualScale
              fraction={cups / max}
              top={{
                unit: m("cup-gram-conversion.answer.cups"),
                display: vars.cups,
                ticks: marks.map((k) => ({
                  at: k / max,
                  label: label(k, step < 1 ? 2 : 0),
                })),
              }}
              bottom={{
                unit: m("cup-gram-conversion.answer.gram"),
                display: vars.grams,
                ticks: marks.map((k) => ({
                  at: k / max,
                  label: label(k * perCup, 0),
                })),
              }}
            />
          </VizFigure>
        );
      }}
    />
  );
}
