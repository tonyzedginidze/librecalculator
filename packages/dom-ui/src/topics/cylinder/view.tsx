import type { ErrorCode, Result } from "../../../../calculators/src/cylinder";
import { CylinderShape } from "../../components/shape-diagram";
import type { TopicViewProps } from "../../view-contract";
import { ShapeTopicView } from "../geometry-view";
import { adapter } from "./adapter";

export default function TopicView(props: TopicViewProps) {
  return (
    <ShapeTopicView<Result, ErrorCode>
      {...props}
      topicId="cylinder"
      adapter={adapter}
      fieldUnitKey={() => "cylinder.unit.metre"}
      diagram={(ctx) => (
        <CylinderShape
          radius={ctx.dimensions.radius ?? "1"}
          height={ctx.dimensions.height ?? "1"}
          radiusLabel={ctx.labels.radius ?? ""}
          heightLabel={ctx.labels.height ?? ""}
          focus={
            ctx.operation === "cylinder-volume"
              ? "volume"
              : ctx.operation === "cylinder-surface"
                ? "total"
                : "lateral"
          }
          answerLabel={ctx.answer}
        />
      )}
    />
  );
}
