import type { ErrorCode, Result } from "../../../../calculators/src/triangle";
import {
  AltitudeTriangleShape,
  SidesTriangleShape,
} from "../../components/shape-diagram";
import type { TopicViewProps } from "../../view-contract";
import { ShapeTopicView } from "../geometry-view";
import { adapter } from "./adapter";

export default function TopicView(props: TopicViewProps) {
  return (
    <ShapeTopicView<Result, ErrorCode>
      {...props}
      topicId="triangle"
      adapter={adapter}
      fieldUnitKey={(field) =>
        field === "area" ? "triangle.unit.square-metre" : "triangle.unit.metre"
      }
      diagram={(ctx) => {
        const d = ctx.dimensions;
        const l = ctx.labels;
        if (ctx.operation === "triangle-perimeter")
          return (
            <SidesTriangleShape
              a={d.sideA ?? "1"}
              b={d.sideB ?? "1"}
              c={d.sideC ?? "1"}
              aLabel={l.sideA ?? ""}
              bLabel={l.sideB ?? ""}
              cLabel={l.sideC ?? ""}
              answerLabel={ctx.answer}
            />
          );
        if (ctx.operation === "triangle-altitude")
          return (
            <AltitudeTriangleShape
              base={d.base ?? "1"}
              height={ctx.answerValue}
              baseLabel={l.base ?? ""}
              heightLabel={ctx.answer}
              heightTone="answer"
              centreLabel={l.area ?? ""}
              centreTone="given"
            />
          );
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
      }}
    />
  );
}
