import { expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

test("shared engine boundary excludes UI, Intl, and persistence APIs", async () => {
  const source = await readFile(
    new URL("../packages/calculators/src/percentage/index.ts", import.meta.url),
    "utf8",
  );
  expect(source).not.toMatch(
    /react|Intl|localStorage|sessionStorage|Decimal\.toLocaleString/i,
  );
  expect(source).not.toContain('from "decimal.js"');
  const publicIndex = await readFile(
    new URL("../packages/calculators/src/index.ts", import.meta.url),
    "utf8",
  );
  expect(publicIndex).not.toContain("numeric/decimal");
});

test("catalog remains metadata-only and engines are literal lazy imports", async () => {
  const catalog = await readFile(
    new URL(
      "../packages/calculators/src/catalog.generated.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const imports = await readFile(
    new URL(
      "../packages/calculators/src/engine-imports.generated.ts",
      import.meta.url,
    ),
    "utf8",
  );
  expect(catalog).not.toMatch(/import\s*\(/);
  expect(imports).toContain('"percentage": () => import("./percentage/index")');
  const messages = await readFile(
    new URL("../packages/i18n/src/topics/index.generated.ts", import.meta.url),
    "utf8",
  );
  const lessons = await readFile(
    new URL("../packages/content/src/lessons.generated.ts", import.meta.url),
    "utf8",
  );
  expect(messages).toContain('"percentage": () => import("./percentage")');
  expect(lessons).toContain('"percentage": () => import("./percentage/index")');
  expect(catalog).not.toMatch(/lesson|working|visual/);
});
