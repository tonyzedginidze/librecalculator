import { DecimalValue } from "../../../../calculators/src/numeric/decimal";
import { formatDecimal } from "../../../../i18n/src/en";
import { NumericTopic } from "../../components/numeric-topic";
import { NumberLine } from "../../components/viz";
import { messageText } from "../../lesson-text";
import type { TopicViewProps } from "../../view-contract";
import { PhysicsFigure, physicsValues } from "../physics-visual";
import { adapter } from "./adapter";

/** Fresh water near room temperature, kg/m³: the everyday reference point. */
const WATER = "1000";

/** Round a scale end up to 1, 2 or 5 × 10ⁿ so the ticks stay readable. */
function niceMax(value: number): number {
  const exp = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 5, 10].find((m) => m * exp >= value) ?? 10;
  return step * exp;
}

export default function View(props: TopicViewProps) {
  return (
    <NumericTopic
      {...props}
      adapter={adapter}
      fractionDigits={1}
      visual={(ctx) => {
        const v = physicsValues(ctx, "density");
        const answer = Number(ctx.result.answer.value);
        const max = niceMax(Math.max(answer, Number(WATER)) * 1.1);
        const ticks = [0, max / 2, max].map((t) => ({
          value: t,
          label: formatDecimal(String(t), ctx.locale),
        }));
        const order = new DecimalValue(ctx.result.answer.value).cmp(WATER);
        const water = v.withUnit(formatDecimal(WATER, ctx.locale), ctx.unit);
        const noteKey =
          order > 0
            ? "density.visual.sinks"
            : order < 0
              ? "density.visual.floats"
              : "density.visual.same";
        return (
          <PhysicsFigure
            ctx={ctx}
            id="density"
            terms={[
              { field: "mass", unitKey: "density.unit.kg" },
              { field: "volume", unitKey: "density.unit.m3" },
            ]}
            ops={["÷", "="]}
            vars={{ water }}
            note={messageText(ctx.messages, noteKey)}
          >
            <NumberLine
              min={0}
              max={max}
              ticks={ticks}
              markers={[
                {
                  value: Number(WATER),
                  label: messageText(ctx.messages, "density.visual.water"),
                  display: formatDecimal(WATER, ctx.locale),
                  tone: "muted",
                },
                {
                  value: answer,
                  label: messageText(ctx.messages, "density.visual.sample"),
                  display: ctx.show(ctx.result.answer.value),
                },
              ]}
            />
          </PhysicsFigure>
        );
      }}
    />
  );
}
