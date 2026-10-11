import type {
  VolumeErrorCode,
  VolumeResult,
} from "../../../../calculators/src/volume";
import {
  BoxShape,
  CylinderShape,
  RoundShape,
} from "../../components/shape-diagram";
import type { TopicViewProps } from "../../view-contract";
import { ShapeTopicView } from "../geometry-view";
import { adapter } from "./adapter";

export type { TopicViewProps };

function volumeDimensions(result: VolumeResult): Record<string, string> {
  const v = result.visual;
  if (v.kind === "volume-prism")
    return { width: v.width, height: v.height, depth: v.depth };
  if (v.kind === "volume-cylinder")
    return { radius: v.radius, height: v.height };
  return { radius: v.radius };
}

export default function VolumeTopicView(props: TopicViewProps) {
  return (
    <ShapeTopicView<VolumeResult, VolumeErrorCode>
      {...props}
      topicId="volume"
      adapter={adapter}
      fieldUnitKey={() => "volume.symbol.metre"}
      answerUnitKey={() => "volume.symbol.cubic-metre"}
      dimensions={volumeDimensions}
      diagram={(ctx) => {
        const d = ctx.dimensions;
        const l = ctx.labels;
        if (ctx.operation === "prism")
          return (
            <BoxShape
              width={d.width ?? "1"}
              height={d.height ?? "1"}
              depth={d.depth ?? "1"}
              widthLabel={l.width ?? ""}
              heightLabel={l.height ?? ""}
              depthLabel={l.depth ?? ""}
              answerLabel={ctx.answer}
            />
          );
        if (ctx.operation === "cylinder")
          return (
            <CylinderShape
              radius={d.radius ?? "1"}
              height={d.height ?? "1"}
              radiusLabel={l.radius ?? ""}
              heightLabel={l.height ?? ""}
              focus="volume"
              answerLabel={ctx.answer}
            />
          );
        return (
          <RoundShape
            sphere
            radiusLabel={l.radius ?? ""}
            focus="fill"
            answerLabel={ctx.answer}
          />
        );
      }}
    />
  );
}
