import { expect, test } from "bun:test";
import { calculate } from "../../../calculators/src/temperature";
import {
  linearScales,
  roundCanonical,
  rulerTicks,
  significantFractionDigits,
  TEMPERATURE_REFERENCES,
  temperatureScales,
} from "./unit-scale";

const six = (value: string) =>
  roundCanonical(value, significantFractionDigits(value));

test("answers keep six significant figures without trailing zeros", () => {
  expect(six("30.48")).toBe("30.48");
  expect(six("68.0388555")).toBe("68.0389");
  expect(six("236.5882365")).toBe("236.588");
  expect(six("62.137119223733396961")).toBe("62.1371");
  expect(six("0.45359237")).toBe("0.453592");
  expect(six("0.0000022046226218487758")).toBe("0.00000220462");
  expect(six("604800000")).toBe("604800000");
  expect(six("1.5")).toBe("1.5");
  expect(six("-40")).toBe("-40");
  expect(six("-17.777777777777777778")).toBe("-17.7778");
  expect(six("0")).toBe("0");
  expect(six("2.54000001")).toBe("2.54");
  expect(six("99.9999996")).toBe("100");
});

test("ruler ticks are evenly stepped and fit a phone-width ruler", () => {
  const ticks = rulerTicks(-0.75, 15.75);
  expect(ticks.map((t) => t.value)).toEqual(["0", "5", "10", "15"]);
  const wide = rulerTicks(0, 756_000_000);
  expect(wide.reduce((n, t) => n + t.value.length + 3, 0)).toBeLessThanOrEqual(
    34,
  );
  for (const t of wide) expect(t.at).toBeGreaterThanOrEqual(0);
});

test("linear scales place the value and its conversion at one fraction", () => {
  const pair = linearScales("12", "2.54", "0");
  expect(pair).not.toBeNull();
  if (!pair) return;
  const top10 = pair.top.find((t) => t.value === "10");
  const bottom = pair.bottom.find((t) => t.value === "20");
  expect(top10 && bottom).toBeTruthy();
  // 10 in sits further right than 20 cm (= 7.87 in).
  expect((top10?.at ?? 0) > (bottom?.at ?? 1)).toBe(true);
  expect(pair.fraction).toBeGreaterThan(0.5);
  expect(pair.fraction).toBeLessThan(1);
  expect(linearScales("-3", "0.3048", "0")?.fraction).toBeLessThan(0.5);
  expect(linearScales("1e30", "1", "0")).toBeNull();
});

test("temperature references agree with the engine", () => {
  const units = Object.keys(TEMPERATURE_REFERENCES);
  for (const source of units)
    for (const target of units)
      TEMPERATURE_REFERENCES[source]?.forEach((value, i) => {
        const r = calculate({ operation: "convert", value, source, target });
        expect(r.ok).toBe(true);
        if (r.ok)
          expect(Number(r.result.answer.value)).toBeCloseTo(
            Number(TEMPERATURE_REFERENCES[target]?.[i]),
            9,
          );
      });
});

test("temperature scales align references and widen for extreme readings", () => {
  const room = temperatureScales("20", "c", "f", "1.8", "32");
  expect(room?.top.map((t) => t.value)).toEqual(["-40", "0", "37", "100"]);
  expect(room?.bottom.map((t) => t.value)).toEqual([
    "-40",
    "32",
    "98.6",
    "212",
  ]);
  expect(room?.top.map((t) => t.at)).toEqual(room?.bottom.map((t) => t.at));
  const cold = temperatureScales("-273.15", "c", "k", "1", "273.15");
  expect(cold?.fraction).toBe(0);
  const hot = temperatureScales("5000", "c", "f", "1.8", "32");
  expect(hot?.fraction).toBeLessThan(1);
  expect(hot?.top.length).toBeGreaterThanOrEqual(2);
});
