import type {
  CalculationResult,
  FieldDescriptor,
} from "../../../../calculators/src/contracts";
import {
  calculate,
  operations,
  type PercentageErrorCode,
  type PercentageInput,
  type PercentageResult,
} from "../../../../calculators/src/percentage/index";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter, TopicFieldParse } from "../../topic";

export function percentageInput(
  operation: string,
  fields: Readonly<Record<string, string>>,
): PercentageInput | null {
  if (operation === "of-value") {
    const value = fields.value;
    const percentage = fields.percentage;
    if (value === undefined || percentage === undefined) return null;
    return { operation: "of-value", value, percentage };
  }
  if (operation === "ratio") {
    const part = fields.part;
    const whole = fields.whole;
    if (part === undefined || whole === undefined) return null;
    return { operation: "ratio", part, whole };
  }
  return null;
}

export const adapter: TopicAdapter<PercentageResult, PercentageErrorCode> = {
  id: "percentage",
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
  ): CalculationResult<PercentageResult, PercentageErrorCode> {
    const input = percentageInput(operationId, fields);
    if (!input) {
      return {
        ok: false,
        error: { code: "invalid-field" },
      };
    }
    return calculate(input);
  },
};
