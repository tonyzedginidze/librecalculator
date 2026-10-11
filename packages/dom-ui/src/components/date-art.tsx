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
  stroke: accent,
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};
const half = (n: number) => Math.round(n * 2) / 2;
/** Point on a clock face: degrees clockwise from twelve o'clock. */
const polar = (cx: number, cy: number, r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [half(cx + r * Math.cos(a)), half(cy + r * Math.sin(a))] as const;
};
const arc = (cx: number, cy: number, r: number, from: number, to: number) => {
  const [x1, y1] = polar(cx, cy, r, from);
  const [x2, y2] = polar(cx, cy, r, to);
  const sweep = (((to - from) % 360) + 360) % 360;
  return `M${x1} ${y1}A${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${x2} ${y2}`;
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

/** A clock face with hour ticks and two hands. */
function Clock(props: {
  cx: number;
  cy: number;
  r: number;
  hour: number;
  minute: number;
  fill?: string;
  ticks?: boolean;
}) {
  const { cx, cy, r } = props;
  const [hx, hy] = polar(cx, cy, r * 0.48, props.hour * 30 + props.minute / 2);
  const [mx, my] = polar(cx, cy, r * 0.7, props.minute * 6);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={props.fill ?? surface} {...outline} />
      {props.ticks
        ? Array.from({ length: 12 }, (_, i) => {
            const [x1, y1] = polar(cx, cy, r - 5, i * 30);
            const [x2, y2] = polar(cx, cy, r - 10, i * 30);
            return (
              <line
                key={`tick-${i * 30}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={line}
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })
        : null}
      <path
        d={`M${cx} ${cy}L${mx} ${my}M${cx} ${cy}L${hx} ${hy}`}
        {...outline}
      />
      <circle cx={cx} cy={cy} r="3" fill={accent} />
    </g>
  );
}

/** Calendar sheet with binding rings and a soft header band. */
function Sheet(props: { x: number; y: number; w: number; h: number }) {
  const { x, y, w, h } = props;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="4"
        fill={surface}
        {...outline}
      />
      <path
        d={`M${x} ${y + 22}V${y + 4}a4 4 0 0 1 4 -4h${w - 8}a4 4 0 0 1 4 4V${y + 22}Z`}
        fill={soft}
        {...outline}
      />
      {[x + w * 0.25, x + w * 0.75].map((cx) => (
        <rect
          key={`ring-${cx}`}
          x={half(cx - 3.5)}
          y={y - 8}
          width="7"
          height="16"
          rx="3"
          {...detail}
          fill={surface}
        />
      ))}
    </g>
  );
}

export const dateScenes: Record<string, ReactNode> = {
  // Two-tier birthday cake: completed years are counted birthdays.
  age: (
    <g>
      {ground(56, 264)}
      <rect
        x="84"
        y="138"
        width="152"
        height="8"
        rx="4"
        fill={surface}
        {...outline}
      />
      <rect
        x="96"
        y="96"
        width="128"
        height="42"
        rx="4"
        fill={soft}
        {...outline}
      />
      <path
        d="M96 106a8 8 0 0 0 16 0a8 8 0 0 0 16 0a8 8 0 0 0 16 0a8 8 0 0 0 16 0a8 8 0 0 0 16 0a8 8 0 0 0 16 0a8 8 0 0 0 16 0a8 8 0 0 0 16 0"
        {...detail}
      />
      <rect
        x="120"
        y="66"
        width="80"
        height="30"
        rx="4"
        fill={surface}
        {...outline}
      />
      {[136, 160, 184].map((cx) => (
        <g key={`candle-${cx}`}>
          <rect
            x={cx - 3.5}
            y="48"
            width="7"
            height="18"
            rx="2"
            {...detail}
            fill={cx === 160 ? accent : soft}
          />
          <ellipse cx={cx} cy="38" rx="3.5" ry="5" fill={accent} />
        </g>
      ))}
    </g>
  ),

  // A month sheet with one run of days picked out from start to end.
  "date-difference": (
    <g>
      <Sheet x={64} y={38} w={192} h={110} />
      <rect x="83" y="91" width="154" height="22" rx="11" fill={soft} />
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2, 3, 4, 5, 6].map((col) => {
          const cx = 88 + col * 24,
            cy = 80 + row * 22;
          if (row === 1 && (col === 0 || col === 6))
            return (
              <circle
                key={`day-${row}-${col}`}
                cx={cx + (col === 0 ? 6 : -6)}
                cy={cy}
                r="8"
                fill={accent}
              />
            );
          return (
            <circle
              key={`day-${row}-${col}`}
              cx={cx}
              cy={cy}
              r="2.5"
              fill={row === 1 ? accent : line}
            />
          );
        }),
      )}
    </g>
  ),

  // A day count on a calendar page, heading for a finish flag.
  countdown: (
    <g>
      {ground(48, 272)}
      <Sheet x={64} y={46} w={116} h={100} />
      <text
        x="122"
        y="113"
        fill={ink}
        fontSize="22"
        fontFamily="var(--oc-font-mono)"
        textAnchor="middle"
      >
        75
      </text>
      <path d="M194 104h22" {...detail} strokeDasharray="4 4" />
      <path d="M232 148V52" {...outline} fill="none" />
      <path d="M232 54h40l-10 14 10 14h-40Z" fill={accent} {...outline} />
    </g>
  ),

  // A time card with a clock: the shift (soft band) with a short break gap.
  "work-hours": (
    <g>
      <rect
        x="168"
        y="40"
        width="96"
        height="108"
        rx="4"
        fill={surface}
        {...outline}
      />
      <rect
        x="196"
        y="32"
        width="40"
        height="14"
        rx="3"
        fill={soft}
        {...outline}
      />
      <rect x="196" y="66" width="56" height="8" rx="4" fill={accent} />
      {[88, 106, 124].map((y) => (
        <rect
          key={`row-${y}`}
          x="196"
          y={y}
          width="56"
          height="8"
          rx="4"
          fill={line}
        />
      ))}
      <circle cx="120" cy="96" r="54" fill={surface} {...outline} />
      <path
        d={arc(120, 96, 38, 270, 375)}
        stroke={soft}
        strokeWidth="12"
        fill="none"
      />
      <path
        d={arc(120, 96, 38, 390, 510)}
        stroke={soft}
        strokeWidth="12"
        fill="none"
      />
      <Clock cx={120} cy={96} r={54} hour={5} minute={0} fill="none" ticks />
    </g>
  ),

  // Two clocks reading different times either side of a globe.
  "time-zone": (
    <g>
      <circle cx="160" cy="100" r="48" fill={soft} {...outline} />
      <ellipse cx="160" cy="100" rx="20" ry="48" {...detail} />
      <path d="M112 100h96M118.5 76h83M118.5 124h83" {...detail} />
      <path d="M96 58A120 120 0 0 1 224 58" {...detail} strokeDasharray="4 4" />
      <Clock cx={70} cy={64} r={26} hour={9} minute={0} />
      <Clock cx={250} cy={64} r={26} hour={3} minute={0} fill={soft} />
    </g>
  ),
};

export const dateOperationPaths: Record<string, ReactNode> = {
  // Birthday cake with one candle.
  "completed-years": (
    <>
      <path d="M4 20h16M5.5 20v-5.5a1.5 1.5 0 0 1 1.5-1.5h10a1.5 1.5 0 0 1 1.5 1.5V20" />
      <path d="M5.5 16.5c1.3 1 2.6 1 3.9 0s2.6-1 3.9 0 2.6 1 3.9 0" />
      <path d="M12 13v-3.5M12 7c-1-.8-1-2 0-3 1 1 1 2.2 0 3z" />
    </>
  ),
  // Calendar with an arrow from one day to another.
  "elapsed-days": (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4M7 15h9.5M14 12.5l2.5 2.5-2.5 2.5" />
    </>
  ),
  // Calendar with a span closed at both ends.
  "inclusive-days": (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4M7.5 12.5v5M16.5 12.5v5M7.5 15h9" />
    </>
  ),
  // Hourglass: time running out toward the event.
  "days-until": (
    <path d="M6.5 3h11M6.5 21h11M8 3v2.5c0 2.3 4 4 4 6.5s-4 4.2-4 6.5V21M16 3v2.5c0 2.3-4 4-4 6.5s4 4.2 4 6.5V21M9.5 19h5" />
  ),
  // Time card with a small clock.
  "paid-hours": (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10.5" r="3.5" />
      <path d="M12 9v1.5l1 1M8.5 17h7" />
    </>
  ),
  // Globe: converting between places.
  "fixed-offset": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z" />
    </>
  ),
};
