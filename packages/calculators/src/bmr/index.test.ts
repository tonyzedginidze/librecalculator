import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

test.each([
  [
    { operation: "male-equation", weight: "70", height: "180", age: "30" },
    "1680",
  ],
  [
    { operation: "female-equation", weight: "70", height: "180", age: "30" },
    "1514",
  ],
  [
    { operation: "male-equation", weight: "80", height: "180", age: "40" },
    "1730",
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
    operation: "male-equation",
    weight: "70",
    height: "180",
    age: "30",
  } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0"])
    expect(calculate({ ...valid, weight: bad }).ok).toBe(false);
});

test("adult context rejects children and fractional age", () => {
  const valid = {
    operation: "male-equation",
    weight: "70",
    height: "180",
    age: "30",
  } as Input;
  for (const age of ["19", "0", "20.5", "-1", "1e2"])
    expect(calculate({ ...valid, age }).ok).toBe(false);
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{ operation: "male-equation", weight: "70", height: "180", age: "30" },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});

test("visual terms add up to the answer", () => {
  const male = calculate({
    operation: "male-equation",
    weight: "70",
    height: "180",
    age: "30",
  });
  expect(male.ok).toBe(true);
  if (male.ok)
    expect(male.result.visual.terms).toEqual({
      weight: "700",
      height: "1125",
      age: "-150",
      constant: "5",
    });
  const female = calculate({
    operation: "female-equation",
    weight: "70",
    height: "180",
    age: "30",
  });
  if (female.ok) {
    expect(female.result.visual.terms.constant).toBe("-161");
    expect(female.result.visual.reference).toBe("1675");
  }
});
