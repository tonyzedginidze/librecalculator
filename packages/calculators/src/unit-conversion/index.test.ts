import { describe, expect, test } from "bun:test";
import { calculate, units } from "./index";

function answer(value: string, source: string, target: string): string {
  const result = calculate({ operation: "convert", value, source, target });
  if (!result.ok)
    throw new Error(
      `${result.error.code}${result.error.field ? ` (${result.error.field})` : ""}`,
    );
  return result.result.answer.value;
}

function close(actual: string, expected: string) {
  const a = Number(actual);
  const e = Number(expected);
  expect(Math.abs(a - e)).toBeLessThanOrEqual(1e-12 + 1e-12 * Math.abs(e));
}

describe("unit conversion", () => {
  test("catalog covers all six explicit dimensions", () => {
    expect(new Set(units.map(({ dimension }) => dimension))).toEqual(
      new Set(["length", "mass", "temperature", "area", "volume", "time"]),
    );
  });

  test("independent exact linear reference fixtures", () => {
    expect(answer("1", "in", "m")).toBe("0.0254");
    expect(answer("1", "lb", "kg")).toBe("0.45359237");
    expect(answer("1", "us-gallon", "l")).toBe("3.785411784");
    expect(answer("1", "imperial-gallon", "l")).toBe("4.54609");
    expect(answer("1", "us-fluid-ounce", "ml")).toBe("29.5735295625");
    expect(answer("1", "acre", "m2")).toBe("4046.8564224");
    expect(answer("1", "day", "s")).toBe("86400");
  });

  test("affine temperature references and absolute-zero boundary", () => {
    expect(answer("0", "c", "f")).toBe("32");
    expect(answer("0", "c", "k")).toBe("273.15");
    expect(answer("0", "k", "c")).toBe("-273.15");
    expect(answer("0", "k", "f")).toBe("-459.67");
    const invalid = calculate({
      operation: "convert",
      value: "-0.0000000000000000000001",
      source: "k",
      target: "c",
    });
    expect(invalid).toEqual({
      ok: false,
      error: { code: "below-absolute-zero", field: "value" },
    });
  });

  test("identity conversions preserve canonical values without bypassing temperature bounds", () => {
    const preciseFahrenheit = "0.0000000000000000000000000001";
    const preciseFahrenheitResult = calculate({
      operation: "convert",
      value: preciseFahrenheit,
      source: "f",
      target: "f",
    });
    expect(preciseFahrenheitResult.ok).toBe(true);
    if (preciseFahrenheitResult.ok) {
      const { result } = preciseFahrenheitResult;
      expect(result.answer.value).toBe(preciseFahrenheit);
      expect(result.working[0]?.args).toMatchObject({
        value: { kind: "decimal", value: preciseFahrenheit },
        answer: { kind: "decimal", value: preciseFahrenheit },
      });
      expect(result.visual.source).toBe("f");
      expect(result.visual.target).toBe("f");
      const sourceKelvin = result.visual.sourceKelvin;
      if (sourceKelvin === undefined)
        throw new Error("Expected Kelvin visual value");
      const targetKelvin = result.visual.targetKelvin;
      if (targetKelvin === undefined)
        throw new Error("Expected target Kelvin visual value");
      expect(sourceKelvin).toBe(targetKelvin);
    }

    for (const [value, unit] of [
      ["-123.45", "m"],
      ["-123.45", "kg"],
      ["-123.45", "m2"],
      ["-123.45", "l"],
      ["-123.45", "s"],
      ["-1", "c"],
      ["-459", "f"],
      ["0", "k"],
    ] as const)
      expect(answer(value, unit, unit)).toBe(value);

    for (const [value, unit] of [
      ["-273.15000000000000000000000001", "c"],
      ["-459.67000000000000000000000001", "f"],
      ["-0.0000000000000000000000000001", "k"],
    ] as const)
      expect(
        calculate({ operation: "convert", value, source: unit, target: unit }),
      ).toEqual({
        ok: false,
        error: { code: "below-absolute-zero", field: "value" },
      });
  });

  test("signs, identity, reverse conversions, precision bounds, and invalid dimensions", () => {
    expect(answer("-12.5", "cm", "m")).toBe("-0.125");
    expect(answer("987654321012345678901234567890", "km", "km")).toBe(
      "987654321012345678901234567890",
    );
    close(answer("1", "mi", "km"), "1.609344");
    close(answer("1.609344", "km", "mi"), "1");
    expect(
      calculate({
        operation: "convert",
        value: "1",
        source: "m",
        target: "kg",
      }),
    ).toEqual({ ok: false, error: { code: "incompatible-units" } });
    expect(
      calculate({
        operation: "convert",
        value: "1",
        source: "not-a-unit",
        target: "m",
      }),
    ).toEqual({ ok: false, error: { code: "invalid-field", field: "source" } });
  });
});
