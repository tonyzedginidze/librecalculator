import { describe, expect, test } from "bun:test";
import { lesson } from "../../../content/src/fractions/index";
import { renderWorkingStep } from "../../../i18n/src/en";
import { messages } from "../../../i18n/src/topics/fractions";
import { calculate } from "./index";

describe("fraction engine", () => {
  test.each([
    [
      {
        operation: "add",
        leftNumerator: "1",
        leftDenominator: "2",
        rightNumerator: "1",
        rightDenominator: "3",
      },
      "5",
      "6",
      "5/6",
    ],
    [
      {
        operation: "subtract",
        leftNumerator: "1",
        leftDenominator: "2",
        rightNumerator: "3",
        rightDenominator: "4",
      },
      "-1",
      "4",
      "-1/4",
    ],
    [
      {
        operation: "multiply",
        leftNumerator: "2",
        leftDenominator: "3",
        rightNumerator: "9",
        rightDenominator: "4",
      },
      "3",
      "2",
      "1 1/2",
    ],
    [
      {
        operation: "divide",
        leftNumerator: "2",
        leftDenominator: "3",
        rightNumerator: "4",
        rightDenominator: "5",
      },
      "5",
      "6",
      "5/6",
    ],
  ] as const)("independent exact fixture %j", (input, numerator, denominator, mixed) => {
    const result = calculate(input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.answer).toEqual({
      kind: "exact-rational",
      numerator,
      denominator,
    });
    expect(result.result.mixed.text).toBe(mixed);
    expect(result.result.visual.numerator).toBe(numerator);
    expect(result.result.visual.denominator).toBe(denominator);
    expect(result.result.visual.numberLine.exactMarkerNumerator).toBe(
      numerator,
    );
  });

  test("normalizes denominator signs, zero, and negative mixed form", () => {
    const reduced = calculate({
      operation: "reduce",
      numerator: "-42",
      denominator: "-56",
    });
    expect(reduced.ok && reduced.result.answer).toEqual({
      kind: "exact-rational",
      numerator: "3",
      denominator: "4",
    });

    const negative = calculate({
      operation: "reduce",
      numerator: "-7",
      denominator: "3",
    });
    expect(negative.ok && negative.result.mixed).toEqual({
      sign: "negative",
      whole: "2",
      remainderNumerator: "1",
      remainderDenominator: "3",
      text: "-2 1/3",
    });

    const zero = calculate({
      operation: "reduce",
      numerator: "0",
      denominator: "-9",
    });
    expect(zero.ok && zero.result.answer).toEqual({
      kind: "exact-rational",
      numerator: "0",
      denominator: "1",
    });
    expect(zero.ok && zero.result.mixed.whole).toBe("0");
  });

  test("cancels independently authored 1000-digit factors exactly", () => {
    const power = `1${"0".repeat(999)}`;
    const threeTimesPower = `3${"0".repeat(999)}`;
    const result = calculate({
      operation: "reduce",
      numerator: power,
      denominator: threeTimesPower,
    });
    expect(result.ok && result.result.answer).toEqual({
      kind: "exact-rational",
      numerator: "1",
      denominator: "3",
    });
  });

  test("marks large exact values outside the number-line window without clamping", () => {
    const numerator = "9".repeat(1000);
    const result = calculate({
      operation: "reduce",
      numerator,
      denominator: "1",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.visual.numberLine).toEqual({
      lowerBound: "-10",
      upperBound: "10",
      exactMarkerNumerator: numerator,
      exactMarkerDenominator: "1",
      outsideWindow: true,
    });
  });

  test("accepts the 2001-digit exact output boundary", () => {
    const denominator = BigInt("9".repeat(1000));
    const numerator = denominator - 1n;
    const rightDenominator = denominator - 2n;
    const result = calculate({
      operation: "add",
      leftNumerator: numerator.toString(),
      leftDenominator: denominator.toString(),
      rightNumerator: numerator.toString(),
      rightDenominator: rightDenominator.toString(),
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.answer.numerator).toBe(
      (numerator * rightDenominator + numerator * denominator).toString(),
    );
    expect(result.result.answer.denominator).toBe(
      (denominator * rightDenominator).toString(),
    );
    expect(result.result.answer.numerator).toHaveLength(2001);
    expect(result.result.answer.denominator).toHaveLength(2000);
  });

  test("rejects invalid integers, zero denominators, zero divisors, and excessive digits", () => {
    const cases = [
      [
        { operation: "reduce", numerator: "1.5", denominator: "2" },
        "invalid-integer",
        "numerator",
      ],
      [
        { operation: "reduce", numerator: "1,000", denominator: "2" },
        "invalid-integer",
        "numerator",
      ],
      [
        { operation: "reduce", numerator: "1", denominator: "0" },
        "zero-denominator",
        "denominator",
      ],
      [
        {
          operation: "add",
          leftNumerator: "1",
          leftDenominator: "0",
          rightNumerator: "1",
          rightDenominator: "2",
        },
        "zero-denominator",
        "leftDenominator",
      ],
      [
        {
          operation: "divide",
          leftNumerator: "1",
          leftDenominator: "2",
          rightNumerator: "0",
          rightDenominator: "7",
        },
        "division-by-zero",
        "rightNumerator",
      ],
      [
        {
          operation: "reduce",
          numerator: `1${"0".repeat(1000)}`,
          denominator: "1",
        },
        "integer-too-large",
        "numerator",
      ],
    ] as const;
    for (const [input, code, field] of cases) {
      const result = calculate(input);
      expect(result).toEqual({ ok: false, error: { code, field } });
    }
  });

  test("lesson examples equal independent exact fixtures and render typed working", () => {
    const references: Record<string, string> = {
      "example-add": "5/6",
      "example-subtract": "-1/4",
      "example-multiply": "3/2",
      "example-divide": "5/6",
      "example-reduce-negative": "3/4",
    };
    for (const block of lesson.blocks) {
      if (block.kind !== "example") continue;
      const expected = references[block.id];
      expect(expected).toBe(block.expected);
      if (expected === undefined)
        throw new Error(`Missing independent fixture for ${block.id}`);
      const result = calculate({
        operation: block.operation,
        ...block.inputs,
      } as Parameters<typeof calculate>[0]);
      expect(
        result.ok &&
          `${result.result.answer.numerator}/${result.result.answer.denominator}`,
      ).toBe(expected);
      if (!result.ok) continue;
      const step = result.result.working[0];
      if (!step) throw new Error("Expected a fraction working step");
      const rendered = renderWorkingStep(step, {
        locale: "en-US",
        messages,
      });
      expect(rendered).not.toContain("{");
      expect(rendered).toContain(expected);
    }
    expect(Object.keys(references)).toHaveLength(5);
  });
});
