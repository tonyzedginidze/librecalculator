import type { ErrorCode, Result } from "../../../../calculators/src/roofing";
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

/** Gable section; the shape follows rise/run and the pitch mark shows the ratio. */
function RoofSection(props: {
  ratio: number;
  labels: { rise: string; run: string; factor: string };
}) {
  const ratio = Number.isFinite(props.ratio) ? Math.max(0, props.ratio) : 0;
  const run = ratio > 0 ? Math.min(140, 96 / ratio) : 140;
  const rise = run * ratio;
  const top = 40;
  const ridge = top;
  const base = top + rise;
  const cx = 180;
  const left = cx - run;
  const right = cx + run;
  // Pitch mark above the right slope: horizontal leg h, vertical leg h × ratio.
  const h = ratio > 0 ? Math.min(60, 40 / ratio) : 60;
  const qx = cx + run * 0.28;
  const qy = ridge + run * 0.28 * ratio;
  const leg = h * ratio;
  return (
    <DiagramSvg width={360} height={base + 30}>
      <rect
        x={left + 14}
        y={base}
        width={run * 2 - 28}
        height="18"
        fill={draw.surface}
        stroke={draw.line}
        strokeWidth="2"
      />
      <polygon
        points={`${left},${base} ${cx},${ridge} ${right},${base}`}
        fill={draw.soft}
        stroke={draw.accent}
        strokeWidth="3"
      />
      <path
        d={`M${qx} ${qy}H${qx + h}V${qy + leg}`}
        stroke={draw.muted}
        strokeWidth="1.5"
      />
      <text
        x={qx + h / 2}
        y={qy - 10}
        fill={draw.ink}
        textAnchor="middle"
        style={figText}
      >
        {props.labels.run}
      </text>
      <text
        x={qx + h + 8}
        y={qy + Math.max(leg, 0) / 2}
        fill={draw.ink}
        dominantBaseline="middle"
        style={figText}
      >
        {props.labels.rise}
      </text>
      <text
        x={cx - 16}
        y={ridge - 8}
        fill={draw.accent}
        textAnchor="end"
        dominantBaseline="middle"
        style={{ ...figText, fontWeight: 600 }}
      >
        {props.labels.factor}
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
      unit={(_, msg) => msg("roofing.answer.unit")}
      visual={({ result, show, msg }) => {
        const v = result.visual;
        const unit = msg("roofing.answer.unit");
        const vars = {
          rise: show(v.rise, 3),
          run: show(v.run, 3),
          factor: show(v.slopeFactor, 3),
          reference: show(v.reference),
          sloped: show(v.slopedArea),
          answer: show(v.answer),
          waste: show(v.waste),
        };
        return (
          <VizFigure
            caption={msg("roofing.visual.caption")}
            summary={msg("roofing.visual.summary", vars)}
            note={msg(v.descriptionKey)}
          >
            <RoofSection
              ratio={Number(v.rise) / Number(v.run)}
              labels={{
                rise: msg("roofing.visual.rise", { value: vars.rise }),
                run: msg("roofing.visual.run", { value: vars.run }),
                factor: msg("roofing.visual.factor", { value: vars.factor }),
              }}
            />
            <StatGrid
              items={[
                {
                  label: msg("roofing.visual.footprint"),
                  display: `${vars.reference} ${unit}`,
                },
                {
                  label: msg("roofing.visual.sloped"),
                  display: `${vars.sloped} ${unit}`,
                },
                {
                  label: msg("roofing.visual.order", vars),
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
