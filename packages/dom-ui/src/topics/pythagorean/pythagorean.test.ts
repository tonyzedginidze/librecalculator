import { expect, test } from "bun:test";
import { en, renderWorkingStep } from "../../../../i18n/src/en";
import { messages as pythagoreanMessages } from "../../../../i18n/src/topics/pythagorean";
import { adapter as pythagoreanAdapter, pythagoreanInput } from "./adapter";
import { presentExample } from "./examples";

const messages = { ...en, ...pythagoreanMessages };

test("pythagoreanInput maps operation fields correctly", () => {
  expect(pythagoreanInput("missing-hypotenuse", { a: "3", b: "4" })).toEqual({
    operation: "missing-hypotenuse",
    a: "3",
    b: "4",
  });
  expect(
    pythagoreanInput("missing-leg", { hypotenuse: "5", leg: "3" }),
  ).toEqual({
    operation: "missing-leg",
    hypotenuse: "5",
    leg: "3",
  });
  expect(pythagoreanInput("unknown", {})).toBeNull();
});

test("pythagoreanAdapter calculates missing hypotenuse", () => {
  const result = pythagoreanAdapter.calculate("missing-hypotenuse", {
    a: "3",
    b: "4",
  });
  expect(result.ok).toBe(true);
  if (!result.ok) return;
  expect(result.result.answer.value).toBe("5");
  expect(result.result.visual).toEqual({
    kind: "pythagorean-right-triangle",
    a: "3",
    b: "4",
    c: "5",
    solvedSide: "c",
    unitKey: "pythagorean.unit.metre",
  });
});

test("pythagoreanAdapter calculates missing leg", () => {
  const result = pythagoreanAdapter.calculate("missing-leg", {
    hypotenuse: "5",
    leg: "3",
  });
  expect(result.ok).toBe(true);
  if (!result.ok) return;
  expect(result.result.answer.value).toBe("4");
  expect(result.result.visual).toEqual({
    kind: "pythagorean-right-triangle",
    a: "3",
    b: "4",
    c: "5",
    solvedSide: "b",
    unitKey: "pythagorean.unit.metre",
  });
});

test("pythagoreanAdapter rejects impossible triangle where hypotenuse <= leg", () => {
  const impossible = pythagoreanAdapter.calculate("missing-leg", {
    hypotenuse: "3",
    leg: "5",
  });
  expect(impossible.ok).toBe(false);
  if (impossible.ok) return;
  expect(impossible.error.code).toBe("impossible-triangle");
});

test("pythagorean working step renders correct equation", () => {
  const calculation = pythagoreanAdapter.calculate("missing-hypotenuse", {
    a: "3",
    b: "4",
  });
  expect(calculation.ok).toBe(true);
  if (!calculation.ok) return;

  const step = calculation.result.working[0];
  if (!step) throw new Error("Missing working step");

  const rendered = renderWorkingStep(step, { locale: "en-US", messages });
  expect(rendered).toBe("c = √(3² + 4²) = 5 m");
});

test("presentExample formats pythagorean examples with metres unit", () => {
  const exampleResult = presentExample(
    { operation: "missing-hypotenuse", inputs: { a: "3", b: "4" } },
    "en-US",
    messages,
  );
  expect(exampleResult.ok).toBe(true);
  if (!exampleResult.ok) return;
  expect(exampleResult.answer).toBe("5 m");
  expect(exampleResult.fields).toEqual([
    { id: "a", label: "Leg a", value: "3" },
    { id: "b", label: "Leg b", value: "4" },
  ]);
  expect(exampleResult.working).toEqual(["c = √(3² + 4²) = 5 m"]);
});
