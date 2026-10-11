import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const line = "var(--oc-line)";

/** Course bars, width = credits, height = grade points, levelled by the dashed average. */
const courses = [
  { x: 60, w: 28, y: 70 },
  { x: 96, w: 40, y: 98 },
  { x: 144, w: 28, y: 58 },
  { x: 180, w: 40, y: 86 },
] as const;

export const gpaArt: ReactNode = (
  <g strokeLinecap="round" strokeLinejoin="round">
    <line x1="48" y1="148" x2="272" y2="148" stroke={line} strokeWidth="2" />
    {courses.map((c) => (
      <rect
        key={c.x}
        x={c.x}
        y={c.y}
        width={c.w}
        height={148 - c.y}
        rx="4"
        fill={soft}
        stroke={accent}
        strokeWidth="2.5"
      />
    ))}
    <line
      x1="48"
      y1="80"
      x2="228"
      y2="80"
      stroke={accent}
      strokeWidth="2.5"
      strokeDasharray="4 4"
    />
    <text
      x="254"
      y="87"
      fill={accent}
      fontSize="20"
      fontFamily="var(--oc-font-mono)"
      textAnchor="middle"
    >
      3.5
    </text>
  </g>
);
