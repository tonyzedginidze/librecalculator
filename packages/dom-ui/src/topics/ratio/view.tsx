import { NumericTopic } from "../../components/numeric-topic";
import { Equation, fillMessage, VizFigure } from "../../components/viz";
import { messageText } from "../../lesson-text";
import type { TopicViewProps } from "../../view-contract";
import { adapter } from "./adapter";

/** A ratio value reads best with up to four decimals; scaled amounts with three. */
const digitsFor = (operationId: string) => (operationId === "quotient" ? 4 : 3);

export default function View(props: TopicViewProps) {
  return (
    <NumericTopic
      {...props}
      adapter={adapter}
      fractionDigits={digitsFor}
      visual={({ result, operationId, show, messages }) => {
        const text = (key: string) => messageText(messages, key);
        const row = (id: string) =>
          result.visual.rows.find((r) => r.labelKey === `ratio.field.${id}`)
            ?.value ?? "0";
        const vars = {
          first: show(row("first")),
          second: show(row("second")),
          target: show(row("target")),
          answer: show(result.answer.value),
        };
        const colon = { op: text("ratio.visual.colon") };
        const equals = { op: text("ratio.visual.equals") };
        const quotient = operationId === "quotient";
        return (
          <VizFigure
            caption={text("ratio.visual.caption")}
            summary={fillMessage(
              text(
                quotient
                  ? "ratio.visual.summaryQuotient"
                  : "ratio.visual.summaryScale",
              ),
              vars,
            )}
          >
            <Equation
              items={
                quotient
                  ? [
                      {
                        label: text("ratio.visual.first"),
                        display: vars.first,
                      },
                      colon,
                      {
                        label: text("ratio.visual.second"),
                        display: vars.second,
                      },
                      equals,
                      {
                        label: text("ratio.visual.value"),
                        display: vars.answer,
                        emphasis: true,
                      },
                      colon,
                      { label: text("ratio.visual.unit"), display: show("1") },
                    ]
                  : [
                      {
                        label: text("ratio.visual.first"),
                        display: vars.first,
                      },
                      colon,
                      {
                        label: text("ratio.visual.second"),
                        display: vars.second,
                      },
                      equals,
                      {
                        label: text("ratio.visual.newFirst"),
                        display: vars.target,
                      },
                      colon,
                      {
                        label: text("ratio.visual.newSecond"),
                        display: vars.answer,
                        emphasis: true,
                      },
                    ]
              }
            />
          </VizFigure>
        );
      }}
    />
  );
}
