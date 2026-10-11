import { formatDecimal } from "../../../../i18n/src/en";
import { NumericTopic } from "../../components/numeric-topic";
import { fillMessage, NumberLine, VizFigure } from "../../components/viz";
import { messageText } from "../../lesson-text";
import type { TopicViewProps } from "../../view-contract";
import { niceScale } from "../math-everyday-viz";
import { adapter } from "./adapter";

export default function View(props: TopicViewProps) {
  return (
    <NumericTopic
      {...props}
      adapter={adapter}
      fractionDigits={0}
      visual={({ result, show, messages, locale }) => {
        const text = (key: string) => messageText(messages, key);
        const row = (id: string) =>
          result.visual.rows.find(
            (r) => r.labelKey === `random-number.field.${id}`,
          )?.value ?? "0";
        const minimum = row("minimum");
        const maximum = row("maximum");
        const lo = Number(minimum);
        const hi = Number(maximum);
        const size = BigInt(maximum) - BigInt(minimum) + 1n;
        // Every whole number for short ranges, otherwise the ends plus round
        // interior ticks that keep clear of them.
        const inner = niceScale([lo, hi], locale).ticks.filter(
          (t) =>
            t.value - lo > (hi - lo) * 0.08 && hi - t.value > (hi - lo) * 0.08,
        );
        const tickValues =
          size <= 11n
            ? Array.from({ length: Number(size) }, (_, i) => lo + i)
            : [lo, ...inner.map((t) => t.value), hi];
        const vars = {
          answer: show(result.answer.value),
          minimum: show(minimum),
          maximum: show(maximum),
          count: formatDecimal(size.toString(), locale),
        };
        return (
          <VizFigure
            caption={text("random-number.visual.caption")}
            summary={fillMessage(text("random-number.visual.summary"), vars)}
            note={fillMessage(text("random-number.visual.range"), vars)}
          >
            <NumberLine
              min={lo === hi ? lo - 1 : lo}
              max={lo === hi ? hi + 1 : hi}
              ticks={[...new Set(tickValues)].map((value) => ({
                value,
                label: formatDecimal(String(value), locale),
              }))}
              markers={[
                {
                  value: Number(result.answer.value),
                  label: text("random-number.visual.pick"),
                  display: vars.answer,
                },
              ]}
            />
          </VizFigure>
        );
      }}
    />
  );
}
