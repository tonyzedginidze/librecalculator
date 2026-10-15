import { expect, test } from "bun:test";
import { calculatorCatalog } from "../../calculators/src/catalog.generated";
import { metaDescriptions, seoTitles } from "./meta";

test("every calculator has a search description of 110–160 characters", () => {
  const descriptions: Record<string, string> = metaDescriptions;
  for (const item of calculatorCatalog) {
    const text = descriptions[item.id];
    expect(text, item.id).toBeDefined();
    expect(text?.length ?? 0, item.id).toBeGreaterThanOrEqual(110);
    expect(text?.length ?? 0, item.id).toBeLessThanOrEqual(160);
    expect(text, item.id).not.toMatch(/\bworking\b/i);
  }
  expect(Object.keys(descriptions).sort()).toEqual(
    calculatorCatalog.map((item) => item.id).sort(),
  );
});

test("every calculator has a search title of at most 60 characters", () => {
  const titles: Record<string, string> = seoTitles;
  for (const item of calculatorCatalog) {
    const text = titles[item.id];
    expect(text, item.id).toBeDefined();
    expect(text?.length ?? 0, item.id).toBeLessThanOrEqual(60);
  }
  expect(Object.keys(titles).sort()).toEqual(
    calculatorCatalog.map((item) => item.id).sort(),
  );
});
