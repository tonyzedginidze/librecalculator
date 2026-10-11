import type {
  FractionErrorCode,
  FractionResult,
} from "../../../../calculators/src/fractions";
import { renderWorkingStep } from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import {
  CountGrid,
  Equation,
  fillMessage,
  VizFigure,
} from "../../components/viz";
import type { Evaluation } from "../../evaluate";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { adapter as fractionsAdapter } from "./adapter";

export { fractionsAdapter as adapter };
export type { TopicViewProps };

/** Largest grid drawn: up to 12 parts per whole and 3 wholes. */
const GRID_MAX_DENOMINATOR = 12n;
const GRID_MAX_WHOLES = 3n;

/** Typographic minus for an exact "n/d" or mixed string from the engine. */
const pretty = (text: string) => text.replace(/^-/, "−");

const argText = (
  args: Readonly<Record<string, { kind: string; value?: string }>> | undefined,
  name: string,
) => {
  const value = args?.[name]?.value;
  return typeof value === "string" ? pretty(value) : "";
};

export default function FractionsTopicView(props: TopicViewProps) {
  const { title, description, messages, locale } = props;

  const controller = useCalculator<FractionResult, FractionErrorCode>({
    adapter: fractionsAdapter,
    locale,
  });

  const operations = fractionsAdapter.descriptors.map((descriptor) => ({
    id: descriptor.id,
    label: messageText(messages, descriptor.labelKey),
  }));

  const exact = (result: FractionResult) =>
    pretty(`${result.answer.numerator}/${result.answer.denominator}`);

  return (
    <CalculatorPanel<FractionResult, FractionErrorCode>
      title={title}
      description={description}
      topicId="fractions"
      controller={controller}
      operations={operations}
      messages={messages}
      locale={locale}
      getCopyText={(evaluation) =>
        evaluation.status === "ok" ? exact(evaluation.outcome.result) : ""
      }
      renderAnswer={(
        evaluation: Evaluation<FractionResult, FractionErrorCode>,
      ) => {
        const result =
          evaluation.status === "ok" ? evaluation.outcome.result : null;
        const mixed = result ? pretty(result.mixed.text) : "";
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
                  <NumText text={exact(result)} />
                )}
              </p>
            </div>
            {result !== null &&
            result.answer.denominator !== "1" &&
            result.mixed.whole !== "0" ? (
              <p>
                <NumText
                  text={fillMessage(
                    messageText(messages, "fractions.answer.mixed"),
                    { mixed },
                  )}
                />
              </p>
            ) : null}
          </div>
        );
      }}
      renderWorking={(
        evaluation: Evaluation<FractionResult, FractionErrorCode>,
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
        evaluation: Evaluation<FractionResult, FractionErrorCode>,
      ) => {
        if (evaluation.status !== "ok") return null;
        const result = evaluation.outcome.result;
        const args = result.working[0]?.args;
        const answer = exact(result);
        const equals = messageText(messages, "fractions.visual.op.equals");
        const items =
          result.operation === "reduce"
            ? [
                {
                  label: messageText(messages, "fractions.visual.entered"),
                  display: argText(args, "input"),
                },
                { op: equals },
                {
                  label: messageText(messages, "fractions.visual.reduced"),
                  display: answer,
                  emphasis: true,
                },
              ]
            : [
                {
                  label: messageText(messages, "fractions.visual.first"),
                  display: argText(args, "left"),
                },
                {
                  op: messageText(
                    messages,
                    `fractions.visual.op.${result.operation}`,
                  ),
                },
                {
                  label: messageText(messages, "fractions.visual.second"),
                  display: argText(args, "right"),
                },
                { op: equals },
                {
                  label: messageText(messages, "fractions.visual.result"),
                  display: answer,
                  emphasis: true,
                },
              ];
        const equation = items
          .map((item) => ("op" in item ? item.op : item.display))
          .join(" ");

        const numerator = BigInt(result.answer.numerator);
        const denominator = BigInt(result.answer.denominator);
        const wholes =
          numerator > 0n ? (numerator + denominator - 1n) / denominator : 0n;
        const showGrid =
          numerator > 0n &&
          denominator > 1n &&
          denominator <= GRID_MAX_DENOMINATOR &&
          wholes <= GRID_MAX_WHOLES;

        return (
          <VizFigure
            caption={messageText(messages, "fractions.visual.caption")}
            summary={fillMessage(
              messageText(messages, "fractions.visual.summary"),
              { equation, answer },
            )}
          >
            <Equation items={items} />
            {showGrid ? (
              <CountGrid
                total={Number(wholes * denominator)}
                filled={Number(numerator)}
                columns={Number(denominator)}
                display={answer}
                label={fillMessage(
                  messageText(messages, "fractions.visual.grid"),
                  { denominator: result.answer.denominator },
                )}
              />
            ) : null}
          </VizFigure>
        );
      }}
    />
  );
}
