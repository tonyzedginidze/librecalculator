import type { ReactNode } from "react";
import type { WorkingStep } from "../../../calculators/src/contracts";
import { isRoundedForDisplay } from "../../../i18n/src/en";
import { ui } from "../../../i18n/src/ui";
import { CalculatorPanel } from "../components/calculator";
import { NumText } from "../components/num-text";
import { messageText } from "../lesson-text";
import type { TopicAdapter } from "../topic";
import { useCalculator } from "../use-calculator";
import type { TopicViewProps } from "../view-contract";
import { renderFinanceWorking } from "./finance-format";

type FinanceResult = {
  answer: { value: string };
  working: readonly WorkingStep[];
};

/**
 * Shared page for the finance pack's single-answer engines: one answer line, the
 * engine's working, and one diagram built from the same result.
 */
export function FinanceTopic<R extends FinanceResult, Code extends string>(
  props: TopicViewProps & {
    adapter: TopicAdapter<R, Code>;
    answerText: (result: R, operationId: string) => string;
    /** Working arguments that are whole-cent dollar amounts. */
    moneyArgs: readonly string[];
    /** Display precision of the answer, for the "rounded for display" note. */
    digits: number;
    visual: (result: R, operationId: string) => ReactNode;
  },
) {
  const { title, description, messages, locale, adapter } = props;
  const controller = useCalculator<R, Code>({ adapter, locale });
  return (
    <CalculatorPanel<R, Code>
      topicId={adapter.id}
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
        e.status === "ok"
          ? props.answerText(e.outcome.result, controller.operationId)
          : ""
      }
      renderAnswer={(e) => (
        <div className="oc-answer" aria-live="polite">
          <p className="oc-kicker">
            {e.status === "ok"
              ? messageText(
                  messages,
                  `${adapter.id}.answer.${controller.operationId}`,
                )
              : ui["ui.answer.label"]}
          </p>
          <div className="oc-answer-scroll">
            <p className="oc-answer-value">
              {e.status === "ok" ? (
                <NumText
                  text={props.answerText(
                    e.outcome.result,
                    controller.operationId,
                  )}
                />
              ) : (
                ui["ui.answer.empty"]
              )}
            </p>
          </div>
          {e.status === "ok" &&
          isRoundedForDisplay(e.outcome.result.answer.value, props.digits) ? (
            <p>{ui["ui.answer.rounded"]}</p>
          ) : null}
        </div>
      )}
      renderWorking={(e) =>
        e.status === "ok" ? (
          <div className="oc-working">
            <h2 className="oc-kicker">{ui["ui.working.heading"]}</h2>
            {e.outcome.result.working.map((s) => (
              <p key={s.id}>
                <NumText
                  text={renderFinanceWorking(
                    s,
                    props.moneyArgs,
                    messages,
                    locale,
                  )}
                />
              </p>
            ))}
          </div>
        ) : null
      }
      renderVisual={(e) =>
        e.status === "ok"
          ? props.visual(e.outcome.result, controller.operationId)
          : null
      }
    />
  );
}

export { financeFormat } from "./finance-format";
