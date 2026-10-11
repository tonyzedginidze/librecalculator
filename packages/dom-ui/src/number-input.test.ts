import { expect, test } from "bun:test";
import {
  cleanDraft,
  coreCount,
  displayPosition,
  formatDraft,
  interpretPaste,
  numberMarks,
  stepDraft,
  unitAffix,
} from "./number-input";

const us = numberMarks("en-US");
const de = numberMarks("de-DE");

test("cleans typed text to sign, digits and one decimal mark", () => {
  expect(cleanDraft("1,234.5.6abc", us)).toBe("1234.56");
  expect(cleanDraft("-12-3", us)).toBe("-123");
  expect(cleanDraft("−5", us)).toBe("-5");
  expect(cleanDraft("1.5", us, { integer: true })).toBe("15");
  expect(cleanDraft("-4", us, { signed: false })).toBe("4");
});

test("formats thousands grouping without changing the draft", () => {
  expect(formatDraft("1234567.891", us)).toBe("1,234,567.891");
  expect(formatDraft("-1000", us)).toBe("-1,000");
  expect(formatDraft("12.", us)).toBe("12.");
  expect(formatDraft("1234,5", de)).toBe("1.234,5");
});

test("maps carets by counting digits so grouping never moves them", () => {
  const display = formatDraft("1234567", us); // 1,234,567
  expect(coreCount(display, 5, us)).toBe(4);
  expect(displayPosition(display, 4, us)).toBe(5);
  expect(displayPosition(display, 0, us)).toBe(0);
  expect(displayPosition(display, 99, us)).toBe(display.length);
});

test("interprets pasted numbers from other formats", () => {
  expect(interpretPaste("$1,234.50", us)).toBe("1234.50");
  expect(interpretPaste("1.234,56", us)).toBe("1234.56");
  expect(interpretPaste("1 234,5", us)).toBe("1234.5");
  expect(interpretPaste("12,5", us)).toBe("12.5");
  expect(interpretPaste("1,234", us)).toBe("1234");
  expect(interpretPaste("50 %", us)).toBe("50");
  expect(interpretPaste("−7.25", us)).toBe("-7.25");
  expect(interpretPaste("1.234", de)).toBe("1234");
});

test("steps exactly, without floating point drift", () => {
  expect(stepDraft("0.1", 0.2, us)).toBe("0.3");
  expect(stepDraft("", 1, us)).toBe("1");
  expect(stepDraft("-", 1, us)).toBe("1");
  expect(stepDraft("9", 1, us)).toBe("10");
  expect(stepDraft("0.5", -1, us)).toBe("-0.5");
  expect(stepDraft("2,5", 1, de)).toBe("3,5");
});

test("derives a short unit symbol", () => {
  expect(unitAffix("unit.usd", "USD")).toEqual({ prefix: "$" });
  expect(unitAffix("unit.percent", "percent (%)")).toEqual({ suffix: "%" });
  expect(unitAffix("area.unit.square-metre", "square metres (m²)")).toEqual({
    suffix: "m²",
  });
  expect(unitAffix(undefined, undefined)).toEqual({});
});
