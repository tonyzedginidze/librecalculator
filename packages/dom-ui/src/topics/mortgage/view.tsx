import "../../../../design/src/finance.css";
import type {
  MortgageErrorCode,
  MortgageResult,
} from "../../../../calculators/src/mortgage/index";
import { usdCentsToString } from "../../../../calculators/src/numeric/money";
import { formatDecimal } from "../../../../i18n/src/en";
import { ui } from "../../../../i18n/src/ui";
import { CalculatorPanel } from "../../components/calculator";
import { NumText } from "../../components/num-text";
import {
  fillMessage,
  SplitBar,
  StatGrid,
  VizFigure,
} from "../../components/viz";
import { messageText } from "../../lesson-text";
import { useCalculator } from "../../use-calculator";
import type { TopicViewProps } from "../../view-contract";
import { financeFormat, renderFinanceWorking } from "../finance-format";
import { adapter, moneyArgs } from "./adapter";

export default function MortgageView(props: TopicViewProps) {
  const { title, description, messages, locale } = props;
  const controller = useCalculator<MortgageResult, MortgageErrorCode>({
    adapter,
    locale,
  });
  const f = financeFormat(messages, locale);
  const m = (key: string) => messageText(messages, key);
  const cents = (value: string) => f.usd(usdCentsToString(BigInt(value)));
  return (
    <CalculatorPanel<MortgageResult, MortgageErrorCode>
      title={title}
      description={description}
      topicId="mortgage"
      controller={controller}
      operations={adapter.descriptors.map((d) => ({
        id: d.id,
        label: m(d.labelKey),
      }))}
      messages={messages}
      locale={locale}
      getCopyText={(e) =>
        e.status === "ok" ? cents(e.outcome.result.totalMonthlyCents) : ""
      }
      extra={
        <p className="oc-finance-disclosure" role="note">
          {m("mortgage.ui.apr-disclosure")}
        </p>
      }
      renderAnswer={(e) => {
        if (e.status !== "ok")
          return (
            <div className="oc-answer" aria-live="polite">
              <p className="oc-kicker">{ui["ui.answer.label"]}</p>
              <p className="oc-answer-value">{ui["ui.answer.empty"]}</p>
            </div>
          );
        const r = e.outcome.result;
        const payoff = fillMessage(m("mortgage.ui.term.years"), {
          years: formatDecimal(String(r.years), locale),
        });
        return (
          <div className="oc-answer" aria-live="polite">
            <p className="oc-kicker">
              {m(
                r.hasMonthlyCosts
                  ? "mortgage.ui.total-monthly"
                  : "mortgage.ui.regular-payment",
              )}
            </p>
            <div className="oc-answer-scroll">
              <p className="oc-answer-value">
                <NumText text={cents(r.totalMonthlyCents)} />
              </p>
            </div>
            <div className="oc-fin-answer-stats">
              <StatGrid
                items={[
                  ...(r.hasMonthlyCosts
                    ? [
                        {
                          label: m("mortgage.ui.principal-interest"),
                          display: cents(r.regularPaymentCents),
                        },
                      ]
                    : []),
                  {
                    label: m("mortgage.ui.loan-amount"),
                    display: fillMessage(m("mortgage.ui.loan-amount.value"), {
                      loan: cents(r.principalCents),
                      percent: f.percent(r.downPaymentPercent),
                    }),
                  },
                  {
                    label: m("mortgage.ui.total-interest"),
                    display: cents(r.totalInterestCents),
                  },
                  {
                    label: m("mortgage.ui.total-paid"),
                    display: cents(r.totalPaidCents),
                  },
                  ...(r.finalPaymentCents !== r.regularPaymentCents
                    ? [
                        {
                          label: m("mortgage.ui.final-payment"),
                          display: cents(r.finalPaymentCents),
                        },
                      ]
                    : []),
                  { label: m("mortgage.ui.term"), display: payoff },
                ]}
              />
            </div>
          </div>
        );
      }}
      renderWorking={(e) =>
        e.status === "ok" ? (
          <div className="oc-working">
            <h2 className="oc-kicker">{ui["ui.working.heading"]}</h2>
            {e.outcome.result.working.map((s) => (
              <p key={s.id}>
                <NumText
                  text={renderFinanceWorking(s, moneyArgs, messages, locale)}
                />
              </p>
            ))}
          </div>
        ) : null
      }
      renderVisual={(e) => {
        if (e.status !== "ok") return null;
        const r = e.outcome.result;
        const vars = {
          principal: cents(r.principalCents),
          interest: cents(r.totalInterestCents),
          total: cents(r.totalPaidCents),
        };
        const monthly = {
          payment: cents(r.regularPaymentCents),
          tax: cents(r.monthlyPropertyTaxCents),
          insurance: cents(r.monthlyInsuranceCents),
          hoa: cents(r.monthlyHoaCents),
          total: cents(r.totalMonthlyCents),
        };
        return (
          <>
            {r.hasMonthlyCosts ? (
              <VizFigure
                caption={m("mortgage.visual.monthly.caption")}
                summary={fillMessage(
                  m("mortgage.visual.monthly.summary"),
                  monthly,
                )}
              >
                <SplitBar
                  total={{
                    label: m("mortgage.ui.total-monthly"),
                    display: monthly.total,
                  }}
                  parts={[
                    {
                      label: m("mortgage.ui.principal-interest"),
                      value: Number(r.regularPaymentCents),
                      display: monthly.payment,
                      tone: "accent" as const,
                    },
                    {
                      label: m("mortgage.visual.monthly.tax"),
                      value: Number(r.monthlyPropertyTaxCents),
                      display: monthly.tax,
                      tone: "soft" as const,
                    },
                    {
                      label: m("mortgage.visual.monthly.insurance"),
                      value: Number(r.monthlyInsuranceCents),
                      display: monthly.insurance,
                      tone: "ink" as const,
                    },
                    {
                      label: m("mortgage.visual.monthly.hoa"),
                      value: Number(r.monthlyHoaCents),
                      display: monthly.hoa,
                      tone: "muted" as const,
                    },
                  ].filter((part, index) => index === 0 || part.value > 0)}
                />
              </VizFigure>
            ) : null}
            <VizFigure
              caption={m("mortgage.visual.caption")}
              summary={fillMessage(m("mortgage.visual.summary"), vars)}
            >
              <SplitBar
                total={{
                  label: m("mortgage.ui.total-paid"),
                  display: vars.total,
                }}
                parts={[
                  {
                    label: m("mortgage.visual.principal"),
                    value: Number(r.principalCents),
                    display: vars.principal,
                    tone: "soft",
                  },
                  {
                    label: m("mortgage.visual.interest"),
                    value: Number(r.totalInterestCents),
                    display: vars.interest,
                    tone: "accent",
                  },
                ]}
              />
            </VizFigure>
            <details className="oc-fin-schedule">
              <summary>
                {fillMessage(m("mortgage.ui.schedule.heading"), {
                  years: formatDecimal(String(r.yearly.length), locale),
                })}
              </summary>
              <div className="oc-fin-schedule-scroll">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">{m("mortgage.ui.schedule.year")}</th>
                      <th scope="col">{m("mortgage.ui.schedule.interest")}</th>
                      <th scope="col">{m("mortgage.ui.schedule.principal")}</th>
                      <th scope="col">{m("mortgage.ui.schedule.balance")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.yearly.map((y) => (
                      <tr key={y.year}>
                        <th scope="row">
                          <NumText
                            text={formatDecimal(String(y.year), locale)}
                          />
                        </th>
                        <td>
                          <NumText text={cents(y.interestCents)} />
                        </td>
                        <td>
                          <NumText text={cents(y.principalCents)} />
                        </td>
                        <td>
                          <NumText text={cents(y.balanceCents)} />
                        </td>
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
