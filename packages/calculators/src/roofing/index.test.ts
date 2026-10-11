import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

test.each([
  [
    {
      operation: "roof-area",
      length: "10",
      width: "8",
      rise: "0",
      run: "12",
      waste: "0",
    },
    "80",
  ],
  [
    {
      operation: "roof-area",
      length: "10",
      width: "8",
      rise: "3",
      run: "4",
      waste: "0",
    },
    "100",
  ],
  [
    {
      operation: "roof-area",
      length: "10",
      width: "8",
      rise: "3",
      run: "4",
      waste: "10",
    },
    "110",
  ],
])("independent construction fixture %j", (input, expected) => {
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
test("rejects malformed and nonpositive measurements", () => {
  const valid = {
    operation: "roof-area",
    length: "10",
    width: "8",
    rise: "0",
    run: "12",
    waste: "0",
  } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0"])
    expect(calculate({ ...valid, length: bad }).ok).toBe(false);
});

test("irrational slope agrees with independent square-root reference", () => {
  const output = calculate({
    operation: "roof-area",
    length: "10",
    width: "8",
    rise: "1",
    run: "1",
    waste: "0",
  });
  expect(output.ok).toBe(true);
  if (output.ok)
    expect(
      Math.abs(Number(output.result.answer.value) / 113.13708498984761 - 1),
    ).toBeLessThan(1e-12);
  expect(
    calculate({
      operation: "roof-area",
      length: "10",
      width: "8",
      rise: "1",
      run: "0",
      waste: "0",
    }),
  ).toEqual({ ok: false, error: { code: "out-of-range", field: "run" } });
});

test("visual separates footprint, sloped area and allowance", () => {
  const output = calculate({
    operation: "roof-area",
    length: "10",
    width: "8",
    rise: "3",
    run: "4",
    waste: "10",
  });
  expect(output.ok).toBe(true);
  if (output.ok) {
    expect(output.result.visual.reference).toBe("80");
    expect(output.result.visual.slopeFactor).toBe("1.25");
    expect(output.result.visual.slopedArea).toBe("100");
    expect(output.result.answer.value).toBe("110");
  }
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{
        operation: "roof-area",
        length: "10",
        width: "8",
        rise: "0",
        run: "12",
        waste: "0",
      },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});
