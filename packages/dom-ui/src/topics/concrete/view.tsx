import type { ErrorCode, Result } from "../../../../calculators/src/concrete";
import { StatGrid, VizFigure } from "../../components/viz";
import type { TopicViewProps } from "../../view-contract";
import {
  ConstructionTopic,
  DiagramSvg,
  draw,
  figText,
} from "../construction-view";
import { adapter } from "./adapter";

const DIGITS = 2;

type Point = readonly [number, number];
const add = (p: Point, v: Point, k = 1): Point => [
  p[0] + v[0] * k,
  p[1] + v[1] * k,
];
const pts = (...ps: Point[]) => ps.map((p) => p.join(",")).join(" ");
const COS = Math.cos(Math.PI / 6);
const ALONG_L: Point = [COS, 0.5];
const ALONG_W: Point = [-COS, 0.5];

/** Isometric slab; plan proportions follow L : W, depth is drawn at a fixed height. */
function Slab(props: {
  length: number;
  width: number;
  labels: { length: string; width: string; depth: string };
}) {
  const size = 236;
  const share = Math.min(
    0.72,
    Math.max(0.28, props.length / (props.length + props.width || 1)),
  );
  const lp = size * share;
  const wp = size - lp;
  const back: Point = [180 - (COS * (lp - wp)) / 2, 14];
  const right = add(back, ALONG_L, lp);
  const left = add(back, ALONG_W, wp);
  const front = add(right, ALONG_W, wp);
  const t = 16;
  const down = (p: Point): Point => [p[0], p[1] + t];
  const dim = (from: Point, to: Point, normal: Point, label: string) => {
    const a = add(from, normal, 12);
    const b = add(to, normal, 12);
    const mid = add([(from[0] + to[0]) / 2, (from[1] + to[1]) / 2], normal, 27);
    const angle =
      (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI;
    const upright = angle > 90 || angle < -90 ? angle + 180 : angle;
    return (
      <g>
        <path
          d={`M${pts(a, b).replace(" ", "L")}`}
          stroke={draw.muted}
          strokeWidth="1.5"
        />
        <path
          d={`M${pts(add(a, normal, -4), add(a, normal, 4)).replace(" ", "L")}M${pts(add(b, normal, -4), add(b, normal, 4)).replace(" ", "L")}`}
          stroke={draw.muted}
          strokeWidth="1.5"
        />
        <text
          x={mid[0]}
          y={mid[1]}
          fill={draw.ink}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(${upright.toFixed(2)} ${mid[0]} ${mid[1]})`}
          style={figText}
        >
          {label}
        </text>
      </g>
    );
  };
  return (
    <DiagramSvg width={360} height={196}>
      <polygon
        points={pts(left, front, down(front), down(left))}
        fill={draw.surface}
        stroke={draw.accent}
        strokeWidth="2"
      />
      <polygon
        points={pts(front, right, down(right), down(front))}
        fill={draw.line}
        stroke={draw.accent}
        strokeWidth="2"
      />
      <polygon
        points={pts(back, right, front, left)}
        fill={draw.soft}
        stroke={draw.accent}
        strokeWidth="2.5"
      />
      {dim(down(left), down(front), [-0.5, COS], props.labels.length)}
      {dim(down(front), down(right), [0.5, COS], props.labels.width)}
      <text
        x={right[0] + 12}
        y={right[1] + t / 2}
        fill={draw.ink}
        dominantBaseline="middle"
        style={figText}
      >
        {props.labels.depth}
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
      unit={(_, msg) => msg("concrete.answer.unit")}
      visual={({ result, show, msg }) => {
        const v = result.visual;
        const unit = msg("concrete.answer.unit");
        const vars = {
          length: show(v.length, 3),
          width: show(v.width, 3),
          depth: show(v.depth, 3),
          waste: show(v.waste),
          reference: show(v.reference),
          allowance: show(v.allowance),
          answer: show(v.answer),
        };
        return (
          <VizFigure
            caption={msg("concrete.visual.caption")}
            summary={msg("concrete.visual.summary", vars)}
            note={msg(v.descriptionKey)}
          >
            <Slab
              length={Number(v.length)}
              width={Number(v.width)}
              labels={{
                length: msg("concrete.visual.length", { value: vars.length }),
                width: msg("concrete.visual.width", { value: vars.width }),
                depth: msg("concrete.visual.depth", { value: vars.depth }),
              }}
            />
            <StatGrid
              items={[
                {
                  label: msg("concrete.visual.net"),
                  display: `${vars.reference} ${unit}`,
                },
                {
                  label: msg("concrete.visual.allowance", vars),
                  display: `${vars.allowance} ${unit}`,
                },
                {
                  label: msg("concrete.visual.order"),
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
