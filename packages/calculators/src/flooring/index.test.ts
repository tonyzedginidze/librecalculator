import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

test.each([
  [
    { operation: "packs", length: "5", width: "4", packArea: "2", waste: "10" },
    "11",
  ],
  [
    { operation: "packs", length: "3", width: "3", packArea: "2", waste: "0" },
    "5",
  ],
  [
    { operation: "packs", length: "2", width: "2", packArea: "3", waste: "5" },
    "2",
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
test("visual shows packs before and after rounding up", () => {
  const output = calculate({
    operation: "packs",
    length: "5",
    width: "4",
    packArea: "2.4",
    waste: "10",
  });
  expect(output.ok).toBe(true);
  if (output.ok) {
    expect(output.result.answer.value).toBe("10");
    expect(output.result.visual.reference).toBe("20");
    expect(output.result.visual.neededArea).toBe("22");
    expect(output.result.visual.exactPacks.startsWith("9.1666666")).toBe(true);
  }
});

test("rejects malformed and nonpositive measurements", () => {
  const valid = {
    operation: "packs",
    length: "5",
    width: "4",
    packArea: "2",
    waste: "10",
  } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0"])
    expect(calculate({ ...valid, length: bad }).ok).toBe(false);
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{
        operation: "packs",
        length: "5",
        width: "4",
        packArea: "2",
        waste: "10",
      },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});
