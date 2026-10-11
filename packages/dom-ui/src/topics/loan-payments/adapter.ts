import type {
  CalculationResult,
  FieldDescriptor,
} from "../../../../calculators/src/contracts";
import {
  calculate,
  type LoanPaymentErrorCode,
  type LoanPaymentInput,
  type LoanPaymentResult,
  operations,
} from "../../../../calculators/src/loan-payments/index";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter, TopicFieldParse } from "../../topic";

export function loanPaymentInput(
  operation: string,
  fields: Readonly<Record<string, string>>,
): LoanPaymentInput | null {
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

export const adapter: TopicAdapter<LoanPaymentResult, LoanPaymentErrorCode> = {
  id: "loan-payments",
  schemaVersion: 1,
  descriptors: operations,
  parseField: parseLoanField,
  calculate(
    operationId: string,
    fields: Record<string, string>,
  ): CalculationResult<LoanPaymentResult, LoanPaymentErrorCode> {
    const input = loanPaymentInput(operationId, fields);
    if (!input) {
      return {
        ok: false,
        error: { code: "invalid-principal", field: "principal" },
      };
    }
    return calculate(input);
  },
};
