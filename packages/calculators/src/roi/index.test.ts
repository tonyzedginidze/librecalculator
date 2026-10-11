import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

test.each([
  [
    { operation: "return", investment: "1000", proceeds: "1250", fees: "50" },
    "20",
  ],
  [
    { operation: "return", investment: "200", proceeds: "150", fees: "10" },
    "-30",
  ],
  [
    { operation: "return", investment: "500", proceeds: "510", fees: "10" },
    "0",
  ],
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
  const valid = {
    operation: "return",
    investment: "1000",
    proceeds: "1250",
    fees: "50",
  } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0.001"])
    expect(calculate({ ...valid, investment: bad }).ok).toBe(false);
});

test("fees can exceed proceeds without clamping losses", () => {
  const output = calculate({
    operation: "return",
    investment: "100",
    proceeds: "0",
    fees: "50",
  });
  expect(output.ok && output.result.answer.value).toBe("-150");
  expect(
    calculate({
      operation: "return",
      investment: "0",
      proceeds: "100",
      fees: "0",
    }),
  ).toEqual({
    ok: false,
    error: { code: "invalid-field", field: "investment" },
  });
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{
        operation: "return",
        investment: "1000",
        proceeds: "1250",
        fees: "50",
      },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});

test("visual compares investment, net proceeds and signed profit", () => {
  const gain = calculate({
    operation: "return",
    investment: "1000",
    proceeds: "1250",
    fees: "50",
  });
  expect(gain.ok && gain.result.visual).toMatchObject({
    answer: "20",
    investment: "1000",
    netProceeds: "1200",
    profit: "200",
  });
  const loss = calculate({
    operation: "return",
    investment: "200",
    proceeds: "150",
    fees: "10",
  });
  expect(loss.ok && loss.result.visual).toMatchObject({
    answer: "-30",
    netProceeds: "140",
    profit: "-60",
  });
});
