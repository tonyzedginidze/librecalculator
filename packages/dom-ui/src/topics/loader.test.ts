import { expect, test } from "bun:test";
import { en } from "../../../i18n/src/en";
import { messages as percentageMessages } from "../../../i18n/src/topics/percentage";
import {
  loadTopicAdapterModule,
  loadTopicExamplePresenterModule,
} from "./loader-core";

test("loads the percentage adapter through its actual module importer", async () => {
  const adapter = await loadTopicAdapterModule("percentage", {
    "./percentage/adapter.ts": () => import("./percentage/adapter"),
  });

  expect(adapter?.id).toBe("percentage");
  expect(adapter?.descriptors.map(({ id }) => id)).toEqual([
    "of-value",
    "ratio",
  ]);
  const calculated = adapter?.calculate("of-value", {
    value: "80",
    percentage: "15",
  });
  expect(calculated).toMatchObject({
    ok: true,
    result: { answer: { kind: "decimal", value: "12" } },
  });
});

test("loads a second real module fixture with distinct fields and result", async () => {
  const adapter = await loadTopicAdapterModule("percentage", {
    "./percentage/adapter.ts": () =>
      import("./loader-fixtures/independent-adapter"),
  });

  expect(adapter?.id).toBe("percentage");
  expect(adapter?.descriptors[0]?.fields.map(({ id }) => id)).toEqual([
    "amount",
    "factor",
  ]);
  expect(adapter?.calculate("scale", { amount: "3", factor: "4" })).toEqual({
    ok: true,
    result: { summary: "3 scaled by 4", product: "12" },
  });
});

test("reports an actionable error when a module omits its named adapter export", async () => {
  await expect(
    loadTopicAdapterModule("percentage", {
      "./percentage/adapter.ts": async () => ({ default: {} }),
    }),
  ).rejects.toThrow(
    'Topic adapter module for "percentage" must export a named "adapter" value',
  );
});

test("reports a mismatched adapter ID instead of returning it as missing", async () => {
  await expect(
    loadTopicAdapterModule("percentage", {
      "./percentage/adapter.ts": async () => ({
        adapter: {
          id: "another-calculator",
          descriptors: [],
          parseField() {},
          calculate() {},
        },
      }),
    }),
  ).rejects.toThrow(
    'Topic adapter module for "percentage" exports adapter for "another-calculator"',
  );
});

test("loads the percentage example presenter through its actual module importer", async () => {
  const presenter = await loadTopicExamplePresenterModule("percentage", {
    "./percentage/examples.ts": () => import("./percentage/examples"),
  });
  if (!presenter)
    throw new Error("Percentage example presenter was not loaded");

  expect(
    presenter(
      { operation: "of-value", inputs: { value: "80", percentage: "15" } },
      "en-US",
      { ...en, ...percentageMessages },
    ),
  ).toEqual({
    ok: true,
    fields: [
      { id: "value", label: "Value", value: "80" },
      { id: "percentage", label: "Percentage", value: "15" },
    ],
    answer: "12",
    working: ["15% of 80 = 12"],
  });
});

test("loads an independent example presenter module with distinct field and result presentation", async () => {
  const presenter = await loadTopicExamplePresenterModule("percentage", {
    "./percentage/examples.ts": () =>
      import("./loader-fixtures/independent-examples"),
  });
  if (!presenter) throw new Error("Fixture example presenter was not loaded");

  expect(
    presenter(
      { operation: "scale", inputs: { amount: "3", factor: "4" } },
      "en-US",
      {},
    ),
  ).toEqual({
    ok: true,
    fields: [
      { id: "amount", label: "Input amount", value: "3" },
      { id: "factor", label: "Input factor", value: "4" },
    ],
    answer: "fixture-result:12",
    working: ["fixture multiplication: 3 × 4 = 12"],
  });
});

test("reports an actionable error when an examples module omits presentExample", async () => {
  await expect(
    loadTopicExamplePresenterModule("percentage", {
      "./percentage/examples.ts": async () => ({
        default: () => ({ ok: false }),
      }),
    }),
  ).rejects.toThrow(
    'Example presenter module for topic "percentage" must export a named "presentExample" function',
  );
});
