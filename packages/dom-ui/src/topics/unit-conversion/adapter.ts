import type { FieldDescriptor } from "../../../../calculators/src/contracts";
import {
  calculate,
  operations,
  type UnitConversionErrorCode,
  type UnitConversionInput,
  type UnitConversionResult,
  units,
} from "../../../../calculators/src/unit-conversion/index";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter, TopicFieldParse } from "../../topic";

export function unitConversionInput(
  operation: string,
  fields: Readonly<Record<string, string>>,
): UnitConversionInput | null {
  if (operation === "convert") {
    const value = fields.value;
    const source = fields.source;
    const target = fields.target;
    if (value === undefined || source === undefined || target === undefined) {
      return null;
    }
    return { operation: "convert", value, source, target };
  }
  return null;
}

export function parseUnitField(
  raw: string,
  locale: string,
  field: FieldDescriptor,
): TopicFieldParse {
  if (field.input === "choice") {
    const isValid = units.some((u) => u.id === raw);
    if (isValid) {
      return { state: "valid", canonical: raw };
    }
    if (raw.trim() === "") {
      return { state: "incomplete" };
    }
    return { state: "invalid", reason: "invalid-choice" };
  }
  return parseLocaleDecimal(raw, locale);
}

export const adapter: TopicAdapter<
  UnitConversionResult,
  UnitConversionErrorCode
> = {
  id: "unit-conversion",
  schemaVersion: 1,
  descriptors: operations,
  parseField: parseUnitField,
  calculate(operationId: string, fields: Record<string, string>) {
    const input = unitConversionInput(operationId, fields);
    if (!input) {
      return {
        ok: false,
        error: { code: "invalid-field" },
      };
    }
    return calculate(input);
  },
};
