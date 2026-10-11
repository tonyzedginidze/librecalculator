import type { ReactNode } from "react";

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
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};
const label = {
  fontFamily: "var(--oc-font-mono)",
  fontSize: 20,
  textAnchor: "middle" as const,
};

/** Oblique board: front face, top face and end face. */
function board(x: number, y: number, w: number, h: number, key: string) {
  const dx = 20;
  const dy = -12;
  return (
    <g key={key}>
      <path
        d={`M${x} ${y}L${x + dx} ${y + dy}H${x + w + dx}L${x + w} ${y}Z`}
        fill={soft}
        {...outline}
      />
      <rect x={x} y={y} width={w} height={h} fill={surface} {...outline} />
      <path
        d={`M${x + w} ${y}L${x + w + dx} ${y + dy}V${y + h + dy}L${x + w} ${y + h}Z`}
        fill={line}
        {...outline}
      />
    </g>
  );
}

export const constructionScenes: Record<string, ReactNode> = {
  concrete: (
    <g>
      {/* Isometric slab: top, left side, right side. */}
      <path d="M78 80L173 135V147L78 92Z" fill={surface} {...outline} />
      <path d="M173 135L242 95V107L173 147Z" fill={line} {...outline} />
      <path d="M147 40L242 95L173 135L78 80Z" fill={soft} {...outline} />
      {/* Control joints. */}
      <path
        d="M112.5 60L207.5 115M194.5 67.5L125.5 107.5"
        stroke={accent}
        {...detail}
      />
      <text x="246" y="56" fill={ink} {...label}>
        m³
      </text>
    </g>
  ),

  paint: (
    <g>
      {/* Wall with one painted stripe and the roller at its lower edge. */}
      <rect
        x="52"
        y="36"
        width="148"
        height="110"
        rx="4"
        fill={surface}
        stroke={line}
        strokeWidth="2.5"
      />
      <rect x="94" y="36" width="64" height="62" fill={soft} />
      <rect
        x="88"
        y="94"
        width="76"
        height="16"
        rx="4"
        fill={soft}
        {...outline}
      />
      <path
        d="M164 102H176V122H126V130"
        stroke={accent}
        {...detail}
        strokeWidth="2.5"
      />
      <rect x="120" y="130" width="12" height="18" rx="3" fill={accent} />
      {/* Paint tin. */}
      <rect
        x="214"
        y="80"
        width="60"
        height="10"
        rx="3"
        fill={soft}
        {...outline}
      />
      <rect
        x="218"
        y="90"
        width="52"
        height="56"
        rx="4"
        fill={surface}
        {...outline}
      />
      <text x="244" y="125" fill={ink} {...label}>
        L
      </text>
    </g>
  ),

  flooring: (
    <g>
      {/* Staggered planks; the last one is a cut piece. */}
      <rect
        x="48"
        y="40"
        width="176"
        height="100"
        rx="4"
        fill={surface}
        {...outline}
      />
      <path
        d="M48 65H224M48 90H224M48 115H224M112 40V65M182 40V65M78 65V90M150 65V90M206 65V90M126 90V115M196 90V115M90 115V140M162 115V140"
        stroke={accent}
        {...detail}
      />
      <rect x="150" y="65" width="56" height="25" fill={soft} {...outline} />
      <rect x="162" y="115" width="62" height="25" fill={soft} opacity="0.45" />
      {/* Pack of planks. */}
      <rect
        x="238"
        y="96"
        width="42"
        height="44"
        rx="4"
        fill={soft}
        {...outline}
      />
      <path d="M238 110H280" stroke={accent} {...detail} />
      <text x="259" y="85" fill={ink} {...label}>
        10
      </text>
    </g>
  ),

  roofing: (
    <g>
      <line
        x1="48"
        y1="148"
        x2="272"
        y2="148"
        stroke={line}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="84"
        y="96"
        width="152"
        height="50"
        rx="4"
        fill={surface}
        {...outline}
      />
      <path d="M60 96L160 46L260 96Z" fill={soft} {...outline} />
      {/* Pitch mark: run 12, rise 6. */}
      <path d="M196 64H232V82" stroke={accent} {...detail} />
      <text x="252" y="58" fill={accent} {...label}>
        6:12
      </text>
    </g>
  ),

  tile: (
    <g>
      {/* 6 × 3 tiles; the last row ends with a cut tile and an empty space. */}
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2, 3, 4, 5].map((col) => {
          const x = 66 + col * 32;
          const y = 44 + row * 32;
          const last = row === 2 && col === 5;
          const cut = row === 2 && col === 4;
          if (last)
            return (
              <rect
                key={`${row}-${col}`}
                x={x}
                y={y}
                width="28"
                height="28"
                rx="3"
                fill="none"
                stroke={line}
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            );
          return (
            <rect
              key={`${row}-${col}`}
              x={x}
              y={y}
              width={cut ? 14 : 28}
              height="28"
              rx="3"
              fill={row === 1 && col === 2 ? accent : cut ? soft : surface}
              {...outline}
              strokeWidth={cut ? 2.5 : 2}
              opacity={cut ? 0.45 : undefined}
            />
          );
        }),
      )}
      <line
        x1="48"
        y1="148"
        x2="272"
        y2="148"
        stroke={line}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  ),

  lumber: (
    <g>
      <line
        x1="48"
        y1="148"
        x2="272"
        y2="148"
        stroke={line}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {board(62, 124, 176, 22, "b1")}
      {board(74, 102, 176, 22, "b2")}
      {board(62, 80, 176, 22, "b3")}
    </g>
  ),
};

export const constructionOperationPaths: Record<string, ReactNode> = {
  // Isometric slab with a visible thickness.
  slab: (
    <path d="M3 10.5L12 6l9 4.5-9 4.5zM3 10.5V13l9 4.5 9-4.5v-2.5M12 15v2.5" />
  ),
  // Paint roller.
  litres: (
    <>
      <rect x="3.5" y="4" width="13" height="5" rx="1.5" />
      <path d="M16.5 6.5H20v5h-8.5V14" />
      <rect x="10" y="14" width="3" height="6.5" rx="1" />
    </>
  ),
  // Staggered planks.
  packs: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3 9.7h18M3 14.3h18M10 5v4.7M15 9.7v4.6M7.5 14.3V19" />
    </>
  ),
  // Square tiles with one missing.
  tiles: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="3.5" height="7" rx="1" />
    </>
  ),
  // Gable roof with a pitch mark.
  "roof-area": <path d="M2.5 14L12 5l9.5 9M5 11.5V19h14v-7.5M14 7v-2.5h3.5" />,
  // Board in oblique view.
  "board-feet": <path d="M3 11l4-3h14l-4 3zM3 11v5h14v-5M17 16l4-3V8" />,
};
