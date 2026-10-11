import { expect, test } from "bun:test";
import { lesson as fractionsLesson } from "../../../content/src/fractions/index";
import { lesson as percentageChangeLesson } from "../../../content/src/percentage-change/index";
import { en, formatDecimal } from "../../../i18n/src/en";
import { messages as fractionsMessages } from "../../../i18n/src/topics/fractions";
import { messages as percentageChangeMessages } from "../../../i18n/src/topics/percentage-change";
import { adapter as fractionsAdapter } from "./fractions/adapter";
import { presentExample as presentFractionsExample } from "./fractions/examples";
import { adapter as percentageChangeAdapter } from "./percentage-change/adapter";
import { presentExample as presentPercentageChangeExample } from "./percentage-change/examples";

const fractionsEnMessages = { ...en, ...fractionsMessages };
const percentageChangeEnMessages = { ...en, ...percentageChangeMessages };

test("fractions adapter parseField supports 1000-digit integers, incomplete '-', and rejects invalid/too-long inputs", () => {
  expect(fractionsAdapter.id).toBe("fractions");

  // Valid small integer
  const validSmall = fractionsAdapter.parseField("42", "en-US", {
    id: "numerator",
    labelKey: "fractions.field.numerator",
    defaultValue: "1",
    input: "integer",
  });
  expect(validSmall).toEqual({ state: "valid", canonical: "42" });

  // Valid negative integer
  const validNeg = fractionsAdapter.parseField("-123", "en-US", {
    id: "numerator",
    labelKey: "fractions.field.numerator",
    defaultValue: "1",
    input: "integer",
  });
  expect(validNeg).toEqual({ state: "valid", canonical: "-123" });

  // Incomplete inputs
  const incompleteSign = fractionsAdapter.parseField("-", "en-US", {
    id: "numerator",
    labelKey: "fractions.field.numerator",
    defaultValue: "1",
    input: "integer",
  });
  expect(incompleteSign).toEqual({ state: "incomplete" });

  const incompleteEmpty = fractionsAdapter.parseField("", "en-US", {
    id: "numerator",
    labelKey: "fractions.field.numerator",
    defaultValue: "1",
    input: "integer",
  });
  expect(incompleteEmpty).toEqual({ state: "incomplete" });

  // Invalid decimal point
  const invalidDecimal = fractionsAdapter.parseField("12.3", "en-US", {
    id: "numerator",
    labelKey: "fractions.field.numerator",
    defaultValue: "1",
    input: "integer",
  });
  expect(invalidDecimal).toEqual({
    state: "invalid",
    reason: "invalid-character",
  });

  // Valid 1000-digit integer
  const thousandDigits = "9".repeat(1000);
  const valid1000 = fractionsAdapter.parseField(thousandDigits, "en-US", {
    id: "numerator",
    labelKey: "fractions.field.numerator",
    defaultValue: "1",
    input: "integer",
  });
  expect(valid1000).toEqual({ state: "valid", canonical: thousandDigits });

  // Too long 1001-digit integer
  const thousandOneDigits = "9".repeat(1001);
  const invalidTooLong = fractionsAdapter.parseField(
    thousandOneDigits,
    "en-US",
    {
      id: "numerator",
      labelKey: "fractions.field.numerator",
      defaultValue: "1",
      input: "integer",
    },
  );
  expect(invalidTooLong).toEqual({ state: "invalid", reason: "too-long" });
});

test("fractions adapter calculate works for binary and reduce operations", () => {
  const addRes = fractionsAdapter.calculate("add", {
    leftNumerator: "1",
    leftDenominator: "2",
    rightNumerator: "1",
    rightDenominator: "3",
  });
  expect(addRes.ok).toBe(true);
  if (addRes.ok) {
    expect(addRes.result.answer.numerator).toBe("5");
    expect(addRes.result.answer.denominator).toBe("6");
    expect(addRes.result.mixed.text).toBe("5/6");
  }

  const reduceRes = fractionsAdapter.calculate("reduce", {
    numerator: "-42",
    denominator: "-56",
  });
  expect(reduceRes.ok).toBe(true);
  if (reduceRes.ok) {
    expect(reduceRes.result.answer.numerator).toBe("3");
    expect(reduceRes.result.answer.denominator).toBe("4");
    expect(reduceRes.result.mixed.text).toBe("3/4");
  }

  const negativeMixedRes = fractionsAdapter.calculate("add", {
    leftNumerator: "-7",
    leftDenominator: "3",
    rightNumerator: "0",
    rightDenominator: "1",
  });
  expect(negativeMixedRes.ok).toBe(true);
  if (negativeMixedRes.ok) {
    expect(negativeMixedRes.result.mixed.text).toBe("-2 1/3");
  }
});

test("fractions presentExample works for all 5 authored lesson examples with exact n/d answers", () => {
  const exampleBlocks = fractionsLesson.blocks.filter(
    (b) => b.kind === "example",
  );
  expect(exampleBlocks.length).toBe(5);

  for (const block of exampleBlocks) {
    if (block.kind !== "example") continue;
    const presentation = presentFractionsExample(
      { operation: block.operation, inputs: block.inputs },
      "en-US",
      fractionsEnMessages,
    );

    expect(presentation.ok).toBe(true);
    if (!presentation.ok) continue;

    expect(presentation.working.length).toBeGreaterThan(0);
    expect(presentation.answer).toBe(block.expected);
  }
});

test("percentage-change adapter parseField and calculate handle positive and negative baselines", () => {
  expect(percentageChangeAdapter.id).toBe("percentage-change");

  // Positive baseline: 100 -> 125
  const posBaseline = percentageChangeAdapter.calculate("change", {
    oldValue: "100",
    newValue: "125",
  });
  expect(posBaseline.ok).toBe(true);
  if (posBaseline.ok) {
    expect(posBaseline.result.answer.percent).toBe("25");
    expect(posBaseline.result.delta.value).toBe("25");
    expect(posBaseline.result.negativeBaseline).toBe(false);
  }

  // Negative baseline: -100 -> -50
  const negBaseline = percentageChangeAdapter.calculate("change", {
    oldValue: "-100",
    newValue: "-50",
  });
  expect(negBaseline.ok).toBe(true);
  if (negBaseline.ok) {
    expect(negBaseline.result.answer.percent).toBe("-50");
    expect(negBaseline.result.delta.value).toBe("50");
    expect(negBaseline.result.negativeBaseline).toBe(true);
  }

  // Zero baseline error
  const zeroBaseline = percentageChangeAdapter.calculate("change", {
    oldValue: "0",
    newValue: "50",
  });
  expect(zeroBaseline.ok).toBe(false);
  if (!zeroBaseline.ok) {
    expect(zeroBaseline.error.code).toBe("zero-baseline");
  }
});

test("percentage-change presentExample works for all 4 authored lesson examples", () => {
  const exampleBlocks = percentageChangeLesson.blocks.filter(
    (b) => b.kind === "example",
  );
  expect(exampleBlocks.length).toBe(4);

  for (const block of exampleBlocks) {
    if (block.kind !== "example") continue;
    const presentation = presentPercentageChangeExample(
      { operation: block.operation, inputs: block.inputs },
      "en-US",
      percentageChangeEnMessages,
    );

    expect(presentation.ok).toBe(true);
    if (!presentation.ok) continue;

    expect(presentation.working.length).toBeGreaterThan(0);
    expect(presentation.answer).toBe(
      `${formatDecimal(block.expected, "en-US")}%`,
    );
  }
});
