import { expect, test } from "bun:test";
import { calculate } from "./index";

const fixtures = [
  ["0", "c", "f", "32"],
  ["100", "c", "k", "373.15"],
  ["-459.67", "f", "k", "0"],
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
      calculate({ operation: "convert", value, source: "c", target: "f" }).ok,
    ).toBe(false);
  expect(
    calculate({
      operation: "convert",
      value: "1",
      source: "unknown",
      target: "f",
    }).ok,
  ).toBe(false);
});

test("absolute zero is exact and identities still check domain", () => {
  for (const [source, value] of [
    ["c", "-273.150000000000000000000000001"],
    ["f", "-459.670000000000000000000000001"],
    ["k", "-0.01"],
  ])
    expect(
      calculate({
        operation: "convert",
        source: source ?? "",
        target: source ?? "",
        value: value ?? "",
      }).ok,
    ).toBe(false);
});
