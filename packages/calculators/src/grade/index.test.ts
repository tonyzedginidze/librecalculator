import { describe, expect, test } from "bun:test";
import { DecimalValue } from "../numeric/decimal";
import { calculate, type Input } from "./index";

const fixtures = [
  {
    operation: "grade-percent",
    inputs: { earned: "40", possible: "50" },
    expected: "80",
  },
  {
    operation: "grade-contribution",
    inputs: { percentage: "80", weight: "30" },
    expected: "24",
  },
  {
    operation: "grade-required-points",
    inputs: { target: "80", possible: "50" },
    expected: "40",
  },
];
describe("grade", () => {
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

describe("grade visual parts", () => {
  test("percent splits possible points into earned and missed", () => {
    const out = calculate({
      operation: "grade-percent",
      earned: "42",
      possible: "50",
    } as Input);
    expect(out.ok && out.result.visual.parts).toEqual({ remainder: "8" });
  });
  test("contribution splits the course into added, lost and the rest", () => {
    const out = calculate({
      operation: "grade-contribution",
      percentage: "84",
      weight: "25",
    } as Input);
    expect(out.ok && out.result.answer.value).toBe("21");
    expect(out.ok && out.result.visual.parts).toEqual({
      remainder: "4",
      outside: "75",
    });
  });
  test("required points leave the margin to possible; extra credit is negative", () => {
    const out = calculate({
      operation: "grade-required-points",
      target: "110",
      possible: "50",
    } as Input);
    expect(out.ok && out.result.visual.parts).toEqual({ remainder: "-5" });
  });
});
