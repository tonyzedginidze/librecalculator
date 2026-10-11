import { renderWorkingStep } from "../../../../i18n/src/en";
import { NumericTopic } from "../../components/numeric-topic";
import { Equation, fillMessage, VizFigure } from "../../components/viz";
import { messageText } from "../../lesson-text";
import type { TopicViewProps } from "../../view-contract";
import { adapter } from "./adapter";

/** Ten decimals: enough for √2 or ln 10 to be useful, still readable. */
const DIGITS = 10;

export default function View(props: TopicViewProps) {
  return (
    <NumericTopic
      {...props}
      adapter={adapter}
      fractionDigits={DIGITS}
      visual={({ result, operationId, show, messages, locale }) => {
        const text = (key: string) => messageText(messages, key);
        const row = (id: string) =>
          result.visual.rows.find(
            (r) => r.labelKey === `scientific.field.${id}`,
          )?.value ?? "0";
        const value = show(row("value"));
        const op = (key: string) => ({ op: text(`scientific.visual.${key}`) });
        const term = (key: string, display: string) => ({
          label: text(`scientific.visual.${key}`),
          display,
        });
        const answer = {
          ...term("result", show(result.answer.value)),
          emphasis: true,
        };
        const items =
          operationId === "square-root"
            ? [op("sqrt"), term("number", value)]
            : operationId === "integer-power"
              ? [
                  term("base", value),
                  op("power"),
                  term("exponent", show(row("exponent"))),
                ]
              : operationId === "natural-log"
                ? [op("ln"), term("number", value)]
                : [
                    op("sin"),
                    term(
                      "angle",
                      fillMessage(text("scientific.visual.degrees"), { value }),
                    ),
                  ];
        const step = result.working[0];
        return (
          <VizFigure
            caption={text("scientific.visual.caption")}
            summary={step ? renderWorkingStep(step, { locale, messages }) : ""}
          >
            <Equation items={[...items, op("equals"), answer]} />
          </VizFigure>
        );
      }}
    />
  );
}
