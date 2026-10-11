import type { ReactNode } from "react";

/**
 * Math-everyday pack: tile scenes (320x180) and operation icons (24x24).
 * House style: accent contours, accent-soft fills, line for quiet detail, one mono
 * label at most, 2.5 outlines and 1.75 detail strokes, no gradients.
 */

const accent = "var(--oc-accent)",
  soft = "var(--oc-accent-soft)",
  ink = "var(--oc-ink)",
  line = "var(--oc-line)",
  surface = "var(--oc-surface)",
  mono = "var(--oc-font-mono)";

const outline = {
  stroke: accent,
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const detail = { ...outline, strokeWidth: 1.75 };
const label = {
  fontFamily: mono,
  textAnchor: "middle" as const,
};
const ground = (
  <line
    x1="52"
    y1="148"
    x2="268"
    y2="148"
    stroke={line}
    strokeWidth="2"
    strokeLinecap="round"
  />
);

/** Normal curve centred at 160 with σ = 38 px, sampled on a half-pixel grid. */
const bell = (from: number, to: number) => {
  const points: string[] = [];
  for (let x = from; x <= to; x += 4) {
    const y = 138 - 90 * Math.exp(-(((x - 160) / 38) ** 2) / 2);
    points.push(`${x} ${Math.round(y * 2) / 2}`);
  }
  return points;
};
const bellCurve = `M${bell(58, 262).join("L")}`;
const bellBand = `M122 138L${bell(122, 198).join("L")}L198 138Z`;

/** Die pips for a face of size `s` at (x, y). */
const pips = (x: number, y: number, s: number, face: number[][]) =>
  face.map(([px = 0, py = 0]) => (
    <circle
      key={`${px}-${py}`}
      cx={x + (px * s) / 4}
      cy={y + (py * s) / 4}
      r={s / 13}
      fill={accent}
    />
  ));

export const mathScenes: Record<string, ReactNode> = {
  average: (
    <g>
      {ground}
      {[44, 84, 56, 76].map((h, i) => (
        <rect
          key={h}
          x={64 + i * 48}
          y={148 - h}
          width="32"
          height={h}
          rx="4"
          fill={soft}
          {...outline}
        />
      ))}
      {/* The mean of 44, 84, 56 and 76 is 65: the line sits at 148 − 65. */}
      <line
        x1="52"
        y1="83"
        x2="248"
        y2="83"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <text x="266" y="90" fontSize="22" fill={accent} {...label}>
        x̄
      </text>
    </g>
  ),

  "standard-deviation": (
    <g>
      <line
        x1="52"
        y1="138"
        x2="268"
        y2="138"
        stroke={line}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d={bellBand} fill={soft} />
      <line
        x1="160"
        y1="48"
        x2="160"
        y2="138"
        stroke={line}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d={bellCurve} fill="none" {...outline} />
      <path d="M122 83.5V138M198 83.5V138" fill="none" {...detail} />
      <path
        d="M162 118h34M191 114l5 4-5 4"
        fill="none"
        stroke={ink}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="179" y="108" fontSize="20" fill={ink} {...label}>
        σ
      </text>
    </g>
  ),

  ratio: (
    <g>
      <rect
        x="72"
        y="40"
        width="176"
        height="99"
        rx="4"
        fill={surface}
        {...outline}
      />
      <rect
        x="72"
        y="85"
        width="96"
        height="54"
        rx="4"
        fill={soft}
        {...outline}
      />
      <line
        x1="72"
        y1="139"
        x2="248"
        y2="40"
        stroke={accent}
        strokeWidth="1.75"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />
      <text x="212" y="118" fontSize="20" fill={ink} {...label}>
        16:9
      </text>
    </g>
  ),

  scientific: (
    <g>
      <rect
        x="96"
        y="30"
        width="128"
        height="120"
        rx="6"
        fill={surface}
        {...outline}
      />
      <rect
        x="108"
        y="42"
        width="104"
        height="30"
        rx="3"
        fill={soft}
        {...detail}
      />
      <text
        x="204"
        y="63"
        fontSize="18"
        fill={ink}
        fontFamily={mono}
        textAnchor="end"
      >
        1.4142
      </text>
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={108 + col * 27}
            y={84 + row * 20}
            width="23"
            height="14"
            rx="2.5"
            fill={row === 2 && col === 3 ? accent : row === 0 ? soft : "none"}
            stroke={row === 0 || (row === 2 && col === 3) ? accent : line}
            strokeWidth="1.75"
          />
        )),
      )}
      <path
        d="M113 91h2l2 4 3-8h4M141 93q2.5-6 5 0t5 0M171 95l-3-6m0 6l3-6M174 89.5h3"
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  ),

  "random-number": (
    <g>
      {ground}
      <rect
        x="80"
        y="64"
        width="84"
        height="84"
        rx="10"
        fill={soft}
        {...outline}
      />
      {pips(122, 106, 84, [
        [-1.25, -1.25],
        [1.25, -1.25],
        [0, 0],
        [-1.25, 1.25],
        [1.25, 1.25],
      ])}
      <g transform="rotate(14 214 92)">
        <rect
          x="182"
          y="60"
          width="64"
          height="64"
          rx="8"
          fill={surface}
          {...outline}
        />
        {pips(214, 92, 64, [
          [-1.25, -1.25],
          [0, 0],
          [1.25, 1.25],
        ])}
      </g>
    </g>
  ),

  "fuel-economy": (
    <g>
      {ground}
      <rect
        x="100"
        y="40"
        width="72"
        height="108"
        rx="4"
        fill={soft}
        {...outline}
      />
      <rect
        x="112"
        y="54"
        width="48"
        height="30"
        rx="3"
        fill={surface}
        {...detail}
      />
      <text x="136" y="75" fontSize="18" fill={ink} {...label}>
        7.0
      </text>
      <path d="M112 100h48M112 112h32" fill="none" {...detail} />
      <path
        d="M172 66h10a8 8 0 0 1 8 8v44a8 8 0 0 0 16 0V76"
        fill="none"
        {...outline}
      />
      <rect
        x="199"
        y="52"
        width="14"
        height="24"
        rx="3"
        fill={surface}
        {...outline}
      />
      <path
        d="M246 90c9 12 13 19 13 25a13 13 0 0 1-26 0c0-6 4-13 13-25z"
        fill={accent}
        {...outline}
      />
    </g>
  ),
};

export const mathOperationPaths: Record<string, ReactNode> = {
  // Mean: a beam balanced on a fulcrum.
  mean: (
    <>
      <path d="M3 9h18M12 9l-4 10h8z" />
      <circle cx="5.5" cy="6" r="2" />
      <circle cx="18.5" cy="6" r="2" />
    </>
  ),
  // Median: ascending bars with the middle one marked.
  median: (
    <>
      <path d="M5 20v-5M12 20V10M19 20V4" />
      <path d="M10 5.5l2 2 2-2" />
    </>
  ),
  // Mode: dot columns, the tallest is the most frequent value.
  mode: (
    <>
      <circle cx="6" cy="18" r="1.8" />
      <circle cx="12" cy="18" r="1.8" />
      <circle cx="12" cy="12.5" r="1.8" />
      <circle cx="12" cy="7" r="1.8" />
      <circle cx="18" cy="18" r="1.8" />
      <circle cx="18" cy="12.5" r="1.8" />
    </>
  ),
  // Population: every member of the group, a full grid of points in a frame.
  population: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      {[8, 12, 16].flatMap((y) =>
        [8, 12, 16].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="currentColor" />
        )),
      )}
    </>
  ),
  // Sample: a magnifier picking out a few points.
  sample: (
    <>
      <circle cx="10" cy="10" r="6" />
      <path d="M14.5 14.5L20 20" />
      <circle cx="8.5" cy="9" r="1" fill="currentColor" />
      <circle cx="11.5" cy="11.5" r="1" fill="currentColor" />
    </>
  ),
  // Simplify a ratio: two bars with a colon between them.
  quotient: (
    <>
      <path d="M5 20V6M19 20v-8" />
      <circle cx="12" cy="10" r="1.1" fill="currentColor" />
      <circle cx="12" cy="16" r="1.1" fill="currentColor" />
    </>
  ),
  // Scale a ratio: a small rectangle growing into a similar large one.
  "scale-ratio": (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3 19v-6h8v6M11 13l6-5M14 8h3v3" />
    </>
  ),
  "square-root": <path d="M3 13h2.5l3 6L13 5h8" />,
  // Power: a base with a raised exponent.
  "integer-power": (
    <>
      <path d="M4 11l7 9M11 11l-7 9" />
      <path d="M15 5.5a2.2 2.2 0 1 1 3.8 1.6L15 11h5" />
    </>
  ),
  // Natural log: a curve that rises fast and then flattens, on axes.
  "natural-log": (
    <>
      <path d="M4 3v17h17" />
      <path d="M6.5 19C7.5 13 10 10 13.5 9S18 8 20 7.5" />
    </>
  ),
  // Sine: one wave over a centre line.
  "sine-degrees": (
    <>
      <path d="M3 12h18" strokeOpacity="0.45" />
      <path d="M3 12q4.5-14 9 0t9 0" />
    </>
  ),
  // Seeded pick: a die showing three.
  "seeded-integer": (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.1" fill="currentColor" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1.1" fill="currentColor" />
    </>
  ),
  // Litres per 100 km: a fuel drop.
  "litres-per-100km": (
    <>
      <path d="M12 3c3.5 4.8 6 8.3 6 11.5a6 6 0 0 1-12 0C6 11.3 8.5 7.8 12 3z" />
      <path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5" />
    </>
  ),
  // Kilometres per litre: a road running to the horizon.
  "kilometres-per-litre": (
    <>
      <path d="M4 21L10 3M20 21L14 3" />
      <path d="M12 19v-3M12 12v-2.5M12 6.5V5" />
    </>
  ),
};
