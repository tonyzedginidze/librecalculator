import type { ReactNode } from "react";

const accent = "var(--oc-accent)";
const soft = "var(--oc-accent-soft)";
const surface = "var(--oc-surface)";
const line = "var(--oc-line)";

const cx = 160;
const cy = 124;
const polar = (r: number, deg: number) => {
  const a = ((180 - deg) * Math.PI) / 180;
  return [
    Math.round((cx + r * Math.cos(a)) * 2) / 2,
    Math.round((cy - r * Math.sin(a)) * 2) / 2,
  ] as const;
};
const arc = (r: number, from: number, to: number) => {
  const [x1, y1] = polar(r, from);
  const [x2, y2] = polar(r, to);
  return `M${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}`;
};
const [nx, ny] = polar(70, 128);

/** A speedometer dial: outer scale in one unit, inner scale in another. */
export const speedConversionArt: ReactNode = (
  <g>
    <path
      d={`${arc(92, 0, 180)}Z`}
      fill={surface}
      stroke={accent}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d={arc(80, 0, 128)}
      fill="none"
      stroke={soft}
      strokeWidth="14"
      strokeLinecap="butt"
    />
    {Array.from({ length: 11 }, (_, i) => {
      const deg = i * 18;
      const [x1, y1] = polar(92, deg);
      const [x2, y2] = polar(i % 2 ? 84 : 78, deg);
      return (
        <line
          key={deg}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={accent}
          strokeWidth={i % 2 ? 1.75 : 2.5}
          strokeLinecap="round"
        />
      );
    })}
    {Array.from({ length: 7 }, (_, i) => {
      const deg = i * 30;
      const [x1, y1] = polar(62, deg);
      const [x2, y2] = polar(56, deg);
      return (
        <line
          key={deg}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={accent}
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      );
    })}
    <line
      x1={cx}
      y1={cy}
      x2={nx}
      y2={ny}
      stroke={accent}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle
      cx={cx}
      cy={cy}
      r="7"
      fill={surface}
      stroke={accent}
      strokeWidth="2.5"
    />
    <line
      x1="52"
      y1="148"
      x2="268"
      y2="148"
      stroke={line}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </g>
);
