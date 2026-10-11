import type {
  ErrorCode,
  Result,
} from "../../../../calculators/src/baking-ratios";
import {
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
import { answerText, DIGITS, shown } from "./format";

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
      topicId="baking-ratios"
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
        const gram = m("baking-ratios.answer.gram");
        const vars = {
          flour: shown(v.flour, locale),
          ingredient: shown(v.ingredient, locale),
          percentage: shown(v.percentage, locale),
        };
        return (
          <VizFigure
            caption={m("baking-ratios.visual.caption")}
            summary={fillMessage(m("baking-ratios.visual.summary"), vars)}
          >
            <CompareBars
              rows={[
                {
                  label: m("baking-ratios.visual.flour"),
                  value: Number(v.flour),
                  display: `${vars.flour} ${gram}`,
                  tone: "soft",
                  note: m("baking-ratios.visual.reference"),
                },
                {
                  label: m("baking-ratios.visual.ingredient"),
                  value: Number(v.ingredient),
                  display: `${vars.ingredient} ${gram}`,
                  note: fillMessage(m("baking-ratios.visual.share"), vars),
                },
              ]}
            />
          </VizFigure>
        );
      }}
    />
  );
}
