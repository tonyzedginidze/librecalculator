import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

test.each([
  [{ operation: "margin", cost: "80", price: "100" }, "20"],
  [{ operation: "markup", cost: "80", price: "100" }, "25"],
  [{ operation: "margin", cost: "100", price: "80" }, "-25"],
])("independent finance fixture %j", (input, expected) => {
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
test("rejects noncanonical and fractional-cent inputs", () => {
  const valid = { operation: "margin", cost: "80", price: "100" } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0.001"])
    expect(calculate({ ...valid, cost: bad }).ok).toBe(false);
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{ operation: "margin", cost: "80", price: "100" },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});

test("visual carries cost, price and signed profit", () => {
  const output = calculate({ operation: "markup", cost: "80", price: "100" });
  expect(output.ok && output.result.visual).toMatchObject({
    answer: "25",
    cost: "80",
    price: "100",
    profit: "20",
  });
  const loss = calculate({ operation: "margin", cost: "100", price: "80" });
  expect(loss.ok && loss.result.visual).toMatchObject({
    answer: "-25",
    profit: "-20",
  });
});
