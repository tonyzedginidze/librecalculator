import { expect, test } from "bun:test";
import { calculate } from "./index";

test("One and a half deviations above the mean", () => {
  const result = calculate({
    operation: "standard-score",
    value: "85",
    mean: "70",
    deviation: "10",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("1.5");
});
test("Two deviations below the mean", () => {
  const result = calculate({
    operation: "standard-score",
    value: "40",
    mean: "50",
    deviation: "5",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("-2");
});
test("Exactly at the mean", () => {
  const result = calculate({
    operation: "standard-score",
    value: "10",
    mean: "10",
    deviation: "2",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("0");
});
test("rejects malformed input", () => {
  expect(
    calculate({
      operation: "standard-score",
      value: "abc",
      mean: "70",
      deviation: "10",
    }).ok,
  ).toBe(false);
});
test("zero or negative deviation fails", () => {
  for (const deviation of ["0", "-1"])
    expect(
      calculate({
        operation: "standard-score",
        value: "2",
        mean: "1",
        deviation,
      }).ok,
    ).toBe(false);
});
test("sigma axis lists raw values at whole deviations", () => {
  const r = calculate({
    operation: "standard-score",
    value: "85",
    mean: "70",
    deviation: "10",
  });
  if (!r.ok) throw Error("failed");
  expect(r.result.visual.scale.map((s) => [s.z, s.value])).toEqual([
    [-3, "40"],
    [-2, "50"],
    [-1, "60"],
    [0, "70"],
    [1, "80"],
    [2, "90"],
    [3, "100"],
  ]);
});
