import type { ErrorCode, Result } from "../../../../calculators/src/inflation";
import { formatDecimal } from "../../../../i18n/src/en";
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
      answerText={(r) => f.usd(r.answer.value)}
      visual={(r, operation) => {
        const v = r.visual;
        const vars = {
          amount: f.usd(v.reference),
          answer: f.usd(v.answer),
          years: formatDecimal(v.years, locale),
        };
        const label = (key: string) =>
          fillMessage(m(`inflation.visual.${operation}.${key}`), vars);
        return (
          <VizFigure
            caption={label("caption")}
            summary={label("summary")}
            note={m("inflation.visual.note")}
          >
            <CompareBars
              rows={[
                {
                  label: label("before"),
                  value: Number(v.reference),
                  display: vars.amount,
                  tone: "soft",
                },
                {
                  label: label("after"),
                  value: Number(v.answer),
                  display: vars.answer,
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
