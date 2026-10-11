import { describe, expect, test } from "bun:test";
import { DecimalValue } from "../numeric/decimal";
import { calculate, type Input } from "./index";

const fixtures = [
  {
    operation: "baker-percent",
    inputs: { ingredient: "325", flour: "500" },
    expected: "65",
  },
  {
    operation: "ingredient-mass",
    inputs: { flour: "500", percentage: "65" },
    expected: "325",
  },
  {
    operation: "flour-mass",
    inputs: { ingredient: "325", percentage: "65" },
    expected: "500",
  },
];
describe("baking-ratios", () => {
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

test("zero ingredient supported, zero inverse divisor rejected and percentages above 100 accepted", () => {
  expect(
    calculate({ operation: "baker-percent", ingredient: "0", flour: "500" }).ok,
  ).toBe(true);
  expect(
    calculate({ operation: "flour-mass", ingredient: "0", percentage: "0" }).ok,
  ).toBe(false);
  const outcome = calculate({
    operation: "ingredient-mass",
    flour: "500",
    percentage: "150",
  });
  expect(outcome.ok).toBe(true);
  if (outcome.ok) expect(outcome.result.answer.value).toBe("750");
});

test("visual returns flour, ingredient and percentage together", () => {
  const outcome = calculate({
    operation: "flour-mass",
    ingredient: "325",
    percentage: "65",
  });
  expect(outcome.ok).toBe(true);
  if (outcome.ok)
    expect(outcome.result.visual).toMatchObject({
      flour: "500",
      ingredient: "325",
      percentage: "65",
    });
});
