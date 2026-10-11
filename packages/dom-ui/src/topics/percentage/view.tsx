import type {
  PercentageErrorCode,
  PercentageResult,
} from "../../../../calculators/src/percentage";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import { fillMessage, Ring, VizFigure } from "../../components/viz";
import type { Evaluation } from "../../evaluate";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { adapter as percentageAdapter } from "./adapter";

export type { TopicViewProps };

/** Two decimals, widened for small magnitudes so 0.002 never shows as 0. */
function digitsFor(canonical: string): number {
  const [integer = "0", fraction = ""] = canonical
    .replace(/^[+-]/, "")
    .split(".");
  if (!/^0*$/.test(integer)) return 2;
  const zeros = /^0*/.exec(fraction)?.[0].length ?? 0;
  return Math.max(2, zeros + 2);
}

export default function PercentageTopicView(props: TopicViewProps) {
  const { title, description, messages, locale } = props;

  const controller = useCalculator<PercentageResult, PercentageErrorCode>({
    adapter: percentageAdapter,
    locale,
  });

  const operations = percentageAdapter.descriptors.map((descriptor) => ({
    id: descriptor.id,
    label: messageText(messages, descriptor.labelKey),
  }));

  const shown = (canonical: string) =>
    formatDecimal(canonical, locale, { fractionDigits: digitsFor(canonical) });
  const answerText = (result: PercentageResult) =>
    result.operation === "ratio"
      ? `${shown(result.answer.value)}%`
      : shown(result.answer.value);

  return (
    <CalculatorPanel<PercentageResult, PercentageErrorCode>
      title={title}
      description={description}
      topicId="percentage"
      controller={controller}
      operations={operations}
      messages={messages}
      locale={locale}
      getCopyText={(evaluation) =>
        evaluation.status === "ok" ? answerText(evaluation.outcome.result) : ""
      }
      renderAnswer={(
        evaluation: Evaluation<PercentageResult, PercentageErrorCode>,
      ) => {
        const result =
          evaluation.status === "ok" ? evaluation.outcome.result : null;
        return (
          <div className="oc-answer" aria-live="polite">
            <p className="oc-kicker">{ui["ui.answer.label"]}</p>
            <div className="oc-answer-scroll">
              <p className="oc-answer-value">
                {result === null ? (
                  <span className="oc-answer-empty">
                    {ui["ui.answer.empty"]}
                  </span>
                ) : (
                  <NumText text={answerText(result)} />
                )}
              </p>
            </div>
            {result !== null &&
            isRoundedForDisplay(
              result.answer.value,
              digitsFor(result.answer.value),
            ) ? (
              <p>{ui["ui.answer.rounded"]}</p>
            ) : null}
          </div>
        );
      }}
      renderWorking={(
        evaluation: Evaluation<PercentageResult, PercentageErrorCode>,
      ) => {
        if (evaluation.status !== "ok") return null;
        return (
          <div className="oc-working">
            <h2 className="oc-kicker">{ui["ui.working.heading"]}</h2>
            {evaluation.outcome.result.working.map((step) => (
              <p key={step.id}>
                <NumText text={renderWorkingStep(step, { locale, messages })} />
              </p>
            ))}
          </div>
        );
      }}
      renderVisual={(
        evaluation: Evaluation<PercentageResult, PercentageErrorCode>,
      ) => {
        if (evaluation.status !== "ok") return null;
        const result = evaluation.outcome.result;
        const visual = result.visual;
        const args = result.working[0]?.args;
        const first = args ? formatDecimal(args.first.value, locale) : "";
        const second = args ? formatDecimal(args.second.value, locale) : "";
        const answer = shown(result.answer.value);
        const ratio = result.operation === "ratio";
        const vars = ratio
          ? { part: first, whole: second, answer }
          : { value: first, rate: second, answer };
        const suffix = ratio ? "ratio" : "ofValue";
        const note =
          visual.sign === "negative"
            ? messageText(messages, "percentage.visual.negative")
            : visual.outside
              ? messageText(messages, "percentage.visual.outside")
              : undefined;
        return (
          <VizFigure
            caption={messageText(
              messages,
              `percentage.visual.caption.${suffix}`,
            )}
            summary={fillMessage(
              messageText(messages, `percentage.visual.summary.${suffix}`),
              vars,
            )}
            note={note}
          >
            <Ring
              fraction={Number(visual.fraction)}
              display={ratio ? `${answer}%` : answer}
              label={fillMessage(
                messageText(messages, `percentage.visual.label.${suffix}`),
                vars,
              )}
            />
          </VizFigure>
        );
      }}
    />
  );
}
