import type { ErrorCode, Result } from "../../../../calculators/src/bmr";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import { CompareBars, fillMessage, VizFigure } from "../../components/viz";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { adapter } from "./adapter";

const DIGITS = 0;

export default function View({
  title,
  description,
  messages,
  locale,
}: TopicViewProps) {
  const controller = useCalculator<Result, ErrorCode>({ adapter, locale });
  const unit = messageText(messages, "bmr.answer.unit");
  const fmt = (value: string, fractionDigits = DIGITS) =>
    formatDecimal(value, locale, { fractionDigits });
  const text = (key: string) => messageText(messages, key);
  const answerText = (value: string) => `${fmt(value)} ${unit}`;
  return (
    <CalculatorPanel<Result, ErrorCode>
      topicId="bmr"
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
        const t = v.terms;
        const vars = {
          weight: fmt(t.weight),
          height: fmt(t.height),
          age: fmt(t.age.replace(/^-/, "")),
          constant: fmt(t.constant),
          answer: fmt(v.answer),
        };
        const row = (key: string, value: string) => ({
          label: text(`bmr.visual.${key}`),
          value: Number(value),
          display: fmt(value),
          tone: "soft" as const,
        });
        return (
          <VizFigure
            caption={text("bmr.visual.caption")}
            summary={fillMessage(text("bmr.visual.summary"), vars)}
            note={text(v.descriptionKey)}
          >
            <CompareBars
              rows={[
                row("weight", t.weight),
                row("height", t.height),
                row("age", t.age),
                row("constant", t.constant),
                {
                  label: text("bmr.visual.total"),
                  value: Number(v.answer),
                  display: answerText(v.answer),
                  tone: "accent",
                },
              ]}
            />
          </VizFigure>
        );
      }}
    />
  );
}
