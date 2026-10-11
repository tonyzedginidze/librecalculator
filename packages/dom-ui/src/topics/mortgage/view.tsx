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
        e.status === "ok" ? cents(e.outcome.result.regularPaymentCents) : ""
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
        const years = r.schedule.length / 12;
        return (
          <div className="oc-answer" aria-live="polite">
            <p className="oc-kicker">{m("mortgage.ui.regular-payment")}</p>
            <div className="oc-answer-scroll">
              <p className="oc-answer-value">
                <NumText text={cents(r.regularPaymentCents)} />
              </p>
            </div>
            <div className="oc-fin-answer-stats">
              <StatGrid
                items={[
                  {
                    label: m("mortgage.ui.total-interest"),
                    display: cents(r.totalInterestCents),
                  },
                  {
                    label: m("mortgage.ui.total-paid"),
                    display: cents(r.answer.cents),
                  },
                  {
                    label: m("mortgage.ui.final-payment"),
                    display: cents(r.finalPaymentCents),
                  },
                  {
                    label: m("mortgage.ui.term"),
                    display: fillMessage(
                      m(
                        Number.isInteger(years)
                          ? "mortgage.ui.term.years"
                          : "mortgage.ui.term.months",
                      ),
                      {
                        years: formatDecimal(String(years), locale),
                        months: formatDecimal(
                          String(r.schedule.length),
                          locale,
                        ),
                      },
                    ),
                  },
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
          total: cents(r.answer.cents),
        };
        return (
          <>
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
                  years: formatDecimal(String(r.years.length), locale),
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
                    {r.years.map((y) => (
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
