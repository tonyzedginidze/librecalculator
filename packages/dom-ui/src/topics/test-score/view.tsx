import type { ErrorCode, Result } from "../../../../calculators/src/test-score";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import { CountGrid, fillMessage, Ring, VizFigure } from "../../components/viz";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { adapter } from "./adapter";

/** Percent scores read at one decimal; question counts are whole. */
const digitsFor = (operation: string) =>
  operation === "test-percentage" ? 1 : 0;
/** One square per question up to this many; larger tests show a ring. */
const GRID_LIMIT = 200;

/** Square-ish rows: short tests on one row, multiples of five as 5-wide blocks, else tens. */
function gridColumns(total: number) {
  if (total <= 10) return total;
  if (total <= 30 && total % 5 === 0) return 5;
  return total <= 100 ? 10 : 20;
}

export default function TopicView({
  title,
  description,
  messages,
  locale,
}: TopicViewProps) {
  const controller = useCalculator<Result, ErrorCode>({ adapter, locale });
  const m = (key: string) => messageText(messages, key);
  const answerText = (result: Result) => {
    const value = formatDecimal(result.answer.value, locale, {
      fractionDigits: digitsFor(result.operation),
    });
    const unit = m(result.unitKey);
    return unit === m("test-score.answer.percent")
      ? `${value}${unit}`
      : `${value} ${unit}`;
  };
  return (
    <CalculatorPanel<Result, ErrorCode>
      title={title}
      description={description}
      topicId="test-score"
      controller={controller}
      operations={adapter.descriptors.map((d) => ({
        id: d.id,
        label: m(d.labelKey),
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
          {e.status === "ok" &&
          isRoundedForDisplay(
            e.outcome.result.answer.value,
            digitsFor(e.outcome.result.operation),
          ) ? (
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
        const { operation, visual } = result;
        const d = visual.dimensions;
        const vars: Record<string, string> = {};
        for (const [key, value] of Object.entries(d))
          vars[key] = formatDecimal(value, locale);
        vars.answer = formatDecimal(visual.answer, locale, {
          fractionDigits: digitsFor(operation),
        });
        const total = Number(d.questions);
        const filled = Number(
          operation === "test-needed" ? visual.answer : d.correct,
        );
        const grid = fillMessage(m("test-score.visual.grid"), {
          filled: formatDecimal(
            operation === "test-needed" ? visual.answer : (d.correct ?? "0"),
            locale,
          ),
          total: vars.questions ?? "",
        });
        const label =
          operation === "test-missed"
            ? fillMessage(m("test-score.visual.missed"), {
                missed: vars.answer,
              })
            : operation === "test-needed"
              ? fillMessage(m("test-score.visual.needed"), {
                  target: vars.target ?? "",
                })
              : m("test-score.visual.correct");
        return (
          <VizFigure
            caption={m(`test-score.visual.caption.${operation}`)}
            summary={fillMessage(
              m(`test-score.visual.summary.${operation}`),
              vars,
            )}
          >
            {total <= GRID_LIMIT ? (
              <CountGrid
                total={total}
                filled={filled}
                columns={gridColumns(total)}
                display={grid}
                label={label}
              />
            ) : (
              <Ring fraction={filled / total} display={grid} label={label} />
            )}
          </VizFigure>
        );
      }}
    />
  );
}
