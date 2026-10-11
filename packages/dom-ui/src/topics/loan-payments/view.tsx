import "../../../../design/src/finance.css";
import type {
  LoanPaymentErrorCode,
  LoanPaymentResult,
} from "../../../../calculators/src/loan-payments/index";
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
import { adapter as loanAdapter } from "./adapter";

export type { TopicViewProps };

const moneyArguments = ["principal", "payment", "finalPayment", "interest"];

export default function LoanPaymentTopicView(props: TopicViewProps) {
  const { title, description, messages, locale } = props;

  const controller = useCalculator<LoanPaymentResult, LoanPaymentErrorCode>({
    adapter: loanAdapter,
    locale,
  });

  const operations = loanAdapter.descriptors.map((descriptor) => ({
    id: descriptor.id,
    label: messageText(messages, descriptor.labelKey),
  }));
  const money = (cents: string) => formatUsdCents(cents, locale);
  const label = (key: string) => messageText(messages, key);

  return (
    <CalculatorPanel<LoanPaymentResult, LoanPaymentErrorCode>
      title={title}
      description={description}
      topicId="loan-payments"
      controller={controller}
      operations={operations}
      messages={messages}
      locale={locale}
      getCopyText={(evaluation) =>
        evaluation.status === "ok"
          ? money(evaluation.outcome.result.regularPaymentCents)
          : ""
      }
      extra={
        <p className="oc-finance-disclosure" role="note">
          {label("loan-payments.ui.apr-disclosure")}
        </p>
      }
      renderAnswer={(
        evaluation: Evaluation<LoanPaymentResult, LoanPaymentErrorCode>,
      ) => {
        const kicker = label("loan-payments.ui.regular-payment");
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
        return (
          <div className="oc-answer" aria-live="polite">
            <p className="oc-kicker">{kicker}</p>
            <p className="oc-answer-value">
              <NumText text={money(res.regularPaymentCents)} />
            </p>
            <StatGrid
              items={[
                {
                  label: label("loan-payments.ui.final-payment"),
                  display: money(res.finalPaymentCents),
                },
                {
                  label: label("loan-payments.ui.total-interest"),
                  display: money(res.totalInterestCents),
                },
              ]}
            />
          </div>
        );
      }}
      renderWorking={(
        evaluation: Evaluation<LoanPaymentResult, LoanPaymentErrorCode>,
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
        evaluation: Evaluation<LoanPaymentResult, LoanPaymentErrorCode>,
      ) => {
        if (evaluation.status !== "ok") return null;
        const res = evaluation.outcome.result;
        const vars = {
          total: money(res.answer.cents),
          principal: money(res.principalCents),
          interest: money(res.totalInterestCents),
        };
        return (
          <>
            <VizFigure
              caption={label("loan-payments.visual.caption")}
              summary={fillMessage(label("loan-payments.visual.summary"), vars)}
            >
              <SplitBar
                total={{
                  label: label("loan-payments.ui.total-paid"),
                  display: vars.total,
                }}
                parts={[
                  {
                    label: label("loan-payments.ui.principal"),
                    value: Number(res.principalCents),
                    display: vars.principal,
                    tone: "soft",
                  },
                  {
                    label: label("loan-payments.ui.total-interest"),
                    value: Number(res.totalInterestCents),
                    display: vars.interest,
                    tone: "accent",
                  },
                ]}
              />
            </VizFigure>
            <details className="oc-core-schedule">
              <summary className="oc-kicker">
                {fillMessage(label("loan-payments.ui.schedule.heading"), {
                  count: String(res.schedule.length),
                })}
              </summary>
              <div className="oc-core-schedule-scroll">
                <table className="oc-table">
                  <thead>
                    <tr>
                      <th scope="col">
                        {label("loan-payments.ui.schedule.month")}
                      </th>
                      <th scope="col">
                        {label("loan-payments.ui.schedule.payment")}
                      </th>
                      <th scope="col">
                        {label("loan-payments.ui.schedule.interest")}
                      </th>
                      <th scope="col">
                        {label("loan-payments.ui.schedule.principal")}
                      </th>
                      <th scope="col">
                        {label("loan-payments.ui.schedule.balance")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {res.schedule.map((row) => (
                      <tr key={row.month}>
                        <td>{row.month}</td>
                        <td>{money(row.paymentCents)}</td>
                        <td>{money(row.interestCents)}</td>
                        <td>{money(row.principalCents)}</td>
                        <td>{money(row.balanceCents)}</td>
                      </tr>
                    ))}
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
