import type {
  NumericError,
  NumericResult,
} from "../../../../calculators/src/runtime/numeric-result";
import {
  formatDecimal,
  isRoundedForDisplay,
  renderWorkingStep,
} from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import { fillMessage, NumberLine, VizFigure } from "../../components/viz";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { adapter } from "./adapter";

const DIGITS = 3;

function parts(result: NumericResult) {
  const row = (key: string) =>
    result.visual.rows.find((r) => r.labelKey.endsWith(`.field.${key}`))
      ?.value ?? "0";
  return {
    mean: row("mean"),
    lower: row("lower"),
    upper: row("upper"),
    margin: result.answer.value,
  };
}

export default function View({
  title,
  description,
  messages,
  locale,
}: TopicViewProps) {
  const controller = useCalculator<NumericResult, NumericError>({
    adapter,
    locale,
  });
  const shown = (value: string) =>
    formatDecimal(value, locale, { fractionDigits: DIGITS });
  const texts = (result: NumericResult) => {
    const p = parts(result);
    const vars = {
      mean: shown(p.mean),
      lower: shown(p.lower),
      upper: shown(p.upper),
      margin: shown(p.margin),
    };
    return {
      vars,
      range: fillMessage(
        messageText(messages, "confidence-interval.answer.range"),
        vars,
      ),
      margin: fillMessage(
        messageText(messages, "confidence-interval.answer.margin"),
        vars,
      ),
    };
  };
  return (
    <CalculatorPanel<NumericResult, NumericError>
      topicId="confidence-interval"
      title={title}
      description={description}
      controller={controller}
      operations={adapter.descriptors.map((d) => ({
        id: d.id,
        label: messageText(messages, d.labelKey),
      }))}
      messages={messages}
      locale={locale}
      getCopyText={(e) =>
        e.status === "ok" ? texts(e.outcome.result).range : ""
      }
      renderAnswer={(e) => {
        const t = e.status === "ok" ? texts(e.outcome.result) : null;
        const p = e.status === "ok" ? parts(e.outcome.result) : null;
        return (
          <div className="oc-answer" aria-live="polite">
            <p className="oc-kicker">{ui["ui.answer.label"]}</p>
            <div className="oc-answer-scroll">
              <p className="oc-answer-value">
                {t ? <NumText text={t.range} /> : ui["ui.answer.empty"]}
              </p>
            </div>
            {t ? (
              <p>
                <NumText text={t.margin} />
              </p>
            ) : null}
            {p &&
            [p.lower, p.upper, p.margin].some((v) =>
              isRoundedForDisplay(v, DIGITS),
            ) ? (
              <p>{ui["ui.answer.rounded"]}</p>
            ) : null}
          </div>
        );
      }}
      renderWorking={(e) =>
        e.status === "ok" ? (
          <div className="oc-working">
            <h2 className="oc-kicker">{ui["ui.working.heading"]}</h2>
            {e.outcome.result.working.map((s) => (
              <p key={s.id}>
                <NumText text={renderWorkingStep(s, { locale, messages })} />
              </p>
            ))}
          </div>
        ) : null
      }
      renderVisual={(e) => {
        if (e.status !== "ok") return null;
        const p = parts(e.outcome.result);
        const { vars } = texts(e.outcome.result);
        const lower = Number(p.lower);
        const upper = Number(p.upper);
        const pad = (upper - lower) * 0.35 || 1;
        return (
          <VizFigure
            caption={messageText(
              messages,
              "confidence-interval.visual.caption",
            )}
            summary={fillMessage(
              messageText(messages, "confidence-interval.visual.summary"),
              vars,
            )}
          >
            <NumberLine
              min={lower - pad}
              max={upper + pad}
              markers={[
                {
                  value: lower,
                  label: messageText(
                    messages,
                    "confidence-interval.visual.lower",
                  ),
                  display: vars.lower,
                  tone: "ink",
                },
                {
                  value: Number(p.mean),
                  label: messageText(
                    messages,
                    "confidence-interval.visual.mean",
                  ),
                  display: vars.mean,
                  tone: "accent",
                },
                {
                  value: upper,
                  label: messageText(
                    messages,
                    "confidence-interval.visual.upper",
                  ),
                  display: vars.upper,
                  tone: "ink",
                },
              ]}
              range={{
                from: lower,
                to: upper,
                label: fillMessage(
                  messageText(messages, "confidence-interval.visual.range"),
                  vars,
                ),
              }}
            />
          </VizFigure>
        );
      }}
    />
  );
}
