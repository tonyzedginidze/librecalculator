import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

test.each([
  [
    {
      operation: "protein-grams",
      calories: "1800",
      protein: "20",
      carbohydrate: "50",
      fat: "30",
      age: "30",
    },
    "90",
  ],
  [
    {
      operation: "carbohydrate-grams",
      calories: "1800",
      protein: "20",
      carbohydrate: "50",
      fat: "30",
      age: "30",
    },
    "225",
  ],
  [
    {
      operation: "fat-grams",
      calories: "1800",
      protein: "20",
      carbohydrate: "50",
      fat: "30",
      age: "30",
    },
    "60",
  ],
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
    operation: "protein-grams",
    calories: "1800",
    protein: "20",
    carbohydrate: "50",
    fat: "30",
    age: "30",
  } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0"])
    expect(calculate({ ...valid, calories: bad }).ok).toBe(false);
});

test("adult context rejects children and fractional age", () => {
  const valid = {
    operation: "protein-grams",
    calories: "1800",
    protein: "20",
    carbohydrate: "50",
    fat: "30",
    age: "30",
  } as Input;
  for (const age of ["19", "0", "20.5", "-1", "1e2"])
    expect(calculate({ ...valid, age }).ok).toBe(false);
});

test("shares must total exactly one hundred and zero allocations remain zero", () => {
  const valid = {
    operation: "protein-grams",
    calories: "1800",
    protein: "20",
    carbohydrate: "50",
    fat: "30",
    age: "30",
  } as const;
  expect(calculate({ ...valid, fat: "29.999999" })).toEqual({
    ok: false,
    error: { code: "out-of-range", field: "fat" },
  });
  const zero = calculate({ ...valid, protein: "0", carbohydrate: "70" });
  expect(zero.ok && zero.result.answer.value).toBe("0");
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{
        operation: "protein-grams",
        calories: "1800",
        protein: "20",
        carbohydrate: "50",
        fat: "30",
        age: "30",
      },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});

test("visual lists every macronutrient from the same split", () => {
  const out = calculate({
    operation: "fat-grams",
    calories: "1800",
    protein: "20",
    carbohydrate: "50",
    fat: "30",
    age: "30",
  });
  expect(out.ok).toBe(true);
  if (out.ok)
    expect(out.result.visual.parts).toEqual([
      { id: "protein", kcal: "360", grams: "90", selected: false },
      { id: "carbohydrate", kcal: "900", grams: "225", selected: false },
      { id: "fat", kcal: "540", grams: "60", selected: true },
    ]);
});
