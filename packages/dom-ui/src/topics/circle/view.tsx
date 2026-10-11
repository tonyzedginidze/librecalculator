import type { ErrorCode, Result } from "../../../../calculators/src/circle";
import { RoundShape } from "../../components/shape-diagram";
import type { TopicViewProps } from "../../view-contract";
import { ShapeTopicView } from "../geometry-view";
import { adapter } from "./adapter";

export default function TopicView(props: TopicViewProps) {
  return (
    <ShapeTopicView<Result, ErrorCode>
      {...props}
      topicId="circle"
      adapter={adapter}
      fieldUnitKey={() => "circle.unit.metre"}
      diagram={(ctx) => (
        <RoundShape
          radiusLabel={ctx.labels.radius ?? ""}
          focus={
            ctx.operation === "circle-area"
              ? "fill"
              : ctx.operation === "circle-circumference"
                ? "outline"
                : "diameter"
          }
          answerLabel={ctx.answer}
        />
      )}
    />
  );
}
