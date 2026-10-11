import { expect, test } from "bun:test";
import { calculate } from "./index";

const fixtures = [
  ["36", "km-per-h", "m-per-s", "10"],
  ["60", "mi-per-h", "km-per-h", "96.56064"],
  ["1", "knot", "km-per-h", "1.852"],
];
for (const [value, source, target, expected] of fixtures)
  test(`${source} → ${target}`, () => {
    const result = calculate({
      operation: "convert",
      value: value ?? "",
      source: source ?? "",
      target: target ?? "",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.result.answer.value).toBe(expected ?? "");
      expect(result.result.visual.answer).toBe(result.result.answer.value);
    }
  });
test("invalid values and outside preset choices", () => {
  for (const value of ["", "1e4", "1,000"])
    expect(
      calculate({
        operation: "convert",
        value,
        source: "km-per-h",
        target: "m-per-s",
      }).ok,
    ).toBe(false);
  expect(
    calculate({
      operation: "convert",
      value: "1",
      source: "unknown",
      target: "m-per-s",
    }).ok,
  ).toBe(false);
});

test("signed speed and rational reverse factor", () => {
  const result = calculate({
    operation: "convert",
    value: "-10",
    source: "m-per-s",
    target: "km-per-h",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("-36");
});
