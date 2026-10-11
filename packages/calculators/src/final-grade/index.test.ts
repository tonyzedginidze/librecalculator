import { describe, expect, test } from "bun:test";
import { DecimalValue } from "../numeric/decimal";
import { calculate, type Input } from "./index";

const fixtures = [
  {
    operation: "final-required",
    inputs: { current: "80", target: "83", finalWeight: "30" },
    expected: "90",
  },
  {
    operation: "final-projected",
    inputs: { current: "80", finalScore: "90", finalWeight: "30" },
    expected: "83",
  },
  {
    operation: "final-current-needed",
    inputs: { target: "83", finalScore: "90", finalWeight: "30" },
    expected: "80",
  },
];
describe("final-grade", () => {
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

test("required final keeps impossible and already-met targets visible", () => {
  for (const [target, expected] of [
    ["100", "280"],
    ["0", "-720"],
  ]) {
    const outcome = calculate({
      operation: "final-required",
      current: "80",
      target: target ?? "",
      finalWeight: "10",
    });
    expect(outcome.ok).toBe(true);
    if (outcome.ok) expect(outcome.result.answer.value).toBe(expected ?? "");
  }
  expect(
    calculate({
      operation: "final-required",
      current: "80",
      target: "90",
      finalWeight: "0",
    }).ok,
  ).toBe(false);
  expect(
    calculate({
      operation: "final-current-needed",
      target: "90",
      finalScore: "80",
      finalWeight: "100",
    }).ok,
  ).toBe(false);
});
