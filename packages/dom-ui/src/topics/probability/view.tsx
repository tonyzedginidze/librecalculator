import {
  type ProbabilityRegions,
  regionsOf,
} from "../../../../calculators/src/probability";
import { formatDecimal } from "../../../../i18n/src/en";
import { NumericTopic } from "../../components/numeric-topic";
import { fillMessage, SplitBar, VizFigure } from "../../components/viz";
import { messageText } from "../../lesson-text";
import type { TopicViewProps } from "../../view-contract";
import { adapter } from "./adapter";

const DIGITS = 4;
const soft = "color-mix(in srgb, var(--oc-accent) 22%, var(--oc-surface))";
const strong = "color-mix(in srgb, var(--oc-accent) 62%, var(--oc-surface))";
const mono = "var(--oc-font-mono)";
const svgStyle = {
  width: "100%",
  maxWidth: 480,
  height: "auto",
  display: "block",
  margin: "0 auto",
} as const;

type Msg = (key: string) => string;

/** Unit square: A spans its width share, B its height share; the overlap is A × B. */
function AreaSquare(props: {
  a: number;
  b: number;
  show: { a: string; b: string; both: string };
  msg: Msg;
}) {
  const S = 150;
  const X = 110;
  const Y = 26;
  const aw = S * Math.min(1, Math.max(0, props.a));
  const bh = S * Math.min(1, Math.max(0, props.b));
  return (
    <svg viewBox="0 0 360 206" style={svgStyle} aria-hidden="true">
      <rect x={X} y={Y} width={S} height={S} fill="var(--oc-surface)" />
      <rect x={X} y={Y} width={aw} height={S} style={{ fill: soft }} />
      <rect x={X} y={Y + S - bh} width={S} height={bh} style={{ fill: soft }} />
      <rect
        x={X}
        y={Y + S - bh}
        width={aw}
        height={bh}
        style={{ fill: strong }}
      />
      <rect
        x={X}
        y={Y}
        width={S}
        height={S}
        fill="none"
        stroke="var(--oc-line)"
        strokeWidth="1.5"
      />
      {aw > 0 && aw < S ? (
        <path
          d={`M${X + aw} ${Y}V${Y + S}`}
          stroke="var(--oc-accent)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
      ) : null}
      {bh > 0 && bh < S ? (
        <path
          d={`M${X} ${Y + S - bh}H${X + S}`}
          stroke="var(--oc-accent)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
      ) : null}
      <path
        d={`M${X} ${Y + S + 9}H${X + aw}M${X} ${Y + S + 5}v8M${X + aw} ${Y + S + 5}v8`}
        stroke="var(--oc-ink)"
        strokeWidth="1.25"
      />
      <text
        x={X + aw / 2}
        y={Y + S + 27}
        textAnchor="middle"
        fontSize="13"
        fill="var(--oc-ink)"
      >
        {props.msg("probability.visual.a")}{" "}
        <tspan fontFamily={mono}>{props.show.a}</tspan>
      </text>
      <path
        d={`M${X - 9} ${Y + S}V${Y + S - bh}M${X - 13} ${Y + S}h8M${X - 13} ${Y + S - bh}h8`}
        stroke="var(--oc-ink)"
        strokeWidth="1.25"
      />
      <text
        x={X - 18}
        y={Y + S - bh / 2 + 4}
        textAnchor="end"
        fontSize="13"
        fill="var(--oc-ink)"
      >
        {props.msg("probability.visual.b")}{" "}
        <tspan fontFamily={mono}>{props.show.b}</tspan>
      </text>
      <rect
        x={X + S + 14}
        y={Y + S - Math.max(bh, 30) / 2 - 15}
        width="10"
        height="10"
        rx="2"
        style={{ fill: strong }}
      />
      <text
        x={X + S + 30}
        y={Y + S - Math.max(bh, 30) / 2 - 6}
        fontSize="13"
        fill="var(--oc-ink)"
      >
        {props.msg("probability.visual.both")}
      </text>
      <text
        x={X + S + 14}
        y={Y + S - Math.max(bh, 30) / 2 + 12}
        fontSize="14.5"
        fontWeight="600"
        fontFamily={mono}
        fill="var(--oc-accent)"
      >
        {props.show.both}
      </text>
    </svg>
  );
}

/** Two overlapping events inside the sample space, each part labelled with its probability. */
function Venn(props: {
  regions: Record<keyof ProbabilityRegions, string>;
  msg: Msg;
}) {
  const { regions, msg } = props;
  const label = (x: number, title: string, value: string) => (
    <>
      <text
        x={x}
        y="104"
        textAnchor="middle"
        fontSize="12.5"
        fill="var(--oc-muted)"
      >
        {title}
      </text>
      <text
        x={x}
        y="122"
        textAnchor="middle"
        fontSize="14.5"
        fontWeight="600"
        fontFamily={mono}
        fill="var(--oc-ink)"
      >
        {value}
      </text>
    </>
  );
  return (
    <svg viewBox="0 0 360 206" style={svgStyle} aria-hidden="true">
      <defs>
        <clipPath id="oc-prob-venn-a">
          <circle cx="140" cy="108" r="74" />
        </clipPath>
      </defs>
      <rect
        x="8"
        y="8"
        width="344"
        height="190"
        rx="10"
        fill="none"
        stroke="var(--oc-line)"
        strokeWidth="1.5"
      />
      <circle cx="140" cy="108" r="74" style={{ fill: soft }} />
      <circle cx="220" cy="108" r="74" style={{ fill: soft }} />
      <circle
        cx="220"
        cy="108"
        r="74"
        clipPath="url(#oc-prob-venn-a)"
        style={{ fill: strong }}
      />
      <circle
        cx="140"
        cy="108"
        r="74"
        fill="none"
        stroke="var(--oc-accent)"
        strokeWidth="2"
      />
      <circle
        cx="220"
        cy="108"
        r="74"
        fill="none"
        stroke="var(--oc-accent)"
        strokeWidth="2"
      />
      <text
        x="72"
        y="50"
        textAnchor="middle"
        fontSize="14"
        fontWeight="600"
        fill="var(--oc-accent)"
      >
        {msg("probability.visual.a")}
      </text>
      <text
        x="288"
        y="50"
        textAnchor="middle"
        fontSize="14"
        fontWeight="600"
        fill="var(--oc-accent)"
      >
        {msg("probability.visual.b")}
      </text>
      {label(100, msg("probability.visual.a-only"), regions.aOnly)}
      {label(180, msg("probability.visual.both"), regions.both)}
      {label(260, msg("probability.visual.b-only"), regions.bOnly)}
      <text x="20" y="28" fontSize="12.5" fill="var(--oc-muted)">
        {msg("probability.visual.neither")}{" "}
        <tspan fontFamily={mono} fill="var(--oc-ink)">
          {regions.neither}
        </tspan>
      </text>
    </svg>
  );
}

export default function View(props: TopicViewProps) {
  return (
    <NumericTopic
      {...props}
      adapter={adapter}
      fractionDigits={DIGITS}
      visual={({ result, operationId, show, messages, locale }) => {
        const msg: Msg = (key) => messageText(messages, key);
        const row = (key: string) =>
          result.visual.rows.find((r) => r.labelKey.endsWith(`.field.${key}`))
            ?.value ?? "0";
        const regions = regionsOf(result);
        const vars: Record<string, string> = {
          first: show(row("first")),
          second: show(row("second")),
          intersection: show(row("intersection")),
          answer: show(result.answer.value),
        };
        if (regions)
          for (const [k, v] of Object.entries(regions)) vars[k] = show(v);
        const caption = msg(`probability.visual.caption.${operationId}`);
        const summary = fillMessage(
          msg(`probability.visual.summary.${operationId}`),
          vars,
        );
        if (operationId === "complement")
          return (
            <VizFigure caption={caption} summary={summary}>
              <SplitBar
                total={{
                  label: msg("probability.visual.total"),
                  display: formatDecimal("1", locale),
                }}
                parts={[
                  {
                    label: msg("probability.visual.event"),
                    value: Number(row("first")),
                    display: vars.first ?? "",
                    tone: "soft",
                  },
                  {
                    label: msg("probability.visual.not-event"),
                    value: Number(result.answer.value),
                    display: vars.answer ?? "",
                    tone: "accent",
                  },
                ]}
              />
            </VizFigure>
          );
        if (!regions) return null;
        if (operationId === "independent-both")
          return (
            <VizFigure
              caption={caption}
              summary={summary}
              note={msg("probability.visual.note.independent-both")}
            >
              <AreaSquare
                a={Number(row("first"))}
                b={Number(row("second"))}
                show={{
                  a: vars.first ?? "",
                  b: vars.second ?? "",
                  both: vars.answer ?? "",
                }}
                msg={msg}
              />
            </VizFigure>
          );
        return (
          <VizFigure
            caption={caption}
            summary={summary}
            note={msg("probability.visual.note.event-union")}
          >
            <Venn
              regions={{
                aOnly: vars.aOnly ?? "",
                both: vars.both ?? "",
                bOnly: vars.bOnly ?? "",
                neither: vars.neither ?? "",
              }}
              msg={msg}
            />
          </VizFigure>
        );
      }}
    />
  );
}
