import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const surface = "var(--oc-surface)";
const line = "var(--oc-line)";

const grain = (cx: number, cy: number, angle: number) => (
  <ellipse
    cx={cx}
    cy={cy}
    rx="4"
    ry="7"
    transform={`rotate(${angle} ${cx} ${cy})`}
    fill={surface}
    stroke={accent}
    strokeWidth="1.75"
  />
);

/** A flour sack (100%) next to a water jug two-thirds its height: 65% hydration. */
export const bakingRatiosArt: ReactNode = (
  <g strokeLinecap="round" strokeLinejoin="round">
    <path d="M40 148H280" stroke={line} strokeWidth="2" />
    {/* flour sack */}
    <path
      d="M80 62L86 42H146L152 62Z"
      fill={surface}
      stroke={accent}
      strokeWidth="2.5"
    />
    <path
      d="M76 60H156Q160 60 160.5 64L166 142Q166 146 162 146H70Q66 146 66 142L71.5 64Q72 60 76 60Z"
      fill={soft}
      stroke={accent}
      strokeWidth="2.5"
    />
    <path d="M116 88V126" stroke={accent} strokeWidth="1.75" />
    {grain(116, 84, 0)}
    {grain(109, 98, -35)}
    {grain(123, 98, 35)}
    {grain(109, 112, -35)}
    {grain(123, 112, 35)}
    {/* water jug */}
    <path
      d="M248 100H256A6 6 0 0 1 262 106V122A6 6 0 0 1 256 128H246"
      fill="none"
      stroke={accent}
      strokeWidth="2.5"
    />
    <path d="M198 90H250L246 146H202Z" fill={surface} />
    <path d="M199 106H249L246 146H202Z" fill={accent} />
    <path
      d="M190 84L198 90H250L246 146H202L198 90"
      fill="none"
      stroke={accent}
      strokeWidth="2.5"
    />
    <text
      x="224"
      y="74"
      fontSize="20"
      fill={accent}
      fontFamily="var(--oc-font-mono)"
      textAnchor="middle"
    >
      65%
    </text>
  </g>
);
