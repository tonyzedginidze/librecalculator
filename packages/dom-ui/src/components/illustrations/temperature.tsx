import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const surface = "var(--oc-surface)";

const outline = {
  stroke: accent,
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** A thermometer laid flat with a scale on each side: °C above, °F below. */
export const temperatureArt: ReactNode = (
  <g>
    <path d="M88 77H258A13 13 0 0 1 258 103H88" fill={surface} {...outline} />
    <circle cx="70" cy="90" r="24" fill={soft} {...outline} />
    <rect x="84" y="85" width="114" height="10" rx="5" fill={accent} />
    <circle cx="70" cy="90" r="13" fill={accent} />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
      const x = 110 + i * 20;
      return (
        <line
          key={`c${x}`}
          x1={x}
          y1={i % 2 ? 70 : 64}
          x2={x}
          y2="72"
          stroke={accent}
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      );
    })}
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
      const x = 104 + i * 18;
      return (
        <line
          key={`f${x}`}
          x1={x}
          y1="108"
          x2={x}
          y2={i % 2 ? 110 : 116}
          stroke={accent}
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      );
    })}
    <path
      d="M198 58V122"
      stroke={accent}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <text
      x="198"
      y="142"
      fontFamily="var(--oc-font-mono)"
      fontSize="18"
      textAnchor="middle"
      fill={accent}
    >
      °F
    </text>
  </g>
);
