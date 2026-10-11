import type {
  AreaErrorCode,
  AreaResult,
} from "../../../../calculators/src/area";
import {
  AltitudeTriangleShape,
  RectangleShape,
  RoundShape,
} from "../../components/shape-diagram";
import type { TopicViewProps } from "../../view-contract";
import { ShapeTopicView } from "../geometry-view";
import { adapter } from "./adapter";

export type { TopicViewProps };

export function areaDimensions(result: AreaResult): Record<string, string> {
  const v = result.visual;
  if (v.kind === "area-rectangle") return { width: v.width, height: v.height };
  if (v.kind === "area-triangle")
    return { base: v.base, height: v.perpendicularHeight };
  return { radius: v.radius };
}

export default function AreaTopicView(props: TopicViewProps) {
  return (
    <ShapeTopicView<AreaResult, AreaErrorCode>
      {...props}
      topicId="area"
      adapter={adapter}
      fieldUnitKey={() => "area.symbol.metre"}
      answerUnitKey={() => "area.symbol.square-metre"}
      dimensions={areaDimensions}
      diagram={(ctx) => {
        const d = ctx.dimensions;
        const l = ctx.labels;
        if (ctx.operation === "rectangle")
          return (
            <RectangleShape
              width={d.width ?? "1"}
              height={d.height ?? "1"}
              widthLabel={l.width ?? ""}
              heightLabel={l.height ?? ""}
              focus="area"
              answerLabel={ctx.answer}
            />
          );
        if (ctx.operation === "triangle")
          return (
            <AltitudeTriangleShape
              base={d.base ?? "1"}
              height={d.height ?? "1"}
              baseLabel={l.base ?? ""}
              heightLabel={l.height ?? ""}
              heightTone="given"
              centreLabel={ctx.answer}
              centreTone="answer"
            />
          );
        return (
          <RoundShape
            radiusLabel={l.radius ?? ""}
            focus="fill"
            answerLabel={ctx.answer}
          />
        );
      }}
    />
  );
}
