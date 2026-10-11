import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const surface = "var(--oc-surface)";
const line = "var(--oc-line)";

const outline = {
  stroke: accent,
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** An equal-arm balance: a pound weight on one pan, metric weights on the other. */
export const massArt: ReactNode = (
  <g>
    <line
      x1="40"
      y1="148"
      x2="280"
      y2="148"
      stroke={line}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path d="M136 148L144 136H176L184 148Z" fill={soft} {...outline} />
    <path d="M160 136V52" {...outline} fill="none" />
    <path d="M78 58H242" {...outline} fill="none" />
    <circle cx="160" cy="52" r="7" fill={surface} {...outline} />
    <path d="M160 46V40" {...outline} />
    <path
      d="M78 58L58 108M78 58L98 108M242 58L222 108M242 58L262 108"
      stroke={accent}
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <path
      d="M50 108H106Q102 124 78 124Q54 124 50 108Z"
      fill={surface}
      {...outline}
    />
    <path
      d="M214 108H270Q266 124 242 124Q218 124 214 108Z"
      fill={surface}
      {...outline}
    />
    <rect
      x="64"
      y="86"
      width="28"
      height="22"
      rx="3"
      fill={soft}
      {...outline}
    />
    <path d="M230 108V96A6 6 0 0 1 242 96V108" fill={soft} {...outline} />
    <path d="M244 108V100A4.5 4.5 0 0 1 253 100V108" fill={soft} {...outline} />
  </g>
);
