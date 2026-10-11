import { expect, test } from "bun:test";
import {
  formatDecimal,
  interpolateMessage,
  isRoundedForDisplay,
  parseLocaleDecimal,
  plural,
} from "./en";

test("formats arbitrarily large values without Number coercion", () => {
  expect(formatDecimal("123456789012345678901234567890.125", "en-US")).toBe(
    "123,456,789,012,345,678,901,234,567,890.125",
  );
  expect(formatDecimal("-1234.5000", "de-DE")).toBe("-1.234,5");
  expect(formatDecimal("0.000000000000000000000000000001", "en-US")).toBe(
    "0.000000000000000000000000000001",
  );
  expect(formatDecimal("-0.000000000000000000000000000001", "de-DE")).toBe(
    "-0,000000000000000000000000000001",
  );
  expect(formatDecimal("12345678901234567890.25", "en-IN")).toBe(
    "1,23,45,67,89,01,23,45,67,890.25",
  );
});

test("normalizes locale decimal input and preserves incomplete/raw drafts", () => {
  expect(parseLocaleDecimal("1.25", "en-US")).toEqual({
    state: "valid",
    raw: "1.25",
    canonical: "1.25",
  });
  expect(parseLocaleDecimal("1,25", "de-DE")).toEqual({
    state: "valid",
    raw: "1,25",
    canonical: "1.25",
  });
  expect(parseLocaleDecimal("1,25", "fr-FR")).toEqual({
    state: "valid",
    raw: "1,25",
    canonical: "1.25",
  });
  expect(parseLocaleDecimal("-", "en-US")).toEqual({
    state: "incomplete",
    raw: "-",
  });
  expect(parseLocaleDecimal(",", "fr-FR")).toEqual({
    state: "incomplete",
    raw: ",",
  });
  expect(parseLocaleDecimal("1.", "en-US")).toEqual({
    state: "incomplete",
    raw: "1.",
  });
  expect(parseLocaleDecimal("1,", "de-DE")).toEqual({
    state: "incomplete",
    raw: "1,",
  });
  for (const [raw, locale] of [
    ["1,000", "en-US"],
    ["1.000", "de-DE"],
    ["1 000,2", "fr-FR"],
    ["1 000,2", "fr-FR"],
    ["1,2.3", "en-US"],
    [" 1,2", "de-DE"],
    ["1e2", "en-US"],
  ] as const) {
    expect(parseLocaleDecimal(raw, locale).state).toBe("invalid");
  }
  expect(parseLocaleDecimal("0".repeat(257), "en-US")).toMatchObject({
    state: "invalid",
    reason: "too-long",
  });
});

test("uses locale plural categories", () => {
  expect(plural("en", 1, { one: "item", other: "items" })).toBe("item");
  expect(plural("en", 2, { one: "item", other: "items" })).toBe("items");
});

test("interpolates tagged decimal, text, nested-message, and reference arguments safely", () => {
  const rendered = interpolateMessage(
    "{label}: {amount} / {nested} / {reference} / {missing}",
    {
      label: { kind: "text", value: "Rate" },
      amount: { kind: "decimal", value: "1234.5" },
      nested: {
        kind: "message",
        key: "nested",
        args: { value: { kind: "decimal", value: "0.25" } },
      },
      reference: { kind: "reference", id: "field.value" },
    },
    {
      locale: "de-DE",
      messages: { nested: "value {value}" },
      references: { "field.value": "Base" },
    },
  );
  expect(rendered).toBe("Rate: 1.234,5 / value 0,25 / Base / {missing}");
  expect(
    interpolateMessage(
      "{unknown}",
      { unknown: { kind: "reference", id: "toString" } },
      { locale: "en", messages: {}, references: {} },
    ),
  ).toBe("[toString]");
});

test("rounds long fractions for display without zeroing small values", () => {
  expect(
    formatDecimal(
      "3.14159265358979323846264338327950288419716939937510",
      "en-US",
    ),
  ).toBe("3.1415926536");
  expect(formatDecimal("1.99999999999", "en-US")).toBe("2");
  expect(formatDecimal("0.00001234567890123456", "en-US")).toBe(
    "0.0000123456789",
  );
});

test("formatDecimal rounds half-up to requested fraction digits for presentation", () => {
  expect(formatDecimal("22.8571428571", "en-US", { fractionDigits: 1 })).toBe(
    "22.9",
  );
  expect(formatDecimal("1999.5", "en-US", { fractionDigits: 0 })).toBe("2,000");
  expect(formatDecimal("2.2", "en-US", { fractionDigits: 3 })).toBe("2.2");
  expect(formatDecimal("-0.004", "en-US", { fractionDigits: 2 })).toBe("0");
  expect(formatDecimal("0.0049", "de-DE", { fractionDigits: 3 })).toBe("0,005");
  expect(isRoundedForDisplay("22.8571", 1)).toBe(true);
  expect(isRoundedForDisplay("2.20", 1)).toBe(false);
});
