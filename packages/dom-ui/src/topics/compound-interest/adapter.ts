import {
  type CompoundInterestErrorCode,
  type CompoundInterestInput,
  type CompoundInterestResult,
  calculate,
  operations,
} from "../../../../calculators/src/compound-interest/index";
import type {
  CalculationResult,
  FieldDescriptor,
} from "../../../../calculators/src/contracts";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter, TopicFieldParse } from "../../topic";

export function compoundInterestInput(
  operation: string,
  fields: Readonly<Record<string, string>>,
): CompoundInterestInput | null {
  if (operation === "compound") {
    const principal = fields.principal;
    const annualRate = fields.annualRate;
    const years = fields.years;
    const frequency = fields.frequency;
    if (
      principal === undefined ||
      annualRate === undefined ||
      years === undefined ||
      frequency === undefined
    ) {
      return null;
    }
    return { operation: "compound", principal, annualRate, years, frequency };
  }
  return null;
}

export function parseCompoundField(
  raw: string,
  locale: string,
  field: FieldDescriptor,
): TopicFieldParse {
  if (field.id === "years" || field.id === "frequency") {
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

export const adapter: TopicAdapter<
  CompoundInterestResult,
  CompoundInterestErrorCode
> = {
  id: "compound-interest",
  schemaVersion: 1,
  descriptors: operations,
  parseField: parseCompoundField,
  calculate(
    operationId: string,
    fields: Record<string, string>,
  ): CalculationResult<CompoundInterestResult, CompoundInterestErrorCode> {
    const input = compoundInterestInput(operationId, fields);
    if (!input) {
      return {
        ok: false,
        error: { code: "invalid-principal", field: "principal" },
      };
    }
    return calculate(input);
  },
};
