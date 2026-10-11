import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

test.each([
  [
    {
      operation: "save",
      principal: "1000",
      deposit: "100",
      annualRate: "0",
      months: "12",
    },
    "2200",
  ],
  [
    {
      operation: "save",
      principal: "100",
      deposit: "10",
      annualRate: "12",
      months: "1",
    },
    "111",
  ],
  [
    {
      operation: "save",
      principal: "100",
      deposit: "10",
      annualRate: "12",
      months: "2",
    },
    "122.11",
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
    operation: "save",
    principal: "1000",
    deposit: "100",
    annualRate: "0",
    months: "12",
  } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0.001"])
    expect(calculate({ ...valid, principal: bad }).ok).toBe(false);
});

test("zero balances, maximum exact-cent input and overflow remain explicit", () => {
  const zero = calculate({
    operation: "save",
    principal: "0",
    deposit: "0",
    annualRate: "100",
    months: "1200",
  });
  expect(zero.ok && zero.result.answer.value).toBe("0");
  const maximum = calculate({
    operation: "save",
    principal: "9999999999999999.99",
    deposit: "0",
    annualRate: "0",
    months: "1",
  });
  expect(maximum.ok && maximum.result.answer.value).toBe("9999999999999999.99");
  expect(
    calculate({
      operation: "save",
      principal: "9999999999999999.99",
      deposit: "0.01",
      annualRate: "0",
      months: "1",
    }),
  ).toEqual({ ok: false, error: { code: "output-overflow" } });
  for (const months of ["0", "1201", "2.5", "+12"])
    expect(
      calculate({
        operation: "save",
        principal: "0",
        deposit: "0",
        annualRate: "0",
        months,
      }).ok,
    ).toBe(false);
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{
        operation: "save",
        principal: "1000",
        deposit: "100",
        annualRate: "0",
        months: "12",
      },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});

test("visual splits the settled balance into start, deposits and interest", () => {
  const output = calculate({
    operation: "save",
    principal: "100",
    deposit: "10",
    annualRate: "12",
    months: "2",
  });
  expect(output.ok).toBe(true);
  if (!output.ok) return;
  // 100 × 1.01² + 10 × 1.01 + 10 = 122.11; in = 120, interest = 2.11
  expect(output.result.visual).toMatchObject({
    answer: "122.11",
    reference: "120",
    starting: "100",
    deposits: "20",
    interest: "2.11",
  });
});
