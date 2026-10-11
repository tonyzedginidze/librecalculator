/**
 * Display rules shared by the units-pack converters: significant-figure rounding of
 * engine decimals and the two aligned rulers drawn under each answer. Pure helpers so
 * the view and its tests use the same numbers.
 */

/** Conversions read best at six significant figures (30.48, 68.0389, 236.588). */
export const SIGNIFICANT_DIGITS = 6;

/** Fraction digits that keep `significant` figures of a canonical decimal. */
export function significantFractionDigits(
  canonical: string,
  significant = SIGNIFICANT_DIGITS,
): number {
  const [integer = "0", fraction = ""] = canonical
    .replace(/^[+-]/, "")
    .split(".");
  const integerDigits = integer.replace(/^0+/, "").length;
  if (integerDigits > 0) return Math.max(0, significant - integerDigits);
  const leading = /^0*/.exec(fraction)?.[0].length ?? 0;
  return leading === fraction.length ? 0 : leading + significant;
}

/** Rounds a canonical decimal half up (away from zero) and drops trailing zeros. */
export function roundCanonical(canonical: string, fractionDigits: number) {
  const negative = canonical.startsWith("-");
  const [integer = "0", fraction = ""] = canonical
    .replace(/^[+-]/, "")
    .split(".");
  const keep = Math.max(0, Math.floor(fractionDigits));
  let digits: string;
  if (fraction.length <= keep) digits = integer + fraction.padEnd(keep, "0");
  else {
    const up = (fraction[keep] ?? "0") >= "5";
    digits = (BigInt(integer + fraction.slice(0, keep)) + (up ? 1n : 0n))
      .toString()
      .padStart(keep + 1, "0");
  }
  const whole = keep ? digits.slice(0, -keep) : digits;
  const part = keep ? digits.slice(-keep).replace(/0+$/, "") : "";
  const text = `${whole.replace(/^0+(?=\d)/, "") || "0"}${part ? `.${part}` : ""}`;
  return negative && /[1-9]/.test(text) ? `-${text}` : text;
}

/** A plain number as a canonical decimal string with at most `decimals` digits. */
export function numberToCanonical(value: number, decimals: number): string {
  const text = roundCanonical(
    value.toFixed(Math.min(20, Math.max(0, decimals))),
    decimals,
  );
  return text === "-0" ? "0" : text;
}

export type Tick = { at: number; value: string };
export type ScalePair = {
  fraction: number;
  top: Tick[];
  bottom: Tick[];
};

function niceStep(raw: number): number {
  const power = 10 ** Math.floor(Math.log10(raw));
  const m = raw / power;
  return (
    (m < 1.5 ? 1 : m < 2.25 ? 2 : m < 3.5 ? 2.5 : m < 7.5 ? 5 : 10) * power
  );
}

function stepDecimals(step: number): number {
  const exponent = Math.floor(Math.log10(step) + 1e-9);
  const mantissa = step / 10 ** exponent;
  return Math.max(0, -exponent + (Math.abs(mantissa - 2.5) < 1e-9 ? 1 : 0));
}

/** Character budget for one ruler's labels, sized for a 390px-wide phone. */
const LABEL_BUDGET = 34;
const EDGE = 0.04;

/** Evenly stepped ticks for [lo, hi] whose labels fit on a narrow ruler. */
export function rulerTicks(lo: number, hi: number): Tick[] {
  const span = hi - lo;
  if (!(span > 0) || !Number.isFinite(span)) return [];
  let best: Tick[] = [];
  for (const count of [4, 3, 2, 1]) {
    const step = niceStep(span / count);
    const decimals = stepDecimals(step);
    const ticks: Tick[] = [];
    for (
      let k = Math.ceil(lo / step - 1e-9);
      k * step <= hi + step * 1e-9;
      k++
    ) {
      const v = k * step;
      const at = (v - lo) / span;
      // Labels are centred on their tick; keep them off the ruler's rounded ends.
      if (at >= EDGE && at <= 1 - EDGE)
        ticks.push({ at, value: numberToCanonical(v, decimals) });
    }
    best = ticks;
    const width = ticks.reduce((sum, t) => sum + t.value.length + 3, 0);
    if (width <= LABEL_BUDGET) return ticks;
  }
  return best;
}

/** Largest magnitude the rulers draw; beyond it the view shows a plain equation. */
const DRAWABLE = 1e15;
const TINY = 1e-9;

function drawable(...values: number[]) {
  return values.every(
    (v) =>
      Number.isFinite(v) &&
      Math.abs(v) < DRAWABLE &&
      (v === 0 || Math.abs(v) > TINY),
  );
}

/**
 * Two rulers over the same physical range: the top one in the source unit, the bottom
 * one in the target unit, mapped through the engine's exact `slope` and `offset`.
 */
/** The value's cursor runs through both rulers; hide tick labels it would strike. */
const CURSOR_CLEARANCE = 0.05;
function clearOfCursor(pair: ScalePair): ScalePair {
  const clear = (t: Tick) => Math.abs(t.at - pair.fraction) >= CURSOR_CLEARANCE;
  return {
    fraction: pair.fraction,
    top: pair.top.filter(clear),
    bottom: pair.bottom.filter(clear),
  };
}

export function linearScales(
  value: string,
  slope: string,
  offset: string,
): ScalePair | null {
  const v = Number(value);
  const k = Number(slope);
  const c = Number(offset);
  if (!(k > 0) || !drawable(v, k, v * k + c)) return null;
  const magnitude = Math.abs(v) || 1;
  const step = niceStep(magnitude / 3);
  const extent = Math.ceil((magnitude * 1.12) / step) * step;
  // A small margin keeps the end labels inside the ruler, as on a real rule.
  const pad = extent * 0.05;
  const [lo, hi] = v < 0 ? [-extent - pad, pad] : [-pad, extent + pad];
  return clearOfCursor({
    fraction: (v - lo) / (hi - lo),
    top: rulerTicks(lo, hi),
    bottom: rulerTicks(lo * k + c, hi * k + c),
  });
}

/** Reference temperatures (−40, water freezes, body temperature, water boils). */
export const TEMPERATURE_REFERENCES: Readonly<
  Record<string, readonly string[]>
> = {
  c: ["-40", "0", "37", "100"],
  f: ["-40", "32", "98.6", "212"],
  k: ["233.15", "273.15", "310.15", "373.15"],
};
const ABSOLUTE_ZERO: Readonly<Record<string, number>> = {
  c: -273.15,
  f: -459.67,
  k: 0,
};
/** The default window runs a little past the references at both ends. */
const TEMPERATURE_WINDOW: Readonly<Record<string, readonly [number, number]>> =
  {
    c: [-55, 115],
    f: [-67, 239],
    k: [218.15, 388.15],
  };

/**
 * Thermometer-style pair: both scales cover the same temperatures and share reference
 * ticks, so 0 °C sits above 32 °F. The window widens to include any valid reading.
 */
export function temperatureScales(
  value: string,
  source: string,
  target: string,
  slope: string,
  offset: string,
): ScalePair | null {
  const refsTop = TEMPERATURE_REFERENCES[source];
  const refsBottom = TEMPERATURE_REFERENCES[target];
  const window = TEMPERATURE_WINDOW[source];
  const zero = ABSOLUTE_ZERO[source];
  const v = Number(value);
  if (!refsTop || !refsBottom || !window || zero === undefined) return null;
  if (!drawable(v)) return null;
  let [lo, hi] = window;
  const span = hi - lo;
  if (v < lo + span * 0.04) lo = Math.max(zero, v - span * 0.1);
  if (v > hi - span * 0.04) hi = v + (v - lo) * 0.12;
  const at = (x: number) => (x - lo) / (hi - lo);
  const top: Tick[] = [];
  const bottom: Tick[] = [];
  refsTop.forEach((ref, i) => {
    const position = at(Number(ref));
    const other = refsBottom[i];
    if (other === undefined || position < EDGE || position > 1 - EDGE) return;
    if (top.some((t) => Math.abs(t.at - position) < 0.12)) return;
    top.push({ at: position, value: ref });
    bottom.push({ at: position, value: other });
  });
  const spread = (top.at(-1)?.at ?? 0) - (top[0]?.at ?? 0);
  if (top.length >= 2 && spread >= 0.4)
    return clearOfCursor({ fraction: at(v), top, bottom });
  // A reading far outside everyday temperatures: fall back to stepped ticks.
  const k = Number(slope);
  const c = Number(offset);
  if (!(k > 0) || !drawable(k, hi * k + c)) return null;
  return clearOfCursor({
    fraction: at(v),
    top: rulerTicks(lo, hi),
    bottom: rulerTicks(lo * k + c, hi * k + c),
  });
}
