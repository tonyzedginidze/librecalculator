import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

test.each([
  [
    { operation: "slab", length: "5", width: "4", depth: "0.1", waste: "10" },
    "2.2",
  ],
  [{ operation: "slab", length: "1", width: "1", depth: "1", waste: "0" }, "1"],
  [
    { operation: "slab", length: "2", width: "3", depth: "0.2", waste: "5" },
    "1.26",
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
test("visual splits the order into net volume and allowance", () => {
  const output = calculate({
    operation: "slab",
    length: "6",
    width: "4",
    depth: "0.1",
    waste: "10",
  });
  expect(output.ok).toBe(true);
  if (output.ok) {
    expect(output.result.answer.value).toBe("2.64");
    expect(output.result.visual.reference).toBe("2.4");
    expect(output.result.visual.allowance).toBe("0.24");
    expect(output.result.visual.depth).toBe("0.1");
  }
});

test("rejects malformed and nonpositive measurements", () => {
  const valid = {
    operation: "slab",
    length: "5",
    width: "4",
    depth: "0.1",
    waste: "10",
  } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0"])
    expect(calculate({ ...valid, length: bad }).ok).toBe(false);
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{
        operation: "slab",
        length: "5",
        width: "4",
        depth: "0.1",
        waste: "10",
      },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});
