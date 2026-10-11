import { expect, test } from "bun:test";
import {
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
