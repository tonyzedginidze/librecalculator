import { expect, test } from "bun:test";
import { type CategoryId, calculate, type Input } from "./index";

test.each([
  [{ operation: "bmi", weight: "70", height: "200", age: "30" }, "17.5"],
  [{ operation: "bmi", weight: "64", height: "160", age: "40" }, "25"],
  [{ operation: "bmi", weight: "81", height: "180", age: "50" }, "25"],
])("independent health fixture %j", (input, expected) => {
  const output = calculate(input as Input);
  expect(output.ok).toBe(true);
  if (output.ok) {
    expect(output.result.answer.value).toBe(expected);
    expect(output.result.visual.answer).toBe(expected);
    expect(output.result.working[0]?.args.answer).toEqual({
      kind: "decimal",
      value: expected,
    });
  }
});
test("rejects malformed and out-of-range measurements", () => {
  const valid = {
    operation: "bmi",
    weight: "70",
    height: "200",
    age: "30",
  } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0"])
    expect(calculate({ ...valid, weight: bad }).ok).toBe(false);
});

test("adult context rejects children and fractional age", () => {
  const valid = {
    operation: "bmi",
    weight: "70",
    height: "200",
    age: "30",
  } as Input;
  for (const age of ["19", "0", "20.5", "-1", "1e2"])
    expect(calculate({ ...valid, age }).ok).toBe(false);
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{ operation: "bmi", weight: "70", height: "200", age: "30" },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});

// Independent fixtures: weight / (2.00 m)² = weight / 4, so each BMI is exact.
test.each([
  ["70", "17.5", "underweight"],
  ["73.99", "18.4975", "underweight"],
  ["74", "18.5", "healthy"],
  ["99.99", "24.9975", "healthy"],
  ["100", "25", "overweight"],
  ["119.99", "29.9975", "overweight"],
  ["120", "30", "obesity-1"],
  ["139.99", "34.9975", "obesity-1"],
  ["140", "35", "obesity-2"],
  ["159.99", "39.9975", "obesity-2"],
  ["160", "40", "obesity-3"],
  ["300", "75", "obesity-3"],
] as const satisfies readonly (readonly [
  string,
  string,
  CategoryId,
])[])("WHO adult category for %skg at 200cm", (weight, bmi, category) => {
  const output = calculate({
    operation: "bmi",
    weight,
    height: "200",
    age: "30",
  });
  expect(output.ok).toBe(true);
  if (output.ok) {
    expect(output.result.answer.value).toBe(bmi);
    expect(output.result.category.id).toBe(category);
    expect(output.result.category.labelKey).toBe(`bmi.category.${category}`);
    expect(output.result.visual.band).toEqual({
      from: output.result.category.from,
      to: output.result.category.to,
    });
    expect(output.result.working[1]?.args.category).toEqual({
      kind: "message",
      key: `bmi.category.${category}`,
    });
  }
});

test("boundaries from other heights use the unrounded BMI", () => {
  // 64kg at 160cm and 81kg at 180cm are exactly 25.
  for (const [weight, height] of [
    ["64", "160"],
    ["81", "180"],
  ] as const) {
    const output = calculate({ operation: "bmi", weight, height, age: "40" });
    expect(output.ok && output.result.category.id).toBe("overweight");
  }
  // 59.94kg at 180cm is 18.5 exactly; 59.93kg is 18.4969..., which rounds to 18.5 for display.
  const at = calculate({
    operation: "bmi",
    weight: "59.94",
    height: "180",
    age: "40",
  });
  const below = calculate({
    operation: "bmi",
    weight: "59.93",
    height: "180",
    age: "40",
  });
  expect(at.ok && at.result.category.id).toBe("healthy");
  expect(below.ok && below.result.category.id).toBe("underweight");
});

test("category step states the range and label", () => {
  const output = calculate({
    operation: "bmi",
    weight: "100",
    height: "200",
    age: "30",
  });
  expect(output.ok).toBe(true);
  if (output.ok)
    expect(output.result.working[1]).toEqual({
      id: "category",
      messageKey: "bmi.working.category",
      args: {
        answer: { kind: "decimal", value: "25" },
        range: {
          kind: "message",
          key: "bmi.range.between",
          args: {
            from: { kind: "decimal", value: "25" },
            to: { kind: "decimal", value: "30" },
          },
        },
        category: { kind: "message", key: "bmi.category.overweight" },
      },
    });
});
