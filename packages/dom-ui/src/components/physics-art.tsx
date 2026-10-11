import type { ReactNode } from "react";

/** Physics pack tiles (320×180) and operation icons (24×24), house style. */

const accent = "var(--oc-accent)",
  soft = "var(--oc-accent-soft)",
  ink = "var(--oc-ink)",
  line = "var(--oc-line)",
  surface = "var(--oc-surface)",
  mono = "var(--oc-font-mono)";

const outline = {
  stroke: accent,
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
const detail = { ...outline, strokeWidth: 1.75 } as const;

const ground = (
  <line
    x1="40"
    y1="148"
    x2="280"
    y2="148"
    stroke={line}
    strokeWidth="2"
    strokeLinecap="round"
  />
);

export const physicsScenes: Record<string, ReactNode> = {
  speed: (
    <g>
      {ground}
      <path d="M44 100H74M56 114H78M44 128H70" fill="none" {...outline} />
      <path
        d="M90 128V108Q90 99 99 98L128 94L148 74H208L232 94L254 97Q262 98 262 107V128Z"
        fill={soft}
        {...outline}
      />
      <path d="M140 92L154 80H178V92Z" fill={surface} {...detail} />
      <path d="M188 80H204L218 92H188Z" fill={surface} {...detail} />
      <path d="M100 110H112M240 110H252" fill="none" {...detail} />
      {[124, 222].map((x) => (
        <g key={x}>
          <circle cx={x} cy="128" r="16" fill={surface} {...outline} />
          <circle cx={x} cy="128" r="4" fill={accent} />
        </g>
      ))}
    </g>
  ),

  force: (
    <g>
      {ground}
      <rect
        x="66"
        y="66"
        width="88"
        height="82"
        rx="4"
        fill={soft}
        {...outline}
      />
      <path
        d="M168 100H236V88L268 107L236 126V114H168Z"
        fill={accent}
        {...outline}
      />
      <text
        x="208"
        y="74"
        textAnchor="middle"
        fontFamily={mono}
        fontSize="22"
        fontWeight="600"
        fill={ink}
      >
        F
      </text>
    </g>
  ),

  energy: (
    <g>
      {ground}
      <path d="M52 98H112M68 116H120M52 134H112" fill="none" {...outline} />
      <circle cx="190" cy="106" r="40" fill={soft} {...outline} />
      <path d="M164 92A30 30 0 0 1 190 76" fill="none" {...detail} />
    </g>
  ),

  power: (
    <g>
      <path
        d="M140 114Q120 100 120 78A40 40 0 0 1 200 78Q200 100 180 114Z"
        fill={soft}
        {...outline}
      />
      <path d="M146 96L153 84L160 96L167 84L174 96" fill="none" {...detail} />
      <path d="M152 114V100M168 114V100" fill="none" {...detail} />
      <rect
        x="140"
        y="114"
        width="40"
        height="30"
        rx="3"
        fill={surface}
        {...outline}
      />
      <path
        d="M140 124H180M140 134H180"
        fill="none"
        stroke={line}
        strokeWidth="1.75"
      />
      <path
        d="M122 42L114 34M198 42L206 34M106 78H94M214 78H226"
        fill="none"
        {...outline}
      />
      {ground}
    </g>
  ),

  density: (
    <g>
      {ground}
      <rect
        x="60"
        y="62"
        width="86"
        height="86"
        rx="4"
        fill={surface}
        {...outline}
      />
      <rect
        x="174"
        y="62"
        width="86"
        height="86"
        rx="4"
        fill={soft}
        {...outline}
      />
      {[
        [86, 88],
        [120, 88],
        [86, 122],
        [120, 122],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill={accent} />
      ))}
      {[189, 206, 223, 240].flatMap((x) =>
        [77, 94, 111, 128].map((y) => (
          <circle
            key={`${x}-${y}`}
            cx={x + 2.5}
            cy={y + 3.5}
            r="5"
            fill={accent}
          />
        )),
      )}
    </g>
  ),

  pressure: (
    <g>
      {[120, 160, 200].map((x) => (
        <path
          key={x}
          d={`M${x} 32V96M${x - 9} 87L${x} 96L${x + 9} 87`}
          fill="none"
          {...outline}
        />
      ))}
      <path d="M60 140V148H220L260 116V108" fill={surface} {...detail} />
      <path d="M60 140L100 108H260L220 140Z" fill={soft} {...outline} />
      <path d="M220 140V148" fill="none" {...detail} />
    </g>
  ),
};

export const physicsOperationPaths: Record<string, ReactNode> = {
  "speed-si": (
    <>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 17l4.5-5" />
      <path d="M4 17h2M18 17h2" />
    </>
  ),
  "force-si": (
    <>
      <rect x="3" y="8" width="8" height="8" rx="1.5" />
      <path d="M11 12h9.5M17.5 9l3 3-3 3" />
    </>
  ),
  "energy-si": (
    <>
      <circle cx="15.5" cy="12" r="5.5" />
      <path d="M3 9h4.5M3 15h4.5M5 12h3.5" />
    </>
  ),
  "power-si": <path d="M13.5 3L5.5 13.5h6l-1 7.5 8-10.5h-6z" />,
  "density-si": (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path
        d="M8.5 8.5h.01M15.5 8.5h.01M12 12h.01M8.5 15.5h.01M15.5 15.5h.01"
        strokeWidth="2.75"
      />
    </>
  ),
  "pressure-si": (
    <>
      <path d="M3.5 20.5h17" />
      <path d="M8 3.5v12M5 12.5l3 3 3-3M16 3.5v12M13 12.5l3 3 3-3" />
    </>
  ),
};
