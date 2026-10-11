import { NumericTopic } from "../../components/numeric-topic";
import type { TopicViewProps } from "../../view-contract";
import { PhysicsFigure, physicsSvg, physicsValues } from "../physics-visual";
import { adapter } from "./adapter";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const muted = "var(--oc-muted)";
const ARROWS = [118, 160, 202];

export default function View(props: TopicViewProps) {
  return (
    <NumericTopic
      {...props}
      adapter={adapter}
      fractionDigits={1}
      visual={(ctx) => {
        const v = physicsValues(ctx, "pressure");
        const pushing = Number(v.raw("pressure.field.force")) > 0;
        return (
          <PhysicsFigure
            ctx={ctx}
            id="pressure"
            terms={[
              { field: "force", unitKey: "pressure.unit.n" },
              { field: "area", unitKey: "pressure.unit.m2" },
            ]}
            ops={["÷", "="]}
          >
            <svg
              viewBox="0 0 320 140"
              style={physicsSvg.style}
              aria-hidden="true"
            >
              <path
                d="M64 108L100 80H256L220 108Z"
                fill={soft}
                stroke={accent}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {pushing
                ? ARROWS.map((x) => (
                    <path
                      key={x}
                      d={`M${x} 16V94M${x - 7} 86L${x} 94L${x + 7} 86`}
                      fill="none"
                      stroke={accent}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))
                : null}
              <text x="214" y="40" fill={accent} style={physicsSvg.label}>
                {v.field("force", "pressure.unit.n")}
              </text>
              <text
                x="160"
                y="130"
                textAnchor="middle"
                fill={muted}
                style={{ ...physicsSvg.label, fontWeight: 400 }}
              >
                {v.field("area", "pressure.unit.m2")}
              </text>
            </svg>
          </PhysicsFigure>
        );
      }}
    />
  );
}
