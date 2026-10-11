import { expect, test } from "bun:test";
import { DecimalValue } from "../numeric/decimal";
import { makeUnitPreset } from "./unit-preset";

const temperature = makeUnitPreset("t", ["c", "f", "k"], "c", "f", "20");
const length = makeUnitPreset("l", ["in", "cm", "m"], "in", "cm", "12");

const run = (
  preset: ReturnType<typeof makeUnitPreset>,
  value: string,
  source: string,
  target: string,
) => {
  const result = preset.calculate({
    operation: "convert",
    value,
    source,
    target,
  });
  if (!result.ok) throw new Error(result.error.code);
  return result.result;
};

test("default value is configurable per preset", () => {
  expect(temperature.operations[0]?.fields[0]?.defaultValue).toBe("20");
  expect(length.operations[0]?.fields[0]?.defaultValue).toBe("12");
});

test("linear visual map is the exact factor with zero offset", () => {
  const result = run(length, "12", "in", "cm");
  expect(result.answer.value).toBe("30.48");
  expect(result.visual.slope).toBe("2.54");
  expect(result.visual.offset).toBe("0");
});

test("temperature visual map is affine", () => {
  const cf = run(temperature, "20", "c", "f");
  expect(cf.answer.value).toBe("68");
  expect(cf.visual.slope).toBe("1.8");
  expect(cf.visual.offset).toBe("32");
  const fk = run(temperature, "-40", "f", "k");
  expect(fk.visual.offset).toBe(
    "255.37222222222222222222222222222222222222222222222",
  );
  const kc = run(temperature, "0", "k", "c");
  expect(kc.visual.slope).toBe("1");
  expect(kc.visual.offset).toBe("-273.15");
});

test("answer equals value × slope + offset", () => {
  for (const [value, source, target] of [
    ["-40", "c", "f"],
    ["98.6", "f", "c"],
    ["300", "k", "f"],
  ] as const) {
    const r = run(temperature, value, source, target);
    const mapped = new DecimalValue(value)
      .mul(r.visual.slope)
      .plus(r.visual.offset);
    expect(mapped.minus(r.answer.value).abs().lt("1e-40")).toBe(true);
  }
});

test("working names units by symbol keys", () => {
  const result = run(length, "1", "in", "m");
  const args = result.working[0]?.args;
  expect(args?.source).toEqual({ kind: "message", key: "l.symbol.in" });
  expect(args?.target).toEqual({ kind: "message", key: "l.symbol.m" });
});
