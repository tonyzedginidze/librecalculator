import { expect, test } from "bun:test";
import { calculate } from "./index";

test("A population with mean five", () => {
  const result = calculate({
    operation: "population",
    values: "2;4;4;4;5;5;7;9",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("2");
});
test("Three observations used as a sample", () => {
  const result = calculate({ operation: "sample", values: "1;3;5" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("2");
});
test("Identical values have no spread", () => {
  const result = calculate({ operation: "population", values: "7;7;7" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("0");
});
test("rejects malformed input", () => {
  expect(calculate({ operation: "population", values: "abc" }).ok).toBe(false);
});
test("sample requires two observations; population accepts one", () => {
  expect(calculate({ operation: "sample", values: "5" }).ok).toBe(false);
  const r = calculate({ operation: "population", values: "5" });
  if (!r.ok) throw Error("failed");
  expect(r.result.answer.value).toBe("0");
});
test("spread is invariant under translation", () => {
  const r = calculate({
    operation: "population",
    values: "100000000000000000000000000001;100000000000000000000000000003",
  });
  if (!r.ok) throw Error("failed");
  expect(r.result.answer.value).toBe("1");
});
test("visual carries sorted points and the one-deviation band", () => {
  const r = calculate({ operation: "population", values: "9;2;4;4;4;5;5;7" });
  if (!r.ok) throw Error("failed");
  expect(r.result.visual.points).toEqual([
    "2",
    "4",
    "4",
    "4",
    "5",
    "5",
    "7",
    "9",
  ]);
  expect(r.result.visual.mean).toBe("5");
  expect(r.result.visual.low).toBe("3");
  expect(r.result.visual.high).toBe("7");
  expect(r.result.visual.within).toBe("6");
});
