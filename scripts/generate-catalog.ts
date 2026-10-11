import { access, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { readPacks } from "./pack-manifests";

type Metadata = {
  id: string;
  slug: string;
  category: string;
  titleKey: string;
  descriptionKey: string;
  searchKeys: string[];
  inputSchemaVersion: number;
  operations: Record<string, string[]>;
};
export type GeneratedOutput = { path: string; content: string };

function requireString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0)
    throw new Error(`${label} must be a non-empty string`);
}

function validateMetadata(value: unknown, filename: string): Metadata {
  if (!value || typeof value !== "object")
    throw new Error(`${filename}: metadata must be an object`);
  const meta = value as Partial<Metadata>;
  const {
    id,
    slug,
    category,
    titleKey,
    descriptionKey,
    inputSchemaVersion,
    operations,
  } = meta;
  for (const [key, field] of Object.entries({
    id,
    slug,
    category,
    titleKey,
    descriptionKey,
  }))
    requireString(field, `${filename}: ${key}`);
  if (
    !/^[a-z][a-z0-9-]*$/.test(id as string) ||
    !/^[a-z][a-z0-9-]*$/.test(slug as string)
  )
    throw new Error(
      `${filename}: id and slug must be lowercase stable identifiers`,
    );
  if (
    !Array.isArray(meta.searchKeys) ||
    !meta.searchKeys.length ||
    !meta.searchKeys.every((key) => typeof key === "string" && key.length > 0)
  )
    throw new Error(`${filename}: searchKeys must be non-empty strings`);
  if (!Number.isInteger(inputSchemaVersion) || Number(inputSchemaVersion) < 1)
    throw new Error(
      `${filename}: inputSchemaVersion must be a positive integer`,
    );
  if (
    !operations ||
    typeof operations !== "object" ||
    !Object.keys(operations).length
  )
    throw new Error(`${filename}: operations must be a non-empty object`);
  for (const [operation, fields] of Object.entries(operations)) {
    if (
      !/^[a-z][a-z0-9-]*$/.test(operation) ||
      !Array.isArray(fields) ||
      fields.length === 0 ||
      !fields.every(
        (field) =>
          typeof field === "string" && /^[a-z][a-zA-Z0-9]*$/.test(field),
      )
    )
      throw new Error(`${filename}: invalid schema for operation ${operation}`);
    if (new Set(fields).size !== fields.length)
      throw new Error(`${filename}: duplicate field in operation ${operation}`);
  }
  return meta as Metadata;
}

export async function buildCatalog(
  calculatorsRoot: string,
  contentRoot: string,
  topicMessagesRoot: string,
  packsRoot?: string,
): Promise<GeneratedOutput[]> {
  const entries = await readdir(calculatorsRoot, { withFileTypes: true });
  const markers = entries
    .filter((entry) => entry.isDirectory())
    .map(({ name }) => join(calculatorsRoot, name, "metadata.json"));
  const metadata: Metadata[] = [];
  for (const marker of markers) {
    const source = await readFile(marker, "utf8").catch(() => null);
    if (source === null) continue;
    const parsed = validateMetadata(JSON.parse(source) as unknown, marker);
    const directory = join(calculatorsRoot, parsed.id);
    if (marker !== join(directory, "metadata.json"))
      throw new Error(
        `${marker}: directory name must match metadata ID ${parsed.id}`,
      );
    for (const required of [
      join(directory, "index.ts"),
      join(contentRoot, parsed.id, "index.ts"),
      join(topicMessagesRoot, `${parsed.id}.ts`),
    ]) {
      await access(required).catch(() => {
        throw new Error(`${parsed.id}: missing required module ${required}`);
      });
    }
    metadata.push(parsed);
  }
  metadata.sort((a, b) => a.id.localeCompare(b.id));
  for (const [label, values] of [
    ["ID", metadata.map((item) => item.id)],
    ["slug", metadata.map((item) => item.slug)],
  ] as const) {
    if (new Set(values).size !== values.length)
      throw new Error(`Duplicate calculator ${label}`);
  }
  if (!metadata.length)
    throw new Error(
      `No metadata.json calculator markers found in ${calculatorsRoot}`,
    );
  const ids = new Set(metadata.map(({ id }) => id));
  const contentDirectories = (
    await readdir(contentRoot, { withFileTypes: true })
  )
    .filter((entry) => entry.isDirectory())
    .map(({ name }) => name);
  for (const id of contentDirectories)
    if (!ids.has(id))
      throw new Error(
        `Content directory ${id} has no calculator metadata marker`,
      );
  const topicFiles = (await readdir(topicMessagesRoot, { withFileTypes: true }))
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".ts") &&
        !entry.name.endsWith(".generated.ts"),
    )
    .map(({ name }) => name.slice(0, -3));
  for (const id of topicFiles)
    if (!ids.has(id))
      throw new Error(
        `Topic message file ${id}.ts has no calculator metadata marker`,
      );
  const idImports = (target: string) =>
    metadata
      .map(
        ({ id }) =>
          `  ${JSON.stringify(id)}: () => import("./${id}/${target}"),`,
      )
      .join("\n");
  const catalog = `// Generated by scripts/generate-catalog.ts. Do not edit by hand.\nexport const calculatorCatalog = ${JSON.stringify(
    metadata.map(
      ({ operations: _ops, inputSchemaVersion: _version, ...item }) => item,
    ),
    null,
    2,
  )} as const;\nexport const inputSchemas = ${JSON.stringify(Object.fromEntries(metadata.map(({ id, inputSchemaVersion, operations }) => [id, { version: inputSchemaVersion, operations }])), null, 2)} as const;\nexport type CalculatorId = keyof typeof inputSchemas;\n`;
  const engines = `// Generated literal lazy imports; discovery never imports engines.\nexport const engineImports = {\n${idImports("index")}\n} as const;\n`;
  const lessons = `// Generated literal lazy imports; search/catalog do not load lesson content.\nexport const lessonImports = {\n${idImports("index")}\n} as const;\n`;
  const topics = `// Generated literal lazy imports; UI labels/lesson prose are topic-loaded.\nexport const topicMessageImports = {\n${metadata.map(({ id }) => `  ${JSON.stringify(id)}: () => import("./${id}"),`).join("\n")}\n} as const;\n`;
  const outputs = [
    { path: join(calculatorsRoot, "catalog.generated.ts"), content: catalog },
    {
      path: join(calculatorsRoot, "engine-imports.generated.ts"),
      content: engines,
    },
    { path: join(contentRoot, "lessons.generated.ts"), content: lessons },
    { path: join(topicMessagesRoot, "index.generated.ts"), content: topics },
  ];
  if (packsRoot) {
    const packs = await readPacks(
      packsRoot,
      metadata.map(({ id }) => id),
    );
    outputs.push({
      path: join(calculatorsRoot, "packs.generated.ts"),
      content: `// Generated pack metadata. No engines or lessons are imported.\nexport const packCatalog = ${JSON.stringify(packs, null, 2)} as const;\nexport type PackId = (typeof packCatalog)[number]["id"];\nexport const calculatorPacks = ${JSON.stringify(Object.fromEntries(packs.flatMap((pack) => pack.calculatorIds.map((id) => [id, pack.id]))), null, 2)} as const;\n`,
    });
  }
  return outputs;
}

if (import.meta.main) {
  const base = join(import.meta.dir, "..");
  const outputs = await buildCatalog(
    join(base, "packages/calculators/src"),
    join(base, "packages/content/src"),
    join(base, "packages/i18n/src/topics"),
    join(base, "packs"),
  );
  let stale = false;
  for (const { path, content } of outputs) {
    if (process.argv.includes("--check")) {
      if ((await readFile(path, "utf8").catch(() => "")) !== content) {
        console.error(`Stale generated file: ${path}`);
        stale = true;
      }
    } else await writeFile(path, content);
  }
  if (stale) process.exitCode = 1;
}
