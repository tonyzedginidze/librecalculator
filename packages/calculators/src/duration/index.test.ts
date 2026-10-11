import { expect, test } from "bun:test";
import { calculate } from "./index";

const fixtures = [
  ["1", "h", "min", "60"],
  ["2", "day", "h", "48"],
  ["1500", "ms", "s", "1.5"],
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
      calculate({ operation: "convert", value, source: "h", target: "min" }).ok,
    ).toBe(false);
  expect(
    calculate({
      operation: "convert",
      value: "1",
      source: "unknown",
      target: "min",
    }).ok,
  ).toBe(false);
});
