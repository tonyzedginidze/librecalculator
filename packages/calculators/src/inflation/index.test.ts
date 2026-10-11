import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

test.each([
  [
    { operation: "future-cost", amount: "100", annualRate: "10", years: "2" },
    "121",
  ],
  [
    {
      operation: "purchasing-power",
      amount: "121",
      annualRate: "10",
      years: "2",
    },
    "100",
  ],
  [
    { operation: "future-cost", amount: "250", annualRate: "0", years: "20" },
    "250",
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
    operation: "future-cost",
    amount: "100",
    annualRate: "10",
    years: "2",
  } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0.001"])
    expect(calculate({ ...valid, amount: bad }).ok).toBe(false);
});

test("zero years preserve cents and overflow or negative inflation fails", () => {
  const output = calculate({
    operation: "future-cost",
    amount: "12.34",
    annualRate: "100",
    years: "0",
  });
  expect(output.ok && output.result.answer.value).toBe("12.34");
  expect(
    calculate({
      operation: "future-cost",
      amount: "9999999999999999.99",
      annualRate: "100",
      years: "1",
    }),
  ).toEqual({ ok: false, error: { code: "output-overflow" } });
  expect(
    calculate({
      operation: "purchasing-power",
      amount: "100",
      annualRate: "-1",
      years: "2",
    }),
  ).toEqual({
    ok: false,
    error: { code: "out-of-range", field: "annualRate" },
  });
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{
        operation: "future-cost",
        amount: "100",
        annualRate: "10",
        years: "2",
      },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});

test("visual keeps the entered amount and years beside the answer", () => {
  const output = calculate({
    operation: "future-cost",
    amount: "100",
    annualRate: "10",
    years: "2",
  });
  expect(output.ok && output.result.visual).toMatchObject({
    answer: "121",
    reference: "100",
    years: "2",
  });
});
