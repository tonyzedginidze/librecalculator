import { expect, test } from "bun:test";
import { catalogItems, categoryOrder, filterItems } from "./catalog";

test("core spans category groups; pack activation never adds a Core category", () => {
  const core = catalogItems.filter((item) => item.packId === "core");
  const groups = categoryOrder.filter(
    (category) => filterItems(core, "", category).length > 0,
  );
  expect(core).toHaveLength(10);
  expect(groups).toEqual(["math", "geometry", "units", "finance"]);
  expect(groups).not.toContain("core");
});

test("enabled pack calculators join categories and disabling the last pack hides its group", () => {
  const active = (ids: string[]) =>
    catalogItems.filter((item) => ids.includes(item.packId));
  const groups = (ids: string[]) =>
    categoryOrder.filter(
      (category) => filterItems(active(ids), "", category).length > 0,
    );
  expect(groups(["core", "health"])).toContain("health");
  expect(groups(["core"])).not.toContain("health");
  expect(
    filterItems(active(["core", "geometry"]), "", "geometry"),
  ).toHaveLength(8);
  expect(filterItems(active(["core"]), "", "geometry")).toHaveLength(3);
});

test("search ranks title matches above description matches", () => {
  const ids = (query: string) =>
    filterItems(catalogItems, query).map((item) => item.id);
  // Percentage's description says "compare"; the title match must win.
  expect(ids("comp")[0]).toBe("compound-interest");
  expect(ids("interest")[0]).toBe("compound-interest");
  // A word inside the title outranks keyword and description hits.
  expect(ids("payment")[0]).toBe("loan-payments");
});
