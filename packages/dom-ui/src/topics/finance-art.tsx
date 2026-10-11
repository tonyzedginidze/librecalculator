import type { ReactNode } from "react";

/*
 * Finance pack tiles (320x180) and operation icons (24x24). House style: accent
 * contours and one key mark, accent-soft main fills, surface paper, line for ground
 * and quiet detail, one mono figure at most.
 */

const accent = "var(--oc-accent)",
  soft = "var(--oc-accent-soft)",
  ink = "var(--oc-ink)",
  line = "var(--oc-line)",
  surface = "var(--oc-surface)";

const outline = {
  stroke: accent,
  strokeWidth: 2.5,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};
const detail = {
  stroke: accent,
  strokeWidth: 1.75,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
  fill: "none",
};
const figure = {
  fontFamily: "var(--oc-font-mono)",
  fontWeight: 600,
  textAnchor: "middle" as const,
};
const ground = (
  <line
    x1="48"
    y1="148"
    x2="272"
    y2="148"
    stroke={line}
    strokeWidth="2"
    strokeLinecap="round"
  />
);

export const financeScenes: Record<string, ReactNode> = {
  // A house on a fixed rate: the roof and door carry the accent.
  mortgage: (
    <>
      {ground}
      <rect
        x="82"
        y="84"
        width="108"
        height="64"
        rx="4"
        fill={soft}
        {...outline}
      />
      <path d="M68 92L136 40L204 92" fill="none" {...outline} />
      <rect x="124" y="108" width="24" height="40" rx="3" fill={accent} />
      <rect
        x="94"
        y="100"
        width="20"
        height="18"
        rx="2.5"
        {...detail}
        fill={surface}
      />
      <rect
        x="158"
        y="100"
        width="20"
        height="18"
        rx="2.5"
        {...detail}
        fill={surface}
      />
      <rect
        x="214"
        y="58"
        width="62"
        height="34"
        rx="4"
        fill={surface}
        {...outline}
      />
      <text x="245" y="82" fontSize="18" fill={ink} {...figure}>
        6.5%
      </text>
    </>
  ),
  // A savings jar filling with coins, one more on the way in.
  savings: (
    <>
      {ground}
      <rect
        x="116"
        y="44"
        width="88"
        height="14"
        rx="4"
        fill={surface}
        {...outline}
      />
      <path
        d="M116 58h88a12 12 0 0 1 12 12v62a16 16 0 0 1-16 16h-80a16 16 0 0 1-16-16V70a12 12 0 0 1 12-12z"
        fill={surface}
        {...outline}
      />
      {[132, 118, 104].map((y, i) => (
        <rect
          key={y}
          x={128 + (i === 2 ? 8 : 0)}
          y={y}
          width={i === 2 ? 48 : 64}
          height="12"
          rx="6"
          fill={i === 0 ? accent : soft}
          {...outline}
        />
      ))}
      <path
        d="M150 51h20"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* A coin on its way to the slot; the path stops short of both shapes. */}
      <circle cx="244" cy="46" r="14" fill={soft} {...outline} />
      <path d="M244 39v14" {...detail} />
      <path d="M226 40c-14-10-36-12-50-2" strokeDasharray="4 4" {...detail} />
    </>
  ),
  // Money in, more money out: a short bar, a tall accent bar and the gain.
  roi: (
    <>
      {ground}
      <rect
        x="84"
        y="98"
        width="44"
        height="50"
        rx="4"
        fill={soft}
        {...outline}
      />
      <rect
        x="150"
        y="58"
        width="44"
        height="90"
        rx="4"
        fill={accent}
        {...outline}
      />
      <path
        d="M106 86C120 58 140 46 168 42"
        strokeDasharray="4 4"
        {...detail}
      />
      <path d="M160 36l9 6-7 8" {...detail} />
      <text x="244" y="84" fontSize="22" fill={accent} {...figure}>
        +24%
      </text>
    </>
  ),
  // A pay slip and a clock: salary and the hourly rate behind it.
  salary: (
    <>
      {ground}
      <rect
        x="64"
        y="66"
        width="152"
        height="74"
        rx="4"
        fill={soft}
        {...outline}
      />
      <rect
        x="76"
        y="78"
        width="128"
        height="50"
        rx="3"
        {...detail}
        fill={surface}
      />
      <circle cx="140" cy="103" r="15" {...detail} fill={soft} />
      <text x="140" y="110" fontSize="19" fill={accent} {...figure}>
        $
      </text>
      <circle cx="234" cy="64" r="28" fill={surface} {...outline} />
      <path d="M234 48v16l11 7" fill="none" {...outline} />
      <circle cx="234" cy="64" r="2.5" fill={accent} />
    </>
  ),
  // A price tag whose bar splits into cost and profit.
  "margin-markup": (
    <>
      <path
        d="M96 52h132a6 6 0 0 1 6 6v76a6 6 0 0 1-6 6H96L58 96z"
        fill={surface}
        {...outline}
      />
      <circle cx="84" cy="96" r="6" fill="none" {...outline} />
      <text x="166" y="92" fontSize="22" fill={ink} {...figure}>
        40%
      </text>
      <rect
        x="110"
        y="106"
        width="108"
        height="16"
        rx="4"
        fill={soft}
        {...outline}
      />
      <path d="M176 106h38a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-38z" fill={accent} />
      <rect
        x="110"
        y="106"
        width="108"
        height="16"
        rx="4"
        fill="none"
        {...outline}
      />
    </>
  ),
  // The same bag of shopping costs more: a ghost price behind the new one.
  // The same shopping bag, now with a higher price on its tag.
  inflation: (
    <>
      {ground}
      <path d="M116 70v-8a22 22 0 0 1 44 0v8" fill="none" {...outline} />
      <path d="M98 70h80l8 78H90z" fill={soft} {...outline} />
      <path d="M116 70v10M160 70v10" {...detail} />
      <path d="M160 56c14 4 24 10 34 14" {...detail} />
      <path
        d="M210 52h52a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4h-52l-14-18z"
        fill={surface}
        {...outline}
      />
      <circle cx="206" cy="70" r="3" fill={accent} />
      <text x="239" y="76" fontSize="18" fill={accent} {...figure}>
        $134
      </text>
    </>
  ),
  // A nest egg: savings that grow into retirement.
  retirement: (
    <>
      {ground}
      <ellipse cx="160" cy="80" rx="40" ry="50" fill={soft} {...outline} />
      <path d="M143 54a20 26 0 0 1 14-14" {...detail} />
      <path
        d="M72 106c6 26 40 40 88 40s82-14 88-40"
        fill={surface}
        {...outline}
      />
      <path d="M72 106h176" {...outline} />
      <path
        d="M90 120h140M108 133h104"
        stroke={line}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
};

/** Each operation answers a different question, so each has its own drawing. */
export const financeOperationPaths: Record<string, ReactNode> = {
  // Balance stepping down to zero.
  amortize: <path d="M4 4v16h16M7 7h3v4h3v4h4v3" />,
  // A jar with a coin going in.
  save: (
    <>
      <path d="M8 8h8a3 3 0 0 1 3 3v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a3 3 0 0 1 3-3z" />
      <path d="M10 5h4M12 12v4" />
    </>
  ),
  // A coin and an arrow climbing away from it.
  return: (
    <>
      <circle cx="8.5" cy="15.5" r="4.5" />
      <path d="M13 11l7-7M15 4h5v5" />
    </>
  ),
  // A clock: the hourly answer.
  "annual-to-hourly": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  // A calendar: the yearly answer.
  "hourly-to-annual": (
    <>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4M8 14h2M14 14h2M8 17h2" />
    </>
  ),
  // A price tag: profit as a share of the price.
  margin: (
    <>
      <path d="M3.5 12.5L12 4h8v8l-8.5 8.5z" />
      <circle cx="16" cy="8" r="1.4" />
    </>
  ),
  // A box with a plus: profit added on top of cost.
  markup: (
    <>
      <rect x="4" y="12" width="11" height="8" rx="1.5" />
      <path d="M18 4v7M14.5 7.5h7" />
    </>
  ),
  // A price tag with a rising arrow.
  "future-cost": (
    <>
      <path d="M3 13.5L10 6.5h5.5V12l-7 7z" />
      <circle cx="12.5" cy="9.5" r="1.2" />
      <path d="M18.5 20V8M16 10.5l2.5-2.5 2.5 2.5" />
    </>
  ),
  // A coin with a falling arrow: the same cash buys less.
  "purchasing-power": (
    <>
      <circle cx="9" cy="12" r="6" />
      <path d="M9 9v6M18.5 4v13M16 14.5l2.5 2.5 2.5-2.5" />
    </>
  ),
  // A growth line reaching a flag.
  project: (
    <>
      <path d="M4 20l5-5 3 3 6-7" />
      <path d="M18 11V3.5l3.5 1.75L18 7" />
    </>
  ),
};
