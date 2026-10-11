import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

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
