import { describe, expect, test } from "bun:test";
import { calculatorCatalog } from "../../packages/calculators/src/catalog.generated";
import {
  assertLiveSource,
  parseOptions,
  selectCalculators,
} from "../export-art";

describe("art export selection", () => {
  test("current-source exports reject built preview HTML", () => {
    expect(() =>
      assertLiveSource(
        '<astro-island component-url="/_astro/components.old.js"></astro-island>',
        "http://localhost:4321/",
      ),
    ).toThrow("not the live Astro/Vite dev server");
    expect(() =>
      assertLiveSource(
        '<script type="module" src="/@vite/client"></script>',
        "http://localhost:4321/",
      ),
    ).not.toThrow();
    expect(() =>
      assertLiveSource(
        "<script src='/@vite/client?t=123'></script>",
        "http://localhost:4321/",
      ),
    ).not.toThrow();
  });
  test("defaults exclude core and discount; both themes", () => {
    const options = parseOptions([]);
    const selected = selectCalculators(options);
    expect(options.url).toBe("http://localhost:4321");
    expect(options.themes).toEqual(["light", "dark"]);
    expect(selected).toHaveLength(calculatorCatalog.length - 11);
    expect(
      selected.some(
        (item) => item.id === "percentage" || item.id === "discount",
      ),
    ).toBe(false);
  });
  test("all includes core and discount", () => {
    expect(selectCalculators(parseOptions(["--all"]))).toHaveLength(
      calculatorCatalog.length,
    );
  });
  test("explicit IDs preserve order and can include core", () => {
    const options = parseOptions([
      "--ids",
      "length, percentage",
      "--theme",
      "dark",
      "--url",
      "http://localhost:4321/",
      "--out",
      "./art",
    ]);
    expect(selectCalculators(options).map((item) => item.id)).toEqual([
      "length",
      "percentage",
    ]);
    expect(options.themes).toEqual(["dark"]);
    expect(options.out?.endsWith("/art")).toBe(true);
  });
  test("bad input fails rather than silently skipping", () => {
    for (const args of [
      ["--ids", "missing"],
      ["--ids", "length,,circle"],
      ["--ids", "length,length"],
      ["--theme", "sepia"],
      ["--out"],
      ["--nope"],
      ["--all", "--ids", "circle"],
      ["--all", "--all"],
      ["--url", "file:///tmp/art"],
    ])
      expect(() => selectCalculators(parseOptions(args))).toThrow();
  });
});
