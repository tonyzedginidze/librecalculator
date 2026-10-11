import type { ErrorCode, Result } from "../../../../calculators/src/lumber";
import { Equation, VizFigure } from "../../components/viz";
import type { TopicViewProps } from "../../view-contract";
import {
  ConstructionTopic,
  DiagramSvg,
  draw,
  figText,
} from "../construction-view";
import { adapter } from "./adapter";

const DIGITS = 2;

/** One board in oblique view; the cross-section keeps T : W, length is fixed. */
function Board(props: {
  thickness: number;
  width: number;
  labels: { thickness: string; width: string; length: string };
}) {
  const big = Math.max(props.thickness, props.width) || 1;
  const size = (n: number) => Math.max(10, Math.round((n / big) * 48));
  const tp = size(props.thickness);
  const wp = size(props.width);
  const dx = Math.round(wp * 0.62);
  const dy = -Math.round(wp * 0.5);
  const x0 = 96;
  const x1 = 316;
  const y0 = 34 - dy;
  const y1 = y0 + tp;
  const pts = (...p: (readonly [number, number])[]) =>
    p.map((q) => q.join(",")).join(" ");
  return (
    <DiagramSvg width={360} height={y1 + 44}>
      <polygon
        points={pts([x0, y0], [x1, y0], [x1 + dx, y0 + dy], [x0 + dx, y0 + dy])}
        fill={draw.soft}
        stroke={draw.accent}
        strokeWidth="2.5"
      />
      <rect
        x={x0}
        y={y0}
        width={x1 - x0}
        height={tp}
        fill={draw.surface}
        stroke={draw.accent}
        strokeWidth="2.5"
      />
      <polygon
        points={pts([x1, y0], [x1 + dx, y0 + dy], [x1 + dx, y1 + dy], [x1, y1])}
        fill={draw.line}
        stroke={draw.accent}
        strokeWidth="2.5"
      />
      <path
        d={`M${x0} ${y1 + 14}H${x1}M${x0} ${y1 + 9}v10M${x1} ${y1 + 9}v10`}
        stroke={draw.muted}
        strokeWidth="1.5"
      />
      <text
        x={(x0 + x1) / 2}
        y={y1 + 30}
        fill={draw.ink}
        textAnchor="middle"
        dominantBaseline="middle"
        style={figText}
      >
        {props.labels.length}
      </text>
      <path
        d={`M${x0 - 12} ${y0}V${y1}M${x0 - 17} ${y0}h10M${x0 - 17} ${y1}h10`}
        stroke={draw.muted}
        strokeWidth="1.5"
      />
      <text
        x={x0 - 22}
        y={(y0 + y1) / 2}
        fill={draw.ink}
        textAnchor="end"
        dominantBaseline="middle"
        style={figText}
      >
        {props.labels.thickness}
      </text>
      <text
        x={x1 + dx}
        y={y0 + dy - 12}
        fill={draw.ink}
        textAnchor="end"
        style={figText}
      >
        {props.labels.width}
      </text>
    </DiagramSvg>
  );
}

export default function View(props: TopicViewProps) {
  return (
    <ConstructionTopic<Result, ErrorCode>
      {...props}
      adapter={adapter}
      digits={DIGITS}
      unit={(_, msg) => msg("lumber.answer.unit")}
      visual={({ result, show, msg }) => {
        const v = result.visual;
        const unit = msg("lumber.answer.unit");
        const vars = {
          thickness: show(v.thickness, 3),
          width: show(v.width, 3),
          length: show(v.length, 3),
          perBoard: show(v.perBoard),
          quantity: show(v.reference, 0),
          answer: show(v.answer),
        };
        return (
          <VizFigure
            caption={msg("lumber.visual.caption")}
            summary={msg("lumber.visual.summary", vars)}
            note={msg(v.descriptionKey)}
          >
            <Board
              thickness={Number(v.thickness)}
              width={Number(v.width)}
              labels={{
                thickness: msg("lumber.visual.thickness", {
                  value: vars.thickness,
                }),
                width: msg("lumber.visual.width", { value: vars.width }),
                length: msg("lumber.visual.length", { value: vars.length }),
              }}
            />
            <Equation
              items={[
                {
                  label: msg("lumber.visual.per-board"),
                  display: `${vars.perBoard} ${unit}`,
                },
                { op: "×" },
                { label: msg("lumber.visual.boards"), display: vars.quantity },
                { op: "=" },
                {
                  label: msg("lumber.visual.total"),
                  display: `${vars.answer} ${unit}`,
                  emphasis: true,
                },
              ]}
            />
          </VizFigure>
        );
      }}
    />
  );
}
