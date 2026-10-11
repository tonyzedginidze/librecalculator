import type {
  ErrorCode,
  Result,
} from "../../../../calculators/src/recipe-scaling";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import { Equation, fillMessage, VizFigure } from "../../components/viz";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { adapter } from "./adapter";
import { answerText, DIGITS, factorText, shown } from "./format";

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
      topicId="recipe-scaling"
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
          e.outcome.result.operation !== "recipe-factor" ? (
            <p>{m("recipe-scaling.answer.quantity")}</p>
          ) : null}
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
        const result = e.outcome.result;
        const v = result.visual;
        const servingsOf = (count: string) => formatDecimal(count, locale);
        const vars = {
          original: shown(v.originalQuantity ?? "0", locale),
          scaled: shown(v.scaledQuantity ?? "0", locale),
          factor: factorText(v.factor, locale, messages),
          originalServings: servingsOf(v.originalServings),
          targetServings: servingsOf(v.targetServings),
        };
        const originalTerm = {
          label: fillMessage(m("recipe-scaling.visual.original"), {
            servings: vars.originalServings,
          }),
          display: vars.original,
        };
        const scaledTerm = {
          label: fillMessage(m("recipe-scaling.visual.scaled"), {
            servings: vars.targetServings,
          }),
          display: vars.scaled,
        };
        const factorTerm = {
          label: m("recipe-scaling.visual.factor"),
          display: vars.factor,
        };
        const items =
          result.operation === "recipe-scale"
            ? [
                originalTerm,
                { op: "×" },
                { ...factorTerm, display: shown(v.factor, locale) },
                { op: "=" },
                { ...scaledTerm, emphasis: true },
              ]
            : result.operation === "recipe-reverse"
              ? [
                  scaledTerm,
                  { op: "÷" },
                  { ...factorTerm, display: shown(v.factor, locale) },
                  { op: "=" },
                  { ...originalTerm, emphasis: true },
                ]
              : [
                  {
                    label: m("recipe-scaling.visual.target"),
                    display: vars.targetServings,
                  },
                  { op: "÷" },
                  {
                    label: m("recipe-scaling.visual.source"),
                    display: vars.originalServings,
                  },
                  { op: "=" },
                  { ...factorTerm, emphasis: true },
                ];
        return (
          <VizFigure
            caption={m(`recipe-scaling.visual.caption.${result.operation}`)}
            summary={fillMessage(
              m(
                result.operation === "recipe-factor"
                  ? "recipe-scaling.visual.summary.factor"
                  : "recipe-scaling.visual.summary",
              ),
              vars,
            )}
          >
            <Equation items={items} />
          </VizFigure>
        );
      }}
    />
  );
}
