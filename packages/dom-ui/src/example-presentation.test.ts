import { expect, test } from "bun:test";
import { lesson as percentageLesson } from "../../content/src/percentage/index";
import { en } from "../../i18n/src/en";
import { messages as percentageMessages } from "../../i18n/src/topics/percentage";
import type {
  ExamplePresentation,
  ExamplePresenter,
} from "./example-presentation";
import { presentExample as presentPercentageExample } from "./topics/percentage/examples";

const messages = { ...en, ...percentageMessages };

test("percentage all 4 lesson examples compare expected in fixture tests and produce working result", () => {
  const exampleBlocks = percentageLesson.blocks.filter(
    (b) => b.kind === "example",
  );
  expect(exampleBlocks.length).toBe(4);

  for (const block of exampleBlocks) {
    if (block.kind !== "example") continue;
    const presentation = presentPercentageExample(
      { operation: block.operation, inputs: block.inputs },
      "en-US",
      messages,
    );

    expect(presentation.ok).toBe(true);
    if (!presentation.ok) continue;

    expect(presentation.working.length).toBeGreaterThan(0);

    // Verify expected answer matches formatted result
    if (block.operation === "ratio") {
      expect(presentation.answer).toBe(`${block.expected}%`);
    } else {
      expect(presentation.answer).toBe(block.expected);
    }
  }
});

test("rendered 3-field nondecimal test fixture boundary produces correct fields, answer, and working without generic formatDecimal", () => {
  const nondecimalPresenter: ExamplePresenter = (
    example,
    _locale,
    _messages,
  ): ExamplePresentation => {
    if (example.operation !== "mixed-fraction") {
      return { ok: false, reason: "unsupported-operation" };
    }
    const whole = example.inputs.whole ?? "0";
    const numerator = example.inputs.numerator ?? "0";
    const denominator = example.inputs.denominator ?? "1";

    return {
      ok: true,
      fields: [
        { id: "whole", label: "Whole Number", value: whole },
        { id: "numerator", label: "Numerator", value: numerator },
        { id: "denominator", label: "Denominator", value: denominator },
      ],
      answer: `${whole} ${numerator}/${denominator}`,
      working: [
        `Convert to improper fraction: (${whole} × ${denominator} + ${numerator}) / ${denominator}`,
      ],
    };
  };

  const presentation = nondecimalPresenter(
    {
      operation: "mixed-fraction",
      inputs: { whole: "3", numerator: "1", denominator: "4" },
    },
    "en-US",
    {},
  );

  expect(presentation.ok).toBe(true);
  if (presentation.ok) {
    expect(presentation.fields.length).toBe(3);
    expect(presentation.fields[0]).toEqual({
      id: "whole",
      label: "Whole Number",
      value: "3",
    });
    expect(presentation.fields[1]).toEqual({
      id: "numerator",
      label: "Numerator",
      value: "1",
    });
    expect(presentation.fields[2]).toEqual({
      id: "denominator",
      label: "Denominator",
      value: "4",
    });
    expect(presentation.answer).toBe("3 1/4");
    expect(presentation.working).toEqual([
      "Convert to improper fraction: (3 × 4 + 1) / 4",
    ]);
  }
});
