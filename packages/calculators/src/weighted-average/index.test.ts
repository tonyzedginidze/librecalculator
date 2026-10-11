import { expect, test } from "bun:test";
import { calculate } from "./index";

test("Unequal weights with a balanced centre", () => {
  const result = calculate({
    operation: "weighted-mean",
    values: "10;20;30",
    weights: "1;2;1",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("20");
});
test("Three times the weight on eighty", () => {
  const result = calculate({
    operation: "weighted-mean",
    values: "80;100",
    weights: "3;1",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("85");
});
test("A zero-weight observation contributes nothing", () => {
  const result = calculate({
    operation: "weighted-mean",
    values: "5;100",
    weights: "1;0",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("5");
});
test("rejects malformed input", () => {
  expect(
    calculate({ operation: "weighted-mean", values: "abc", weights: "1;2;1" })
      .ok,
  ).toBe(false);
});
test("weights require matched nonnegative lists and positive total", () => {
  for (const weights of ["1", "0;0", "1;-1"])
    expect(
      calculate({ operation: "weighted-mean", values: "1;2", weights }).ok,
    ).toBe(false);
});
test("points carry each weight's share of the total", () => {
  const r = calculate({
    operation: "weighted-mean",
    values: "88;92;75",
    weights: "20;30;50",
  });
  if (!r.ok) throw Error("failed");
  expect(r.result.answer.value).toBe("82.7");
  expect(r.result.visual.points).toEqual([
    { value: "88", weight: "20", percent: "20" },
    { value: "92", weight: "30", percent: "30" },
    { value: "75", weight: "50", percent: "50" },
  ]);
});
