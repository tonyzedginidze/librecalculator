import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const surface = "var(--oc-surface)";
const line = "var(--oc-line)";

/** A sphere resting on the ground, with its equator and a radius. */
export const sphereArt: ReactNode = (
  <g strokeLinecap="round" strokeLinejoin="round">
    <line x1="48" y1="148" x2="272" y2="148" stroke={line} strokeWidth="2" />
    <circle
      cx="160"
      cy="88"
      r="58"
      fill={soft}
      stroke={accent}
      strokeWidth="2.5"
    />
    <path
      d="M102 88A58 17 0 0 1 218 88"
      fill="none"
      stroke={accent}
      strokeWidth="1.75"
      strokeDasharray="4 4"
      opacity="0.45"
    />
    <path
      d="M102 88A58 17 0 0 0 218 88"
      fill="none"
      stroke={accent}
      strokeWidth="1.75"
    />
    <path d="M160 88L204 58" fill="none" stroke={accent} strokeWidth="2.5" />
    <circle cx="160" cy="88" r="4.5" fill={accent} />
    <circle
      cx="204"
      cy="58"
      r="4"
      fill={surface}
      stroke={accent}
      strokeWidth="2"
    />
  </g>
);
