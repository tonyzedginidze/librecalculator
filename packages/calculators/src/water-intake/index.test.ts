import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

test.each([
  [{ operation: "water-volume", weight: "70", rate: "30", age: "30" }, "2.1"],
  [{ operation: "water-volume", weight: "80", rate: "25", age: "40" }, "2"],
  [{ operation: "water-volume", weight: "60", rate: "40", age: "50" }, "2.4"],
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
    operation: "water-volume",
    weight: "70",
    rate: "30",
    age: "30",
  } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0"])
    expect(calculate({ ...valid, weight: bad }).ok).toBe(false);
});

test("adult context rejects children and fractional age", () => {
  const valid = {
    operation: "water-volume",
    weight: "70",
    rate: "30",
    age: "30",
  } as Input;
  for (const age of ["19", "0", "20.5", "-1", "1e2"])
    expect(calculate({ ...valid, age }).ok).toBe(false);
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{ operation: "water-volume", weight: "70", rate: "30", age: "30" },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});

test("visual counts the same volume in 250 mL glasses", () => {
  const out = calculate({
    operation: "water-volume",
    weight: "70",
    rate: "30",
    age: "30",
  });
  expect(out.ok).toBe(true);
  if (out.ok) {
    expect(out.result.visual.reference).toBe("2100");
    expect(out.result.visual.glasses).toBe("8.4");
    expect(out.result.visual.glassMillilitres).toBe("250");
  }
});
