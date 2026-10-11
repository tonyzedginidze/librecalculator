import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const line = "var(--oc-line)";

/** A rectangle with a right-angle mark, its diagonal and a height dimension. */
export const rectangleArt: ReactNode = (
  <g strokeLinecap="round" strokeLinejoin="round">
    <line x1="48" y1="148" x2="272" y2="148" stroke={line} strokeWidth="2" />
    <rect
      x="68"
      y="44"
      width="164"
      height="96"
      fill={soft}
      stroke={accent}
      strokeWidth="2.5"
    />
    <path
      d="M68 140L232 44"
      fill="none"
      stroke={accent}
      strokeWidth="1.75"
      strokeDasharray="4 4"
    />
    <path d="M218 140v-14h14" fill="none" stroke={accent} strokeWidth="1.75" />
    <circle cx="68" cy="140" r="4" fill={accent} />
    <circle cx="232" cy="44" r="4" fill={accent} />
    <path
      d="M252 44v96M246 44h12M246 140h12"
      fill="none"
      stroke={line}
      strokeWidth="2"
    />
  </g>
);
