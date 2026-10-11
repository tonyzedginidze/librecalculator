import { describe, expect, test } from "bun:test";
import {
  errorCodes,
  operations,
} from "../packages/calculators/src/unit-conversion/index";
import { lesson } from "../packages/content/src/unit-conversion/index";
import { messages } from "../packages/i18n/src/topics/unit-conversion";
import {
  checkLocaleCoverage,
  findHardcodedUiStrings,
  validateContent,
} from "./content-validation";

function validate(
  defaultValue: string,
  choiceIds = ["m", "ft"],
  omitChoiceLabel = false,
) {
  const choices = choiceIds.map((id) => ({ id, labelKey: `unit.${id}` }));
  return validateContent({
    catalog: [
      {
        id: "units",
        titleKey: "title",
        descriptionKey: "description",
        searchKeys: ["search"],
      },
    ],
    schemas: { units: { version: 1, operations: { convert: ["source"] } } },
    lessons: { units: { calculatorId: "units", blocks: [] } },
    topicMessages: {
      units: { "units.operation": "Convert", "units.field": "Source" },
    },
    operations: {
      units: [
        {
          id: "convert",
          labelKey: "units.operation",
          fields: [
            {
              id: "source",
              labelKey: "units.field",
              input: "choice",
              defaultValue,
              choices,
            },
          ],
          working: [],
        },
      ],
    },
    errorCodes: {},
    catalogMessages: {
      title: "Title",
      description: "Description",
      search: "Search",
      ...Object.fromEntries(
        choices
          .filter((_, index) => !(omitChoiceLabel && index === 0))
          .map(({ labelKey }) => [labelKey, labelKey]),
      ),
    },
  });
}

describe("choice-field content contract", () => {
  test("unit-conversion descriptors, lesson examples, and translations agree", () => {
    expect(
      validateContent({
        catalog: [
          {
            id: "unit-conversion",
            titleKey: "calculator.unit-conversion.title",
            descriptionKey: "calculator.unit-conversion.description",
            searchKeys: ["calculator.unit-conversion.search"],
          },
        ],
        schemas: {
          "unit-conversion": {
            version: 1,
            operations: { convert: ["value", "source", "target"] },
          },
        },
        lessons: { "unit-conversion": lesson },
        topicMessages: { "unit-conversion": messages },
        operations: { "unit-conversion": operations },
        errorCodes: { "unit-conversion": errorCodes },
        catalogMessages: {
          "calculator.unit-conversion.title": "Unit conversion",
          "calculator.unit-conversion.description": "Convert units",
          "calculator.unit-conversion.search": "Units",
        },
      }),
    ).toEqual([]);
  });

  test("accepts stable unique choice IDs with translated labels and supported default", () => {
    expect(validate("m")).toEqual([]);
  });

  test("rejects unsupported defaults, duplicate IDs, and malformed IDs", () => {
    expect(
      validate("cm").some((error) =>
        error.includes("default must be a supported choice ID"),
      ),
    ).toBe(true);
    expect(
      validate("m", ["m", "m"]).some((error) =>
        error.includes("invalid or duplicate choice ID"),
      ),
    ).toBe(true);
    expect(
      validate("m", ["M"]).some((error) =>
        error.includes("invalid or duplicate choice ID"),
      ),
    ).toBe(true);
  });

  test("requires a nonempty set of choices and each translated label", () => {
    expect(
      validate("m", []).some((error) => error.includes("must declare choices")),
    ).toBe(true);
    expect(
      validate("m", ["m", "ft"], true).some((error) =>
        error.includes("missing choice translation unit.m"),
      ),
    ).toBe(true);
  });
});

describe("locale coverage", () => {
  const en = {
    ui: { "ui.a": "A" },
    catalog: { "calculator.x.title": "X" },
    topics: { x: { "x.field": "F" } },
  };
  test("passes with only the default locale", () => {
    expect(
      checkLocaleCoverage({
        defaultLocale: "en",
        supportedLocales: ["en"],
        catalogs: { en },
      }),
    ).toEqual([]);
  });
  test("reports missing keys and missing catalogs per locale", () => {
    const errors = checkLocaleCoverage({
      defaultLocale: "en",
      supportedLocales: ["en", "fr", "de"],
      catalogs: {
        en,
        fr: { ui: {}, catalog: en.catalog, topics: { x: {} } },
      },
    });
    expect(errors).toContain("fr: missing ui message ui.a");
    expect(errors).toContain("fr: missing topic x message x.field");
    expect(errors).toContain("de: supported locale has no catalog");
    expect(errors.some((error) => error.includes("catalog message"))).toBe(
      false,
    );
  });
});

describe("hardcoded UI strings", () => {
  test("flags literal aria-label, placeholder, title and alt text", () => {
    const errors = findHardcodedUiStrings([
      {
        path: "a.tsx",
        source:
          '<input placeholder="Search" />\n<b aria-label={ui["x"]} />\n<kbd title="Hi" />',
      },
    ]);
    expect(errors).toHaveLength(2);
    expect(errors[0]).toContain("a.tsx:1");
    expect(errors[1]).toContain("a.tsx:3");
  });
});
