import { NumericTopic } from "../../components/numeric-topic";
import type { TopicViewProps } from "../../view-contract";
import { PhysicsFigure } from "../physics-visual";
import { adapter } from "./adapter";

export default function View(props: TopicViewProps) {
  return (
    <NumericTopic
      {...props}
      adapter={adapter}
      fractionDigits={2}
      visual={(ctx) => (
        <PhysicsFigure
          ctx={ctx}
          id="speed"
          terms={[
            { field: "distance", unitKey: "speed.unit.m" },
            { field: "time", unitKey: "speed.unit.s" },
          ]}
          ops={["÷", "="]}
        />
      )}
    />
  );
}
