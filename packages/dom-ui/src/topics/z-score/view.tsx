import {
  isZScoreResult,
  type ZScoreResult,
} from "../../../../calculators/src/z-score";
import { formatDecimal } from "../../../../i18n/src/en";
import { NumericTopic } from "../../components/numeric-topic";
import { fillMessage, VizFigure } from "../../components/viz";
import { messageText } from "../../lesson-text";
import type { TopicViewProps } from "../../view-contract";
import { adapter } from "./adapter";

const DIGITS = 2;
/** Plot spans ±4σ; values beyond are pinned to the edge with their exact label. */
const LIMIT = 4;
const X0 = 180;
const STEP = 39;
const BASE = 138;
const PEAK = 96;
const x = (z: number) => X0 + Math.max(-LIMIT, Math.min(LIMIT, z)) * STEP;
const y = (z: number) => BASE - PEAK * Math.exp((-z * z) / 2);

const soft = "color-mix(in srgb, var(--oc-accent) 30%, var(--oc-surface))";
const mono = "var(--oc-font-mono)";

function curvePath(from: number, to: number, closed: boolean) {
  const points: string[] = [];
  const n = Math.max(2, Math.ceil((to - from) * 12));
  for (let i = 0; i <= n; i++) {
    const z = from + ((to - from) * i) / n;
    points.push(`${x(z).toFixed(2)} ${y(z).toFixed(2)}`);
  }
  const d = `M${points.join("L")}`;
  return closed
    ? `${d}L${x(to).toFixed(2)} ${BASE}L${x(from).toFixed(2)} ${BASE}Z`
    : d;
}

/** Shows only as many raw-value ticks as fit their label width. */
function visibleSteps(labels: readonly string[]) {
  const longest = Math.max(...labels.map((l) => l.length));
  if (longest <= 4) return [-3, -2, -1, 0, 1, 2, 3];
  if (longest <= 9) return [-2, 0, 2];
  return [0];
}

function BellCurve(props: {
  result: ZScoreResult;
  locale: string;
  messages: Readonly<Record<string, string>>;
}) {
  const { result, locale, messages } = props;
  const z = Number(result.answer.value);
  const value = result.visual.rows.find((r) =>
    r.labelKey.endsWith(".value"),
  )?.value;
  const raw = (v: string) => formatDecimal(v, locale, { fractionDigits: 2 });
  const steps = visibleSteps(result.visual.scale.map((s) => raw(s.value)));
  const tail =
    z > 0
      ? curvePath(Math.min(z, LIMIT), LIMIT, true)
      : z < 0
        ? curvePath(-LIMIT, Math.max(z, -LIMIT), true)
        : null;
  const mx = x(z);
  const labelX = Math.max(52, Math.min(308, mx));
  const zLabel = `${messageText(messages, "z-score.visual.z")} = ${formatDecimal(result.answer.value, locale, { fractionDigits: DIGITS })}`;
  return (
    <svg
      viewBox="0 0 360 200"
      style={{
        width: "100%",
        maxWidth: 420,
        height: "auto",
        display: "block",
        margin: "0 auto",
        overflow: "visible",
      }}
      aria-hidden="true"
    >
      {tail ? <path d={tail} style={{ fill: soft }} /> : null}
      <path
        d={`M${x(-LIMIT)} ${BASE}H${x(LIMIT)}`}
        stroke="var(--oc-line)"
        strokeWidth="1.5"
      />
      <path
        d={`M${X0} ${BASE}V${y(0)}`}
        stroke="var(--oc-muted)"
        strokeWidth="1.25"
        strokeDasharray="3 3"
      />
      <path
        d={curvePath(-LIMIT, LIMIT, false)}
        fill="none"
        stroke="var(--oc-accent)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d={`M${mx} ${BASE}V${y(Math.max(-LIMIT, Math.min(LIMIT, z))) - 2}`}
        stroke="var(--oc-ink)"
        strokeWidth="1.75"
      />
      <path
        d={`M${mx} ${y(Math.max(-LIMIT, Math.min(LIMIT, z))) - 2}V40`}
        stroke="var(--oc-ink)"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      <circle
        cx={mx}
        cy={y(Math.max(-LIMIT, Math.min(LIMIT, z)))}
        r="4.5"
        fill="var(--oc-accent)"
        stroke="var(--oc-surface)"
        strokeWidth="1.5"
      />
      <text
        x={labelX}
        y="14"
        textAnchor="middle"
        fontSize="13"
        fill="var(--oc-muted)"
      >
        {messageText(messages, "z-score.visual.value")}{" "}
        <tspan fontFamily={mono} fill="var(--oc-ink)">
          {value ? raw(value) : ""}
        </tspan>
      </text>
      <text
        x={labelX}
        y="33"
        textAnchor="middle"
        fontSize="15"
        fontFamily={mono}
        fontWeight="600"
        fill="var(--oc-accent)"
      >
        {zLabel}
      </text>
      {result.visual.scale.map((s) => (
        <g key={s.z}>
          <path
            d={`M${x(s.z)} ${BASE}v5`}
            stroke="var(--oc-line)"
            strokeWidth="1.5"
          />
          <text
            x={x(s.z)}
            y={BASE + 20}
            textAnchor="middle"
            fontSize="12"
            fontFamily={mono}
            fill="var(--oc-muted)"
          >
            {s.z === 0
              ? formatDecimal("0", locale)
              : `${s.z > 0 ? "+" : "−"}${formatDecimal(String(Math.abs(s.z)), locale)}σ`}
          </text>
          {steps.includes(s.z) ? (
            <text
              x={x(s.z)}
              y={BASE + 39}
              textAnchor="middle"
              fontSize="13"
              fontFamily={mono}
              fill="var(--oc-ink)"
            >
              {raw(s.value)}
            </text>
          ) : null}
        </g>
      ))}
      <text
        x={X0}
        y={BASE + 56}
        textAnchor="middle"
        fontSize="12"
        fill="var(--oc-muted)"
      >
        {messageText(messages, "z-score.visual.mean")}
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
      visual={({ result, show, messages, locale }) => {
        if (!isZScoreResult(result)) return null;
        const row = (key: string) =>
          result.visual.rows.find((r) => r.labelKey.endsWith(`.${key}`))
            ?.value ?? "0";
        const z = Number(result.answer.value);
        const vars = {
          value: formatDecimal(row("value"), locale),
          mean: formatDecimal(row("mean"), locale),
          answer: show(result.answer.value),
          distance: show(result.answer.value.replace(/^-/, "")),
        };
        const summaryKey = z > 0 ? "above" : z < 0 ? "below" : ("at" as const);
        return (
          <VizFigure
            caption={messageText(messages, "z-score.visual.caption")}
            summary={fillMessage(
              messageText(messages, `z-score.visual.summary.${summaryKey}`),
              vars,
            )}
            note={messageText(messages, "z-score.visual.note")}
          >
            <BellCurve result={result} locale={locale} messages={messages} />
          </VizFigure>
        );
      }}
    />
  );
}
