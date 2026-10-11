import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const line = "var(--oc-line)";

const outline = {
  stroke: accent,
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** A folding-rule segment with a measured span marked above it. */
export const lengthArt: ReactNode = (
  <g>
    <line
      x1="40"
      y1="148"
      x2="280"
      y2="148"
      stroke={line}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect
      x="50"
      y="84"
      width="220"
      height="50"
      rx="4"
      fill={soft}
      {...outline}
    />
    {Array.from({ length: 21 }, (_, i) => {
      const x = 60 + i * 10;
      const major = i % 5 === 0;
      return (
        <line
          // biome-ignore lint/suspicious/noArrayIndexKey: ticks are positional
          key={i}
          x1={x}
          y1="84"
          x2={x}
          y2={major ? 106 : 95}
          stroke={accent}
          strokeWidth={major ? 2.5 : 1.75}
          strokeLinecap="round"
        />
      );
    })}
    <path d="M60 56V70M160 56V70" {...outline} fill="none" />
    <path
      d="M60 63H160"
      stroke={accent}
      strokeWidth="1.75"
      strokeDasharray="4 4"
      strokeLinecap="round"
    />
    <text
      x="214"
      y="70"
      fontFamily="var(--oc-font-mono)"
      fontSize="20"
      textAnchor="middle"
      fill={accent}
    >
      2.54
    </text>
  </g>
);
