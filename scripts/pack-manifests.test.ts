import { expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readPacks } from "./pack-manifests";

test("pack membership rejects duplicates, unknown topics and unassigned topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "oc-packs-"));
  const save = async (id: string, calculatorIds: string[]) => {
    await mkdir(join(root, id), { recursive: true });
    await writeFile(
      join(root, id, "pack.json"),
      JSON.stringify({
        id,
        version: 1,
        category: "math",
        titleKey: "title",
        descriptionKey: "description",
        calculatorIds,
        default: id === "core",
      }),
    );
  };
  try {
    await save("core", ["one"]);
    expect((await readPacks(root, ["one"]))[0]?.id).toBe("core");
    await expect(readPacks(root, ["one", "two"])).rejects.toThrow(
      "exactly one pack",
    );
    await save("extra", ["missing"]);
    await expect(readPacks(root, ["one"])).rejects.toThrow(
      "unknown calculator",
    );
    await save("extra", ["one"]);
    await expect(readPacks(root, ["one"])).rejects.toThrow(
      "duplicate membership",
    );
    await save("extra", ["two"]);
    expect(await readPacks(root, ["one", "two"])).toHaveLength(2);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
