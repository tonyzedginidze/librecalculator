import type {
  ErrorCode,
  Result,
} from "../../../../calculators/src/ideal-weight";
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

const DIGITS = 1;

export default function View({
  title,
  description,
  messages,
  locale,
}: TopicViewProps) {
  const controller = useCalculator<Result, ErrorCode>({ adapter, locale });
  const unit = messageText(messages, "ideal-weight.answer.unit");
  const fmt = (value: string, fractionDigits = DIGITS) =>
    formatDecimal(value, locale, { fractionDigits });
  const text = (key: string) => messageText(messages, key);
  const answerText = (value: string) => `${fmt(value)} ${unit}`;
  return (
    <CalculatorPanel<Result, ErrorCode>
      topicId="ideal-weight"
      title={title}
      description={description}
      controller={controller}
      operations={adapter.descriptors.map((d) => ({
        id: d.id,
        label: text(d.labelKey),
      }))}
      messages={messages}
      locale={locale}
      getCopyText={(e) =>
        e.status === "ok" ? answerText(e.outcome.result.answer.value) : ""
      }
      renderAnswer={(e) => (
        <div className="oc-answer" aria-live="polite">
          <p className="oc-kicker">{ui["ui.answer.label"]}</p>
          <p className="oc-answer-value">
            {e.status === "ok" ? (
              <NumText text={answerText(e.outcome.result.answer.value)} />
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
            {e.outcome.result.working.map((s) => (
              <p key={s.id}>
                <NumText text={renderWorkingStep(s, { locale, messages })} />
              </p>
            ))}
          </div>
        ) : null
      }
      renderVisual={(e) => {
        if (e.status !== "ok") return null;
        const v = e.outcome.result.visual;
        const last = v.scale.length - 1;
        const low = v.scale[0];
        const high = v.scale[last];
        const vars = {
          height: fmt(v.height),
          bmi: fmt(v.reference),
          answer: fmt(v.answer),
          low: fmt(low?.bmi ?? "0"),
          lowKg: fmt(low?.weight ?? "0"),
          high: fmt(high?.bmi ?? "0"),
          highKg: fmt(high?.weight ?? "0"),
        };
        return (
          <VizFigure
            caption={fillMessage(text("ideal-weight.visual.caption"), vars)}
            summary={fillMessage(text("ideal-weight.visual.summary"), vars)}
            note={text(v.descriptionKey)}
          >
            <DualScale
              fraction={Number(v.fraction)}
              top={{
                unit: text("ideal-weight.visual.bmi"),
                display: vars.bmi,
                ticks: v.scale.map((s, i) => ({
                  at: i / last,
                  label: fmt(s.bmi),
                })),
              }}
              bottom={{
                unit: text("ideal-weight.visual.kg"),
                display: vars.answer,
                ticks: v.scale.map((s, i) => ({
                  at: i / last,
                  label: fmt(s.weight, 0),
                })),
              }}
            />
          </VizFigure>
        );
      }}
    />
  );
}
