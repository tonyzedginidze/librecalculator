import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

test.each([
  [
    { operation: "daily-energy", resting: "1600", factor: "1.5", age: "30" },
    "2400",
  ],
  [
    { operation: "daily-energy", resting: "1500", factor: "1", age: "40" },
    "1500",
  ],
  [
    { operation: "daily-energy", resting: "1800", factor: "2", age: "50" },
    "3600",
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
    operation: "daily-energy",
    resting: "1600",
    factor: "1.5",
    age: "30",
  } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0"])
    expect(calculate({ ...valid, resting: bad }).ok).toBe(false);
});

test("adult context rejects children and fractional age", () => {
  const valid = {
    operation: "daily-energy",
    resting: "1600",
    factor: "1.5",
    age: "30",
  } as Input;
  for (const age of ["19", "0", "20.5", "-1", "1e2"])
    expect(calculate({ ...valid, age }).ok).toBe(false);
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{
        operation: "daily-energy",
        resting: "1600",
        factor: "1.5",
        age: "30",
      },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});

test("visual splits daily energy into resting and the part above it", () => {
  const out = calculate({
    operation: "daily-energy",
    resting: "1600",
    factor: "1.5",
    age: "30",
  });
  expect(out.ok).toBe(true);
  if (out.ok) {
    expect(out.result.visual.reference).toBe("1600");
    expect(out.result.visual.extra).toBe("800");
  }
  const flat = calculate({
    operation: "daily-energy",
    resting: "1500",
    factor: "1",
    age: "30",
  });
  if (flat.ok) expect(flat.result.visual.extra).toBe("0");
});
