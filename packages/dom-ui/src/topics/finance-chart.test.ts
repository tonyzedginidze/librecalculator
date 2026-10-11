import { expect, test } from "bun:test";
import {
  calculateNormalizedY,
  findNearestIndex,
  pointerToNearestIndex,
  selectAxisTicks,
} from "./finance-chart-helpers";

test("findNearestIndex clamps ratio and selects correct index across counts", () => {
  expect(findNearestIndex(0.5, 0)).toBe(0);
  expect(findNearestIndex(0.5, 1)).toBe(0);
  expect(findNearestIndex(0, 10)).toBe(0);
  expect(findNearestIndex(1, 10)).toBe(9);
  expect(findNearestIndex(0.5, 10)).toBe(5);
  expect(findNearestIndex(-0.2, 10)).toBe(0);
  expect(findNearestIndex(1.5, 10)).toBe(9);

  // Large schedule (1200 months)
  expect(findNearestIndex(0, 1200)).toBe(0);
  expect(findNearestIndex(1, 1200)).toBe(1199);
  expect(findNearestIndex(0.5, 1200)).toBe(600);

  // 1000 years
  expect(findNearestIndex(0.25, 1000)).toBe(250);
});

test("pointerToNearestIndex maps client coordinates across responsive CSS widths (250px, 500px, 1000px)", () => {
  // rectLeft = 100, viewBox 500, plot 40..480
  // plot start in viewBox = 40 (ratio 0.08 of width 500)
  // plot end in viewBox = 480 (ratio 0.96 of width 500)

  // 1. CSS width = 500px (1:1 with viewBox)
  // clientX for SVG x=40 -> 100 + 40 = 140
  // clientX for SVG x=480 -> 100 + 480 = 580
  expect(pointerToNearestIndex(140, 100, 500, 10)).toBe(0);
  expect(pointerToNearestIndex(580, 100, 500, 10)).toBe(9);
  expect(pointerToNearestIndex(360, 100, 500, 10)).toBe(5);

  // 2. CSS width = 250px (half viewBox)
  // clientX for SVG x=40 -> 100 + 20 = 120
  // clientX for SVG x=480 -> 100 + 240 = 340
  expect(pointerToNearestIndex(120, 100, 250, 10)).toBe(0);
  expect(pointerToNearestIndex(340, 100, 250, 10)).toBe(9);

  // 3. CSS width = 1000px (double viewBox)
  // clientX for SVG x=40 -> 100 + 80 = 180
  // clientX for SVG x=480 -> 100 + 960 = 1060
  expect(pointerToNearestIndex(180, 100, 1000, 10)).toBe(0);
  expect(pointerToNearestIndex(1060, 100, 1000, 10)).toBe(9);

  // Single row (1 month / 1 year)
  expect(pointerToNearestIndex(140, 100, 500, 1)).toBe(0);

  // 2 rows (2 months)
  expect(pointerToNearestIndex(140, 100, 500, 2)).toBe(0);
  expect(pointerToNearestIndex(580, 100, 500, 2)).toBe(1);

  // 1200 rows (1200 months)
  expect(pointerToNearestIndex(140, 100, 500, 1200)).toBe(0);
  expect(pointerToNearestIndex(580, 100, 500, 1200)).toBe(1199);
  expect(pointerToNearestIndex(360, 100, 500, 1200)).toBe(600);
});

test("selectAxisTicks returns bounded indices including start and end", () => {
  expect(selectAxisTicks(0)).toEqual([]);
  expect(selectAxisTicks(1)).toEqual([0]);
  expect(selectAxisTicks(5, 6)).toEqual([0, 1, 2, 3, 4]);

  const ticks12 = selectAxisTicks(12, 6);
  expect(ticks12.length).toBeLessThanOrEqual(6);
  expect(ticks12[0]).toBe(0);
  expect(ticks12[ticks12.length - 1]).toBe(11);

  const ticks1200 = selectAxisTicks(1200, 6);
  expect(ticks1200.length).toBeLessThanOrEqual(6);
  expect(ticks1200[0]).toBe(0);
  expect(ticks1200[ticks1200.length - 1]).toBe(1199);

  const ticks1000 = selectAxisTicks(1000, 6);
  expect(ticks1000.length).toBeLessThanOrEqual(6);
  expect(ticks1000[0]).toBe(0);
  expect(ticks1000[ticks1000.length - 1]).toBe(999);
});

test("calculateNormalizedY scales correctly and handles zero/flat bounds", () => {
  // 0 of 1000 -> 160
  expect(calculateNormalizedY(0n, 1000n, 140, 160)).toBe(160);
  // 1000 of 1000 -> 20
  expect(calculateNormalizedY(1000n, 1000n, 140, 160)).toBe(20);
  // 500 of 1000 -> 90
  expect(calculateNormalizedY(500n, 1000n, 140, 160)).toBe(90);

  // Flat series with zero max
  expect(calculateNormalizedY(0n, 0n, 140, 160)).toBe(160);
});
