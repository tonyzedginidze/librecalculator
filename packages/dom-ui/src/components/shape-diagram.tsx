import type { ReactNode } from "react";
import "../../../design/src/geometry.css";

/**
 * Dimensioned shape drawings for geometry results. Shapes keep the proportions the
 * user entered (clamped so a very thin shape stays readable), given measurements sit
 * on thin dimension lines in ink, and the solved quantity is drawn in the accent.
 * Every visible string is passed in already formatted by the view.
 */

const VB_W = 360;
const VB_H = 220;
const CX = VB_W / 2;
const CY = 106;

type Pt = readonly [number, number];
type Tone = "given" | "answer";

const num = (value: string, fallback = 1) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

/** Fits a w × h box inside maxW × maxH, keeping the ratio within [1/limit, limit]. */
function fit(w: number, h: number, maxW: number, maxH: number, limit = 4) {
  const ratio = Math.min(limit, Math.max(1 / limit, w / h));
  return ratio > maxW / maxH
    ? { w: maxW, h: maxW / ratio }
    : { w: maxH * ratio, h: maxH };
}

const r1 = (n: number) => Math.round(n * 10) / 10;
const pts = (list: readonly Pt[]) =>
  list.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" ");

export function ShapeSvg(props: { children: ReactNode }) {
  return (
    <svg
      className="oc-shape"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      aria-hidden="true"
      focusable="false"
    >
      {props.children}
    </svg>
  );
}

function Label(props: {
  at: Pt;
  text: string;
  tone?: Tone;
  anchor?: "start" | "middle" | "end";
  onFill?: boolean;
}) {
  return (
    <text
      x={r1(props.at[0])}
      y={r1(props.at[1])}
      className="oc-shape-label"
      data-tone={props.tone ?? "given"}
      data-on={props.onFill ? "fill" : undefined}
      textAnchor={props.anchor ?? "middle"}
    >
      {props.text}
    </text>
  );
}

/** Dimension line parallel to a→b, shifted along its normal by `offset`. */
function Dim(props: {
  a: Pt;
  b: Pt;
  offset: number;
  label: string;
  tone?: Tone;
}) {
  const [ax, ay] = props.a;
  const [bx, by] = props.b;
  const len = Math.hypot(bx - ax, by - ay) || 1;
  const dx = (bx - ax) / len;
  const dy = (by - ay) / len;
  const nx = -dy;
  const ny = dx;
  const o = props.offset;
  const p1: Pt = [ax + nx * o, ay + ny * o];
  const p2: Pt = [bx + nx * o, by + ny * o];
  const tick = (p: Pt) =>
    `M${r1(p[0] - nx * 5)} ${r1(p[1] - ny * 5)}L${r1(p[0] + nx * 5)} ${r1(p[1] + ny * 5)}`;
  const side = Math.sign(o) || 1;
  const sideways = Math.abs(nx * side) > 0.6;
  const gap = sideways ? 9 : 13;
  const mid: Pt = [
    (p1[0] + p2[0]) / 2 + nx * side * gap,
    (p1[1] + p2[1]) / 2 + ny * side * gap,
  ];
  const anchor = sideways ? (nx * side > 0 ? "start" : "end") : "middle";
  const toneClass =
    props.tone === "answer"
      ? "oc-shape-dim oc-shape-dim-answer"
      : "oc-shape-dim";
  return (
    <g>
      <path
        className="oc-shape-ext"
        d={`M${r1(ax + nx * side * 4)} ${r1(ay + ny * side * 4)}L${r1(p1[0] + nx * side * 4)} ${r1(p1[1] + ny * side * 4)}M${r1(bx + nx * side * 4)} ${r1(by + ny * side * 4)}L${r1(p2[0] + nx * side * 4)} ${r1(p2[1] + ny * side * 4)}`}
      />
      <path
        className={toneClass}
        d={`M${r1(p1[0])} ${r1(p1[1])}L${r1(p2[0])} ${r1(p2[1])}${tick(p1)}${tick(p2)}`}
      />
      <Label
        at={mid}
        text={props.label}
        tone={props.tone ?? "given"}
        anchor={anchor}
      />
    </g>
  );
}

function RightAngle(props: { at: Pt; ux: Pt; uy: Pt; size?: number }) {
  const s = props.size ?? 10;
  const [x, y] = props.at;
  const a: Pt = [x + props.ux[0] * s, y + props.ux[1] * s];
  const c: Pt = [x + props.uy[0] * s, y + props.uy[1] * s];
  const b: Pt = [a[0] + props.uy[0] * s, a[1] + props.uy[1] * s];
  return (
    <path
      className="oc-shape-mark"
      d={`M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}L${r1(c[0])} ${r1(c[1])}`}
    />
  );
}

/* ───────── Rectangle ───────── */

export function RectangleShape(props: {
  width: string;
  height: string;
  widthLabel: string;
  heightLabel: string;
  focus: "area" | "perimeter" | "diagonal";
  answerLabel: string;
}) {
  const box = fit(num(props.width), num(props.height), 220, 132);
  const x0 = CX - box.w / 2 + 14;
  const y0 = CY - box.h / 2;
  const x1 = x0 + box.w;
  const y1 = y0 + box.h;
  const dlen = Math.hypot(box.w, box.h) || 1;
  // Unit vector along the diagonal, used to set its label off the line.
  const diag: Pt = [box.w / dlen, box.h / dlen];
  return (
    <ShapeSvg>
      <rect
        x={r1(x0)}
        y={r1(y0)}
        width={r1(box.w)}
        height={r1(box.h)}
        rx="2"
        className={
          props.focus === "area"
            ? "oc-shape-solid"
            : props.focus === "perimeter"
              ? "oc-shape-outline-strong"
              : "oc-shape-quiet"
        }
      />
      <Dim a={[x0, y1]} b={[x1, y1]} offset={18} label={props.widthLabel} />
      <Dim a={[x0, y1]} b={[x0, y0]} offset={-18} label={props.heightLabel} />
      {props.focus === "diagonal" ? (
        <>
          <path
            className="oc-shape-answer-line"
            d={`M${r1(x0)} ${r1(y1)}L${r1(x1)} ${r1(y0)}`}
          />
          <circle cx={r1(x0)} cy={r1(y1)} r="3.5" className="oc-shape-dot" />
          <circle cx={r1(x1)} cy={r1(y0)} r="3.5" className="oc-shape-dot" />
          <Label
            at={[CX + 14 - diag[1] * 12, CY - diag[0] * 12]}
            text={props.answerLabel}
            tone="answer"
            anchor="end"
          />
        </>
      ) : (
        <Label
          at={[CX + 14, CY]}
          text={props.answerLabel}
          tone="answer"
          onFill={props.focus === "area"}
        />
      )}
    </ShapeSvg>
  );
}

/* ───────── Rectangular prism ───────── */

export function BoxShape(props: {
  width: string;
  height: string;
  depth: string;
  widthLabel: string;
  heightLabel: string;
  depthLabel: string;
  answerLabel: string;
}) {
  const w = num(props.width);
  const h = num(props.height);
  const d = num(props.depth);
  // Oblique projection: depth recedes up-right at 30° and half scale.
  const k = 0.5;
  const ox = Math.cos(Math.PI / 6) * k;
  const oy = Math.sin(Math.PI / 6) * k;
  const clampD = Math.min(d, Math.max(w, h) * 2.5);
  const totalW = w + clampD * ox;
  const totalH = h + clampD * oy;
  const box = fit(totalW, totalH, 210, 140, 3.5);
  const s = Math.min(box.w / totalW, box.h / totalH);
  const fw = w * s;
  const fh = h * s;
  const dx = clampD * ox * s;
  const dy = clampD * oy * s;
  const x0 = CX - (fw + dx) / 2;
  const yb = CY + (fh + dy) / 2;
  const front: Pt[] = [
    [x0, yb],
    [x0 + fw, yb],
    [x0 + fw, yb - fh],
    [x0, yb - fh],
  ];
  const top: Pt[] = [
    [x0, yb - fh],
    [x0 + fw, yb - fh],
    [x0 + fw + dx, yb - fh - dy],
    [x0 + dx, yb - fh - dy],
  ];
  const side: Pt[] = [
    [x0 + fw, yb],
    [x0 + fw + dx, yb - dy],
    [x0 + fw + dx, yb - fh - dy],
    [x0 + fw, yb - fh],
  ];
  return (
    <ShapeSvg>
      <polygon points={pts(side)} className="oc-shape-solid-deep" />
      <polygon points={pts(top)} className="oc-shape-solid-light" />
      <polygon points={pts(front)} className="oc-shape-solid" />
      <Dim
        a={[x0, yb]}
        b={[x0 + fw, yb]}
        offset={16}
        label={props.widthLabel}
      />
      <Dim
        a={[x0, yb]}
        b={[x0, yb - fh]}
        offset={-16}
        label={props.heightLabel}
      />
      <Dim
        a={[x0 + fw, yb]}
        b={[x0 + fw + dx, yb - dy]}
        offset={14}
        label={props.depthLabel}
      />
      <Label
        at={[x0 + fw / 2, yb - fh / 2]}
        text={props.answerLabel}
        tone="answer"
        onFill
      />
    </ShapeSvg>
  );
}

/* ───────── Triangles ───────── */

/** Triangle from a base and perpendicular height; the apex sits over 35% of the base. */
export function AltitudeTriangleShape(props: {
  base: string;
  height: string;
  baseLabel: string;
  heightLabel: string;
  heightTone: Tone;
  centreLabel: string;
  centreTone: Tone;
}) {
  const box = fit(num(props.base), num(props.height), 220, 132);
  const x0 = CX - box.w / 2 - 10;
  const yb = CY + box.h / 2;
  const apex: Pt = [x0 + box.w * 0.35, yb - box.h];
  const foot: Pt = [apex[0], yb];
  return (
    <ShapeSvg>
      <polygon
        points={pts([[x0, yb], [x0 + box.w, yb], apex])}
        className="oc-shape-solid"
      />
      <path
        className={
          props.heightTone === "answer"
            ? "oc-shape-answer-line"
            : "oc-shape-guide"
        }
        d={`M${r1(apex[0])} ${r1(apex[1])}L${r1(foot[0])} ${r1(foot[1])}`}
      />
      <RightAngle at={foot} ux={[1, 0]} uy={[0, -1]} />
      <Dim
        a={[x0, yb]}
        b={[x0 + box.w, yb]}
        offset={18}
        label={props.baseLabel}
      />
      <Dim
        a={[x0 + box.w, yb]}
        b={[x0 + box.w, apex[1]]}
        offset={22}
        label={props.heightLabel}
        tone={props.heightTone}
      />
      <path
        className="oc-shape-ext"
        d={`M${r1(apex[0] + 4)} ${r1(apex[1])}H${r1(x0 + box.w + 26)}`}
      />
      <Label
        at={[x0 + box.w * 0.55, yb - box.h * 0.3]}
        text={props.centreLabel}
        tone={props.centreTone}
        onFill
      />
    </ShapeSvg>
  );
}

/** Triangle from three side lengths a, b, c (a along the base). */
export function SidesTriangleShape(props: {
  a: string;
  b: string;
  c: string;
  aLabel: string;
  bLabel: string;
  cLabel: string;
  answerLabel: string;
}) {
  const a = num(props.a);
  const b = num(props.b);
  const c = num(props.c);
  // Vertex P with |P - O| = c and |P - A| = b, where O = (0,0), A = (a,0).
  const px = (a * a + c * c - b * b) / (2 * a);
  const py = Math.sqrt(Math.max(0, c * c - px * px));
  const minX = Math.min(0, px);
  const maxX = Math.max(a, px);
  const spanX = maxX - minX || 1;
  const spanY = py || 1;
  const s = Math.min(220 / spanX, 132 / spanY);
  const ox = CX - (spanX * s) / 2 - minX * s;
  const oy = CY + (spanY * s) / 2;
  const O: Pt = [ox, oy];
  const A: Pt = [ox + a * s, oy];
  const P: Pt = [ox + px * s, oy - py * s];
  const centroid: Pt = [(O[0] + A[0] + P[0]) / 3, (O[1] + A[1] + P[1]) / 3];
  const edgeLabel = (p: Pt, q: Pt, text: string) => {
    const mx = (p[0] + q[0]) / 2;
    const my = (p[1] + q[1]) / 2;
    const vx = mx - centroid[0];
    const vy = my - centroid[1];
    const len = Math.hypot(vx, vy) || 1;
    const at: Pt = [mx + (vx / len) * 16, my + (vy / len) * 16];
    const anchor =
      Math.abs(vx / len) < 0.35 ? "middle" : vx > 0 ? "start" : "end";
    return <Label at={at} text={text} anchor={anchor} />;
  };
  return (
    <ShapeSvg>
      <polygon points={pts([O, A, P])} className="oc-shape-outline-strong" />
      {[O, A, P].map(([x, y]) => (
        <circle
          key={`${r1(x)}-${r1(y)}`}
          cx={r1(x)}
          cy={r1(y)}
          r="3.5"
          className="oc-shape-dot"
        />
      ))}
      {edgeLabel(O, A, props.aLabel)}
      {edgeLabel(A, P, props.bLabel)}
      {edgeLabel(O, P, props.cLabel)}
      <Label at={centroid} text={props.answerLabel} tone="answer" />
    </ShapeSvg>
  );
}

/** Right triangle: leg a horizontal, leg b vertical, hypotenuse c. */
export function RightTriangleShape(props: {
  a: string;
  b: string;
  aLabel: string;
  bLabel: string;
  cLabel: string;
  solved: "a" | "b" | "c";
}) {
  const box = fit(num(props.a), num(props.b), 210, 132);
  const x0 = CX - box.w / 2 + 6;
  const yb = CY + box.h / 2;
  const B: Pt = [x0 + box.w, yb];
  const T: Pt = [x0, yb - box.h];
  const tone = (side: "a" | "b" | "c"): Tone =>
    props.solved === side ? "answer" : "given";
  const hyp = [B[0] - T[0], B[1] - T[1]] as const;
  const hlen = Math.hypot(hyp[0], hyp[1]) || 1;
  const n: Pt = [-hyp[1] / hlen, hyp[0] / hlen];
  const mid: Pt = [(B[0] + T[0]) / 2, (B[1] + T[1]) / 2];
  // Outward normal of the hypotenuse points away from the right-angle corner.
  const away = n[0] * (mid[0] - x0) + n[1] * (mid[1] - yb);
  const out: Pt = away < 0 ? [-n[0], -n[1]] : n;
  return (
    <ShapeSvg>
      <polygon points={pts([[x0, yb], B, T])} className="oc-shape-solid" />
      {(["a", "b", "c"] as const).map((side) =>
        props.solved === side ? (
          <path
            key={side}
            className="oc-shape-answer-line"
            d={
              side === "a"
                ? `M${r1(x0)} ${r1(yb)}L${r1(B[0])} ${r1(B[1])}`
                : side === "b"
                  ? `M${r1(x0)} ${r1(yb)}L${r1(T[0])} ${r1(T[1])}`
                  : `M${r1(T[0])} ${r1(T[1])}L${r1(B[0])} ${r1(B[1])}`
            }
          />
        ) : null,
      )}
      <RightAngle at={[x0, yb]} ux={[1, 0]} uy={[0, -1]} size={12} />
      <Dim
        a={[x0, yb]}
        b={B}
        offset={18}
        label={props.aLabel}
        tone={tone("a")}
      />
      <Dim
        a={[x0, yb]}
        b={T}
        offset={-18}
        label={props.bLabel}
        tone={tone("b")}
      />
      <Label
        at={[mid[0] + out[0] * 12, mid[1] + out[1] * 12]}
        text={props.cLabel}
        tone={tone("c")}
        anchor="start"
      />
    </ShapeSvg>
  );
}

/* ───────── Round shapes ───────── */

const R = 72;

/** Circle or sphere with a radius line. `focus` decides what is drawn in accent. */
export function RoundShape(props: {
  sphere?: boolean;
  radiusLabel: string;
  focus: "fill" | "outline" | "diameter";
  answerLabel: string;
}) {
  const cy = CY - 4;
  const ry = props.sphere ? R * 0.28 : 0;
  // A sphere's radius rises above the equator so its label clears the ellipse.
  const tip: Pt = props.sphere
    ? [Math.cos(Math.PI / 6), -Math.sin(Math.PI / 6)]
    : [1, 0];
  return (
    <ShapeSvg>
      <circle
        cx={CX}
        cy={cy}
        r={R}
        className={
          props.focus === "fill"
            ? "oc-shape-solid"
            : props.focus === "outline"
              ? "oc-shape-outline-strong"
              : "oc-shape-quiet"
        }
      />
      {props.sphere ? (
        <>
          <path
            className="oc-shape-hidden"
            d={`M${CX - R} ${cy}A${R} ${r1(ry)} 0 0 1 ${CX + R} ${cy}`}
          />
          <path
            className="oc-shape-edge"
            d={`M${CX - R} ${cy}A${R} ${r1(ry)} 0 0 0 ${CX + R} ${cy}`}
          />
        </>
      ) : null}
      {props.focus === "diameter" ? (
        <>
          <path
            className="oc-shape-answer-line"
            d={`M${CX - R} ${cy}H${CX + R}`}
          />
          <circle cx={CX - R} cy={cy} r="3.5" className="oc-shape-dot" />
          <circle cx={CX + R} cy={cy} r="3.5" className="oc-shape-dot" />
          <Label
            at={[CX, cy + R + 22]}
            text={props.answerLabel}
            tone="answer"
          />
          <Label
            at={[CX + R / 2, cy - (props.sphere ? ry + 12 : 14)]}
            text={props.radiusLabel}
          />
          <circle cx={CX} cy={cy} r="3" className="oc-shape-centre" />
        </>
      ) : (
        <>
          <path
            className="oc-shape-radius"
            d={`M${CX} ${cy}L${r1(CX + R * tip[0])} ${r1(cy + R * tip[1])}`}
          />
          <circle cx={CX} cy={cy} r="3" className="oc-shape-centre" />
          <Label
            at={[
              CX + (R / 2) * tip[0] + tip[1] * 14,
              cy + (R / 2) * tip[1] - tip[0] * 14,
            ]}
            text={props.radiusLabel}
            anchor={props.sphere ? "end" : "middle"}
            onFill={props.focus === "fill"}
          />
          <Label
            at={props.focus === "fill" ? [CX, cy + R * 0.5] : [CX, cy + R + 22]}
            text={props.answerLabel}
            tone="answer"
            onFill={props.focus === "fill"}
          />
        </>
      )}
    </ShapeSvg>
  );
}

/** Upright cylinder sized from radius and height. */
export function CylinderShape(props: {
  radius: string;
  height: string;
  radiusLabel: string;
  heightLabel: string;
  focus: "volume" | "total" | "lateral";
  answerLabel: string;
}) {
  const box = fit(2 * num(props.radius), num(props.height), 190, 120, 3.5);
  const w = box.w;
  const h = box.h;
  const ry = Math.max(8, Math.min(22, w * 0.15));
  const x0 = CX - w / 2 - 14;
  const x1 = x0 + w;
  const cx = (x0 + x1) / 2;
  const yt = CY - h / 2 + 4;
  const yb = yt + h;
  const rx = w / 2;
  const body = `M${r1(x0)} ${r1(yt)}V${r1(yb)}A${r1(rx)} ${r1(ry)} 0 0 0 ${r1(x1)} ${r1(yb)}V${r1(yt)}A${r1(rx)} ${r1(ry)} 0 0 1 ${r1(x0)} ${r1(yt)}Z`;
  const bodyClass =
    props.focus === "volume"
      ? "oc-shape-solid"
      : props.focus === "lateral"
        ? "oc-shape-solid oc-shape-strong"
        : "oc-shape-solid oc-shape-strong";
  const capClass =
    props.focus === "lateral"
      ? "oc-shape-quiet"
      : props.focus === "total"
        ? "oc-shape-solid-deep oc-shape-strong"
        : "oc-shape-solid-light";
  return (
    <ShapeSvg>
      <path d={body} className={bodyClass} />
      <path
        className="oc-shape-hidden"
        d={`M${r1(x0)} ${r1(yb)}A${r1(rx)} ${r1(ry)} 0 0 1 ${r1(x1)} ${r1(yb)}`}
      />
      <ellipse
        cx={r1(cx)}
        cy={r1(yt)}
        rx={r1(rx)}
        ry={r1(ry)}
        className={capClass}
      />
      {props.focus === "total" ? (
        <path
          className="oc-shape-edge-strong"
          d={`M${r1(x0)} ${r1(yb)}A${r1(rx)} ${r1(ry)} 0 0 0 ${r1(x1)} ${r1(yb)}`}
        />
      ) : null}
      <path className="oc-shape-radius" d={`M${r1(cx)} ${r1(yt)}H${r1(x1)}`} />
      <circle cx={r1(cx)} cy={r1(yt)} r="3" className="oc-shape-centre" />
      <Label at={[cx + rx / 2, yt - ry - 12]} text={props.radiusLabel} />
      <Dim a={[x1, yb]} b={[x1, yt]} offset={20} label={props.heightLabel} />
      <Label
        at={[cx, (yt + yb) / 2 + ry / 2]}
        text={props.answerLabel}
        tone="answer"
        onFill
      />
    </ShapeSvg>
  );
}
