import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const surface = "var(--oc-surface)";
const line = "var(--oc-line)";
const ink = "var(--oc-ink)";

/** A measuring cup beside a kitchen scale reading the same amount in grams. */
export const cupGramConversionArt: ReactNode = (
  <g strokeLinecap="round" strokeLinejoin="round">
    <path d="M40 148H280" stroke={line} strokeWidth="2" />
    {/* measuring cup */}
    <path
      d="M140 72H150A8 8 0 0 1 158 80V110A8 8 0 0 1 150 118H137"
      fill="none"
      stroke={accent}
      strokeWidth="2.5"
    />
    <path d="M64 52H144L136 146H72Z" fill={surface} />
    <path d="M67.1 88H140.9L136 146H72Z" fill={soft} />
    <path d="M67.1 88H140.9" stroke={accent} strokeWidth="1.75" />
    <path
      d="M78 70H94M78 106H90M78 124H94"
      stroke={accent}
      strokeWidth="1.75"
    />
    <path
      d="M64 52H144L136 146H72Z"
      fill="none"
      stroke={accent}
      strokeWidth="2.5"
    />
    {/* kitchen scale */}
    <path d="M224 98V108" stroke={accent} strokeWidth="2.5" />
    <rect
      x="182"
      y="90"
      width="84"
      height="8"
      rx="3"
      fill={soft}
      stroke={accent}
      strokeWidth="2.5"
    />
    <rect
      x="174"
      y="108"
      width="100"
      height="38"
      rx="4"
      fill={surface}
      stroke={accent}
      strokeWidth="2.5"
    />
    <rect x="184" y="114" width="80" height="26" rx="3" fill={soft} />
    <text
      x="224"
      y="133"
      fontSize="18"
      fill={ink}
      fontFamily="var(--oc-font-mono)"
      textAnchor="middle"
    >
      240 g
    </text>
  </g>
);
