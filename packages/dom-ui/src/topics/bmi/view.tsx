import type { ErrorCode, Result } from "../../../../calculators/src/bmi";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import { fillMessage, Gauge, VizFigure } from "../../components/viz";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { adapter } from "./adapter";

const DIGITS = 1;
const SCALE = { min: 15, max: 40 };
const TICKS = [15, 20, 25, 30, 35, 40];

export default function View({
  title,
  description,
  messages,
  locale,
}: TopicViewProps) {
  const controller = useCalculator<Result, ErrorCode>({ adapter, locale });
  const unit = messageText(messages, "bmi.answer.unit");
  const shown = (value: string) =>
    formatDecimal(value, locale, { fractionDigits: DIGITS });
  const answerText = (value: string) => `${shown(value)} ${unit}`;
  return (
    <CalculatorPanel<Result, ErrorCode>
      topicId="bmi"
      title={title}
      description={description}
      controller={controller}
      operations={adapter.descriptors.map((d) => ({
        id: d.id,
        label: messageText(messages, d.labelKey),
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
        const vars = { answer: shown(v.answer), reference: shown(v.reference) };
        return (
          <VizFigure
            caption={messageText(messages, "bmi.visual.caption")}
            summary={fillMessage(
              messageText(messages, "bmi.visual.summary"),
              vars,
            )}
            note={messageText(messages, v.descriptionKey)}
          >
            <Gauge
              min={SCALE.min}
              max={SCALE.max}
              value={Number(v.answer)}
              display={vars.answer}
              label={unit}
              ticks={TICKS.map((t) => ({
                value: t,
                label: formatDecimal(String(t), locale),
              }))}
              reference={{
                value: Number(v.reference),
                label: fillMessage(
                  messageText(messages, "bmi.visual.reference"),
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
