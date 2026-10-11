import type { ReactNode } from "react";
import type {
  NumericError,
  NumericResult,
} from "../../../calculators/src/runtime/numeric-result";
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
export type NumericVisualContext = {
  result: NumericResult;
  operationId: string;
  unit: string;
  /** Formats a canonical decimal at the answer's display precision. */
  show: (value: string) => string;
  messages: Readonly<Record<string, string>>;
  locale: string;
};

/**
 * Shared view for single-answer numeric engines. `fractionDigits` sets answer display
 * precision per operation; `visual` replaces the default number line with a diagram
 * built from the same result (components/viz).
 */
export function NumericTopic({
  adapter,
  fractionDigits,
  visual: renderCustomVisual,
  ...props
}: TopicViewProps & {
  adapter: TopicAdapter<NumericResult, NumericError>;
  fractionDigits?: number | ((operationId: string) => number | undefined);
  visual?: (context: NumericVisualContext) => ReactNode;
}) {
  const { title, description, messages, locale } = props;
  const controller = useCalculator({ adapter, locale });
  const unitKey = `${adapter.id}.unit.${controller.operationId}`;
  const unit = unitKey in messages ? messageText(messages, unitKey) : "";
  const digits =
    typeof fractionDigits === "function"
      ? fractionDigits(controller.operationId)
      : fractionDigits;
  const show = (value: string) =>
    formatDecimal(value, locale, { fractionDigits: digits });
  const answerText = (result: NumericResult) =>
    [show(result.answer.value), unit].filter(Boolean).join(" ");
  return (
    <CalculatorPanel
      title={title}
      description={description}
      topicId={adapter.id}
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
          <div className="oc-answer-scroll">
            <p className="oc-answer-value">
              {e.status === "ok" ? (
                <NumText text={answerText(e.outcome.result)} />
              ) : (
                ui["ui.answer.empty"]
              )}
            </p>
          </div>
          {e.status === "ok" &&
          digits !== undefined &&
          isRoundedForDisplay(e.outcome.result.answer.value, digits) ? (
            <p>{ui["ui.answer.rounded"]}</p>
          ) : null}
        </div>
      )}
      renderWorking={(e) =>
        e.status !== "ok" ? null : (
          <div className="oc-working">
            <h2 className="oc-kicker">{ui["ui.working.heading"]}</h2>
            {e.outcome.result.working.map((s) => (
              <p key={s.id}>
                <NumText text={renderWorkingStep(s, { locale, messages })} />
              </p>
            ))}
          </div>
        )
      }
      renderVisual={(e) => {
        if (e.status !== "ok") return null;
        if (renderCustomVisual)
          return renderCustomVisual({
            result: e.outcome.result,
            operationId: controller.operationId,
            unit,
            show,
            messages,
            locale,
          });
        const visual = e.outcome.result.visual;
        const marker = 30 + Number(visual.numberLine.fraction) * 260;
        return (
          <figure className="oc-bar">
            <figcaption className="oc-kicker">
              {ui["ui.visual.caption"]}
            </figcaption>
            <svg viewBox="0 0 320 80" aria-hidden="true">
              <path
                d="M30 32H290M160 24v16"
                stroke="var(--oc-line)"
                strokeWidth="3"
              />
              <circle cx={marker} cy="32" r="7" fill="var(--oc-accent)" />
              <text x="160" y="61" textAnchor="middle" fill="var(--oc-ink)">
                {formatDecimal("0", locale)}
              </text>
            </svg>
            <p>
              <NumText
                text={[
                  formatDecimal(visual.numberLine.minimum, locale),
                  formatDecimal(visual.numberLine.maximum, locale),
                ].join(" … ")}
              />
              {unit ? ` ${unit}` : ""}
            </p>
            <p className="oc-sr-only">
              {messageText(messages, `${adapter.id}.visual.alternative`)}
            </p>
            <table>
              <tbody>
                {visual.rows.map((r) => (
                  <tr key={r.labelKey}>
                    <th scope="row">{messageText(messages, r.labelKey)}</th>
                    <td>
                      <NumText text={formatDecimal(r.value, locale)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </figure>
        );
      }}
    />
  );
}
