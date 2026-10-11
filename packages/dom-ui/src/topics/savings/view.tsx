import type { ErrorCode, Result } from "../../../../calculators/src/savings";
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
          deposits: f.usd(v.deposits),
          interest: f.usd(v.interest),
        };
        return (
          <VizFigure
            caption={m("savings.visual.caption")}
            summary={fillMessage(m("savings.visual.summary"), vars)}
            note={m("savings.visual.note")}
          >
            <SplitBar
              total={{ label: m("savings.visual.total"), display: vars.answer }}
              parts={[
                {
                  label: m("savings.visual.starting"),
                  value: Number(v.starting),
                  display: vars.starting,
                  tone: "muted",
                },
                {
                  label: m("savings.visual.deposits"),
                  value: Number(v.deposits),
                  display: vars.deposits,
                  tone: "soft",
                },
                {
                  label: m("savings.visual.interest"),
                  value: Number(v.interest),
                  display: vars.interest,
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
