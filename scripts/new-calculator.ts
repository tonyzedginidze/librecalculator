import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Scaffolds a calculator by cloning the `percentage` reference topic across
 * calculators, content, i18n and dom-ui, then adding base catalog labels.
 * The clone compiles and passes the generators; replace its engine, lesson
 * and view with real ones. Usage: bun scripts/new-calculator.ts <id> [category]
 */
const TEMPLATE = "percentage";
const root = join(import.meta.dir, "..");
const dirs = [
  "packages/calculators/src",
  "packages/content/src",
  "packages/dom-ui/src/topics",
];

const [id, category = "math"] = process.argv.slice(2);
if (!id || !/^[a-z][a-z0-9-]*$/.test(id)) {
  console.error("Usage: bun scripts/new-calculator.ts <kebab-id> [category]");
  process.exit(1);
}
const pascal = id.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase());
const camel = pascal[0]?.toLowerCase() + pascal.slice(1);

// Rewrite only identifier, path and message-key uses of the template id.
// Domain words (field names, prose) such as "percentage" are left untouched.
const swap = (text: string) =>
  text
    .replace(/Percentage(?=[A-Z])/g, pascal)
    .replace(/percentage(?=Adapter|Input)/g, camel)
    .replace(/(?<=\b(?:calculator|lesson)\.)percentage(?=\.)/g, id)
    .replace(/(?<=")percentage(?=\.[a-z])/g, id)
    .replace(/(?<=\/)percentage(?=["/])/g, id)
    .replace(/\b(slug|calculatorId)(["']?: ?)"percentage"/g, `$1$2"${id}"`)
    .replace(/"id": "percentage"/g, `"id": "${id}"`)
    .replace(/\bid: "percentage",(\s+schemaVersion)/g, `id: "${id}",$1`);

async function copyTree(from: string, to: string) {
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from, { withFileTypes: true })) {
    const src = join(from, entry.name);
    const dest = join(to, entry.name);
    if (entry.isDirectory()) await copyTree(src, dest);
    else await writeFile(dest, swap(await readFile(src, "utf8")));
  }
}

for (const dir of dirs) {
  const target = join(root, dir, id);
  if (existsSync(target)) {
    console.error(`Already exists: ${dir}/${id}`);
    process.exit(1);
  }
}
const i18nFile = join(root, "packages/i18n/src/topics", `${id}.ts`);
if (existsSync(i18nFile)) {
  console.error(`Already exists: packages/i18n/src/topics/${id}.ts`);
  process.exit(1);
}

for (const dir of dirs)
  await copyTree(join(root, dir, TEMPLATE), join(root, dir, id));
await writeFile(
  i18nFile,
  swap(
    await readFile(
      join(root, "packages/i18n/src/topics", `${TEMPLATE}.ts`),
      "utf8",
    ),
  ),
);

const metaPath = join(root, "packages/calculators/src", id, "metadata.json");
const meta = JSON.parse(await readFile(metaPath, "utf8"));
meta.category = category;
await writeFile(metaPath, `${JSON.stringify(meta, null, 2)}\n`);

const enPath = join(root, "packages/i18n/src/en.ts");
const en = await readFile(enPath, "utf8");
const label = id.replace(/-/g, " ");
const keys = `  "calculator.${id}.title": "${label.charAt(0).toUpperCase()}${label.slice(1)} calculator",
  "calculator.${id}.description": "TODO: describe the ${label} calculator.",
  "calculator.${id}.search": "${label}",
`;
await writeFile(enPath, en.replace("\n} as const;", `\n${keys}} as const;`));

console.log(`Scaffolded "${id}" (${category}). Next:
  1. rewrite engine, tests, lesson, i18n topic messages and view (cloned from ${TEMPLATE})
  2. bun run generate && bun run generate:web-topics
  3. bun run check:generated check:web-topics content-check test typecheck lint`);
