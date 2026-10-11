import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

test.each([
  [
    {
      operation: "board-feet",
      thickness: "1",
      width: "12",
      length: "8",
      quantity: "1",
    },
    "8",
  ],
  [
    {
      operation: "board-feet",
      thickness: "1.5",
      width: "3.5",
      length: "8",
      quantity: "4",
    },
    "14",
  ],
  [
    {
      operation: "board-feet",
      thickness: "2",
      width: "6",
      length: "10",
      quantity: "2",
    },
    "20",
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
test("visual gives board feet per board", () => {
  const output = calculate({
    operation: "board-feet",
    thickness: "1.5",
    width: "5.5",
    length: "8",
    quantity: "10",
  });
  expect(output.ok).toBe(true);
  if (output.ok) {
    expect(output.result.answer.value).toBe("55");
    expect(output.result.visual.perBoard).toBe("5.5");
    expect(output.result.visual.reference).toBe("10");
  }
});

test("rejects malformed and nonpositive measurements", () => {
  const valid = {
    operation: "board-feet",
    thickness: "1",
    width: "12",
    length: "8",
    quantity: "1",
  } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0"])
    expect(calculate({ ...valid, thickness: bad }).ok).toBe(false);
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{
        operation: "board-feet",
        thickness: "1",
        width: "12",
        length: "8",
        quantity: "1",
      },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});
