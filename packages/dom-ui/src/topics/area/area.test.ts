import { expect, test } from "bun:test";
import { en, renderWorkingStep } from "../../../../i18n/src/en";
import { messages as areaMessages } from "../../../../i18n/src/topics/area";
import { adapter as areaAdapter, areaInput } from "./adapter";
import { presentExample } from "./examples";

const messages = { ...en, ...areaMessages };

test("areaInput maps operation fields correctly", () => {
  expect(areaInput("rectangle", { width: "3", height: "4" })).toEqual({
    operation: "rectangle",
    width: "3",
    height: "4",
  });
  expect(areaInput("triangle", { base: "6", height: "5" })).toEqual({
    operation: "triangle",
    base: "6",
    height: "5",
  });
  expect(areaInput("circle", { radius: "2" })).toEqual({
    operation: "circle",
    radius: "2",
  });
  expect(areaInput("unknown", {})).toBeNull();
  expect(areaInput("rectangle", { width: "3" })).toBeNull();
});

test("areaAdapter calculates rectangle area", () => {
  const result = areaAdapter.calculate("rectangle", {
    width: "3",
    height: "4",
  });
  expect(result.ok).toBe(true);
  if (!result.ok) return;
  expect(result.result.answer.value).toBe("12");
  expect(result.result.visual).toEqual({
    kind: "area-rectangle",
    width: "3",
    height: "4",
    area: "12",
    unitKey: "area.unit.square-metre",
  });
});

test("areaAdapter calculates triangle area", () => {
  const result = areaAdapter.calculate("triangle", {
    base: "3",
    height: "4",
  });
  expect(result.ok).toBe(true);
  if (!result.ok) return;
  expect(result.result.answer.value).toBe("6");
});

test("circle working step renders correct substituted equation with radius squared", () => {
  const calculation = areaAdapter.calculate("circle", {
    radius: "2",
  });
  expect(calculation.ok).toBe(true);
  if (!calculation.ok) return;

  const step = calculation.result.working[0];
  if (!step) throw new Error("Missing working step");

  const rendered = renderWorkingStep(step, { locale: "en-US", messages });
  expect(rendered).toBe("π × (2 m)² = 12.5663706144 m²");
});

test("areaAdapter handles invalid and nonpositive inputs", () => {
  const invalid = areaAdapter.calculate("rectangle", {
    width: "abc",
    height: "4",
  });
  expect(invalid.ok).toBe(false);

  const nonpositive = areaAdapter.calculate("circle", {
    radius: "0",
  });
  expect(nonpositive.ok).toBe(false);
  if (nonpositive.ok) return;
  expect(nonpositive.error.code).toBe("nonpositive-dimension");
});

test("presentExample formats area examples with square metres unit", () => {
  const exampleResult = presentExample(
    { operation: "rectangle", inputs: { width: "3", height: "4" } },
    "en-US",
    messages,
  );
  expect(exampleResult.ok).toBe(true);
  if (!exampleResult.ok) return;
  expect(exampleResult.answer).toBe("12 m²");
  expect(exampleResult.fields).toEqual([
    { id: "width", label: "Width", value: "3" },
    { id: "height", label: "Height", value: "4" },
  ]);
  expect(exampleResult.working).toEqual(["3 m × 4 m = 12 m²"]);
});
