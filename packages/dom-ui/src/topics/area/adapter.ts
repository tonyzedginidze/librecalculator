import {
  type AreaErrorCode,
  type AreaInput,
  type AreaResult,
  calculate,
  operations,
} from "../../../../calculators/src/area/index";
import type {
  CalculationResult,
  FieldDescriptor,
} from "../../../../calculators/src/contracts";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter, TopicFieldParse } from "../../topic";

export function areaInput(
  operation: string,
  fields: Readonly<Record<string, string>>,
): AreaInput | null {
  if (operation === "rectangle") {
    const width = fields.width;
    const height = fields.height;
    if (width === undefined || height === undefined) return null;
    return { operation: "rectangle", width, height };
  }
  if (operation === "triangle") {
    const base = fields.base;
    const height = fields.height;
    if (base === undefined || height === undefined) return null;
    return { operation: "triangle", base, height };
  }
  if (operation === "circle") {
    const radius = fields.radius;
    if (radius === undefined) return null;
    return { operation: "circle", radius };
  }
  return null;
}

export const adapter: TopicAdapter<AreaResult, AreaErrorCode> = {
  id: "area",
  schemaVersion: 1,
  descriptors: operations,
  parseField(
    raw: string,
    locale: string,
    _field: FieldDescriptor,
  ): TopicFieldParse {
    return parseLocaleDecimal(raw, locale);
  },
  calculate(
    operationId: string,
    fields: Record<string, string>,
  ): CalculationResult<AreaResult, AreaErrorCode> {
    const input = areaInput(operationId, fields);
    if (!input) {
      return {
        ok: false,
        error: { code: "invalid-field" },
      };
    }
    return calculate(input);
  },
};
