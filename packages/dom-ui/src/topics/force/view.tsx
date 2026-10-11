import { NumericTopic } from "../../components/numeric-topic";
import type { TopicViewProps } from "../../view-contract";
import { PhysicsFigure, physicsSvg, physicsValues } from "../physics-visual";
import { adapter } from "./adapter";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const ink = "var(--oc-ink)";
const muted = "var(--oc-muted)";
const line = "var(--oc-line)";

export default function View(props: TopicViewProps) {
  return (
    <NumericTopic
      {...props}
      adapter={adapter}
      fractionDigits={2}
      visual={(ctx) => {
        const v = physicsValues(ctx, "force");
        const sign = Math.sign(Number(ctx.result.answer.value));
        // Block in the middle; the force arrow leaves the side it points to.
        const from = sign < 0 ? 120 : 200;
        const to = sign < 0 ? 34 : 286;
        const head = sign < 0 ? 1 : -1;
        // Short figures sit centred on the arrow; long ones hang from its tip and
        // rise above the block so they never cross it.
        const tipAnchor: "start" | "end" = sign < 0 ? "start" : "end";
        const place = (text: string, y: number, high: number) =>
          text.length <= 10
            ? { x: (from + to) / 2, y, textAnchor: "middle" as const }
            : { x: to, y: high, textAnchor: tipAnchor };
        const force = place(v.answer, 62, 36);
        const accel = v.field("acceleration", "force.unit.mps2");
        const mass = v.field("mass", "force.unit.kg");
        const massInside = mass.length <= 9;
        return (
          <PhysicsFigure
            ctx={ctx}
            id="force"
            terms={[
              { field: "mass", unitKey: "force.unit.kg" },
              { field: "acceleration", unitKey: "force.unit.mps2" },
            ]}
            ops={["×", "="]}
          >
            <svg
              viewBox="0 24 320 102"
              style={physicsSvg.style}
              aria-hidden="true"
            >
              <path
                d="M20 104H300"
                stroke={line}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect
                x="120"
                y="44"
                width="80"
                height="60"
                rx="4"
                fill={soft}
                stroke={accent}
                strokeWidth="2.5"
              />
              <text
                x="160"
                y={massInside ? 79 : 121}
                textAnchor="middle"
                fill={ink}
                style={physicsSvg.label}
              >
                {mass}
              </text>
              {sign === 0 ? (
                <text
                  x="160"
                  y="38"
                  textAnchor="middle"
                  fill={accent}
                  style={physicsSvg.label}
                >
                  {v.answer}
                </text>
              ) : (
                <g>
                  <path
                    d={`M${from} 74H${to}M${to + head * 10} 66L${to} 74L${to + head * 10} 82`}
                    fill="none"
                    stroke={accent}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text {...force} fill={accent} style={physicsSvg.label}>
                    {v.answer}
                  </text>
                  <text
                    {...place(accel, 94, 96)}
                    fill={muted}
                    style={{ ...physicsSvg.label, fontWeight: 400 }}
                  >
                    {accel}
                  </text>
                </g>
              )}
            </svg>
          </PhysicsFigure>
        );
      }}
    />
  );
}
