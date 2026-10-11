import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const surface = "var(--oc-surface)";
const line = "var(--oc-line)";

/** An upright cylinder with its radius across the top and a height dimension. */
export const cylinderArt: ReactNode = (
  <g strokeLinecap="round" strokeLinejoin="round">
    <line x1="48" y1="148" x2="272" y2="148" stroke={line} strokeWidth="2" />
    <path
      d="M104 44V128A52 16 0 0 0 208 128V44Z"
      fill={soft}
      stroke={accent}
      strokeWidth="2.5"
    />
    <path
      d="M104 128A52 16 0 0 1 208 128"
      fill="none"
      stroke={accent}
      strokeWidth="1.75"
      strokeDasharray="4 4"
      opacity="0.45"
    />
    <ellipse
      cx="156"
      cy="44"
      rx="52"
      ry="16"
      fill={surface}
      stroke={accent}
      strokeWidth="2.5"
    />
    <path d="M156 44H208" fill="none" stroke={accent} strokeWidth="1.75" />
    <circle cx="156" cy="44" r="4" fill={accent} />
    <path
      d="M234 44v84M228 44h12M228 128h12"
      fill="none"
      stroke={line}
      strokeWidth="2"
    />
  </g>
);
