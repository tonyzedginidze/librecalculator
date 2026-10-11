import type {
  UnitPresetError,
  UnitPresetResult,
} from "../../../calculators/src/runtime/unit-preset";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../i18n/src/en";
import { ui } from "../../../i18n/src/ui";
import { messageText } from "../lesson-text";
import type { TopicAdapter } from "../topic";
import { useCalculator } from "../use-calculator";
import type { TopicViewProps } from "../view-contract";
import { CalculatorPanel } from "./calculator";
import { NumText } from "./num-text";
import {
  linearScales,
  roundCanonical,
  significantFractionDigits,
  temperatureScales,
} from "./unit-scale";
import { DualScale, Equation, fillMessage, VizFigure } from "./viz";

/** Shared view of the units-pack converters (length, mass, temperature, …). */
export function UnitPresetTopic({
  adapter,
  ...props
}: TopicViewProps & {
  adapter: TopicAdapter<UnitPresetResult, UnitPresetError>;
}) {
  const { title, description, messages, locale } = props;
  const id = adapter.id;
  const controller = useCalculator({ adapter, locale });
  const text = (key: string) => messageText(messages, `${id}.${key}`);
  const symbol = (unit: string) => text(`symbol.${unit}`);
  /** Six significant figures; the working keeps every digit. */
  const shown = (canonical: string) =>
    formatDecimal(
      roundCanonical(canonical, significantFractionDigits(canonical)),
      locale,
    );
  const answerText = (result: UnitPresetResult) =>
    `${shown(result.answer.value)} ${symbol(result.visual.target)}`;
  return (
    <CalculatorPanel
      title={title}
      description={description}
      topicId={id}
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
          {e.status === "ok" &&
          isRoundedForDisplay(
            e.outcome.result.answer.value,
            significantFractionDigits(e.outcome.result.answer.value),
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
        const v = e.outcome.result.visual;
        const vars = {
          value: shown(v.value),
          source: symbol(v.source),
          answer: shown(v.answer),
          target: symbol(v.target),
          factor: shown(v.slope),
        };
        const temperature = v.kelvin !== undefined;
        const scales = temperature
          ? temperatureScales(v.value, v.source, v.target, v.slope, v.offset)
          : linearScales(v.value, v.slope, v.offset);
        const label = (value: string) => formatDecimal(value, locale);
        const note = temperature
          ? text("visual.note")
          : fillMessage(text("visual.factor"), vars);
        return (
          <VizFigure
            caption={text("visual.caption")}
            summary={fillMessage(text("visual.summary"), vars)}
            note={<NumText text={note} />}
          >
            {scales ? (
              <DualScale
                fraction={scales.fraction}
                top={{
                  unit: vars.source,
                  display: vars.value,
                  ticks: scales.top.map((t) => ({
                    at: t.at,
                    label: label(t.value),
                  })),
                }}
                bottom={{
                  unit: vars.target,
                  display: vars.answer,
                  ticks: scales.bottom.map((t) => ({
                    at: t.at,
                    label: label(t.value),
                  })),
                }}
              />
            ) : (
              <Equation
                items={[
                  { label: vars.source, display: vars.value },
                  { op: "=" },
                  { label: vars.target, display: vars.answer, emphasis: true },
                ]}
              />
            )}
          </VizFigure>
        );
      }}
    />
  );
}
