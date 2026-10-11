import "../../../../design/src/finance.css";
import type {
  CompoundInterestErrorCode,
  CompoundInterestResult,
} from "../../../../calculators/src/compound-interest/index";
import { renderWorkingStep } from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import {
  fillMessage,
  SplitBar,
  StatGrid,
  VizFigure,
} from "../../components/viz";
import type { Evaluation } from "../../evaluate";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { formatUsdCents, withUsdArguments } from "../core-money";
import { adapter as compoundAdapter } from "./adapter";

export type { TopicViewProps };

const moneyArguments = ["principal", "balance", "interest"];
const frequencyPresets = ["1", "2", "4", "12", "365"];

export default function CompoundInterestTopicView(props: TopicViewProps) {
  const { title, description, messages, locale } = props;

  const controller = useCalculator<
    CompoundInterestResult,
    CompoundInterestErrorCode
  >({
    adapter: compoundAdapter,
    locale,
  });

  const operations = compoundAdapter.descriptors.map((descriptor) => ({
    id: descriptor.id,
    label: messageText(messages, descriptor.labelKey),
  }));
  const money = (cents: string | bigint) => formatUsdCents(cents, locale);
  const growth = (res: CompoundInterestResult) => {
    const principal = BigInt(res.principalCents);
    if (principal === 0n) return null;
    const basisPoints = (BigInt(res.interestCents) * 10000n) / principal;
    return `+${(Number(basisPoints) / 100).toLocaleString(locale, {
      maximumFractionDigits: 1,
    })}%`;
  };

  return (
    <CalculatorPanel<CompoundInterestResult, CompoundInterestErrorCode>
      title={title}
      description={description}
      topicId="compound-interest"
      controller={controller}
      operations={operations}
      messages={messages}
      locale={locale}
      getCopyText={(evaluation) =>
        evaluation.status === "ok"
          ? money(evaluation.outcome.result.answer.cents)
          : ""
      }
      extra={
        <div className="oc-finance-extra">
          <fieldset className="oc-finance-presets">
            <legend className="oc-quiet">
              {messageText(messages, "compound-interest.ui.presets")}
            </legend>
            {frequencyPresets.map((value) => (
              <button
                key={value}
                type="button"
                className="oc-finance-chip"
                data-active={controller.drafts.frequency === value}
                aria-pressed={controller.drafts.frequency === value}
                onClick={() => controller.setDraft("frequency", value)}
              >
                {messageText(messages, `compound-interest.frequency.${value}`)}
              </button>
            ))}
          </fieldset>
        </div>
      }
      renderAnswer={(
        evaluation: Evaluation<
          CompoundInterestResult,
          CompoundInterestErrorCode
        >,
      ) => {
        const kicker = messageText(
          messages,
          "compound-interest.ui.final-balance",
        );
        if (evaluation.status !== "ok") {
          return (
            <div className="oc-answer" aria-live="polite">
              <p className="oc-kicker">{kicker}</p>
              <p className="oc-answer-value">
                <span className="oc-answer-empty">{ui["ui.answer.empty"]}</span>
              </p>
            </div>
          );
        }
        const res = evaluation.outcome.result;
        const change = growth(res);
        return (
          <div className="oc-answer" aria-live="polite">
            <p className="oc-kicker">{kicker}</p>
            <p className="oc-answer-value">
              <NumText text={money(res.answer.cents)} />
            </p>
            <StatGrid
              items={[
                {
                  label: messageText(
                    messages,
                    "compound-interest.ui.total-interest",
                  ),
                  display: money(res.interestCents),
                },
                ...(change
                  ? [
                      {
                        label: messageText(
                          messages,
                          "compound-interest.ui.growth",
                        ),
                        display: change,
                      },
                    ]
                  : []),
              ]}
            />
          </div>
        );
      }}
      renderWorking={(
        evaluation: Evaluation<
          CompoundInterestResult,
          CompoundInterestErrorCode
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
                    withUsdArguments(step, moneyArguments, locale),
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
          CompoundInterestResult,
          CompoundInterestErrorCode
        >,
      ) => {
        if (evaluation.status !== "ok") return null;
        const res = evaluation.outcome.result;
        const principalCents = BigInt(res.principalCents);
        const vars = {
          balance: money(res.answer.cents),
          principal: money(res.principalCents),
          interest: money(res.interestCents),
        };
        return (
          <>
            <VizFigure
              caption={messageText(
                messages,
                "compound-interest.visual.caption",
              )}
              summary={fillMessage(
                messageText(messages, "compound-interest.visual.summary"),
                vars,
              )}
            >
              <SplitBar
                total={{
                  label: messageText(
                    messages,
                    "compound-interest.ui.final-balance",
                  ),
                  display: vars.balance,
                }}
                parts={[
                  {
                    label: messageText(
                      messages,
                      "compound-interest.ui.principal",
                    ),
                    value: Number(res.principalCents),
                    display: vars.principal,
                    tone: "soft",
                  },
                  {
                    label: messageText(
                      messages,
                      "compound-interest.ui.total-interest",
                    ),
                    value: Number(res.interestCents),
                    display: vars.interest,
                    tone: "accent",
                  },
                ]}
              />
            </VizFigure>
            <details className="oc-core-schedule">
              <summary className="oc-kicker">
                {messageText(messages, "compound-interest.ui.table.heading")}
              </summary>
              <div className="oc-core-schedule-scroll">
                <table className="oc-table">
                  <thead>
                    <tr>
                      <th scope="col">
                        {messageText(
                          messages,
                          "compound-interest.ui.table.year",
                        )}
                      </th>
                      <th scope="col">
                        {messageText(
                          messages,
                          "compound-interest.ui.table.balance",
                        )}
                      </th>
                      <th scope="col">
                        {messageText(
                          messages,
                          "compound-interest.ui.table.interest",
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {res.annualSeries.map((point) => {
                      const balance = BigInt(point.balanceCents);
                      const interest = balance - principalCents;
                      return (
                        <tr key={point.year}>
                          <td>{point.year}</td>
                          <td>{money(balance)}</td>
                          <td>{money(interest > 0n ? interest : 0n)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </details>
          </>
        );
      }}
    />
  );
}
