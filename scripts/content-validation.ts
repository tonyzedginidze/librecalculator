type TopicMetadata = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  searchKeys: readonly string[];
};
type ContentBlock = Record<string, unknown> & { id: string; kind: string };
type TopicLesson = { calculatorId: string; blocks: readonly ContentBlock[] };
type OperationDescriptor = {
  id: string;
  labelKey: string;
  fields: readonly {
    id: string;
    labelKey: string;
    input?: string;
    defaultValue?: string;
    choices?: readonly { id: string; labelKey: string }[];
  }[];
  working: readonly {
    messageKey: string;
    arguments: Readonly<Record<string, string>>;
  }[];
};

export function validateContent(input: {
  catalog: readonly TopicMetadata[];
  schemas: Readonly<
    Record<
      string,
      {
        version: number;
        operations: Readonly<Record<string, readonly string[]>>;
      }
    >
  >;
  lessons: Readonly<Record<string, TopicLesson>>;
  topicMessages: Readonly<Record<string, Readonly<Record<string, string>>>>;
  operations: Readonly<Record<string, readonly OperationDescriptor[]>>;
  errorCodes: Readonly<Record<string, readonly string[]>>;
  catalogMessages: Readonly<Record<string, string>>;
}): string[] {
  const errors: string[] = [];
  const ids = new Set(input.catalog.map(({ id }) => id));
  const keyExists = (id: string, key: unknown) => {
    if (typeof key !== "string") return false;
    const value = input.catalogMessages[key] ?? input.topicMessages[id]?.[key];
    return typeof value === "string" && value.length > 0;
  };
  for (const topic of input.catalog) {
    const { id } = topic;
    for (const key of [
      topic.titleKey,
      topic.descriptionKey,
      ...topic.searchKeys,
    ])
      if (!(key in input.catalogMessages))
        errors.push(`${id}: missing catalog message ${key}`);
    const lesson = input.lessons[id];
    const messages = input.topicMessages[id];
    const operations = input.operations[id];
    const schemaOperations = input.schemas[id]?.operations;
    if (!operations) errors.push(`${id}: missing operation descriptors`);
    else if (!schemaOperations)
      errors.push(`${id}: missing generated input schema`);
    else {
      const schemaOperationIds = Object.keys(schemaOperations).sort();
      const descriptorOperationIds = operations
        .map(({ id: operationId }) => operationId)
        .sort();
      if (
        new Set(descriptorOperationIds).size !== descriptorOperationIds.length
      )
        errors.push(`${id}: duplicate engine operation descriptor ID`);
      if (schemaOperationIds.join("|") !== descriptorOperationIds.join("|"))
        errors.push(
          `${id}: engine operation IDs [${descriptorOperationIds.join(",")}] do not match generated schema [${schemaOperationIds.join(",")}]`,
        );
      for (const operation of operations) {
        const schemaFields = schemaOperations[operation.id];
        const descriptorFieldIds = operation.fields
          .map(({ id: fieldId }) => fieldId)
          .sort();
        if (
          !schemaFields ||
          [...schemaFields].sort().join("|") !== descriptorFieldIds.join("|")
        )
          errors.push(
            `${id}: operation ${operation.id} engine fields [${descriptorFieldIds.join(",")}] do not match generated schema fields [${schemaFields ? [...schemaFields].sort().join(",") : "<missing operation>"}]`,
          );
        if (new Set(descriptorFieldIds).size !== descriptorFieldIds.length)
          errors.push(
            `${id}: operation ${operation.id} has duplicate engine field descriptor IDs`,
          );
        if (!keyExists(id, operation.labelKey))
          errors.push(
            `${id}: missing operation translation ${operation.labelKey}`,
          );
        for (const field of operation.fields) {
          if (!keyExists(id, field.labelKey))
            errors.push(`${id}: missing field translation ${field.labelKey}`);
          if (field.input === "choice") {
            const choices = field.choices;
            if (!choices?.length) {
              errors.push(
                `${id}: choice field ${field.id} must declare choices`,
              );
              continue;
            }
            const choiceIds = new Set<string>();
            for (const choice of choices) {
              if (
                typeof choice.id !== "string" ||
                !/^[a-z][a-z0-9-]*$/.test(choice.id) ||
                choiceIds.has(choice.id)
              )
                errors.push(
                  `${id}: choice field ${field.id} has an invalid or duplicate choice ID ${choice.id}`,
                );
              choiceIds.add(choice.id);
              if (!keyExists(id, choice.labelKey))
                errors.push(
                  `${id}: missing choice translation ${choice.labelKey}`,
                );
            }
            if (!choiceIds.has(field.defaultValue ?? ""))
              errors.push(
                `${id}: choice field ${field.id} default must be a supported choice ID`,
              );
          } else if (field.choices !== undefined) {
            errors.push(
              `${id}: non-choice field ${field.id} must not declare choices`,
            );
          }
        }
        for (const working of operation.working) {
          if (!keyExists(id, working.messageKey))
            errors.push(
              `${id}: missing working translation ${working.messageKey}`,
            );
          const template =
            input.topicMessages[id]?.[working.messageKey] ??
            input.catalogMessages[working.messageKey];
          if (template) {
            const placeholders = [
              ...template.matchAll(/\{([A-Za-z][A-Za-z0-9_.-]*)\}/g),
            ].map((match) => match[1] ?? "");
            const placeholderNames = [...new Set(placeholders)].sort();
            const argumentNames = Object.keys(working.arguments).sort();
            if (placeholderNames.join("|") !== argumentNames.join("|"))
              errors.push(
                `${id}: working template ${working.messageKey} placeholders [${placeholderNames.join(",")}] do not match typed arguments [${argumentNames.join(",")}]`,
              );
            if (
              Object.values(working.arguments).some(
                (kind) =>
                  !["decimal", "text", "message", "reference"].includes(kind),
              )
            )
              errors.push(
                `${id}: working template ${working.messageKey} has an unknown argument kind`,
              );
          }
        }
      }
    }
    for (const code of input.errorCodes[id] ?? [])
      if (!keyExists(id, `${id}.error.${code}`))
        errors.push(`${id}: missing error translation ${id}.error.${code}`);
    if (!lesson) {
      errors.push(`${id}: missing lesson module`);
      continue;
    }
    if (!messages) {
      errors.push(`${id}: missing topic message bundle`);
      continue;
    }
    if (lesson.calculatorId !== id)
      errors.push(`${id}: lesson calculatorId mismatch`);
    const seen = new Set<string>();
    for (const block of lesson.blocks) {
      if (
        typeof block.id !== "string" ||
        !/^[a-z][a-z0-9-]*$/.test(block.id) ||
        seen.has(block.id)
      )
        errors.push(
          `${id}: invalid or duplicate lesson block ID ${String(block.id)}`,
        );
      seen.add(block.id);
      const reference = (key: unknown, label: string) => {
        if (!keyExists(id, key))
          errors.push(
            `${id}/${block.id}: missing ${label} translation ${String(key)}`,
          );
      };
      switch (block.kind) {
        case "prose":
          if (block.titleKey !== undefined) reference(block.titleKey, "title");
          reference(block.bodyKey, "body");
          break;
        case "formula":
          reference(block.bodyKey, "formula");
          if (!Array.isArray(block.variables) || block.variables.length === 0)
            errors.push(`${id}/${block.id}: formula must document variables`);
          else {
            const symbols = new Set<string>();
            for (const item of block.variables as unknown[]) {
              if (!item || typeof item !== "object" || Array.isArray(item)) {
                errors.push(
                  `${id}/${block.id}: invalid formula variable descriptor`,
                );
                continue;
              }
              const variable = item as Record<string, unknown>;
              if (
                typeof variable.symbol !== "string" ||
                !variable.symbol.trim() ||
                symbols.has(variable.symbol)
              )
                errors.push(
                  `${id}/${block.id}: missing or duplicate formula variable symbol`,
                );
              if (typeof variable.symbol === "string")
                symbols.add(variable.symbol);
              reference(variable.nameKey, "variable");
              if (variable.unitKey !== undefined)
                reference(variable.unitKey, "unit");
            }
          }
          break;
        case "example": {
          reference(block.titleKey, "example title");
          reference(block.workingKey, "working");
          const schema = input.schemas[id]?.operations[String(block.operation)];
          if (!schema)
            errors.push(
              `${id}/${block.id}: unknown operation ${String(block.operation)}`,
            );
          else if (
            !block.inputs ||
            typeof block.inputs !== "object" ||
            Array.isArray(block.inputs) ||
            Object.keys(block.inputs).sort().join("|") !==
              [...schema].sort().join("|")
          )
            errors.push(
              `${id}/${block.id}: example inputs do not match operation schema`,
            );
          else if (
            Object.values(block.inputs).some(
              (value) => typeof value !== "string" || value.length === 0,
            )
          )
            errors.push(
              `${id}/${block.id}: example inputs must be canonical strings`,
            );
          if (typeof block.expected !== "string")
            errors.push(`${id}/${block.id}: missing canonical expected answer`);
          break;
        }
        case "faq":
          reference(block.questionKey, "question");
          reference(block.answerKey, "answer");
          break;
        case "visual":
          reference(block.visualKey, "visual");
          reference(block.alternativeKey, "visual alternative");
          break;
        case "related":
          if (
            typeof block.calculatorId !== "string" ||
            !ids.has(block.calculatorId)
          )
            errors.push(
              `${id}/${block.id}: unknown related calculator ${String(block.calculatorId)}`,
            );
          break;
        default:
          errors.push(`${id}/${block.id}: unknown block kind ${block.kind}`);
      }
    }
  }
  for (const id of Object.keys(input.lessons))
    if (!ids.has(id))
      errors.push(`${id}: lesson has no calculator catalog entry`);
  for (const id of Object.keys(input.topicMessages))
    if (!ids.has(id))
      errors.push(`${id}: messages have no calculator catalog entry`);
  return errors;
}

export type LocaleCatalogs = {
  ui: Readonly<Record<string, string>>;
  catalog: Readonly<Record<string, string>>;
  topics: Readonly<Record<string, Readonly<Record<string, string>>>>;
};

/** Reports every key the default locale defines that another supported locale lacks. */
export function checkLocaleCoverage(input: {
  defaultLocale: string;
  supportedLocales: readonly string[];
  catalogs: Readonly<Record<string, LocaleCatalogs | undefined>>;
}): string[] {
  const errors: string[] = [];
  const reference = input.catalogs[input.defaultLocale];
  if (!reference)
    return [`default locale ${input.defaultLocale} has no catalog`];
  for (const locale of input.supportedLocales) {
    if (locale === input.defaultLocale) continue;
    const own = input.catalogs[locale];
    if (!own) {
      errors.push(`${locale}: supported locale has no catalog`);
      continue;
    }
    const missing = (label: string, from: object, to: object) => {
      for (const key of Object.keys(from))
        if (!Object.hasOwn(to, key))
          errors.push(`${locale}: missing ${label} message ${key}`);
    };
    missing("ui", reference.ui, own.ui);
    missing("catalog", reference.catalog, own.catalog);
    for (const [id, messages] of Object.entries(reference.topics))
      missing(`topic ${id}`, messages, own.topics[id] ?? {});
  }
  return errors;
}

const literalAttribute = /\s(aria-label|placeholder|alt|title)="[A-Za-z]/;

/** Flags user-facing attributes written as English literals instead of i18n keys. */
export function findHardcodedUiStrings(
  files: readonly { path: string; source: string }[],
): string[] {
  const errors: string[] = [];
  for (const { path, source } of files)
    source.split("\n").forEach((line, index) => {
      if (literalAttribute.test(line))
        errors.push(
          `${path}:${index + 1}: hardcoded UI string, move it into i18n (${line.trim().slice(0, 80)})`,
        );
    });
  return errors;
}
