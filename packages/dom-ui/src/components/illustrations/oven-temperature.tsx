import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const surface = "var(--oc-surface)";
const line = "var(--oc-line)";
const ink = "var(--oc-ink)";

/** An oven front: dials, a temperature readout and a dish on the rack. */
export const ovenTemperatureArt: ReactNode = (
  <g strokeLinecap="round" strokeLinejoin="round">
    <path d="M48 148H272" stroke={line} strokeWidth="2" />
    <rect
      x="72"
      y="32"
      width="176"
      height="114"
      rx="6"
      fill={soft}
      stroke={accent}
      strokeWidth="2.5"
    />
    <path d="M72 62H248" stroke={accent} strokeWidth="1.75" />
    <circle
      cx="94"
      cy="47"
      r="7.5"
      fill={surface}
      stroke={accent}
      strokeWidth="1.75"
    />
    <path d="M94 47L89.5 42.5" stroke={accent} strokeWidth="1.75" />
    <circle
      cx="120"
      cy="47"
      r="7.5"
      fill={surface}
      stroke={accent}
      strokeWidth="1.75"
    />
    <path d="M120 47V40.5" stroke={accent} strokeWidth="1.75" />
    <text
      x="208"
      y="54"
      fontSize="18"
      fill={ink}
      fontFamily="var(--oc-font-mono)"
      textAnchor="middle"
    >
      180°C
    </text>
    {/* door handle and window */}
    <path d="M110 72H210" stroke={accent} strokeWidth="2.5" />
    <rect
      x="90"
      y="82"
      width="140"
      height="52"
      rx="4"
      fill={surface}
      stroke={accent}
      strokeWidth="1.75"
    />
    <path d="M98 120H222" stroke={line} strokeWidth="1.75" />
    <rect x="134" y="104" width="52" height="16" rx="3" fill={accent} />
  </g>
);
