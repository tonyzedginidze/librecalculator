import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

test.each([
  [
    { operation: "male-regression", weight: "80", height: "200", age: "30" },
    "14.7",
  ],
  [
    { operation: "female-regression", weight: "80", height: "200", age: "30" },
    "25.5",
  ],
  [
    { operation: "male-regression", weight: "100", height: "200", age: "40" },
    "23",
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
    operation: "male-regression",
    weight: "80",
    height: "200",
    age: "30",
  } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0"])
    expect(calculate({ ...valid, weight: bad }).ok).toBe(false);
});

test("adult context rejects children and fractional age", () => {
  const valid = {
    operation: "male-regression",
    weight: "80",
    height: "200",
    age: "30",
  } as Input;
  for (const age of ["19", "0", "20.5", "-1", "1e2"])
    expect(calculate({ ...valid, age }).ok).toBe(false);
});

test("regression outside research BMI span fails instead of inventing a percentage", () => {
  expect(
    calculate({
      operation: "male-regression",
      weight: "350",
      height: "100",
      age: "30",
    }),
  ).toEqual({ ok: false, error: { code: "out-of-range", field: "weight" } });
  expect(
    calculate({
      operation: "female-regression",
      weight: "20",
      height: "250",
      age: "30",
    }),
  ).toEqual({ ok: false, error: { code: "out-of-range", field: "weight" } });
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{
        operation: "male-regression",
        weight: "80",
        height: "200",
        age: "30",
      },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});

test("visual splits the entered weight by the predicted percentage", () => {
  const out = calculate({
    operation: "male-regression",
    weight: "80",
    height: "200",
    age: "30",
  });
  expect(out.ok).toBe(true);
  if (out.ok) {
    expect(out.result.answer.value).toBe("14.7");
    expect(out.result.visual.weight).toBe("80");
    expect(out.result.visual.fatMass).toBe("11.76");
    expect(out.result.visual.fatFreeMass).toBe("68.24");
  }
});
