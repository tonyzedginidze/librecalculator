import { describe, expect, test } from "bun:test";
import { lesson } from "../../../content/src/percentage-change/index";
import { renderWorkingStep } from "../../../i18n/src/en";
import { messages } from "../../../i18n/src/topics/percentage-change";
import { calculate } from "./index";

describe("percentage change engine", () => {
  test.each([
    [
      { operation: "change", oldValue: "100", newValue: "125" },
      "25",
      "25",
      false,
    ],
    [
      { operation: "change", oldValue: "-100", newValue: "-50" },
      "50",
      "-50",
      true,
    ],
    [
      { operation: "change", oldValue: "-100", newValue: "-150" },
      "-50",
      "50",
      true,
    ],
    [
      { operation: "change", oldValue: "50", newValue: "0" },
      "-50",
      "-100",
      false,
    ],
  ] as const)("independent signed-baseline fixture %j", (input, delta, percent, negativeBaseline) => {
    const result = calculate(input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.delta).toEqual({ kind: "signed-delta", value: delta });
    expect(result.result.answer).toEqual({
      kind: "percentage-change",
      percent,
    });
    expect(result.result.negativeBaseline).toBe(negativeBaseline);
    expect(result.result.visual.delta).toBe(delta);
    expect(result.result.visual.percentageChange).toBe(percent);
  });

  test("rejects zero baseline and invalid decimals by field", () => {
    expect(
      calculate({ operation: "change", oldValue: "0", newValue: "0" }),
    ).toEqual({
      ok: false,
      error: { code: "zero-baseline", field: "oldValue" },
    });
    expect(
      calculate({ operation: "change", oldValue: "1e3", newValue: "2" }),
    ).toEqual({
      ok: false,
      error: { code: "invalid-field", field: "oldValue" },
    });
    expect(
      calculate({ operation: "change", oldValue: "1", newValue: "1,000" }),
    ).toEqual({
      ok: false,
      error: { code: "invalid-field", field: "newValue" },
    });
  });

  test("uses full shared precision and structured negative-baseline explanation", () => {
    const result = calculate({
      operation: "change",
      oldValue: "3",
      newValue: "4",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result.answer.percent).toBe(
      "33.333333333333333333333333333333333333333333333333",
    );

    const negative = calculate({
      operation: "change",
      oldValue: "-100",
      newValue: "-150",
    });
    expect(negative.ok).toBe(true);
    if (!negative.ok) return;
    const step = negative.result.working[0];
    if (!step) throw new Error("Expected a percentage-change working step");
    expect(renderWorkingStep(step, { locale: "en-US", messages })).toContain(
      "Because the baseline is negative, a positive percentage change does not necessarily mean the new value is larger.",
    );
    expect(negative.result.visual.negativeBaseline).toBe(true);
  });

  test("authored lessons match independent change and delta fixtures", () => {
    const references: Record<string, { delta: string; percent: string }> = {
      "example-increase": { delta: "25", percent: "25" },
      "example-negative-toward-zero": { delta: "50", percent: "-50" },
      "example-negative-away-zero": { delta: "-50", percent: "50" },
      "example-to-zero": { delta: "-50", percent: "-100" },
    };
    for (const block of lesson.blocks) {
      if (block.kind !== "example") continue;
      const reference = references[block.id];
      expect(reference).toBeDefined();
      if (!reference) continue;
      expect(block.expected).toBe(reference.percent);
      const result = calculate({
        operation: block.operation,
        ...block.inputs,
      } as Parameters<typeof calculate>[0]);
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      expect(result.result.delta.value).toBe(reference.delta);
      expect(result.result.answer.percent).toBe(reference.percent);
    }
    expect(Object.keys(references)).toHaveLength(4);
  });
});
