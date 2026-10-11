import { describe, expect, test } from "bun:test";
import { DecimalValue } from "../numeric/decimal";
import { calculate, type Input } from "./index";

const fixtures = [
  {
    operation: "recipe-scale",
    inputs: { quantity: "250", originalServings: "4", targetServings: "12" },
    expected: "750",
  },
  {
    operation: "recipe-factor",
    inputs: { originalServings: "4", targetServings: "12" },
    expected: "3",
  },
  {
    operation: "recipe-reverse",
    inputs: { quantity: "750", originalServings: "4", targetServings: "12" },
    expected: "250",
  },
];
describe("recipe-scaling", () => {
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

test("zero quantity is supported; zero yield is undefined", () => {
  expect(
    calculate({
      operation: "recipe-scale",
      quantity: "0",
      originalServings: "4",
      targetServings: "12",
    }).ok,
  ).toBe(true);
  expect(
    calculate({
      operation: "recipe-scale",
      quantity: "250",
      originalServings: "0",
      targetServings: "12",
    }).ok,
  ).toBe(false);
});

test("visual carries the factor and both quantities from one calculation", () => {
  const scale = calculate({
    operation: "recipe-scale",
    quantity: "250",
    originalServings: "4",
    targetServings: "6",
  });
  expect(scale.ok).toBe(true);
  if (scale.ok) {
    expect(scale.result.answer.value).toBe("375");
    expect(scale.result.visual.factor).toBe("1.5");
    expect(scale.result.visual.originalQuantity).toBe("250");
    expect(scale.result.visual.scaledQuantity).toBe("375");
  }
  const reverse = calculate({
    operation: "recipe-reverse",
    quantity: "375",
    originalServings: "4",
    targetServings: "6",
  });
  expect(reverse.ok).toBe(true);
  if (reverse.ok) {
    expect(reverse.result.visual.originalQuantity).toBe("250");
    expect(reverse.result.visual.scaledQuantity).toBe("375");
  }
  const factor = calculate({
    operation: "recipe-factor",
    originalServings: "4",
    targetServings: "6",
  });
  expect(factor.ok).toBe(true);
  if (factor.ok) {
    expect(factor.result.visual.factor).toBe(factor.result.answer.value);
    expect(factor.result.visual.scaledQuantity).toBeUndefined();
  }
});
