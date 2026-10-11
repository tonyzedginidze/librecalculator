import { expect, test } from "bun:test";
import { packCatalog } from "../packs.generated";
import {
  allPackIds,
  decodeActivePacks,
  defaultPackIds,
  normalizeActivePacks,
} from "./packs";

test("pack preferences retain core and discard obsolete and duplicate IDs", () => {
  expect(normalizeActivePacks(["core", "core", "obsolete"])).toEqual(["core"]);
  expect(normalizeActivePacks([])).toContain("core");
  expect(decodeActivePacks("invalid json")).toEqual(defaultPackIds());
  expect(decodeActivePacks('{"core": true}')).toEqual(defaultPackIds());
});

test("a fallback replaces the default packs when nothing is saved", () => {
  expect(decodeActivePacks(null, allPackIds)).toHaveLength(packCatalog.length);
  expect(decodeActivePacks('["core"]', allPackIds)).toEqual(["core"]);
});
