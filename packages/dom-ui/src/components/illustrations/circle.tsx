import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const surface = "var(--oc-surface)";
const line = "var(--oc-line)";

/** A circle with its centre, radius and a quarter sector in accent. */
export const circleArt: ReactNode = (
  <g strokeLinecap="round" strokeLinejoin="round">
    <line x1="48" y1="148" x2="272" y2="148" stroke={line} strokeWidth="2" />
    <circle
      cx="148"
      cy="88"
      r="58"
      fill={soft}
      stroke={accent}
      strokeWidth="2.5"
    />
    <path d="M148 88H206" fill="none" stroke={accent} strokeWidth="2.5" />
    <circle cx="148" cy="88" r="4.5" fill={accent} />
    <circle
      cx="206"
      cy="88"
      r="4"
      fill={surface}
      stroke={accent}
      strokeWidth="2"
    />
    <text
      x="252"
      y="95"
      fontSize="20"
      fill={accent}
      textAnchor="middle"
      fontFamily="var(--oc-font-mono)"
    >
      πr²
    </text>
  </g>
);
