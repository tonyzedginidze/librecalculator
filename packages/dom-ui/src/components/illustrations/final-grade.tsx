import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const surface = "var(--oc-surface)";
const line = "var(--oc-line)";

/** A grade track: coursework filled, the final's share solid up to the target flag. */
export const finalGradeArt: ReactNode = (
  <g strokeLinecap="round" strokeLinejoin="round">
    {[60, 100, 140, 180, 220, 260].map((x) => (
      <line
        key={x}
        x1={x}
        y1="130"
        x2={x}
        y2="138"
        stroke={line}
        strokeWidth="2"
      />
    ))}
    <rect
      x="56"
      y="94"
      width="208"
      height="24"
      rx="6"
      fill={surface}
      stroke={line}
      strokeWidth="2"
    />
    <rect
      x="56"
      y="94"
      width="176"
      height="24"
      rx="6"
      fill={soft}
      stroke={accent}
      strokeWidth="2.5"
    />
    <path d="M184 94h42a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6h-42z" fill={accent} />
    <line
      x1="232"
      y1="44"
      x2="232"
      y2="124"
      stroke={accent}
      strokeWidth="2.5"
    />
    <path
      d="M232 44h34l-8 11 8 11h-34z"
      fill={soft}
      stroke={accent}
      strokeWidth="2.5"
    />
    <text
      x="196"
      y="78"
      fill={accent}
      fontSize="20"
      fontFamily="var(--oc-font-mono)"
      textAnchor="middle"
    >
      92%
    </text>
  </g>
);
