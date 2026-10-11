import type {
  CalculationResult,
  FieldDescriptor,
} from "../../../../calculators/src/contracts";
import {
  calculate,
  type DiscountErrorCode,
  type DiscountInput,
  type DiscountResult,
  operations,
} from "../../../../calculators/src/discount/index";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter, TopicFieldParse } from "../../topic";

export function discountInput(
  operation: string,
  fields: Readonly<Record<string, string>>,
): DiscountInput | null {
  if (operation === "sale-price") {
    const { original, discount } = fields;
    if (original === undefined || discount === undefined) return null;
    return { operation: "sale-price", original, discount };
  }
  if (operation === "discount-percent") {
    const { original, sale } = fields;
    if (original === undefined || sale === undefined) return null;
    return { operation: "discount-percent", original, sale };
  }
  return null;
}

export const adapter: TopicAdapter<DiscountResult, DiscountErrorCode> = {
  id: "discount",
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
  ): CalculationResult<DiscountResult, DiscountErrorCode> {
    const input = discountInput(operationId, fields);
    if (!input) {
      return {
        ok: false,
        error: { code: "invalid-field" },
      };
    }
    return calculate(input);
  },
};
