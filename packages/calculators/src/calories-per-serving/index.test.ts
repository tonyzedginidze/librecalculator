import { describe, expect, test } from "bun:test";
import { DecimalValue } from "../numeric/decimal";
import { calculate, type Input } from "./index";

const fixtures = [
  {
    operation: "portion-calories",
    inputs: { totalCalories: "1000", servings: "4" },
    expected: "250",
  },
  {
    operation: "recipe-calories",
    inputs: { portionCalories: "250", servings: "4" },
    expected: "1000",
  },
  {
    operation: "portion-weight",
    inputs: { totalCalories: "1000", totalGrams: "800", portionGrams: "200" },
    expected: "250",
  },
];
describe("calories-per-serving", () => {
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

test("zero energy supported; zero serving divisor rejected", () => {
  const outcome = calculate({
    operation: "portion-calories",
    totalCalories: "0",
    servings: "4",
  });
  expect(outcome.ok).toBe(true);
  if (outcome.ok) expect(outcome.result.answer.value).toBe("0");
  expect(
    calculate({
      operation: "portion-calories",
      totalCalories: "1000",
      servings: "0",
    }).ok,
  ).toBe(false);
});

test("visual splits a weighed portion from the rest of the batch", () => {
  const outcome = calculate({
    operation: "portion-weight",
    totalCalories: "2400",
    totalGrams: "1600",
    portionGrams: "250",
  });
  expect(outcome.ok).toBe(true);
  if (outcome.ok)
    expect(outcome.result.visual).toMatchObject({
      portionCalories: "375",
      portionGrams: "250",
      remainderGrams: "1350",
    });
  const twoBatches = calculate({
    operation: "portion-weight",
    totalCalories: "1000",
    totalGrams: "800",
    portionGrams: "1600",
  });
  expect(twoBatches.ok).toBe(true);
  if (twoBatches.ok) {
    expect(twoBatches.result.answer.value).toBe("2000");
    expect(twoBatches.result.visual.remainderGrams).toBe("0");
  }
});

test("count visual keeps total, portion and servings together", () => {
  const outcome = calculate({
    operation: "recipe-calories",
    portionCalories: "300",
    servings: "8",
  });
  expect(outcome.ok).toBe(true);
  if (outcome.ok)
    expect(outcome.result.visual).toMatchObject({
      totalCalories: "2400",
      portionCalories: "300",
      servings: "8",
    });
});
