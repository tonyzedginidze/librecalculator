import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

test.each([
  [
    { operation: "annual-to-hourly", pay: "52000", hours: "40", weeks: "52" },
    "25",
  ],
  [
    { operation: "hourly-to-annual", pay: "20", hours: "40", weeks: "52" },
    "41600",
  ],
  [
    { operation: "annual-to-hourly", pay: "12000", hours: "20", weeks: "50" },
    "12",
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
    operation: "annual-to-hourly",
    pay: "52000",
    hours: "40",
    weeks: "52",
  } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0.001"])
    expect(calculate({ ...valid, pay: bad }).ok).toBe(false);
});

test("half-cent output settles upward and paid-week bounds are enforced", () => {
  const output = calculate({
    operation: "annual-to-hourly",
    pay: "0.01",
    hours: "2",
    weeks: "1",
  });
  expect(output.ok && output.result.answer.value).toBe("0.01");
  for (const weeks of ["0", "54", "1.5", "+52"])
    expect(
      calculate({
        operation: "annual-to-hourly",
        pay: "52000",
        hours: "40",
        weeks,
      }).ok,
    ).toBe(false);
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{
        operation: "annual-to-hourly",
        pay: "52000",
        hours: "40",
        weeks: "52",
      },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});

test("visual lists every pay period, each settled once to cents", () => {
  const toHourly = calculate({
    operation: "annual-to-hourly",
    pay: "52000",
    hours: "40",
    weeks: "52",
  });
  expect(toHourly.ok && toHourly.result.visual).toMatchObject({
    answer: "25",
    hourly: "25",
    weekly: "1000",
    monthly: "4333.33",
    annual: "52000",
  });
  const toAnnual = calculate({
    operation: "hourly-to-annual",
    pay: "20",
    hours: "40",
    weeks: "52",
  });
  expect(toAnnual.ok && toAnnual.result.visual).toMatchObject({
    answer: "41600",
    hourly: "20",
    weekly: "800",
    monthly: "3466.67",
    annual: "41600",
  });
});
