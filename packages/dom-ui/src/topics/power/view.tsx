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
          id="power"
          terms={[
            { field: "energy", unitKey: "power.unit.j" },
            { field: "time", unitKey: "power.unit.s" },
          ]}
          ops={["÷", "="]}
        />
      )}
    />
  );
}
