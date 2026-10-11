import type { ErrorCode, Result } from "../../../../calculators/src/rectangle";
import { RectangleShape } from "../../components/shape-diagram";
import type { TopicViewProps } from "../../view-contract";
import { ShapeTopicView } from "../geometry-view";
import { adapter } from "./adapter";

export default function TopicView(props: TopicViewProps) {
  return (
    <ShapeTopicView<Result, ErrorCode>
      {...props}
      topicId="rectangle"
      adapter={adapter}
      fieldUnitKey={() => "rectangle.unit.metre"}
      diagram={(ctx) => (
        <RectangleShape
          width={ctx.dimensions.width ?? "1"}
          height={ctx.dimensions.height ?? "1"}
          widthLabel={ctx.labels.width ?? ""}
          heightLabel={ctx.labels.height ?? ""}
          focus={
            ctx.operation === "rectangle-area"
              ? "area"
              : ctx.operation === "rectangle-perimeter"
                ? "perimeter"
                : "diagonal"
          }
          answerLabel={ctx.answer}
        />
      )}
    />
  );
}
