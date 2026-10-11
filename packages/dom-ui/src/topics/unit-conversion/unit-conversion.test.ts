import { expect, test } from "bun:test";
import { lesson as unitLesson } from "../../../../content/src/unit-conversion/index";
import { en, formatDecimal } from "../../../../i18n/src/en";
import { messages as unitMessages } from "../../../../i18n/src/topics/unit-conversion";
import { adapter } from "./adapter";
import { presentExample } from "./examples";

const messages = { ...en, ...unitMessages };

test("unit-conversion adapter supports choice parseField and conversion calculate", () => {
  expect(adapter.id).toBe("unit-conversion");
  expect(adapter.descriptors[0]?.id).toBe("convert");

  const parsedChoice = adapter.parseField("m", "en-US", {
    id: "source",
    labelKey: "unit-conversion.field.source",
    defaultValue: "m",
    input: "choice",
  });
  expect(parsedChoice).toEqual({ state: "valid", canonical: "m" });

  const invalidChoice = adapter.parseField("invalid_unit", "en-US", {
    id: "source",
    labelKey: "unit-conversion.field.source",
    defaultValue: "m",
    input: "choice",
  });
  expect(invalidChoice).toEqual({ state: "invalid", reason: "invalid-choice" });

  const result = adapter.calculate("convert", {
    value: "1",
    source: "in",
    target: "m",
  });
  expect(result.ok).toBe(true);
  if (result.ok) {
    expect(result.result.answer.value).toBe("0.0254");
  }
});

test("unit-conversion presentExample works for all authored lesson examples", () => {
  const exampleBlocks = unitLesson.blocks.filter((b) => b.kind === "example");
  expect(exampleBlocks.length).toBe(7);

  for (const block of exampleBlocks) {
    if (block.kind !== "example") continue;
    const presentation = presentExample(
      { operation: block.operation, inputs: block.inputs },
      "en-US",
      messages,
    );

    expect(presentation.ok).toBe(true);
    if (!presentation.ok) continue;

    expect(presentation.working.length).toBeGreaterThan(0);
    expect(presentation.answer).toBe(formatDecimal(block.expected, "en-US"));
  }
});
