import type { ReactNode } from "react";
import type { WorkingStep } from "../../../calculators/src/contracts";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../i18n/src/en";
import { ui } from "../../../i18n/src/ui";
import { CalculatorPanel } from "../components/calculator";
import { measureDigits } from "../components/measure";
import { NumText } from "../components/num-text";
import { fillMessage, VizFigure } from "../components/viz";
import { messageText } from "../lesson-text";
import type { TopicAdapter } from "../topic";
import { useCalculator } from "../use-calculator";
import type { TopicViewProps } from "../view-contract";

/** Result shape shared by the geometry pack's shape calculators. */
export type ShapeResult = {
  operation: string;
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
};

type DefaultShapeResult = ShapeResult & {
  unitKey: string;
  visual: { dimensions: Record<string, string> };
};

export type ShapeDiagramContext = {
  operation: string;
  /** Raw canonical inputs keyed by field id. */
  dimensions: Record<string, string>;
  /** Formatted inputs with their unit symbol, keyed by field id. */
  labels: Record<string, string>;
  /** Formatted answer with its unit symbol. */
  answer: string;
  /** Canonical answer, for sizing the drawing. */
  answerValue: string;
};

/** One answer, one working line and one dimensioned drawing for a shape calculator. */
export function ShapeTopicView<R extends ShapeResult, Code extends string>(
  props: TopicViewProps & {
    topicId: string;
    adapter: TopicAdapter<R, Code>;
    /** Message key of the unit symbol for each input field. */
    fieldUnitKey: (field: string) => string;
    /** Message key of the answer's unit symbol; defaults to `result.unitKey`. */
    answerUnitKey?: (result: R) => string;
    /** Canonical inputs keyed by field id; defaults to `result.visual.dimensions`. */
    dimensions?: (result: R) => Record<string, string>;
    diagram: (ctx: ShapeDiagramContext & { result: R }) => ReactNode;
  },
) {
  const { title, description, messages, locale, topicId, adapter } = props;
  const controller = useCalculator<R, Code>({ adapter, locale });
  const unitKeyOf =
    props.answerUnitKey ??
    ((result: R) => (result as unknown as DefaultShapeResult).unitKey);
  const dimensionsOf =
    props.dimensions ??
    ((result: R) =>
      (result as unknown as DefaultShapeResult).visual.dimensions);
  const answerText = (result: R) =>
    `${formatDecimal(result.answer.value, locale, {
      fractionDigits: measureDigits(result.answer.value),
    })} ${messageText(messages, unitKeyOf(result))}`;
  const rounded = (result: R) => {
    const digits = measureDigits(result.answer.value);
    return (
      digits !== undefined && isRoundedForDisplay(result.answer.value, digits)
    );
  };
  return (
    <CalculatorPanel<R, Code>
      title={title}
      description={description}
      topicId={topicId}
      controller={controller}
      operations={adapter.descriptors.map((d) => ({
        id: d.id,
        label: messageText(messages, d.labelKey),
      }))}
      messages={messages}
      locale={locale}
      getCopyText={(e) =>
        e.status === "ok" ? answerText(e.outcome.result) : ""
      }
      renderAnswer={(e) => (
        <div className="oc-answer" aria-live="polite">
          <p className="oc-kicker">{ui["ui.answer.label"]}</p>
          <p className="oc-answer-value">
            {e.status === "ok" ? (
              <NumText text={answerText(e.outcome.result)} />
            ) : (
              ui["ui.answer.empty"]
            )}
          </p>
          {e.status === "ok" && rounded(e.outcome.result) ? (
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
        const dimensions = dimensionsOf(result);
        const labels = Object.fromEntries(
          Object.entries(dimensions).map(([field, value]) => [
            field,
            `${formatDecimal(value, locale)} ${messageText(messages, props.fieldUnitKey(field))}`,
          ]),
        );
        const answer = answerText(result);
        const op = result.operation;
        return (
          <VizFigure
            caption={messageText(messages, `${topicId}.visual.caption.${op}`)}
            summary={fillMessage(
              messageText(messages, `${topicId}.visual.summary.${op}`),
              { ...labels, answer },
            )}
          >
            {props.diagram({
              operation: op,
              dimensions,
              labels,
              answer,
              answerValue: result.answer.value,
              result,
            })}
          </VizFigure>
        );
      }}
    />
  );
}
