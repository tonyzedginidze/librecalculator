import { NumericTopic } from "../../components/numeric-topic";
import { CompareBars, fillMessage } from "../../components/viz";
import { messageText } from "../../lesson-text";
import type { TopicViewProps } from "../../view-contract";
import { PhysicsFigure, physicsValues } from "../physics-visual";
import { adapter } from "./adapter";

const DIGITS = 2;

export default function View(props: TopicViewProps) {
  return (
    <NumericTopic
      {...props}
      adapter={adapter}
      fractionDigits={DIGITS}
      visual={(ctx) => {
        const v = physicsValues(ctx, "energy");
        const mps = v.symbol("energy.unit.mps");
        const speed = v.field("speed", "energy.unit.mps");
        const doubledSpeed = v.withUnit(
          ctx.show(v.raw("energy.visual.doubled-speed")),
          mps,
        );
        const doubledEnergy = v.withUnit(
          ctx.show(v.raw("energy.visual.doubled-energy")),
          ctx.unit,
        );
        const at = (value: string) =>
          fillMessage(messageText(ctx.messages, "energy.visual.at"), {
            speed: value,
          });
        return (
          <PhysicsFigure
            ctx={ctx}
            id="energy"
            terms={[
              { field: "mass", unitKey: "energy.unit.kg" },
              {
                field: "speed",
                unitKey: "energy.unit.mps",
                wrapKey: "energy.visual.squared",
              },
            ]}
            ops={["×", "÷ 2 ="]}
            vars={{ doubledSpeed, doubledEnergy }}
          >
            <CompareBars
              rows={[
                {
                  label: at(speed),
                  value: Number(ctx.result.answer.value),
                  display: v.answer,
                },
                {
                  label: at(doubledSpeed),
                  value: Number(v.raw("energy.visual.doubled-energy")),
                  display: doubledEnergy,
                  tone: "soft",
                  note: messageText(ctx.messages, "energy.visual.doubled-note"),
                },
              ]}
            />
          </PhysicsFigure>
        );
      }}
    />
  );
}
