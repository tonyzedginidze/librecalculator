import type {
  CalculationResult,
  FieldDescriptor,
} from "../../../../calculators/src/contracts";
import {
  calculate,
  operations,
  type PercentageChangeErrorCode,
  type PercentageChangeInput,
  type PercentageChangeResult,
} from "../../../../calculators/src/percentage-change/index";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter, TopicFieldParse } from "../../topic";

export function percentageChangeInput(
  operation: string,
  fields: Readonly<Record<string, string>>,
): PercentageChangeInput | null {
  if (operation === "change") {
    const oldValue = fields.oldValue;
    const newValue = fields.newValue;
    if (oldValue === undefined || newValue === undefined) return null;
    return { operation: "change", oldValue, newValue };
  }
  return null;
}

export const adapter: TopicAdapter<
  PercentageChangeResult,
  PercentageChangeErrorCode
> = {
  id: "percentage-change",
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
  ): CalculationResult<PercentageChangeResult, PercentageChangeErrorCode> {
    const input = percentageChangeInput(operationId, fields);
    if (!input) {
      return {
        ok: false,
        error: { code: "invalid-field" },
      };
    }
    return calculate(input);
  },
};
