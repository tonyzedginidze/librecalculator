import type {
  PythagoreanErrorCode,
  PythagoreanResult,
} from "../../../../calculators/src/pythagorean";
import { formatDecimal } from "../../../../i18n/src/en";
import { RightTriangleShape } from "../../components/shape-diagram";
import { messageText } from "../../lesson-text";
import type { TopicViewProps } from "../../view-contract";
import { ShapeTopicView } from "../geometry-view";
import { adapter } from "./adapter";

export type { TopicViewProps };

export default function PythagoreanTopicView(props: TopicViewProps) {
  const unit = messageText(props.messages, "pythagorean.symbol.metre");
  return (
    <ShapeTopicView<PythagoreanResult, PythagoreanErrorCode>
      {...props}
      topicId="pythagorean"
      adapter={adapter}
      fieldUnitKey={() => "pythagorean.symbol.metre"}
      answerUnitKey={() => "pythagorean.symbol.metre"}
      dimensions={(result) =>
        result.operation === "missing-hypotenuse"
          ? { a: result.visual.a, b: result.visual.b }
          : { hypotenuse: result.visual.c, leg: result.visual.a }
      }
      diagram={(ctx) => {
        const sides = ctx.result.visual;
        const side = (key: "a" | "b" | "c") =>
          sides.solvedSide === key
            ? ctx.answer
            : `${formatDecimal(sides[key], props.locale)} ${unit}`;
        return (
          <RightTriangleShape
            a={sides.a}
            b={sides.b}
            aLabel={fillSide(props.messages, "a", side("a"))}
            bLabel={fillSide(props.messages, "b", side("b"))}
            cLabel={fillSide(props.messages, "c", side("c"))}
            solved={sides.solvedSide}
          />
        );
      }}
    />
  );
}

function fillSide(
  messages: Readonly<Record<string, string>>,
  side: "a" | "b" | "c",
  value: string,
): string {
  return messageText(messages, `pythagorean.visual.side.${side}`).replace(
    "{value}",
    value,
  );
}
