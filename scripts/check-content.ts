import {
  calculatorCatalog,
  inputSchemas,
} from "../packages/calculators/src/catalog.generated";
import { engineImports } from "../packages/calculators/src/engine-imports.generated";
import { packCatalog } from "../packages/calculators/src/packs.generated";
import { lessonImports } from "../packages/content/src/lessons.generated";
import {
  calculatorArtIds,
  operationIconIds,
} from "../packages/dom-ui/src/components/art";
import { en } from "../packages/i18n/src/en";
import { defaultLocale, supportedLocales } from "../packages/i18n/src/locales";
import { topicMessageImports } from "../packages/i18n/src/topics/index.generated";
import { ui } from "../packages/i18n/src/ui";
import {
  checkLocaleCoverage,
  findHardcodedUiStrings,
  validateContent,
} from "./content-validation";

const uiSources = [
  "packages/dom-ui/src/components/**/*.tsx",
  "packages/dom-ui/src/topics/**/view.tsx",
  "apps/desktop/src/shell/**/*.tsx",
  "apps/desktop/src/quick/**/*.tsx",
  "apps/web/src/layouts/**/*.astro",
  "apps/web/src/components/**/*.astro",
  "apps/web/src/pages/index.astro",
];
const sourceFiles = (
  await Promise.all(
    uiSources.map(async (pattern) => {
      const paths = [
        ...new Bun.Glob(pattern).scanSync({ cwd: `${import.meta.dir}/..` }),
      ];
      return Promise.all(
        paths.map(async (path) => ({
          path,
          source: await Bun.file(`${import.meta.dir}/../${path}`).text(),
        })),
      );
    }),
  )
).flat();

const [lessons, engines, topics] = await Promise.all([
  Promise.all(
    Object.entries(lessonImports).map(
      async ([id, load]) => [id, (await load()).lesson] as const,
    ),
  ),
  Promise.all(
    Object.entries(engineImports).map(async ([id, load]) => {
      const engine = await load();
      return [
        id,
        {
          operations: Object.values(engine.operationDescriptors),
          errorCodes: engine.errorCodes,
        },
      ] as const;
    }),
  ),
  Promise.all(
    Object.entries(topicMessageImports).map(
      async ([id, load]) => [id, (await load()).messages] as const,
    ),
  ),
]);
const errors = validateContent({
  catalog: calculatorCatalog,
  schemas: inputSchemas,
  lessons: Object.fromEntries(lessons),
  topicMessages: Object.fromEntries(topics),
  operations: Object.fromEntries(
    engines.map(([id, engine]) => [id, engine.operations]),
  ),
  errorCodes: Object.fromEntries(
    engines.map(([id, engine]) => [id, engine.errorCodes]),
  ),
  catalogMessages: en,
});
const packMessages: Readonly<Record<string, string>> = { ...en, ...ui };
for (const pack of packCatalog) {
  for (const key of [pack.titleKey, pack.descriptionKey])
    if (!packMessages[key])
      errors.push(`${pack.id}: missing pack message ${key}`);
}
for (const item of calculatorCatalog)
  if (!calculatorArtIds.has(item.id))
    errors.push(`${item.id}: missing custom tile art`);
for (const [id, engine] of engines)
  for (const operation of engine.operations)
    if (!operationIconIds.has(operation.id))
      errors.push(`${id}: missing operation icon ${operation.id}`);
errors.push(
  ...checkLocaleCoverage({
    defaultLocale,
    supportedLocales,
    catalogs: {
      [defaultLocale]: { ui, catalog: en, topics: Object.fromEntries(topics) },
    },
  }),
  ...findHardcodedUiStrings(sourceFiles),
);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Content, schemas, translations, stable IDs and links valid for ${calculatorCatalog.length} calculator(s).`,
  );
