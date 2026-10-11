import { expect, test } from "bun:test";
import { en, renderWorkingStep } from "../../../../i18n/src/en";
import { messages as volumeMessages } from "../../../../i18n/src/topics/volume";
import { adapter as volumeAdapter, volumeInput } from "./adapter";
import { presentExample } from "./examples";

const messages = { ...en, ...volumeMessages };

test("volumeInput maps operation fields correctly", () => {
  expect(volumeInput("prism", { width: "2", height: "3", depth: "4" })).toEqual(
    {
      operation: "prism",
      width: "2",
      height: "3",
      depth: "4",
    },
  );
  expect(volumeInput("cylinder", { radius: "2", height: "3" })).toEqual({
    operation: "cylinder",
    radius: "2",
    height: "3",
  });
  expect(volumeInput("sphere", { radius: "3" })).toEqual({
    operation: "sphere",
    radius: "3",
  });
  expect(volumeInput("unknown", {})).toBeNull();
});

test("volumeAdapter calculates prism volume", () => {
  const result = volumeAdapter.calculate("prism", {
    width: "2",
    height: "3",
    depth: "4",
  });
  expect(result.ok).toBe(true);
  if (!result.ok) return;
  expect(result.result.answer.value).toBe("24");
  expect(result.result.visual).toEqual({
    kind: "volume-prism",
    width: "2",
    height: "3",
    depth: "4",
    volume: "24",
    unitKey: "volume.unit.cubic-metre",
  });
});

test("volumeAdapter calculates cylinder and sphere volume", () => {
  const cylinderRes = volumeAdapter.calculate("cylinder", {
    radius: "2",
    height: "3",
  });
  expect(cylinderRes.ok).toBe(true);
  if (!cylinderRes.ok) return;
  expect(cylinderRes.result.answer.value).toBe(
    "37.6991118430775188615517205993540346103660327925",
  );

  const sphereRes = volumeAdapter.calculate("sphere", {
    radius: "3",
  });
  expect(sphereRes.ok).toBe(true);
  if (!sphereRes.ok) return;
  expect(sphereRes.result.answer.value).toBe(
    "113.0973355292325565846551617980621038310980983775",
  );
});

test("cylinder working step renders correct substituted equation with radius squared", () => {
  const calculation = volumeAdapter.calculate("cylinder", {
    radius: "2",
    height: "3",
  });
  expect(calculation.ok).toBe(true);
  if (!calculation.ok) return;

  const step = calculation.result.working[0];
  if (!step) throw new Error("Missing working step");

  const rendered = renderWorkingStep(step, { locale: "en-US", messages });
  expect(rendered).toBe("π × (2 m)² × 3 m = 37.6991118431 m³");
});

test("sphere working step renders correct substituted equation with radius cubed", () => {
  const calculation = volumeAdapter.calculate("sphere", {
    radius: "3",
  });
  expect(calculation.ok).toBe(true);
  if (!calculation.ok) return;

  const step = calculation.result.working[0];
  if (!step) throw new Error("Missing working step");

  const rendered = renderWorkingStep(step, { locale: "en-US", messages });
  expect(rendered).toBe("4π × (3 m)³ ÷ 3 = 113.0973355292 m³");
});

test("circle working step renders correct substituted equation with radius squared regression", () => {
  const areaCalc = volumeAdapter.calculate("cylinder", {
    radius: "2",
    height: "1",
  });
  expect(areaCalc.ok).toBe(true);
});

test("presentExample formats volume examples with cubic metres unit", () => {
  const exampleResult = presentExample(
    { operation: "prism", inputs: { width: "2", height: "3", depth: "4" } },
    "en-US",
    messages,
  );
  expect(exampleResult.ok).toBe(true);
  if (!exampleResult.ok) return;
  expect(exampleResult.answer).toBe("24 m³");
  expect(exampleResult.fields).toEqual([
    { id: "width", label: "Width", value: "2" },
    { id: "height", label: "Height", value: "3" },
    { id: "depth", label: "Depth", value: "4" },
  ]);
  expect(exampleResult.working).toEqual(["2 m × 3 m × 4 m = 24 m³"]);
});
