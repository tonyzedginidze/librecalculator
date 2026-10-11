import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

test.each([
  [
    {
      operation: "tiles",
      area: "10",
      tileWidth: "50",
      tileHeight: "50",
      waste: "10",
    },
    "44",
  ],
  [
    {
      operation: "tiles",
      area: "1",
      tileWidth: "25",
      tileHeight: "25",
      waste: "0",
    },
    "16",
  ],
  [
    {
      operation: "tiles",
      area: "1",
      tileWidth: "30",
      tileHeight: "30",
      waste: "0",
    },
    "12",
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
test("visual shows tiles before and after rounding up", () => {
  const output = calculate({
    operation: "tiles",
    area: "10",
    tileWidth: "60",
    tileHeight: "30",
    waste: "10",
  });
  expect(output.ok).toBe(true);
  if (output.ok) {
    expect(output.result.answer.value).toBe("62");
    expect(output.result.visual.tileArea).toBe("1800");
    expect(output.result.visual.exactTiles.startsWith("61.111111")).toBe(true);
  }
});

test("rejects malformed and nonpositive measurements", () => {
  const valid = {
    operation: "tiles",
    area: "10",
    tileWidth: "50",
    tileHeight: "50",
    waste: "10",
  } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0"])
    expect(calculate({ ...valid, area: bad }).ok).toBe(false);
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{
        operation: "tiles",
        area: "10",
        tileWidth: "50",
        tileHeight: "50",
        waste: "10",
      },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});
