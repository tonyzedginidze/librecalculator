import type {
  ErrorCode,
  Result,
} from "../../../../calculators/src/calories-per-serving";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import {
  CountGrid,
  Equation,
  fillMessage,
  SplitBar,
  VizFigure,
} from "../../components/viz";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { adapter } from "./adapter";
import { answerText, grams, KCAL_DIGITS, kcal } from "./format";

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
      topicId="calories-per-serving"
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
          isRoundedForDisplay(e.outcome.result.answer.value, KCAL_DIGITS) ? (
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
        const unit = m("calories-per-serving.answer.kcal");
        const gram = m("calories-per-serving.answer.gram");
        const vars = {
          totalCalories: kcal(v.totalCalories, locale),
          portionCalories: kcal(v.portionCalories, locale),
          servings: formatDecimal(v.servings ?? "0", locale, {
            fractionDigits: 2,
          }),
          totalGrams: grams(v.totalGrams ?? "0", locale),
          portionGrams: grams(v.portionGrams ?? "0", locale),
          remainderGrams: grams(v.remainderGrams ?? "0", locale),
        };
        const caption = m(
          `calories-per-serving.visual.caption.${result.operation}`,
        );
        if (result.operation === "portion-weight")
          return (
            <VizFigure
              caption={caption}
              summary={fillMessage(
                m("calories-per-serving.visual.summary.weight"),
                vars,
              )}
            >
              <SplitBar
                total={{
                  label: fillMessage(
                    m("calories-per-serving.visual.batch"),
                    vars,
                  ),
                  display: `${vars.totalGrams} ${gram}`,
                }}
                parts={[
                  {
                    label: m("calories-per-serving.visual.portion"),
                    value: Number(v.portionGrams),
                    display: `${vars.portionGrams} ${gram}`,
                  },
                  {
                    label: m("calories-per-serving.visual.rest"),
                    value: Number(v.remainderGrams),
                    display: `${vars.remainderGrams} ${gram}`,
                    tone: "soft",
                  },
                ]}
              />
            </VizFigure>
          );
        const summary = fillMessage(
          m("calories-per-serving.visual.summary.count"),
          vars,
        );
        if (result.operation === "recipe-calories")
          return (
            <VizFigure caption={caption} summary={summary}>
              <Equation
                items={[
                  {
                    label: m("calories-per-serving.visual.per-serving"),
                    display: `${vars.portionCalories} ${unit}`,
                  },
                  { op: "×" },
                  {
                    label: m("calories-per-serving.visual.servings"),
                    display: vars.servings,
                  },
                  { op: "=" },
                  {
                    label: m("calories-per-serving.visual.whole"),
                    display: `${vars.totalCalories} ${unit}`,
                    emphasis: true,
                  },
                ]}
              />
            </VizFigure>
          );
        const servings = Number(v.servings);
        return (
          <VizFigure caption={caption} summary={summary}>
            <CountGrid
              total={Math.ceil(servings)}
              filled={1}
              columns={Math.min(12, Math.max(1, Math.ceil(servings)))}
              label={fillMessage(
                m("calories-per-serving.visual.one-serving"),
                vars,
              )}
              display={`${vars.portionCalories} ${unit}`}
            />
          </VizFigure>
        );
      }}
    />
  );
}
