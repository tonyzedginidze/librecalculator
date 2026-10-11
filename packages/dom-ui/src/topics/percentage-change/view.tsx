import type {
  PercentageChangeErrorCode,
  PercentageChangeResult,
} from "../../../../calculators/src/percentage-change";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import { CompareBars, fillMessage, VizFigure } from "../../components/viz";
import type { Evaluation } from "../../evaluate";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { adapter as percentageChangeAdapter } from "./adapter";

export { percentageChangeAdapter as adapter };
export type { TopicViewProps };

const PERCENT_DIGITS = 2;

const magnitude = (canonical: string) => canonical.replace(/^[+-]/, "");
const isZero = (canonical: string) => /^[+-]?0*(?:\.0*)?$/.test(canonical);
const isNegative = (canonical: string) =>
  canonical.startsWith("-") && !isZero(canonical);

export default function PercentageChangeTopicView(props: TopicViewProps) {
  const { title, description, messages, locale } = props;

  const controller = useCalculator<
    PercentageChangeResult,
    PercentageChangeErrorCode
  >({
    adapter: percentageChangeAdapter,
    locale,
  });

  const operations = percentageChangeAdapter.descriptors.map((descriptor) => ({
    id: descriptor.id,
    label: messageText(messages, descriptor.labelKey),
  }));

  /** Signed figure with an explicit plus for increases. */
  const signed = (canonical: string, fractionDigits?: number) => {
    const text = formatDecimal(canonical, locale, { fractionDigits });
    return isNegative(canonical) || isZero(canonical) ? text : `+${text}`;
  };
  const percentText = (canonical: string) =>
    `${signed(canonical, PERCENT_DIGITS)}%`;

  return (
    <CalculatorPanel<PercentageChangeResult, PercentageChangeErrorCode>
      title={title}
      description={description}
      topicId="percentage-change"
      controller={controller}
      operations={operations}
      messages={messages}
      locale={locale}
      getCopyText={(evaluation) =>
        evaluation.status === "ok"
          ? percentText(evaluation.outcome.result.answer.percent)
          : ""
      }
      renderAnswer={(
        evaluation: Evaluation<
          PercentageChangeResult,
          PercentageChangeErrorCode
        >,
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
                  <NumText text={percentText(result.answer.percent)} />
                )}
              </p>
            </div>
            {result !== null ? (
              <p>
                <NumText
                  text={fillMessage(
                    messageText(messages, "percentage-change.answer.delta"),
                    { delta: signed(result.delta.value) },
                  )}
                />
              </p>
            ) : null}
            {result !== null &&
            isRoundedForDisplay(result.answer.percent, PERCENT_DIGITS) ? (
              <p>{ui["ui.answer.rounded"]}</p>
            ) : null}
          </div>
        );
      }}
      renderWorking={(
        evaluation: Evaluation<
          PercentageChangeResult,
          PercentageChangeErrorCode
        >,
      ) => {
        if (evaluation.status !== "ok") return null;
        return (
          <div className="oc-working">
            <h2 className="oc-kicker">{ui["ui.working.heading"]}</h2>
            {evaluation.outcome.result.working.map((step) => (
              <p key={step.id}>
                <NumText
                  text={renderWorkingStep(
                    step as Parameters<typeof renderWorkingStep>[0],
                    { locale, messages },
                  )}
                />
              </p>
            ))}
          </div>
        );
      }}
      renderVisual={(
        evaluation: Evaluation<
          PercentageChangeResult,
          PercentageChangeErrorCode
        >,
      ) => {
        if (evaluation.status !== "ok") return null;
        const result = evaluation.outcome.result;
        const visual = result.visual;
        const vars = {
          oldValue: formatDecimal(visual.oldValue, locale),
          newValue: formatDecimal(visual.newValue, locale),
          delta: signed(visual.delta),
          percentage: signed(visual.percentageChange, PERCENT_DIGITS),
          magnitude: formatDecimal(magnitude(visual.delta), locale),
          magnitudePercent: formatDecimal(
            magnitude(visual.percentageChange),
            locale,
            { fractionDigits: PERCENT_DIGITS },
          ),
        };
        const direction = isNegative(visual.delta) ? "decrease" : "increase";
        const note = isZero(visual.delta)
          ? messageText(messages, "percentage-change.visual.same")
          : fillMessage(
              messageText(
                messages,
                `percentage-change.visual.${direction}${visual.negativeBaseline ? ".negative" : ""}`,
              ),
              vars,
            );
        return (
          <VizFigure
            caption={messageText(messages, "percentage-change.visual.caption")}
            summary={fillMessage(
              messageText(messages, "percentage-change.visual.summary"),
              vars,
            )}
            note={note}
          >
            <CompareBars
              rows={[
                {
                  label: messageText(messages, "percentage-change.visual.old"),
                  value: Number(visual.oldValue),
                  display: vars.oldValue,
                  tone: "soft",
                },
                {
                  label: messageText(messages, "percentage-change.visual.new"),
                  value: Number(visual.newValue),
                  display: vars.newValue,
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
