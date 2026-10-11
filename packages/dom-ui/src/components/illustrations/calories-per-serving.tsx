import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const surface = "var(--oc-surface)";
const line = "var(--oc-line)";

/** A plate cut into four servings, one served, between a fork and a knife. */
export const caloriesPerServingArt: ReactNode = (
  <g strokeLinecap="round" strokeLinejoin="round">
    {/* fork: three tines on a rounded head, then a handle */}
    <path
      d="M70 36V52a6 6 0 0 0 12 0V36M76 36V58M76 58V66"
      fill="none"
      stroke={accent}
      strokeWidth="2.5"
    />
    <rect
      x="71"
      y="66"
      width="10"
      height="78"
      rx="5"
      fill={soft}
      stroke={accent}
      strokeWidth="2.5"
    />
    {/* plate */}
    <circle
      cx="160"
      cy="90"
      r="56"
      fill={surface}
      stroke={accent}
      strokeWidth="2.5"
    />
    <circle
      cx="160"
      cy="90"
      r="44"
      fill="none"
      stroke={line}
      strokeWidth="1.75"
    />
    <circle cx="160" cy="90" r="35" fill={soft} />
    <path d="M160 90V55A35 35 0 0 1 195 90Z" fill={accent} />
    <path d="M160 55V125M125 90H195" stroke={surface} strokeWidth="2.5" />
    {/* knife */}
    <path
      d="M243 92V40c8 4 12 22 10 52z"
      fill={surface}
      stroke={accent}
      strokeWidth="2.5"
    />
    <rect
      x="243"
      y="92"
      width="10"
      height="52"
      rx="5"
      fill={soft}
      stroke={accent}
      strokeWidth="2.5"
    />
  </g>
);
