import { expect, test } from "bun:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import type { TopicAdapter } from "./topic";
import { getTopicView, registerTopicView } from "./topics/loader-core";
import { useCalculator } from "./use-calculator";
import type { TopicViewProps } from "./view-contract";

// Test fixture 1: Temporary Area Topic Adapter (Multi-field: length, width)
type AreaResult = { area: string; perimeter: string };
const tempAreaAdapter: TopicAdapter<AreaResult, "invalid-dim"> = {
  id: "percentage",
  schemaVersion: 1,
  descriptors: [
    {
      id: "calc-area",
      labelKey: "temp.area.label",
      fields: [
        {
          id: "length",
          labelKey: "temp.area.length",
          defaultValue: "10",
          input: "decimal",
        },
        {
          id: "width",
          labelKey: "temp.area.width",
          defaultValue: "5",
          input: "decimal",
        },
      ],
      working: [],
    },
  ],
  parseField(raw) {
    if (raw === "" || raw === "-") return { state: "incomplete" };
    if (Number.isNaN(Number(raw))) return { state: "invalid", reason: "nan" };
    return { state: "valid", canonical: raw };
  },
  calculate(_op, fields) {
    const l = Number(fields.length);
    const w = Number(fields.width);
    if (Number.isNaN(l) || Number.isNaN(w)) {
      return { ok: false, error: { code: "invalid-dim", field: "length" } };
    }
    return {
      ok: true,
      result: { area: String(l * w), perimeter: String(2 * (l + w)) },
    };
  },
};

function TempAreaView(props: TopicViewProps) {
  const controller = useCalculator({
    adapter: tempAreaAdapter,
    locale: props.locale,
  });

  return createElement(
    "div",
    { className: "temp-area-view" },
    createElement("h1", null, props.title),
    createElement(
      "span",
      { className: "area-result" },
      controller.evaluation.status === "ok"
        ? controller.evaluation.outcome.result.area
        : "empty",
    ),
  );
}

// Test fixture 2: Temporary Temperature Converter Topic Adapter (Affine conversion)
type TempResult = { converted: string; symbol: string };
const tempTemperatureAdapter: TopicAdapter<TempResult, "out-of-range"> = {
  id: "percentage",
  schemaVersion: 1,
  descriptors: [
    {
      id: "c-to-f",
      labelKey: "temp.ctof.label",
      fields: [
        {
          id: "celsius",
          labelKey: "temp.celsius.label",
          defaultValue: "100",
          input: "decimal",
        },
      ],
      working: [],
    },
  ],
  parseField(raw) {
    if (raw === "" || raw === "-") return { state: "incomplete" };
    if (Number.isNaN(Number(raw))) return { state: "invalid", reason: "nan" };
    return { state: "valid", canonical: raw };
  },
  calculate(_op, fields) {
    const c = Number(fields.celsius);
    if (Number.isNaN(c)) {
      return { ok: false, error: { code: "out-of-range", field: "celsius" } };
    }
    return {
      ok: true,
      result: { converted: String((c * 9) / 5 + 32), symbol: "°F" },
    };
  },
};

function TempTemperatureView(props: TopicViewProps) {
  const controller = useCalculator({
    adapter: tempTemperatureAdapter,
    locale: props.locale,
  });

  return createElement(
    "div",
    { className: "temp-temperature-view" },
    createElement("h1", null, props.title),
    createElement(
      "span",
      { className: "temp-result" },
      controller.evaluation.status === "ok"
        ? controller.evaluation.outcome.result.converted
        : "empty",
    ),
  );
}

test("getTopicView returns null for unregistered missing platform topic view", () => {
  const missing = getTopicView("unknown-topic-id");
  expect(missing).toBeNull();
});

test("registerTopicView registers custom topic view fixture dynamically", () => {
  // Registry fixture keys are test-only; adapters and view props use a live catalog ID.
  registerTopicView("area-fixture", TempAreaView);
  const resolved = getTopicView("area-fixture");
  expect(resolved).toBe(TempAreaView);
});

test("renders concrete temporary topic view fixture 1 (Area) with route HTML and default inputs", () => {
  const html = renderToString(
    createElement(TempAreaView, {
      id: "percentage",
      title: "Area Calculator",
      description: "Calculates rectangle area",
      messages: {},
      locale: "en-US",
    }),
  );

  expect(html).toContain('<div class="temp-area-view">');
  expect(html).toContain("<h1>Area Calculator</h1>");
  expect(html).toContain('<span class="area-result">50</span>');
});

test("renders concrete temporary topic view fixture 2 (Temperature) with route HTML and default inputs", () => {
  const html = renderToString(
    createElement(TempTemperatureView, {
      id: "percentage",
      title: "Temperature Converter",
      description: "Converts Celsius to Fahrenheit",
      messages: {},
      locale: "en-US",
    }),
  );

  expect(html).toContain('<div class="temp-temperature-view">');
  expect(html).toContain("<h1>Temperature Converter</h1>");
  expect(html).toContain('<span class="temp-result">212</span>');
});
