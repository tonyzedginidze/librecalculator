import type { ReactNode } from "react";
import { physicsOperationPaths, physicsScenes } from "./physics-art";

const accent = "var(--oc-accent)",
  soft = "var(--oc-accent-soft)",
  line = "var(--oc-line)",
  surface = "var(--oc-surface)",
  mono = "var(--oc-font-mono)";

export const scienceScenes: Record<string, ReactNode> = {
  "z-score": (
    <g>
      <path d="M206 79.5C225.5 107 246 140 276 140H206Z" fill={soft} />
      <line
        x1="40"
        y1="140"
        x2="280"
        y2="140"
        stroke={line}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="160"
        y1="48"
        x2="160"
        y2="140"
        stroke={line}
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M44 140C96 140 118 42 160 42C202 42 224 140 276 140"
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="206"
        y1="79.5"
        x2="206"
        y2="140"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx="206"
        cy="79.5"
        r="5.5"
        fill={accent}
        stroke={surface}
        strokeWidth="2"
      />
      <text x="218" y="62" fill={accent} fontSize="20" fontFamily={mono}>
        +1.5σ
      </text>
    </g>
  ),

  "confidence-interval": (
    <g>
      <path
        d="M112 94.3C129.2 73.2 142.5 50 160 50C177.5 50 190.8 73.2 208 94.3V128H112Z"
        fill={soft}
      />
      <path
        d="M112 94.3V128M208 94.3V128"
        stroke={accent}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M56 128C110 128 128 50 160 50C192 50 210 128 264 128"
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="128"
        x2="280"
        y2="128"
        stroke={line}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M112 140v12M208 140v12M112 146H208"
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx="160"
        cy="146"
        r="5.5"
        fill={accent}
        stroke={surface}
        strokeWidth="2"
      />
      <text
        x="160"
        y="112"
        textAnchor="middle"
        fill={accent}
        fontSize="20"
        fontFamily={mono}
      >
        95%
      </text>
    </g>
  ),

  probability: (
    <g>
      <rect
        x="56"
        y="30"
        width="208"
        height="120"
        rx="4"
        fill="none"
        stroke={line}
        strokeWidth="2"
      />
      <circle
        cx="130"
        cy="90"
        r="50"
        fill={soft}
        stroke={accent}
        strokeWidth="2.5"
      />
      <circle
        cx="190"
        cy="90"
        r="50"
        fill={soft}
        stroke={accent}
        strokeWidth="2.5"
      />
      <path
        d="M160 50A50 50 0 0 1 160 130A50 50 0 0 1 160 50Z"
        fill={accent}
        stroke={accent}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle
        cx="130"
        cy="90"
        r="50"
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
      />
    </g>
  ),

  "weighted-average": (
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
      <rect
        x="56"
        y="100"
        width="208"
        height="8"
        rx="3"
        fill={surface}
        stroke={accent}
        strokeWidth="2.5"
      />
      <path
        d="M118 108L98 148H138Z"
        fill={accent}
        stroke={accent}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <rect
        x="64"
        y="52"
        width="48"
        height="48"
        rx="4"
        fill={soft}
        stroke={accent}
        strokeWidth="2.5"
      />
      <rect
        x="232"
        y="76"
        width="24"
        height="24"
        rx="3"
        fill={soft}
        stroke={accent}
        strokeWidth="2.5"
      />
      <line
        x1="118"
        y1="40"
        x2="118"
        y2="92"
        stroke={line}
        strokeWidth="2"
        strokeDasharray="4 4"
      />
    </g>
  ),

  ...physicsScenes,
};

const statisticsOperationPaths: Record<string, ReactNode> = {
  "standard-score": (
    <>
      <path d="M3 19h18" />
      <path d="M4 18.5c3.5 0 4.5-12 8-12s4.5 12 8 12" />
      <path d="M16.5 11v8" />
    </>
  ),
  "normal-interval": (
    <>
      <path d="M4 12h16M4 8v8M20 8v8" />
      <circle cx="12" cy="12" r="2.25" fill="currentColor" />
    </>
  ),
  complement: (
    <>
      <path d="M11 13V5a8 8 0 1 0 8 8z" />
      <path d="M13 11V3a8 8 0 0 1 8 8z" />
    </>
  ),
  "independent-both": (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <path d="M12 4v16M4 12h16" />
      <rect x="4" y="12" width="8" height="8" fill="currentColor" />
    </>
  ),
  "event-union": (
    <>
      <path d="M12 6.2A6.5 6.5 0 1 0 12 17.8A6.5 6.5 0 1 0 12 6.2Z" />
      <path d="M12 9v6M9 12h6" />
    </>
  ),
  "weighted-mean": (
    <>
      <path d="M3 13h18M10 13l-2.5 7h5z" />
      <rect x="4" y="5.5" width="7" height="7.5" rx="1" />
      <rect x="16" y="9" width="4" height="4" rx="1" />
    </>
  ),
};

export const scienceOperationPaths: Record<string, ReactNode> = {
  ...physicsOperationPaths,
  ...statisticsOperationPaths,
};
