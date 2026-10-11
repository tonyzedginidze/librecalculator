import type { ErrorCode, Result } from "../../../../calculators/src/tdee";
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

const DIGITS = 0;

export default function View({
  title,
  description,
  messages,
  locale,
}: TopicViewProps) {
  const controller = useCalculator<Result, ErrorCode>({ adapter, locale });
  const unit = messageText(messages, "tdee.answer.unit");
  const fmt = (value: string, fractionDigits = DIGITS) =>
    formatDecimal(value, locale, { fractionDigits });
  const text = (key: string) => messageText(messages, key);
  const answerText = (value: string) => `${fmt(value)} ${unit}`;
  return (
    <CalculatorPanel<Result, ErrorCode>
      topicId="tdee"
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
        const vars = {
          answer: fmt(v.answer),
          resting: fmt(v.reference),
          extra: fmt(v.extra),
          factor: fmt(v.factor, 3),
        };
        return (
          <VizFigure
            caption={text("tdee.visual.caption")}
            summary={fillMessage(text("tdee.visual.summary"), vars)}
            note={text(v.descriptionKey)}
          >
            <SplitBar
              total={{
                label: text("tdee.visual.total"),
                display: answerText(v.answer),
              }}
              parts={[
                {
                  label: text("tdee.visual.resting"),
                  value: Number(v.reference),
                  display: answerText(v.reference),
                  tone: "soft",
                },
                {
                  label: text("tdee.visual.extra"),
                  value: Number(v.extra),
                  display: answerText(v.extra),
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
