import type { CSSProperties, ReactNode } from "react";
import { NumText } from "./num-text";

/**
 * Shared result visuals. Every calculator draws its diagram from these parts so the
 * library reads as one system: accent marks for the answer, soft fills for context,
 * mono figures, sans labels. Positions use numbers only for geometry; every visible
 * figure is a formatted engine string passed in by the view.
 */

export type VizTone = "accent" | "soft" | "ink" | "muted" | "negative";

/** One inline figure: keeps "$2,398.20" a single layout item while numerals stay mono. */
function Fig(props: { text: string }) {
  return (
    <span className="oc-viz-fig">
      <NumText text={props.text} />
    </span>
  );
}

const clamp01 = (n: number) =>
  Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;
const pct = (n: number) => `${(clamp01(n) * 100).toFixed(3)}%`;

/** Caption, visible diagram, and a screen-reader sentence describing the same numbers. */
export function VizFigure(props: {
  caption: string;
  summary: string;
  children: ReactNode;
  note?: ReactNode;
}) {
  return (
    <figure className="oc-viz">
      <figcaption className="oc-kicker">{props.caption}</figcaption>
      <div aria-hidden="true" className="oc-viz-body">
        {props.children}
      </div>
      {props.note ? <div className="oc-viz-note">{props.note}</div> : null}
      <span className="oc-sr-only">{props.summary}</span>
    </figure>
  );
}

/** Parts of one whole, left to right, with a legend underneath. */
export function SplitBar(props: {
  parts: readonly {
    label: string;
    value: number;
    display: string;
    tone?: VizTone;
  }[];
  total?: { label: string; display: string };
}) {
  const sum = props.parts.reduce((a, p) => a + Math.max(0, p.value), 0) || 1;
  return (
    <div className="oc-viz-split">
      {props.total ? (
        <div className="oc-viz-split-total">
          <span>{props.total.label}</span>
          <Fig text={props.total.display} />
        </div>
      ) : null}
      <div className="oc-viz-split-bar">
        {props.parts.map((p) =>
          p.value > 0 ? (
            <span
              key={p.label}
              data-tone={p.tone ?? "accent"}
              style={{ flexGrow: Math.max(0, p.value) / sum }}
            />
          ) : null,
        )}
      </div>
      <ul className="oc-viz-legend">
        {props.parts.map((p) => (
          <li key={p.label}>
            <i data-tone={p.tone ?? "accent"} />
            <span>{p.label}</span>
            <Fig text={p.display} />
            <small>{`${Math.round((Math.max(0, p.value) / sum) * 100)}%`}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Labelled horizontal bars on one shared scale. Negative values extend left of zero. */
export function CompareBars(props: {
  rows: readonly {
    label: string;
    value: number;
    display: string;
    tone?: VizTone;
    note?: string;
  }[];
  max?: number;
}) {
  const hasNegative = props.rows.some((r) => r.value < 0);
  const max =
    props.max ??
    Math.max(...props.rows.map((r) => Math.abs(r.value)), Number.MIN_VALUE);
  return (
    <div className="oc-viz-compare" data-signed={hasNegative || undefined}>
      {props.rows.map((r) => {
        const width = clamp01(Math.abs(r.value) / max);
        const style: CSSProperties = hasNegative
          ? r.value < 0
            ? { width: pct(width / 2), right: "50%" }
            : { width: pct(width / 2), left: "50%" }
          : { width: pct(width), left: 0 };
        return (
          <div className="oc-viz-compare-row" key={r.label}>
            <div className="oc-viz-compare-head">
              <span>{r.label}</span>
              <Fig text={r.display} />
            </div>
            <div className="oc-viz-compare-track">
              <span
                data-tone={r.value < 0 ? "negative" : (r.tone ?? "accent")}
                style={style}
              />
            </div>
            {r.note ? (
              <div className="oc-viz-compare-note">{r.note}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** A scale with ticks, labelled markers and an optional shaded range. */
export function NumberLine(props: {
  min: number;
  max: number;
  ticks?: readonly { value: number; label: string }[];
  markers: readonly {
    value: number;
    label: string;
    display?: string;
    tone?: VizTone;
  }[];
  range?: { from: number; to: number; label?: string };
}) {
  const span = props.max - props.min || 1;
  const at = (v: number) => clamp01((v - props.min) / span);
  const sorted = [...props.markers].sort((a, b) => a.value - b.value);
  const lastInRow = [-1, -1];
  const rows = new Map<(typeof sorted)[number], number>();
  for (const m of sorted) {
    const x = at(m.value);
    const row =
      x - (lastInRow[0] ?? -1) >= 0.22
        ? 0
        : x - (lastInRow[1] ?? -1) >= 0.22
          ? 1
          : 0;
    lastInRow[row] = x;
    rows.set(m, row);
  }
  const twoRows = [...rows.values()].includes(1);
  return (
    <div className="oc-viz-line" data-rows={twoRows ? 2 : 1}>
      <div className="oc-viz-line-labels">
        {sorted.map((m) => (
          <div
            key={`${m.label}-${m.value}`}
            className="oc-viz-line-label"
            data-tone={m.tone ?? "accent"}
            data-row={rows.get(m)}
            data-edge={
              at(m.value) < 0.12
                ? "start"
                : at(m.value) > 0.88
                  ? "end"
                  : undefined
            }
            style={{ left: pct(at(m.value)) }}
          >
            <span>{m.label}</span>
            {m.display ? <Fig text={m.display} /> : null}
          </div>
        ))}
      </div>
      <div className="oc-viz-line-axis">
        {props.range ? (
          <span
            className="oc-viz-line-range"
            style={{
              left: pct(at(Math.min(props.range.from, props.range.to))),
              width: pct(Math.abs(at(props.range.to) - at(props.range.from))),
            }}
          />
        ) : null}
        {sorted.map((m) => (
          <i
            key={`${m.label}-${m.value}`}
            data-tone={m.tone ?? "accent"}
            data-row={rows.get(m)}
            style={{ left: pct(at(m.value)) }}
          />
        ))}
      </div>
      <div className="oc-viz-line-ticks">
        {(props.ticks ?? []).map((t) => (
          <span
            key={`${t.label}-${t.value}`}
            style={{ left: pct(at(t.value)) }}
          >
            <Fig text={t.label} />
          </span>
        ))}
      </div>
      {props.range?.label ? (
        <div className="oc-viz-line-range-label">{props.range.label}</div>
      ) : null}
    </div>
  );
}

/** Half-dial for a single reading on a bounded scale, with optional neutral bands. */
export function Gauge(props: {
  min: number;
  max: number;
  value: number;
  display: string;
  label: string;
  ticks?: readonly { value: number; label: string }[];
  bands?: readonly { from: number; to: number }[];
  reference?: { value: number; label: string };
}) {
  const span = props.max - props.min || 1;
  const t = (v: number) => clamp01((v - props.min) / span);
  const r = 80;
  const point = (f: number, radius = r) => {
    const a = Math.PI * (1 - f);
    return [100 + radius * Math.cos(a), 100 - radius * Math.sin(a)] as const;
  };
  const arc = (from: number, to: number) => {
    const [x1, y1] = point(from);
    const [x2, y2] = point(to);
    return `M${x1.toFixed(2)} ${y1.toFixed(2)}A${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  };
  const v = t(props.value);
  const [nx, ny] = point(v, r - 14);
  const ref = props.reference ? t(props.reference.value) : null;
  return (
    <div className="oc-viz-gauge">
      <div className="oc-viz-gauge-dial">
        <svg viewBox="0 0 200 112" aria-hidden="true">
          <path d={arc(0, 1)} className="oc-viz-gauge-track" />
          {(props.bands ?? []).map((b, i) => (
            <path
              key={`${b.from}-${b.to}`}
              d={arc(t(b.from), t(b.to))}
              className="oc-viz-gauge-band"
              data-index={i % 2}
            />
          ))}
          <path d={arc(0, v)} className="oc-viz-gauge-fill" />
          {(props.ticks ?? []).map((tick) => {
            const [x1, y1] = point(t(tick.value), r + 7);
            const [x2, y2] = point(t(tick.value), r + 12);
            return (
              <path
                key={tick.label}
                d={`M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}`}
                className="oc-viz-gauge-tick"
              />
            );
          })}
          {ref !== null ? (
            <path
              d={`M${point(ref, r - 9).join(" ")}L${point(ref, r + 9).join(" ")}`}
              className="oc-viz-gauge-ref"
            />
          ) : null}
          <path
            d={`M100 100L${nx.toFixed(2)} ${ny.toFixed(2)}`}
            className="oc-viz-gauge-needle"
          />
          <circle cx="100" cy="100" r="5" className="oc-viz-gauge-hub" />
        </svg>
        <div className="oc-viz-gauge-ticks">
          {(props.ticks ?? []).map((tick) => {
            const [x, y] = point(t(tick.value), r + 22);
            return (
              <span
                key={tick.label}
                style={{ left: `${x / 2}%`, top: `${(y / 112) * 100}%` }}
              >
                <Fig text={tick.label} />
              </span>
            );
          })}
        </div>
      </div>
      <div className="oc-viz-gauge-readout">
        <Fig text={props.display} />
        <span>{props.label}</span>
      </div>
      {props.reference ? (
        <div className="oc-viz-gauge-reflabel">
          <i />
          {props.reference.label}
        </div>
      ) : null}
    </div>
  );
}

/** Start and end of a span with optional interior markers. */
export function Timeline(props: {
  start: { label: string; display: string };
  end: { label: string; display: string };
  span: string;
  markers?: readonly { at: number; label: string }[];
  progress?: number;
}) {
  return (
    <div className="oc-viz-timeline">
      <div className="oc-viz-timeline-ends">
        <div>
          <span>{props.start.label}</span>
          <Fig text={props.start.display} />
        </div>
        <div>
          <span>{props.end.label}</span>
          <Fig text={props.end.display} />
        </div>
      </div>
      <div className="oc-viz-timeline-track">
        <span style={{ width: pct(props.progress ?? 1) }} />
        {(props.markers ?? []).map((m) => (
          <i key={m.label} style={{ left: pct(m.at) }} />
        ))}
      </div>
      {props.markers?.length ? (
        <div className="oc-viz-timeline-markers">
          {props.markers.map((m) => (
            <span key={m.label} style={{ left: pct(m.at) }}>
              {m.label}
            </span>
          ))}
        </div>
      ) : null}
      <div className="oc-viz-timeline-span">
        <Fig text={props.span} />
      </div>
    </div>
  );
}

/** Two aligned scales for the same quantity in different units, with the value marked. */
export function DualScale(props: {
  fraction: number;
  top: {
    unit: string;
    display: string;
    ticks: readonly { at: number; label: string }[];
  };
  bottom: {
    unit: string;
    display: string;
    ticks: readonly { at: number; label: string }[];
  };
}) {
  const x = pct(props.fraction);
  const scale = (
    side: "top" | "bottom",
    s: {
      unit: string;
      display: string;
      ticks: readonly { at: number; label: string }[];
    },
  ) => (
    <div className="oc-viz-dual-scale" data-side={side}>
      <div
        className="oc-viz-dual-reading"
        style={{ left: x }}
        data-edge={
          props.fraction < 0.15
            ? "start"
            : props.fraction > 0.85
              ? "end"
              : undefined
        }
      >
        <Fig text={s.display} />
        <span>{s.unit}</span>
      </div>
      <div className="oc-viz-dual-ruler">
        {s.ticks
          .filter((t) => Math.abs(t.at - props.fraction) > 0.045)
          .map((t) => (
            <span key={`${t.label}-${t.at}`} style={{ left: pct(t.at) }}>
              <Fig text={t.label} />
            </span>
          ))}
      </div>
    </div>
  );
  return (
    <div className="oc-viz-dual">
      {scale("top", props.top)}
      <div
        className="oc-viz-dual-cursor"
        style={{
          left: `calc(0.6rem + (100% - 1.2rem) * ${clamp01(props.fraction).toFixed(4)})`,
        }}
      />
      {scale("bottom", props.bottom)}
    </div>
  );
}

/** Countable things: filled cells out of a total (questions right, tiles, packs). */
export function CountGrid(props: {
  total: number;
  filled: number;
  partial?: number;
  columns?: number;
  label: string;
  display: string;
}) {
  const total = Math.max(0, Math.min(200, Math.floor(props.total)));
  const filled = Math.max(0, Math.min(total, Math.floor(props.filled)));
  const partial = clamp01(props.partial ?? 0);
  return (
    <div className="oc-viz-grid">
      <div
        className="oc-viz-grid-cells"
        style={
          {
            "--oc-viz-cols": String(
              props.columns ??
                Math.min(20, Math.max(5, Math.ceil(Math.sqrt(total * 2)))),
            ),
          } as CSSProperties
        }
      >
        {Array.from({ length: total }, (_, i) => (
          <i
            // biome-ignore lint/suspicious/noArrayIndexKey: cells are positional
            key={i}
            data-on={i < filled || undefined}
            style={
              i === filled && partial > 0
                ? ({ "--oc-viz-partial": pct(partial) } as CSSProperties)
                : undefined
            }
            data-partial={i === filled && partial > 0 ? true : undefined}
          />
        ))}
      </div>
      <div className="oc-viz-grid-caption">
        <Fig text={props.display} />
        <span>{props.label}</span>
      </div>
    </div>
  );
}

/** A single share of a whole as a ring, for percentages and probabilities. */
export function Ring(props: {
  fraction: number;
  display: string;
  label: string;
}) {
  const f = clamp01(props.fraction);
  const c = 2 * Math.PI * 42;
  return (
    <div className="oc-viz-ring">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="42" className="oc-viz-ring-track" />
        <circle
          cx="50"
          cy="50"
          r="42"
          className="oc-viz-ring-fill"
          strokeDasharray={`${(f * c).toFixed(2)} ${c.toFixed(2)}`}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="oc-viz-ring-readout">
        <Fig text={props.display} />
        <span>{props.label}</span>
      </div>
    </div>
  );
}

/** Secondary figures beside the answer. */
export function StatGrid(props: {
  items: readonly { label: string; display: string; emphasis?: boolean }[];
}) {
  return (
    <dl className="oc-viz-stats">
      {props.items.map((item) => (
        <div key={item.label} data-emphasis={item.emphasis || undefined}>
          <dt>{item.label}</dt>
          <dd>
            <Fig text={item.display} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Quantities with the operation between them (a × b = c). Each operator stays
 * attached to the term after it, so narrow screens never leave a dangling "=". */
export function Equation(props: {
  items: readonly (
    | { label: string; display: string; emphasis?: boolean }
    | { op: string }
  )[];
}) {
  const groups: {
    op?: string;
    term?: { label: string; display: string; emphasis?: boolean };
  }[] = [];
  let pending: string | undefined;
  for (const item of props.items) {
    if ("op" in item) pending = pending ? `${pending} ${item.op}` : item.op;
    else {
      groups.push({ ...(pending ? { op: pending } : {}), term: item });
      pending = undefined;
    }
  }
  if (pending) groups.push({ op: pending });
  return (
    <div className="oc-viz-eq">
      {groups.map((g, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: groups are positional
        <div key={i} className="oc-viz-eq-group">
          {g.op ? <span className="oc-viz-eq-op">{g.op}</span> : null}
          {g.term ? (
            <div
              className="oc-viz-eq-term"
              data-emphasis={g.term.emphasis || undefined}
            >
              <Fig text={g.term.display} />
              <span>{g.term.label}</span>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/** Fills `{name}` placeholders in a message with already-formatted strings. */
export function fillMessage(
  template: string,
  values: Readonly<Record<string, string>>,
): string {
  return template.replace(
    /\{([A-Za-z][A-Za-z0-9_]*)\}/g,
    (match, name: string) =>
      Object.hasOwn(values, name) ? (values[name] ?? match) : match,
  );
}
