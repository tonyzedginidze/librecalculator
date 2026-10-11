import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const surface = "var(--oc-surface)";
const line = "var(--oc-line)";

const cx = 160;
const cy = 92;
const r = 54;
const polar = (radius: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [
    Math.round((cx + radius * Math.cos(a)) * 2) / 2,
    Math.round((cy + radius * Math.sin(a)) * 2) / 2,
  ] as const;
};
const [ex, ey] = polar(r - 8, 135);

/** A stopwatch with the elapsed span shaded on its face. */
export const durationArt: ReactNode = (
  <g>
    <path
      d="M150 28H170M160 28V38M199 47L206 40"
      stroke={accent}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={surface}
      stroke={accent}
      strokeWidth="2.5"
    />
    <path
      d={`M${cx} ${cy}V${cy - r + 8}A${r - 8} ${r - 8} 0 0 1 ${ex} ${ey}Z`}
      fill={soft}
    />
    {Array.from({ length: 12 }, (_, i) => {
      const deg = i * 30;
      const [x1, y1] = polar(r - 3, deg);
      const [x2, y2] = polar(i % 3 ? r - 7 : r - 11, deg);
      return (
        <line
          key={deg}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={i % 3 ? line : accent}
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      );
    })}
    <line
      x1={cx}
      y1={cy}
      x2={ex}
      y2={ey}
      stroke={accent}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx={cx} cy={cy} r="4.5" fill={accent} />
    <line
      x1="40"
      y1="148"
      x2="280"
      y2="148"
      stroke={line}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </g>
);
