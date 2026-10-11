import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const surface = "var(--oc-surface)";
const line = "var(--oc-line)";

/** A small bowl scaled up into a large one: the same mix, three times the amount. */
export const recipeScalingArt: ReactNode = (
  <g strokeLinecap="round" strokeLinejoin="round">
    <path d="M40 148H280" stroke={line} strokeWidth="2" />
    {/* original batch */}
    <path d="M48 116H104A28 28 0 0 1 48 116Z" fill={surface} />
    <path d="M49.8 126H102.2A28 28 0 0 1 49.8 126Z" fill={soft} />
    <path d="M49.8 126H102.2" stroke={accent} strokeWidth="1.75" />
    <path
      d="M48 116A28 28 0 0 0 104 116"
      fill="none"
      stroke={accent}
      strokeWidth="2.5"
    />
    <path d="M44 116H108" stroke={accent} strokeWidth="2.5" />
    {/* scale arrow and factor */}
    <path
      d="M118 128H140M134 122l6 6-6 6"
      fill="none"
      stroke={accent}
      strokeWidth="2.5"
    />
    <text
      x="129"
      y="108"
      fontSize="20"
      fill={accent}
      fontFamily="var(--oc-font-mono)"
      textAnchor="middle"
    >
      ×3
    </text>
    {/* scaled batch */}
    <path d="M152 82H276A62 62 0 0 1 152 82Z" fill={surface} />
    <path d="M154.7 100H273.3A62 62 0 0 1 154.7 100Z" fill={soft} />
    <path d="M154.7 100H273.3" stroke={accent} strokeWidth="1.75" />
    <path
      d="M152 82A62 62 0 0 0 276 82"
      fill="none"
      stroke={accent}
      strokeWidth="2.5"
    />
    <path d="M148 82H280" stroke={accent} strokeWidth="2.5" />
  </g>
);
