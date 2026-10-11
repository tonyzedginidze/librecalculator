import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const surface = "var(--oc-surface)";
const ink = "var(--oc-ink)";

const outline = {
  stroke: accent,
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** One spoon hanging straight down from the ring, rotated into the fan. */
function spoon(angle: number, reach: number, r: number) {
  const cy = 46 + reach;
  return (
    <g transform={`rotate(${angle} 160 46)`}>
      <rect
        x="155"
        y="58"
        width="10"
        height={cy - r - 54}
        rx="5"
        fill={surface}
        {...outline}
      />
      <ellipse cx="160" cy={cy} rx={r - 4} ry={r} fill={surface} {...outline} />
      <ellipse cx="160" cy={cy + 2} rx={r - 9} ry={r - 7} fill={soft} />
    </g>
  );
}

/** A set of three measuring spoons, largest in the middle, fanned on a ring. */
export const cookingMeasuresArt: ReactNode = (
  <g>
    {spoon(42, 76, 19)}
    {spoon(-42, 68, 14)}
    {spoon(0, 76, 26)}
    <circle cx="160" cy="46" r="15" fill="none" {...outline} />
    <text
      x="236"
      y="140"
      fontSize="18"
      fill={ink}
      fontFamily="var(--oc-font-mono)"
      textAnchor="middle"
    >
      15 mL
    </text>
  </g>
);
