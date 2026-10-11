import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

test.each([
  [
    {
      operation: "project",
      balance: "10000",
      contribution: "5000",
      annualRate: "0",
      years: "10",
    },
    "60000",
  ],
  [
    {
      operation: "project",
      balance: "1000",
      contribution: "100",
      annualRate: "10",
      years: "1",
    },
    "1200",
  ],
  [
    {
      operation: "project",
      balance: "1000",
      contribution: "100",
      annualRate: "10",
      years: "2",
    },
    "1420",
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
    operation: "project",
    balance: "10000",
    contribution: "5000",
    annualRate: "0",
    years: "10",
  } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0.001"])
    expect(calculate({ ...valid, balance: bad }).ok).toBe(false);
});

test("annual contribution timing and overflow are not silently adjusted", () => {
  const output = calculate({
    operation: "project",
    balance: "0",
    contribution: "100",
    annualRate: "100",
    years: "2",
  });
  expect(output.ok && output.result.answer.value).toBe("300");
  expect(
    calculate({
      operation: "project",
      balance: "9999999999999999.99",
      contribution: "0",
      annualRate: "100",
      years: "1",
    }),
  ).toEqual({ ok: false, error: { code: "output-overflow" } });
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{
        operation: "project",
        balance: "10000",
        contribution: "5000",
        annualRate: "0",
        years: "10",
      },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});

test("visual splits the projection into savings, contributions and growth", () => {
  const output = calculate({
    operation: "project",
    balance: "1000",
    contribution: "100",
    annualRate: "10",
    years: "2",
  });
  expect(output.ok).toBe(true);
  if (!output.ok) return;
  // 1000 → 1200 → 1420; in = 1200, growth = 220
  expect(output.result.visual).toMatchObject({
    answer: "1420",
    reference: "1200",
    starting: "1000",
    contributions: "200",
    growth: "220",
  });
});
