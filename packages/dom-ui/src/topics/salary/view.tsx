import type { ErrorCode, Result } from "../../../../calculators/src/salary";
import { fillMessage, StatGrid, VizFigure } from "../../components/viz";
import { messageText } from "../../lesson-text";
import type { TopicViewProps } from "../../view-contract";
import { FinanceTopic, financeFormat } from "../finance-topic";
import { adapter, moneyArgs } from "./adapter";

const PERIODS = ["hourly", "weekly", "monthly", "annual"] as const;

export default function View(props: TopicViewProps) {
  const { messages, locale } = props;
  const f = financeFormat(messages, locale);
  const m = (key: string) => messageText(messages, key);
  return (
    <FinanceTopic<Result, ErrorCode>
      {...props}
      adapter={adapter}
      moneyArgs={moneyArgs}
      digits={2}
      answerText={(r, operation) =>
        fillMessage(m(`salary.answer.value.${operation}`), {
          amount: f.usd(r.answer.value),
        })
      }
      visual={(r, operation) => {
        const v = r.visual;
        const vars = Object.fromEntries(
          PERIODS.map((p) => [p, f.usd(v[p])]),
        ) as Record<(typeof PERIODS)[number], string>;
        const answerPeriod =
          operation === "annual-to-hourly" ? "hourly" : "annual";
        return (
          <VizFigure
            caption={m("salary.visual.caption")}
            summary={fillMessage(m("salary.visual.summary"), vars)}
            note={m("salary.visual.note")}
          >
            <StatGrid
              items={PERIODS.map((p) => ({
                label: m(`salary.visual.${p}`),
                display: vars[p],
                emphasis: p === answerPeriod,
              }))}
            />
          </VizFigure>
        );
      }}
    />
  );
}
