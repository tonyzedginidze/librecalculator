import type { ReactNode } from "react";

const ink = "var(--oc-ink)";
const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const surface = "var(--oc-surface)";
const line = "var(--oc-line)";

/** A marked paper; the ring shows the share of points earned. */
export const gradeArt: ReactNode = (
  <g strokeLinecap="round" strokeLinejoin="round">
    <rect
      x="64"
      y="30"
      width="124"
      height="118"
      rx="4"
      fill={surface}
      stroke={accent}
      strokeWidth="2.5"
    />
    <rect x="82" y="48" width="56" height="10" rx="3" fill={soft} />
    {[74, 90, 106, 122].map((y, i) => (
      <line
        key={y}
        x1="82"
        y1={y}
        x2={i % 2 ? 140 : 162}
        y2={y}
        stroke={line}
        strokeWidth="1.75"
      />
    ))}
    <circle
      cx="214"
      cy="104"
      r="38"
      fill={surface}
      stroke={line}
      strokeWidth="10"
    />
    <circle
      cx="214"
      cy="104"
      r="38"
      fill="none"
      stroke={accent}
      strokeWidth="10"
      pathLength="100"
      strokeDasharray="80 20"
      transform="rotate(-90 214 104)"
    />
    <text
      x="214"
      y="111"
      fill={ink}
      fontSize="19"
      fontFamily="var(--oc-font-mono)"
      textAnchor="middle"
    >
      80%
    </text>
  </g>
);
