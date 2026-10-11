import type { ErrorCode, Result } from "../../../../calculators/src/roi";
import { CompareBars, fillMessage, VizFigure } from "../../components/viz";
import { messageText } from "../../lesson-text";
import type { TopicViewProps } from "../../view-contract";
import { FinanceTopic, financeFormat } from "../finance-topic";
import { adapter, moneyArgs } from "./adapter";

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
      answerText={(r) => f.percent(r.answer.value)}
      visual={(r) => {
        const v = r.visual;
        const loss = v.profit.startsWith("-");
        const vars = {
          answer: f.percent(v.answer),
          investment: f.usd(v.investment),
          net: f.usd(v.netProceeds),
          profit: f.usd(v.profit),
        };
        return (
          <VizFigure
            caption={m("roi.visual.caption")}
            summary={fillMessage(m("roi.visual.summary"), vars)}
            note={m("roi.visual.note")}
          >
            <CompareBars
              rows={[
                {
                  label: m("roi.visual.investment"),
                  value: Number(v.investment),
                  display: vars.investment,
                  tone: "soft",
                },
                {
                  label: m("roi.visual.net"),
                  value: Number(v.netProceeds),
                  display: vars.net,
                  tone: "soft",
                },
                {
                  label: m(loss ? "roi.visual.loss" : "roi.visual.profit"),
                  value: Number(v.profit),
                  display: vars.profit,
                  tone: "accent",
                },
              ]}
            />
          </VizFigure>
        );
      }}
    />
  );
}
