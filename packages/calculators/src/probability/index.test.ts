import { expect, test } from "bun:test";
import { calculate } from "./index";

test("Complement of a one-fifth chance", () => {
  const result = calculate({ operation: "complement", first: "0.2" });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("0.8");
});
test("Intersection of independent events", () => {
  const result = calculate({
    operation: "independent-both",
    first: "0.5",
    second: "0.4",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("0.2");
});
test("Count overlap only once", () => {
  const result = calculate({
    operation: "event-union",
    first: "0.5",
    second: "0.4",
    intersection: "0.2",
  });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.result.answer.value).toBe("0.7");
});
test("rejects malformed input", () => {
  expect(calculate({ operation: "complement", first: "abc" }).ok).toBe(false);
});
test("union consistency rejects impossible overlaps", () => {
  for (const intersection of ["0.1", "0.9"])
    expect(
      calculate({
        operation: "event-union",
        first: "0.8",
        second: "0.7",
        intersection,
      }).ok,
    ).toBe(false);
  expect(calculate({ operation: "complement", first: "1.01" }).ok).toBe(false);
});
test("two-event operations partition the sample space", () => {
  const both = calculate({
    operation: "independent-both",
    first: "0.5",
    second: "0.4",
  });
  if (!both.ok) throw Error("failed");
  expect(both.result.visual.regions).toEqual({
    aOnly: "0.3",
    both: "0.2",
    bOnly: "0.2",
    neither: "0.3",
  });
  const union = calculate({
    operation: "event-union",
    first: "0.5",
    second: "0.4",
    intersection: "0.2",
  });
  if (!union.ok) throw Error("failed");
  expect(union.result.visual.regions).toEqual({
    aOnly: "0.3",
    both: "0.2",
    bOnly: "0.2",
    neither: "0.3",
  });
  const complement = calculate({ operation: "complement", first: "0.3" });
  if (!complement.ok) throw Error("failed");
  expect(complement.result.answer.value).toBe("0.7");
  expect(complement.result.visual.regions).toBeUndefined();
});
