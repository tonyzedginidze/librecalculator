import type { ErrorCode, Result } from "../../../../calculators/src/sphere";
import { RoundShape } from "../../components/shape-diagram";
import type { TopicViewProps } from "../../view-contract";
import { ShapeTopicView } from "../geometry-view";
import { adapter } from "./adapter";

export default function TopicView(props: TopicViewProps) {
  return (
    <ShapeTopicView<Result, ErrorCode>
      {...props}
      topicId="sphere"
      adapter={adapter}
      fieldUnitKey={() => "sphere.unit.metre"}
      diagram={(ctx) => (
        <RoundShape
          sphere
          radiusLabel={ctx.labels.radius ?? ""}
          focus={
            ctx.operation === "sphere-volume"
              ? "fill"
              : ctx.operation === "sphere-surface"
                ? "outline"
                : "diameter"
          }
          answerLabel={ctx.answer}
        />
      )}
    />
  );
}
