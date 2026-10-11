import type { ErrorCode, Result } from "../../../../calculators/src/body-fat";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import { fillMessage, SplitBar, VizFigure } from "../../components/viz";
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
  const unit = messageText(messages, "body-fat.answer.unit");
  const fmt = (value: string, fractionDigits = DIGITS) =>
    formatDecimal(value, locale, { fractionDigits });
  const text = (key: string) => messageText(messages, key);
  const answerText = (value: string) => `${fmt(value)}${unit}`;
  return (
    <CalculatorPanel<Result, ErrorCode>
      topicId="body-fat"
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
        const kg = (value: string) =>
          fillMessage(text("body-fat.visual.mass"), { value: fmt(value) });
        const vars = {
          weight: fmt(v.weight),
          fat: fmt(v.fatMass),
          fatFree: fmt(v.fatFreeMass),
          answer: fmt(v.answer),
          bmi: fmt(v.reference),
        };
        return (
          <VizFigure
            caption={text("body-fat.visual.caption")}
            summary={fillMessage(text("body-fat.visual.summary"), vars)}
            note={text(v.descriptionKey)}
          >
            <SplitBar
              total={{
                label: text("body-fat.visual.total"),
                display: kg(v.weight),
              }}
              parts={[
                {
                  label: text("body-fat.visual.fat"),
                  value: Number(v.fatMass),
                  display: kg(v.fatMass),
                  tone: "accent",
                },
                {
                  label: text("body-fat.visual.fat-free"),
                  value: Number(v.fatFreeMass),
                  display: kg(v.fatFreeMass),
                  tone: "soft",
                },
              ]}
            />
          </VizFigure>
        );
      }}
    />
  );
}
