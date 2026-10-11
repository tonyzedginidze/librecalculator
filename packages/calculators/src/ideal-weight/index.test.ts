import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

test.each([
  [
    { operation: "bmi-weight", height: "200", targetBmi: "20", age: "30" },
    "80",
  ],
  [
    { operation: "bmi-weight", height: "160", targetBmi: "25", age: "40" },
    "64",
  ],
  [
    { operation: "bmi-weight", height: "180", targetBmi: "25", age: "50" },
    "81",
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
    operation: "bmi-weight",
    height: "200",
    targetBmi: "20",
    age: "30",
  } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0"])
    expect(calculate({ ...valid, height: bad }).ok).toBe(false);
});

test("adult context rejects children and fractional age", () => {
  const valid = {
    operation: "bmi-weight",
    height: "200",
    targetBmi: "20",
    age: "30",
  } as Input;
  for (const age of ["19", "0", "20.5", "-1", "1e2"])
    expect(calculate({ ...valid, age }).ok).toBe(false);
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{ operation: "bmi-weight", height: "200", targetBmi: "20", age: "30" },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});

test("visual converts the BMI scale to kilograms at the entered height", () => {
  const out = calculate({
    operation: "bmi-weight",
    height: "200",
    targetBmi: "20",
    age: "30",
  });
  expect(out.ok).toBe(true);
  if (out.ok) {
    expect(out.result.visual.scale).toEqual([
      { bmi: "15", weight: "60" },
      { bmi: "20", weight: "80" },
      { bmi: "25", weight: "100" },
      { bmi: "30", weight: "120" },
      { bmi: "35", weight: "140" },
      { bmi: "40", weight: "160" },
    ]);
    expect(out.result.visual.fraction).toBe("0.2");
  }
  const wide = calculate({
    operation: "bmi-weight",
    height: "200",
    targetBmi: "45",
    age: "30",
  });
  if (wide.ok) {
    expect(wide.result.visual.scale[0]).toEqual({ bmi: "10", weight: "40" });
    expect(wide.result.visual.fraction).toBe("0.875");
  }
});
