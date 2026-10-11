import {
  type UnitConversionErrorCode,
  type UnitConversionResult,
  type UnitDimension,
  units,
} from "../../../../calculators/src/unit-conversion/index";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import {
  DualScale,
  Equation,
  fillMessage,
  VizFigure,
} from "../../components/viz";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { adapter as unitAdapter } from "./adapter";

export type { TopicViewProps };

const dimensionOrder: UnitDimension[] = [
  "length",
  "mass",
  "temperature",
  "area",
  "volume",
  "time",
];

const defaultTargetByDimension: Record<UnitDimension, string> = {
  length: "ft",
  mass: "lb",
  temperature: "f",
  area: "ft2",
  volume: "l",
  time: "s",
};

/** Six significant figures: enough for everyday use; the working keeps every digit. */
const SIGNIFICANT = 6;
function significantDigits(canonical: string): number {
  const [integer = "0", fraction = ""] = canonical
    .replace(/^[+-]/, "")
    .split(".");
  const whole = integer.replace(/^0+/, "");
  if (whole.length > 0) return Math.max(0, SIGNIFICANT - whole.length);
  const zeros = /^0*/.exec(fraction)?.[0].length ?? 0;
  return Math.min(20, zeros + SIGNIFICANT);
}

/** A 1, 2, 2.5 or 5 step that splits `span` into about `parts` intervals. */
function niceStep(span: number, parts: number): number {
  const raw = span / parts;
  const power = 10 ** Math.floor(Math.log10(raw));
  const unit = raw / power;
  const factor =
    unit <= 1 ? 1 : unit <= 2 ? 2 : unit <= 2.5 ? 2.5 : unit <= 5 ? 5 : 10;
  return factor * power;
}

/** Canonical decimal text for a tick value, or null when it would need an exponent. */
function tickCanonical(value: number): string | null {
  const text = String(Number(value.toPrecision(12)));
  return /^\d+(?:\.\d+)?$/.test(text) ? text : null;
}

function ticksUpTo(max: number, step: number) {
  const out: number[] = [];
  for (let i = 0; i * step <= max * (1 + 1e-9) && i < 40; i += 1)
    out.push(i * step);
  return out;
}

export default function UnitConversionTopicView(props: TopicViewProps) {
  const { title, description, messages, locale } = props;

  const controller = useCalculator<
    UnitConversionResult,
    UnitConversionErrorCode
  >({
    adapter: unitAdapter,
    locale,
  });

  const operations = unitAdapter.descriptors.map((descriptor) => ({
    id: descriptor.id,
    label: messageText(messages, descriptor.labelKey),
  }));

  const currentSourceId = controller.drafts.source ?? "m";
  const currentSourceUnit = units.find((u) => u.id === currentSourceId);
  const currentDimension = currentSourceUnit?.dimension ?? "length";

  const handleSetDraft = (fieldId: string, value: string) => {
    controller.setDraft(fieldId, value);
    if (fieldId === "source") {
      const newSource = units.find((u) => u.id === value);
      if (newSource) {
        const currentTargetId = controller.drafts.target;
        const currentTargetUnit = units.find((u) => u.id === currentTargetId);
        if (
          !currentTargetUnit ||
          currentTargetUnit.dimension !== newSource.dimension
        ) {
          const fallbackTarget = defaultTargetByDimension[newSource.dimension];
          controller.setDraft("target", fallbackTarget);
        }
      }
    }
  };

  const shown = (canonical: string) =>
    formatDecimal(canonical, locale, {
      fractionDigits: significantDigits(canonical),
    });
  const symbol = (unitId: string) =>
    messageText(messages, `unit-conversion.symbol.${unitId}`);

  // Wrap controller to intercept setDraft for source/target compatibility
  const wrappedController = {
    ...controller,
    setDraft: handleSetDraft,
  };

  return (
    <CalculatorPanel<UnitConversionResult, UnitConversionErrorCode>
      title={title}
      description={description}
      topicId="unit-conversion"
      controller={wrappedController}
      operations={operations}
      messages={messages}
      locale={locale}
      getCopyText={(evaluation) =>
        evaluation.status === "ok"
          ? `${shown(evaluation.outcome.result.answer.value)} ${symbol(evaluation.outcome.result.visual.target)}`
          : ""
      }
      choiceOptions={(field) => {
        const labelled = (unit: (typeof units)[number], group?: string) => ({
          value: unit.id,
          label: messageText(messages, unit.labelKey),
          ...(group ? { group } : {}),
        });
        if (field.id === "source") {
          return dimensionOrder.flatMap((dim) =>
            units
              .filter((unit) => unit.dimension === dim)
              .map((unit) =>
                labelled(
                  unit,
                  messageText(messages, `unit-conversion.dimension.${dim}`),
                ),
              ),
          );
        }
        if (field.id === "target") {
          return units
            .filter((unit) => unit.dimension === currentDimension)
            .map((unit) => labelled(unit));
        }
        return (field.choices ?? []).map((choice) => ({
          value: choice.id,
          label: messageText(messages, choice.labelKey),
        }));
      }}
      renderAnswer={(evaluation) => {
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
                  <NumText
                    text={`${shown(result.answer.value)} ${symbol(result.visual.target)}`}
                  />
                )}
              </p>
            </div>
            {result !== null &&
            isRoundedForDisplay(
              result.answer.value,
              significantDigits(result.answer.value),
            ) ? (
              <p>{ui["ui.answer.rounded"]}</p>
            ) : null}
          </div>
        );
      }}
      renderWorking={(evaluation) => {
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
      renderVisual={(evaluation) => {
        if (evaluation.status !== "ok") return null;
        const result = evaluation.outcome.result;
        const visual = result.visual;
        const valueArg = result.working[0]?.args.value;
        const valueCanonical =
          valueArg?.kind === "decimal" ? valueArg.value : "0";
        const vars = {
          value: shown(valueCanonical),
          source: symbol(visual.source),
          answer: shown(result.answer.value),
          target: symbol(visual.target),
        };
        const summary = fillMessage(
          messageText(messages, "unit-conversion.visual.summary"),
          vars,
        );
        const value = Number(valueCanonical);
        const converted = Number(result.answer.value);
        const linear = visual.sourceKelvin === undefined;

        if (linear && value > 0 && converted > 0) {
          const topStep = niceStep(value * 1.25, 4);
          const topMax = Math.ceil((value * 1.25) / topStep) * topStep;
          const bottomMax = topMax * (converted / value);
          const bottomStep = niceStep(bottomMax, 4);
          const scale = (max: number, step: number) =>
            ticksUpTo(max, step).flatMap((tick) => {
              const canonical = tickCanonical(tick);
              return canonical === null
                ? []
                : [{ at: tick / max, label: formatDecimal(canonical, locale) }];
            });
          return (
            <VizFigure
              caption={messageText(messages, "unit-conversion.visual.caption")}
              summary={summary}
            >
              <DualScale
                fraction={value / topMax}
                top={{
                  unit: vars.source,
                  display: vars.value,
                  ticks: scale(topMax, topStep),
                }}
                bottom={{
                  unit: vars.target,
                  display: vars.answer,
                  ticks: scale(bottomMax, bottomStep),
                }}
              />
            </VizFigure>
          );
        }

        return (
          <VizFigure
            caption={messageText(
              messages,
              "unit-conversion.visual.caption.equation",
            )}
            summary={summary}
            note={
              visual.sourceKelvin !== undefined
                ? fillMessage(
                    messageText(messages, "unit-conversion.visual.kelvin"),
                    {
                      kelvin: formatDecimal(visual.sourceKelvin, locale, {
                        fractionDigits: 2,
                      }),
                    },
                  )
                : undefined
            }
          >
            <Equation
              items={[
                {
                  label: messageText(messages, "unit-conversion.visual.from"),
                  display: `${vars.value} ${vars.source}`,
                },
                { op: messageText(messages, "unit-conversion.visual.equals") },
                {
                  label: messageText(messages, "unit-conversion.visual.to"),
                  display: `${vars.answer} ${vars.target}`,
                  emphasis: true,
                },
              ]}
            />
          </VizFigure>
        );
      }}
    />
  );
}
