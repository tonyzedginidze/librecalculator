import { expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateContent } from "./content-validation";
import { buildCatalog } from "./generate-catalog";

test("two-topic marker fixture generates lazy maps and validates each lesson/message bundle", async () => {
  const root = await mkdtemp(join(tmpdir(), "calculator-catalog-"));
  const calculators = join(root, "calculators");
  const content = join(root, "content");
  const messages = join(root, "messages");
  try {
    for (const [id, slug, operation, field] of [
      ["first", "first-topic", "solve", "input"],
      ["second", "second-topic", "compute", "amount"],
    ] as const) {
      await mkdir(join(calculators, id), { recursive: true });
      await mkdir(join(content, id), { recursive: true });
      await mkdir(messages, { recursive: true });
      await writeFile(
        join(calculators, id, "metadata.json"),
        JSON.stringify({
          id,
          slug,
          category: "test",
          titleKey: `${id}.title`,
          descriptionKey: `${id}.description`,
          searchKeys: [`${id}.title`],
          inputSchemaVersion: 1,
          operations: { [operation]: [field] },
        }),
      );
      await writeFile(join(calculators, id, "index.ts"), "export {};");
      await writeFile(join(content, id, "index.ts"), "export {};");
      await writeFile(join(messages, `${id}.ts`), "export {};");
    }
    const outputs = await buildCatalog(calculators, content, messages);
    expect(outputs).toHaveLength(4);
    const engineMap =
      outputs.find(({ path }) => path.endsWith("engine-imports.generated.ts"))
        ?.content ?? "";
    const lessonMap =
      outputs.find(({ path }) => path.endsWith("lessons.generated.ts"))
        ?.content ?? "";
    const topicMap =
      outputs.find(({ path }) => path.endsWith("index.generated.ts"))
        ?.content ?? "";
    expect(engineMap).toContain('"first": () => import("./first/index")');
    expect(engineMap).toContain('"second": () => import("./second/index")');
    expect(lessonMap).toContain('"first": () => import("./first/index")');
    expect(topicMap).toContain('"second": () => import("./second")');
    const schemas = {
      first: { version: 1, operations: { solve: ["input"] } },
      second: { version: 1, operations: { compute: ["amount"] } },
    };
    const catalog = [
      {
        id: "first",
        titleKey: "first.title",
        descriptionKey: "first.description",
        searchKeys: ["first.title"],
      },
      {
        id: "second",
        titleKey: "second.title",
        descriptionKey: "second.description",
        searchKeys: ["second.title"],
      },
    ];
    const lessons = Object.fromEntries(
      ["first", "second"].map((id) => {
        const operation = id === "first" ? "solve" : "compute";
        const field = id === "first" ? "input" : "amount";
        return [
          id,
          {
            calculatorId: id,
            blocks: [
              {
                id: "formula",
                kind: "formula",
                bodyKey: `${id}.formula`,
                variables: [{ symbol: "x", nameKey: `${id}.variable` }],
              },
              {
                id: "example",
                kind: "example",
                operation,
                inputs: { [field]: "1" },
                expected: "1",
                titleKey: `${id}.example`,
                workingKey: `${id}.working`,
              },
              {
                id: "related",
                kind: "related",
                calculatorId: id === "first" ? "second" : "first",
              },
            ],
          },
        ];
      }),
    );
    const topicMessages = Object.fromEntries(
      ["first", "second"].map((id) => [
        id,
        Object.fromEntries(
          [
            "formula",
            "variable",
            "example",
            "working",
            "operation",
            "field",
            "error.invalid",
          ].map((part) => [
            `${id}.${part}`,
            part === "working" ? "{value}" : part,
          ]),
        ),
      ]),
    );
    const validationInput = {
      catalog,
      schemas,
      lessons,
      topicMessages,
      operations: {
        first: [
          {
            id: "solve",
            labelKey: "first.operation",
            fields: [{ id: "input", labelKey: "first.field" }],
            working: [
              { messageKey: "first.working", arguments: { value: "decimal" } },
            ],
          },
        ],
        second: [
          {
            id: "compute",
            labelKey: "second.operation",
            fields: [{ id: "amount", labelKey: "second.field" }],
            working: [
              { messageKey: "second.working", arguments: { value: "decimal" } },
            ],
          },
        ],
      },
      errorCodes: { first: ["invalid"], second: ["invalid"] },
      catalogMessages: {
        "first.title": "First",
        "first.description": "First",
        "second.title": "Second",
        "second.description": "Second",
      },
    };
    expect(validateContent(validationInput)).toEqual([]);
    const firstOperation = validationInput.operations.first[0];
    if (!firstOperation) throw new Error("Expected first fixture operation");
    const mismatchedWorking = {
      ...validationInput,
      operations: {
        ...validationInput.operations,
        first: [
          {
            ...firstOperation,
            working: [
              {
                messageKey: "first.working",
                arguments: { wrong: "text" },
              },
            ],
          },
        ],
      },
    };
    expect(validateContent(mismatchedWorking)).toContain(
      "first: working template first.working placeholders [value] do not match typed arguments [wrong]",
    );
    const secondMessages = Object.fromEntries(
      Object.entries(topicMessages.second ?? {}).filter(
        ([key]) => key !== "second.working",
      ),
    );
    const incompleteMessages = { ...topicMessages, second: secondMessages };
    expect(
      validateContent({
        ...validationInput,
        topicMessages: incompleteMessages,
      }),
    ).toContain("second/example: missing working translation second.working");
    const firstMarkerPath = join(calculators, "first", "metadata.json");
    const firstMarker = JSON.parse(await readFile(firstMarkerPath, "utf8"));
    firstMarker.operations.solve = ["renamedField"];
    await writeFile(firstMarkerPath, JSON.stringify(firstMarker));
    const driftOutputs = await buildCatalog(calculators, content, messages);
    const generatedCatalog =
      driftOutputs.find(({ path }) => path.endsWith("catalog.generated.ts"))
        ?.content ?? "";
    const prefix = "export const inputSchemas = ";
    const schemaStart = generatedCatalog.indexOf(prefix) + prefix.length;
    const schemaEnd = generatedCatalog.indexOf(" as const;", schemaStart);
    const generatedSchemas = JSON.parse(
      generatedCatalog.slice(schemaStart, schemaEnd),
    );
    expect(
      validateContent({ ...validationInput, schemas: generatedSchemas }),
    ).toContain(
      "first: operation solve engine fields [input] do not match generated schema fields [renamedField]",
    );
    const duplicateSlug = await readFile(
      join(calculators, "second", "metadata.json"),
      "utf8",
    );
    await writeFile(
      join(calculators, "second", "metadata.json"),
      duplicateSlug.replace("second-topic", "first-topic"),
    );
    await expect(buildCatalog(calculators, content, messages)).rejects.toThrow(
      "Duplicate calculator slug",
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
