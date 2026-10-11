import { expect, test } from "bun:test";
import { parseLocaleDecimal } from "../../i18n/src/en";
import { calculatorRoute } from "./catalog";
import { answerCopyText } from "./copy";
import { canonicalToDraft } from "./draft";
import { evaluateDrafts } from "./evaluate";
import { presentExample } from "./topics/percentage/examples";
import { percentageBarModel } from "./visual";

test("keeps raw incomplete drafts and does not call the engine", () => {
  let calls = 0;
  const evaluation = evaluateDrafts({
    operationId: "of-value",
    fields: [
      { id: "value", labelKey: "value", defaultValue: "", input: "decimal" },
      {
        id: "percentage",
        labelKey: "percentage",
        defaultValue: "",
        input: "decimal",
      },
    ],
    drafts: { value: "-", percentage: "25" },
    locale: "en-US",
    parseField: (raw, locale) => parseLocaleDecimal(raw, locale),
    calculate: () => {
      calls += 1;
      return { ok: false, error: { code: "invalid-field" } };
    },
  });
  expect(evaluation.status).toBe("incomplete");
  expect(calls).toBe(0);
  expect(canonicalToDraft("1.25", "de-DE")).toBe("1,25");
});

test("sends canonical fields to the engine and copies the shared answer", () => {
  const evaluation = evaluateDrafts({
    operationId: "ratio",
    fields: [
      { id: "part", labelKey: "part", defaultValue: "", input: "decimal" },
      { id: "whole", labelKey: "whole", defaultValue: "", input: "decimal" },
    ],
    drafts: { part: "18", whole: "24" },
    locale: "en-US",
    parseField: (raw, locale) => parseLocaleDecimal(raw, locale),
    calculate: (_fields) => ({
      ok: true,
      result: {
        operation: "ratio",
        answer: { kind: "decimal", value: "75" },
        working: [],
        visual: {
          kind: "percentage-bar",
          value: "75",
          reference: "100",
          fraction: "0.75",
          outside: false,
          sign: "positive",
          descriptionKey: "percentage.visual.description",
          alternativeKey: "percentage.visual.alternative",
          outsideLabelKey: "percentage.visual.outside",
        },
      },
    }),
  });
  expect(evaluation.status).toBe("ok");
  if (evaluation.status !== "ok") return;
  expect(evaluation.canonical).toEqual({ part: "18", whole: "24" });
  const outcome = evaluation.outcome as Extract<
    typeof evaluation.outcome,
    { ok: true }
  >;
  expect(answerCopyText("ratio", outcome.result.answer.value, "de-DE")).toBe(
    "75%",
  );
  expect(answerCopyText("of-value", "12.5", "de-DE")).toBe("12,5");
});

test("bar model uses the shared fraction and outside flag, not a recomputed ratio", () => {
  const model = percentageBarModel(
    {
      value: "999",
      reference: "100",
      fraction: "0.25",
      outside: true,
      sign: "negative",
      descriptionKey: "d",
      alternativeKey: "a",
      outsideLabelKey: "o",
    },
    "en-US",
  );
  expect(model.widthPercent).toBe(25);
  expect(model.outside).toBe(true);
  expect(model.sign).toBe("negative");
  expect(model.valueText).toBe("999");
});

test("calculator routes use catalog slugs", () => {
  expect(calculatorRoute("percentage")).toBe("/calculators/percentage/");
});

test("derives example presentation through topic presenter", () => {
  const presentation = presentExample(
    { operation: "ratio", inputs: { part: "18", whole: "24" } },
    "de-DE",
    {
      "percentage.field.part": "Part",
      "percentage.field.whole": "Whole",
      "percentage.working.ratio": "{part} ÷ {whole} × 100 = {answer}%",
    },
  );
  expect(presentation.ok).toBe(true);
  if (presentation.ok) {
    expect(presentation.fields).toEqual([
      { id: "part", label: "Part", value: "18" },
      { id: "whole", label: "Whole", value: "24" },
    ]);
    expect(presentation.answer).toBe("75%");
    expect(presentation.working.length).toBeGreaterThan(0);
  }
});
