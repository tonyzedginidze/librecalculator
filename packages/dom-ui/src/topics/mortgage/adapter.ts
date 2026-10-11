import type {
  CalculationResult,
  FieldDescriptor,
} from "../../../../calculators/src/contracts";
import {
  calculate,
  type MortgageErrorCode,
  type MortgageInput,
  type MortgageResult,
  operations,
} from "../../../../calculators/src/mortgage/index";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter, TopicFieldParse } from "../../topic";

export function mortgageInput(
  operation: string,
  fields: Readonly<Record<string, string>>,
): MortgageInput | null {
  if (operation === "amortize") {
    const principal = fields.principal;
    const annualRate = fields.annualRate;
    const months = fields.months;
    if (
      principal === undefined ||
      annualRate === undefined ||
      months === undefined
    ) {
      return null;
    }
    return { operation: "amortize", principal, annualRate, months };
  }
  return null;
}

export function parseLoanField(
  raw: string,
  locale: string,
  field: FieldDescriptor,
): TopicFieldParse {
  if (field.id === "months") {
    const trimmed = raw.trim();
    if (trimmed === "" || trimmed === "+" || trimmed === "-") {
      return { state: "incomplete" };
    }
    if (!/^\d+$/.test(trimmed)) {
      return { state: "invalid", reason: "invalid-character" };
    }
    return { state: "valid", canonical: trimmed };
  }
  return parseLocaleDecimal(raw, locale);
}

export const adapter: TopicAdapter<MortgageResult, MortgageErrorCode> = {
  id: "mortgage",
  schemaVersion: 1,
  descriptors: operations,
  parseField: parseLoanField,
  calculate(
    operationId: string,
    fields: Record<string, string>,
  ): CalculationResult<MortgageResult, MortgageErrorCode> {
    const input = mortgageInput(operationId, fields);
    if (!input) {
      return {
        ok: false,
        error: { code: "invalid-principal", field: "principal" },
      };
    }
    return calculate(input);
  },
};

/** Working-step arguments that are whole-cent dollar amounts. */
export const moneyArgs = [
  "principal",
  "payment",
  "finalPayment",
  "interest",
] as const;
