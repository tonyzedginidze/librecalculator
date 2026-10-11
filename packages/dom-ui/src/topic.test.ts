import { expect, test } from "bun:test";
import { evaluateDrafts } from "./evaluate";
import type { TopicAdapter } from "./topic";

type FractionTextResult = {
  fraction: { numerator: string; denominator: string };
  notation: "fraction-text";
};

const fractionAdapter: TopicAdapter<FractionTextResult, "invalid-fraction"> = {
  id: "percentage",
  schemaVersion: 1,
  descriptors: [
    {
      id: "reduce",
      labelKey: "fraction.reduce",
      fields: [
        {
          id: "value",
          labelKey: "fraction.value",
          defaultValue: "",
          input: "decimal",
        },
      ],
      working: [],
    },
  ],
  parseField(raw) {
    if (raw === "" || raw === "+" || raw === "-")
      return { state: "incomplete" };
    if (!/^[+-]?\d{1,1000}\/\d{1,1000}$/.test(raw))
      return { state: "invalid", reason: "fraction-text" };
    const [numerator, denominator] = raw.split("/");
    if (!numerator || !denominator || /^0+$/.test(denominator))
      return { state: "invalid", reason: "fraction-text" };
    return { state: "valid", canonical: `${numerator}/${denominator}` };
  },
  calculate(_operationId, fields) {
    const [numerator, denominator] = (fields.value ?? "").split("/");
    if (!numerator || !denominator)
      return { ok: false, error: { code: "invalid-fraction", field: "value" } };
    return {
      ok: true,
      result: {
        fraction: { numerator, denominator },
        notation: "fraction-text",
      },
    };
  },
};

test("evaluation delegates non-decimal parsing and retains a topic-specific result type", () => {
  const numerator = "9".repeat(1000);
  const raw = `${numerator}/7`;
  const evaluation = evaluateDrafts({
    operationId: "reduce",
    fields: fractionAdapter.descriptors[0]?.fields ?? [],
    drafts: { value: raw },
    locale: "en-US",
    parseField: fractionAdapter.parseField,
    calculate: (fields) => fractionAdapter.calculate("reduce", fields),
  });
  expect(evaluation.status).toBe("ok");
  if (evaluation.status !== "ok") return;
  expect(evaluation.canonical.value).toBe(raw);
  expect(evaluation.outcome.result).toEqual({
    fraction: { numerator, denominator: "7" },
    notation: "fraction-text",
  });
  expect("answer" in evaluation.outcome.result).toBe(false);
});

test("topic parser can preserve an incomplete fraction draft", () => {
  const result = evaluateDrafts({
    operationId: "reduce",
    fields: fractionAdapter.descriptors[0]?.fields ?? [],
    drafts: { value: "-" },
    locale: "en-US",
    parseField: fractionAdapter.parseField,
    calculate: (fields) => fractionAdapter.calculate("reduce", fields),
  });
  expect(result.status).toBe("incomplete");
});
