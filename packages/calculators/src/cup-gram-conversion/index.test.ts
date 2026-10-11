import { describe, expect, test } from "bun:test";
import { DecimalValue } from "../numeric/decimal";
import { calculate, type Input } from "./index";

const fixtures = [
  {
    operation: "cups-to-grams",
    inputs: { cups: "2", gramsPerCup: "120" },
    expected: "240",
  },
  {
    operation: "grams-to-cups",
    inputs: { grams: "240", gramsPerCup: "120" },
    expected: "2",
  },
  {
    operation: "half-cup-grams",
    inputs: { gramsPerCup: "120" },
    expected: "60",
  },
];
describe("cup-gram-conversion", () => {
  for (const fixture of fixtures)
    test(fixture.operation, () => {
      const outcome = calculate({
        operation: fixture.operation,
        ...fixture.inputs,
      } as Input);
      expect(outcome.ok).toBe(true);
      if (outcome.ok) {
        expect(
          new DecimalValue(outcome.result.answer.value)
            .minus(fixture.expected)
            .abs()
            .lte(
              new DecimalValue(fixture.expected)
                .abs()
                .mul("0.000000000001")
                .plus("0.000000000001"),
            ),
        ).toBe(true);
        expect(outcome.result.visual.answer).toBe(outcome.result.answer.value);
      }
    });
  for (const raw of ["-1000", "1e3", "", "1,000"])
    test(`reject ${raw}`, () => {
      const fixture = fixtures[0];
      if (!fixture) throw new Error("Missing fixture");
      expect(
        calculate({
          operation: fixture.operation,
          ...fixture.inputs,
          [Object.keys(fixture.inputs)[0] ?? "missing"]: raw,
        } as Input).ok,
      ).toBe(false);
    });
});

test("zero mass accepted, zero density rejected", () => {
  expect(
    calculate({ operation: "grams-to-cups", grams: "0", gramsPerCup: "120" })
      .ok,
  ).toBe(true);
  expect(
    calculate({ operation: "grams-to-cups", grams: "240", gramsPerCup: "0" })
      .ok,
  ).toBe(false);
});

test("visual reads the same amount in cups and grams", () => {
  const toCups = calculate({
    operation: "grams-to-cups",
    grams: "300",
    gramsPerCup: "120",
  });
  expect(toCups.ok).toBe(true);
  if (toCups.ok)
    expect(toCups.result.visual).toMatchObject({
      cups: "2.5",
      grams: "300",
      gramsPerCup: "120",
    });
  const half = calculate({ operation: "half-cup-grams", gramsPerCup: "120" });
  expect(half.ok).toBe(true);
  if (half.ok)
    expect(half.result.visual).toMatchObject({ cups: "0.5", grams: "60" });
});
