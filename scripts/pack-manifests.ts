import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

export type PackManifest = {
  id: string;
  version: number;
  category: string;
  titleKey: string;
  descriptionKey: string;
  calculatorIds: string[];
  default: boolean;
};

/** Literal manifests only: catalog discovery never executes pack code. */
export async function readPacks(
  root: string,
  calculatorIds: readonly string[],
): Promise<PackManifest[]> {
  const packs: PackManifest[] = [];
  const known = new Set(calculatorIds);
  const assigned = new Map<string, string>();
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const filename = join(root, entry.name, "pack.json");
    const value = JSON.parse(
      await readFile(filename, "utf8"),
    ) as Partial<PackManifest>;
    if (
      !value ||
      typeof value !== "object" ||
      value.id !== entry.name ||
      !/^[a-z][a-z0-9-]*$/.test(value.id) ||
      !Number.isSafeInteger(value.version) ||
      Number(value.version) < 1 ||
      typeof value.default !== "boolean"
    )
      throw new Error(`${filename}: invalid pack identity, version or default`);
    for (const key of ["category", "titleKey", "descriptionKey"] as const)
      if (typeof value[key] !== "string" || !value[key])
        throw new Error(`${filename}: missing ${key}`);
    if (!Array.isArray(value.calculatorIds) || !value.calculatorIds.length)
      throw new Error(`${filename}: calculatorIds must be non-empty`);
    for (const id of value.calculatorIds) {
      if (!known.has(id))
        throw new Error(`${filename}: unknown calculator ${id}`);
      if (assigned.has(id))
        throw new Error(
          `${id}: duplicate membership in ${assigned.get(id)} and ${value.id}`,
        );
      assigned.set(id, value.id);
    }
    packs.push(value as PackManifest);
  }
  if (!packs.some((pack) => pack.id === "core" && pack.default))
    throw new Error("The core pack must exist and be active by default");
  for (const id of known)
    if (!assigned.has(id))
      throw new Error(`${id}: calculator must belong to exactly one pack`);
  return packs.sort((a, b) => a.id.localeCompare(b.id));
}
