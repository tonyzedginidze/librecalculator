import { describe, expect, test } from "bun:test";
import { DecimalValue } from "../numeric/decimal";
import { calculate, type Input } from "./index";

const fixtures = [
  {
    operation: "test-percentage",
    inputs: { correct: "16", questions: "20" },
    expected: "80",
  },
  {
    operation: "test-missed",
    inputs: { questions: "20", correct: "16" },
    expected: "4",
  },
  {
    operation: "test-needed",
    inputs: { target: "80", questions: "20" },
    expected: "16",
  },
];
describe("test-score", () => {
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

test("threshold rounds up and rejects impossible counts", () => {
  const outcome = calculate({
    operation: "test-needed",
    target: "75",
    questions: "7",
  });
  expect(outcome.ok).toBe(true);
  if (outcome.ok) expect(outcome.result.answer.value).toBe("6");
  for (const correct of ["8", "2.5"])
    expect(
      calculate({ operation: "test-percentage", questions: "7", correct }).ok,
    ).toBe(false);
});
