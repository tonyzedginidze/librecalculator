import { expect, test } from "bun:test";
import { calculate } from "./index";

test("Three equally spaced observations", () => {
  const result = calculate({ operation: "mean", values: "2;4;6" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("4");
});
test("Median between two central observations", () => {
  const result = calculate({ operation: "median", values: "1;2;8;9" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("5");
});
test("One repeated observation", () => {
  const result = calculate({ operation: "mode", values: "2;4;4;6" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("4");
});
test("rejects malformed input", () => {
  expect(calculate({ operation: "mean", values: "abc" }).ok).toBe(false);
});
test("mode rejects ties and all-unique lists", () => {
  for (const values of ["1;2;3", "1;1;2;2"])
    expect(calculate({ operation: "mode", values }).ok).toBe(false);
});
test("dataset bounds and signed centre", () => {
  expect(
    calculate({ operation: "mean", values: Array(101).fill("1").join(";") }).ok,
  ).toBe(false);
  const r = calculate({ operation: "mean", values: "-4;0;4" });
  if (!r.ok) throw Error("failed");
  expect(r.result.answer.value).toBe("0");
});
test("visual carries sorted points and every centre", () => {
  const r = calculate({ operation: "mean", values: "6;2;4;4" });
  if (!r.ok) throw Error("failed");
  expect(r.result.visual.points).toEqual(["2", "4", "4", "6"]);
  expect(r.result.visual.mean).toBe("4");
  expect(r.result.visual.median).toBe("4");
  expect(r.result.visual.mode).toBe("4");
  const noMode = calculate({ operation: "median", values: "1;2;8;9" });
  if (!noMode.ok) throw Error("failed");
  expect(noMode.result.visual.mode).toBeNull();
});
