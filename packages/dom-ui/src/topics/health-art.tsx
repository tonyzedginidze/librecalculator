import type { ReactNode } from "react";

const accent = "var(--oc-accent)",
  soft = "var(--oc-accent-soft)",
  ink = "var(--oc-ink)",
  line = "var(--oc-line)",
  surface = "var(--oc-surface)";

const outline = {
  stroke: accent,
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const detail = {
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const label = {
  fontFamily: "var(--oc-font-mono)",
  fontWeight: 600,
  textAnchor: "middle" as const,
};
const ground = (x1: number, x2: number) => (
  <line
    x1={x1}
    y1="148"
    x2={x2}
    y2="148"
    stroke={line}
    strokeWidth="2"
    strokeLinecap="round"
  />
);

/** Vertical measuring rule with alternating ticks, used for height. */
const rule = (x: number, top: number, bottom: number) => (
  <g>
    <rect
      x={x}
      y={top}
      width="22"
      height={bottom - top}
      rx="4"
      fill={surface}
      {...outline}
    />
    {Array.from(
      { length: Math.floor((bottom - top - 12) / 12) },
      (_, i) => top + 12 + i * 12,
    ).map((y, i) => (
      <line
        key={y}
        x1={x}
        y1={y}
        x2={x + (i % 2 === 0 ? 12 : 7)}
        y2={y}
        stroke={accent}
        {...detail}
      />
    ))}
  </g>
);

export const healthScenes: Record<string, ReactNode> = {
  /* Height rule with its head bar resting over a bathroom scale that reads the BMI. */
  bmi: (
    <g>
      {ground(44, 276)}
      {rule(66, 32, 148)}
      <path d="M88 52H128" fill="none" {...outline} />
      <rect
        x="112"
        y="92"
        width="156"
        height="56"
        rx="8"
        fill={soft}
        {...outline}
      />
      <rect
        x="150"
        y="104"
        width="80"
        height="30"
        rx="4"
        fill={surface}
        stroke={accent}
        {...detail}
      />
      <text x="190" y="126" fontSize="20" fill={ink} {...label}>
        22.9
      </text>
    </g>
  ),

  /* A steady flame beside a resting pulse line: energy used at rest. */
  bmr: (
    <g>
      {ground(44, 276)}
      <path
        d="M118 32C132 52 162 72 162 108A44 40 0 0 1 74 108C74 86 86 74 94 62C96 76 102 84 110 88C108 66 112 48 118 32Z"
        fill={soft}
        {...outline}
      />
      <path
        d="M118 90C128 102 136 112 136 124A18 18 0 0 1 100 124C100 112 108 102 118 90Z"
        fill={accent}
        stroke={accent}
        {...detail}
      />
      <path
        d="M182 118H206L214 100L226 134L234 118H272"
        fill="none"
        {...outline}
      />
      <text x="227" y="74" fontSize="22" fill={ink} {...label}>
        kcal
      </text>
    </g>
  ),

  /* Resting energy column and the same column raised by the whole-day factor. */
  // Base energy, then the same block stacked with half again on top: 1.5 × the base.
  tdee: (
    <g>
      {ground(44, 276)}
      <rect
        x="84"
        y="88"
        width="60"
        height="60"
        rx="4"
        fill={soft}
        {...outline}
      />
      <path d="M176 88V62a4 4 0 0 1 4-4h52a4 4 0 0 1 4 4v26z" fill={accent} />
      <path d="M176 88h60v56a4 4 0 0 1-4 4h-52a4 4 0 0 1-4-4z" fill={soft} />
      <rect
        x="176"
        y="58"
        width="60"
        height="90"
        rx="4"
        fill="none"
        {...outline}
      />
      <path d="M176 88H236" fill="none" {...outline} />
      <text x="114" y="70" fontSize="22" fill={accent} {...label}>
        ×1.5
      </text>
    </g>
  ),

  /* A plate divided into three calorie shares, with a fork and a knife. */
  macros: (
    <g>
      {/* A nutrition card: protein, carbohydrate and fat as three rows. */}
      <rect
        x="104"
        y="32"
        width="112"
        height="116"
        rx="4"
        fill={surface}
        {...outline}
      />
      <rect x="120" y="46" width="48" height="8" rx="4" fill={line} />
      <path d="M120 66H200" fill="none" stroke={line} {...detail} />
      {[
        { y: 82, w: 52, fill: accent },
        { y: 106, w: 38, fill: soft },
        { y: 130, w: 24, fill: soft },
      ].map((row) => (
        <g key={row.y}>
          <rect
            x="120"
            y={row.y - 4}
            width="16"
            height="8"
            rx="4"
            fill={line}
          />
          <rect
            x="148"
            y={row.y - 6}
            width={row.w}
            height="12"
            rx="6"
            fill={row.fill}
            stroke={accent}
            {...detail}
          />
        </g>
      ))}
    </g>
  ),

  /* A body tape measure: the case and its pulled-out ribbon, with the estimate. */
  "body-fat": (
    <g>
      {ground(44, 276)}
      <rect
        x="64"
        y="64"
        width="84"
        height="84"
        rx="16"
        fill={soft}
        {...outline}
      />
      <circle cx="106" cy="106" r="22" fill={surface} {...outline} />
      <circle cx="106" cy="106" r="4" fill={accent} />
      <rect
        x="148"
        y="126"
        width="120"
        height="18"
        rx="3"
        fill={surface}
        {...outline}
      />
      {[160, 172, 184, 196, 208, 220, 232, 244, 256].map((x, i) => (
        <line
          key={x}
          x1={x}
          y1="126"
          x2={x}
          y2={i % 2 === 0 ? 136 : 132}
          stroke={accent}
          {...detail}
        />
      ))}
      <text x="208" y="96" fontSize="22" fill={accent} {...label}>
        18%
      </text>
    </g>
  ),

  /* A tall glass partly filled, a drop beside it and the litres it represents. */
  "water-intake": (
    <g>
      {ground(44, 276)}
      <path d="M107.5 76H200.5L194 148H114Z" fill={soft} />
      <path d="M104 36H204L194 148H114Z" fill="none" {...outline} />
      <path
        d="M107.5 76H200.5"
        fill="none"
        stroke={accent}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      {[96, 116].map((y) => (
        <line
          key={y}
          x1="120"
          y1={y}
          x2="132"
          y2={y}
          stroke={accent}
          {...detail}
        />
      ))}
      <path
        d="M64 76C64 76 44 102 44 116A20 20 0 0 0 84 116C84 102 64 76 64 76Z"
        fill={accent}
        {...outline}
      />
      <text x="246" y="104" fontSize="20" fill={ink} {...label}>
        2.1 L
      </text>
    </g>
  ),

  /* A cast weight beside a height rule: weight read from a chosen BMI at a height. */
  "ideal-weight": (
    <g>
      {ground(44, 276)}
      <path d="M120 72V60A24 24 0 0 1 168 60V72" fill="none" {...outline} />
      <path d="M100 72H188L206 148H82Z" fill={soft} {...outline} />
      <text x="144" y="124" fontSize="22" fill={ink} {...label}>
        kg
      </text>
      {rule(232, 32, 148)}
    </g>
  ),
};

export const healthOperationPaths: Record<string, ReactNode> = {
  /* Bathroom scale with a dial: BMI from weight and height. */
  bmi: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="3" />
      <path d="M8.5 11a3.5 3.5 0 0 1 7 0M12 11l1.5-2" />
    </>
  ),
  /* Published male and female coefficients: the conventional symbols. */
  "male-equation": (
    <>
      <circle cx="10" cy="14" r="5.5" />
      <path d="M14 10l6-6M15 4h5v5" />
    </>
  ),
  "female-equation": (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M12 14.5V21M9 18h6" />
    </>
  ),
  /* Body-fat regressions reuse the symbols with the lower half filled (a share). */
  "male-regression": (
    <>
      <circle cx="10" cy="14" r="5.5" />
      <path d="M4.5 14a5.5 5.5 0 0 0 11 0z" fill="currentColor" />
      <path d="M14 10l6-6M15 4h5v5" />
    </>
  ),
  "female-regression": (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M6.5 9a5.5 5.5 0 0 0 11 0z" fill="currentColor" />
      <path d="M12 14.5V21M9 18h6" />
    </>
  ),
  /* A sun: expenditure across the whole day. */
  "daily-energy": (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
    </>
  ),
  /* Egg for protein, grain for carbohydrate, oil drop for fat. */
  "protein-grams": (
    <path d="M12 3C8.5 3 5.5 8.5 5.5 13.5a6.5 6.5 0 0 0 13 0C18.5 8.5 15.5 3 12 3z" />
  ),
  "carbohydrate-grams": (
    <path d="M12 21V5M12 10c-2.8 0-4.5-1.7-4.5-4 2.8 0 4.5 1.7 4.5 4zM12 10c2.8 0 4.5-1.7 4.5-4-2.8 0-4.5 1.7-4.5 4zM12 16c-2.8 0-4.5-1.7-4.5-4 2.8 0 4.5 1.7 4.5 4zM12 16c2.8 0 4.5-1.7 4.5-4-2.8 0-4.5 1.7-4.5 4z" />
  ),
  "fat-grams": (
    <>
      <path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z" />
      <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
    </>
  ),
  /* A glass with a fill line. */
  "water-volume": (
    <>
      <path d="M5.5 4h13L17 20H7z" />
      <path d="M6.3 10h11.4" />
    </>
  ),
  /* A cast weight with its handle. */
  "bmi-weight": (
    <>
      <path d="M9 9V7.5a3 3 0 0 1 6 0V9" />
      <path d="M7 9h10l2.5 11h-15z" />
    </>
  ),
};
