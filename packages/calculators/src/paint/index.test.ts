import { expect, test } from "bun:test";
import { calculate, type Input } from "./index";

test.each([
  [
    {
      operation: "litres",
      area: "40",
      coats: "2",
      coverage: "10",
      waste: "10",
    },
    "8.8",
  ],
  [
    { operation: "litres", area: "12", coats: "1", coverage: "6", waste: "0" },
    "2",
  ],
  [
    { operation: "litres", area: "30", coats: "3", coverage: "9", waste: "5" },
    "10.5",
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
test("visual carries painted area, net litres and allowance factor", () => {
  const output = calculate({
    operation: "litres",
    area: "36",
    coats: "2",
    coverage: "12",
    waste: "10",
  });
  expect(output.ok).toBe(true);
  if (output.ok) {
    expect(output.result.answer.value).toBe("6.6");
    expect(output.result.visual.paintedArea).toBe("72");
    expect(output.result.visual.reference).toBe("6");
    expect(output.result.visual.factor).toBe("1.1");
  }
});

test("rejects malformed and nonpositive measurements", () => {
  const valid = {
    operation: "litres",
    area: "40",
    coats: "2",
    coverage: "10",
    waste: "10",
  } as Input;
  for (const bad of ["", "1e3", "1,000", "NaN", "-1", "0"])
    expect(calculate({ ...valid, area: bad }).ok).toBe(false);
});

test("rejects unsupported operation", () => {
  expect(
    calculate({
      ...{
        operation: "litres",
        area: "40",
        coats: "2",
        coverage: "10",
        waste: "10",
      },
      operation: "unsupported",
    } as unknown as Input),
  ).toEqual({ ok: false, error: { code: "invalid-field" } });
});
