import { describe, expect, test } from "bun:test";
import { DecimalValue } from "../numeric/decimal";
import { calculate, type Input } from "./index";

const fixtures = [
  {
    operation: "triangle-area",
    inputs: { base: "3", height: "4" },
    expected: "6",
  },
  {
    operation: "triangle-perimeter",
    inputs: { sideA: "3", sideB: "4", sideC: "5" },
    expected: "12",
  },
  {
    operation: "triangle-altitude",
    inputs: { area: "6", base: "3" },
    expected: "4",
  },
];
describe("triangle", () => {
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
  for (const raw of ["0", "-1", "1e3", "", "1,000"])
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

test("triangle perimeter rejects equality and impossible sides", () => {
  for (const sideC of ["7", "8"])
    expect(
      calculate({
        operation: "triangle-perimeter",
        sideA: "3",
        sideB: "4",
        sideC,
      }).ok,
    ).toBe(false);
});
