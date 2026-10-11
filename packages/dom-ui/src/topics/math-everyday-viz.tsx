import type { CSSProperties } from "react";
import { formatDecimal } from "../../../i18n/src/en";
import { NumText } from "../components/num-text";

/**
 * Math-everyday pack visuals. A dot plot for small datasets: every value is a dot on a
 * number line (equal or nearly equal values stack), with labelled markers for centres
 * and an optional shaded band. Styling lives in the `pack: math-everyday` block of
 * ui.css and reuses the kit tones, so it reads as part of components/viz.
 */

const ROW_REM = 2.4;

const clamp01 = (n: number) =>
  Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;
const pct = (n: number) => `${(clamp01(n) * 100).toFixed(3)}%`;

/** A rounded scale with about five labelled ticks that contains every value. */
export function niceScale(
  values: readonly number[],
  locale: string,
): {
  min: number;
  max: number;
  ticks: { value: number; label: string }[];
} {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const spread = hi - lo || Math.max(1, Math.abs(lo));
  const raw = spread / 4;
  const power = 10 ** Math.floor(Math.log10(raw));
  const step =
    [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= raw) ??
    10 * power;
  const decimals = Math.max(0, -Math.floor(Math.log10(step)) + 1);
  let min = Math.floor(lo / step) * step;
  let max = Math.ceil(hi / step) * step;
  if (min === max) {
    min -= step;
    max += step;
  }
  const ticks = [];
  for (let i = 0; min + i * step <= max + step / 1e6; i++) {
    const value = min + i * step;
    const fixed = value.toFixed(decimals);
    const text = fixed.includes(".") ? fixed.replace(/\.?0+$/, "") : fixed;
    ticks.push({
      value,
      label: formatDecimal(text === "-0" ? "0" : text, locale),
    });
  }
  return { min, max, ticks };
}

export type DotMarker = {
  value: number;
  label: string;
  display: string;
  emphasis?: boolean;
};

export function DotPlot(props: {
  min: number;
  max: number;
  ticks: readonly { value: number; label: string }[];
  points: readonly number[];
  markers: readonly DotMarker[];
  band?: { from: number; to: number; label: string };
}) {
  const span = props.max - props.min || 1;
  const at = (v: number) => clamp01((v - props.min) / span);

  // Stack values that would overlap at narrow widths (within 1/40 of the scale).
  const heights = new Map<number, number>();
  const dots = [...props.points]
    .sort((a, b) => a - b)
    .map((value) => {
      const bin = Math.round(at(value) * 40);
      const level = heights.get(bin) ?? 0;
      heights.set(bin, level + 1);
      return { value, bin, level };
    });
  const tallest = Math.max(1, ...heights.values());
  const step = tallest <= 7 ? 1 : 7 / tallest;

  // Marker labels take up to three rows so close centres never overlap.
  const sorted = [...props.markers].sort((a, b) => a.value - b.value);
  const last = [-1, -1, -1];
  const rows = sorted.map((m) => {
    const x = at(m.value);
    const row = last.findIndex((prev) => x - prev >= 0.24);
    const chosen = row === -1 ? 0 : row;
    last[chosen] = x;
    return chosen;
  });
  const rowCount = Math.max(1, ...rows.map((r) => r + 1));

  return (
    <div
      className="oc-me-dots"
      style={
        {
          "--oc-me-rows": String(rowCount),
          "--oc-me-field": `${(tallest * step + 0.5).toFixed(3)}rem`,
          "--oc-me-dot": `${Math.min(0.85, step - 0.12).toFixed(3)}rem`,
        } as CSSProperties
      }
    >
      <div className="oc-me-dots-plot">
        <div className="oc-me-dots-labels">
          {sorted.map((m, i) => (
            <div
              key={`${m.label}-${m.value}`}
              className="oc-me-dots-label"
              data-emphasis={m.emphasis || undefined}
              data-edge={
                at(m.value) < 0.12
                  ? "start"
                  : at(m.value) > 0.88
                    ? "end"
                    : undefined
              }
              style={{
                left: pct(at(m.value)),
                bottom: `${(rows[i] ?? 0) * ROW_REM}rem`,
              }}
            >
              <span>{m.label}</span>
              <span className="oc-viz-fig">
                <NumText text={m.display} />
              </span>
            </div>
          ))}
        </div>
        <div className="oc-me-dots-field">
          {props.band ? (
            <span
              className="oc-me-dots-band"
              style={{
                left: pct(at(Math.min(props.band.from, props.band.to))),
                width: pct(Math.abs(at(props.band.to) - at(props.band.from))),
              }}
            />
          ) : null}
          {dots.map((d, i) => (
            <i
              // biome-ignore lint/suspicious/noArrayIndexKey: dots are positional
              key={i}
              style={{
                left: pct(at(d.value)),
                bottom: `${(d.level * step + 0.3).toFixed(3)}rem`,
              }}
            />
          ))}
        </div>
        {sorted.map((m, i) => (
          <b
            key={`${m.label}-${m.value}`}
            className="oc-me-dots-rule"
            data-emphasis={m.emphasis || undefined}
            style={{
              left: pct(at(m.value)),
              top: `${(rowCount - (rows[i] ?? 0)) * ROW_REM}rem`,
            }}
          />
        ))}
      </div>
      <div className="oc-me-dots-ticks">
        {props.ticks.map((t) => (
          <span
            key={`${t.label}-${t.value}`}
            style={{ left: pct(at(t.value)) }}
          >
            <NumText text={t.label} />
          </span>
        ))}
      </div>
      {props.band ? (
        <div className="oc-me-dots-note">{props.band.label}</div>
      ) : null}
    </div>
  );
}
