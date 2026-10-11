import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";

/** One square per question: 17 of 20 correct. */
const missed = new Set([8, 13, 19]);
const cells = Array.from({ length: 20 }, (_, i) => ({
  i,
  x: 58 + (i % 5) * 30,
  y: 34 + Math.floor(i / 5) * 30,
}));

export const testScoreArt: ReactNode = (
  <g strokeLinecap="round" strokeLinejoin="round">
    {cells
      .filter((c) => !missed.has(c.i))
      .map((c) => (
        <rect
          key={c.i}
          x={c.x}
          y={c.y}
          width="22"
          height="22"
          rx="4"
          fill={soft}
          stroke={accent}
          strokeWidth="2.5"
        />
      ))}
    <g opacity="0.45">
      {cells
        .filter((c) => missed.has(c.i))
        .map((c) => (
          <rect
            key={c.i}
            x={c.x}
            y={c.y}
            width="22"
            height="22"
            rx="4"
            fill="none"
            stroke={accent}
            strokeWidth="2.5"
          />
        ))}
    </g>
    <text
      x="236"
      y="97"
      fill={accent}
      fontSize="22"
      fontFamily="var(--oc-font-mono)"
      textAnchor="middle"
    >
      85%
    </text>
  </g>
);
