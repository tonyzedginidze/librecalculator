import type { ErrorCode, Result } from "../../../../calculators/src/retirement";
import { fillMessage, SplitBar, VizFigure } from "../../components/viz";
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
      answerText={(r) => f.usd(r.answer.value)}
      visual={(r) => {
        const v = r.visual;
        const vars = {
          answer: f.usd(v.answer),
          starting: f.usd(v.starting),
          contributions: f.usd(v.contributions),
          growth: f.usd(v.growth),
        };
        return (
          <VizFigure
            caption={m("retirement.visual.caption")}
            summary={fillMessage(m("retirement.visual.summary"), vars)}
            note={m("retirement.visual.note")}
          >
            <SplitBar
              total={{
                label: m("retirement.visual.total"),
                display: vars.answer,
              }}
              parts={[
                {
                  label: m("retirement.visual.starting"),
                  value: Number(v.starting),
                  display: vars.starting,
                  tone: "muted",
                },
                {
                  label: m("retirement.visual.contributions"),
                  value: Number(v.contributions),
                  display: vars.contributions,
                  tone: "soft",
                },
                {
                  label: m("retirement.visual.growth"),
                  value: Number(v.growth),
                  display: vars.growth,
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
