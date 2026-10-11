import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const line = "var(--oc-line)";

/** A triangle with its altitude dropped onto the base at a right angle. */
export const triangleArt: ReactNode = (
  <g strokeLinecap="round" strokeLinejoin="round">
    <line x1="48" y1="148" x2="272" y2="148" stroke={line} strokeWidth="2" />
    <path
      d="M60 140L260 140L134 36Z"
      fill={soft}
      stroke={accent}
      strokeWidth="2.5"
    />
    <path
      d="M134 40V140"
      fill="none"
      stroke={accent}
      strokeWidth="1.75"
      strokeDasharray="4 4"
    />
    <path d="M134 128h12v12" fill="none" stroke={accent} strokeWidth="1.75" />
    <circle cx="134" cy="36" r="4" fill={accent} />
  </g>
);
