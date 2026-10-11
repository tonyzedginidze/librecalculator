import { expect, test } from "bun:test";
import { calculate } from "./index";

const fixtures = [
  ["1", "us-cup", "ml", "236.5882365"],
  ["1", "metric-cup", "ml", "250"],
  ["1", "australian-tablespoon", "ml", "20"],
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
      calculate({ operation: "convert", value, source: "us-cup", target: "ml" })
        .ok,
    ).toBe(false);
  expect(
    calculate({
      operation: "convert",
      value: "1",
      source: "unknown",
      target: "ml",
    }).ok,
  ).toBe(false);
});
