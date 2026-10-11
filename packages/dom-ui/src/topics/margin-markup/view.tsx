import type {
  ErrorCode,
  Result,
} from "../../../../calculators/src/margin-markup";
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
      answerText={(r) => f.percent(r.answer.value)}
      visual={(r, operation) => {
        const v = r.visual;
        const loss = v.profit.startsWith("-");
        const vars = {
          answer: f.percent(v.answer),
          cost: f.usd(v.cost),
          price: f.usd(v.price),
          profit: f.usd(v.profit.replace(/^-/, "")),
        };
        // A sale above cost splits the price into cost and profit; a sale below
        // cost splits the cost into the price received and the loss.
        const parts = loss
          ? [
              {
                label: m("margin-markup.visual.price"),
                value: Number(v.price),
                display: vars.price,
                tone: "soft" as const,
              },
              {
                label: m("margin-markup.visual.loss"),
                value: -Number(v.profit),
                display: vars.profit,
                tone: "negative" as const,
              },
            ]
          : [
              {
                label: m("margin-markup.visual.cost"),
                value: Number(v.cost),
                display: vars.cost,
                tone: "soft" as const,
              },
              {
                label: m("margin-markup.visual.profit"),
                value: Number(v.profit),
                display: vars.profit,
                tone: "accent" as const,
              },
            ];
        const key = loss ? "loss" : operation;
        return (
          <VizFigure
            caption={m(`margin-markup.visual.caption.${key}`)}
            summary={fillMessage(
              m(`margin-markup.visual.summary.${key}`),
              vars,
            )}
            note={m("margin-markup.visual.note")}
          >
            <SplitBar
              total={{
                label: m(
                  loss
                    ? "margin-markup.visual.cost"
                    : "margin-markup.visual.price",
                ),
                display: loss ? vars.cost : vars.price,
              }}
              parts={parts}
            />
          </VizFigure>
        );
      }}
    />
  );
}
