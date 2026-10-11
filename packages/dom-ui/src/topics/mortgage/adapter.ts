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

const fieldIds = [
  "homePrice",
  "downPayment",
  "annualRate",
  "years",
  "propertyTax",
  "homeInsurance",
  "hoa",
] as const;

/** Monthly costs are optional: a blank field means none. */
const optionalFields = new Set(["propertyTax", "homeInsurance", "hoa"]);

export function mortgageInput(
  operation: string,
  fields: Readonly<Record<string, string>>,
): MortgageInput | null {
  if (operation !== "amortize") return null;
  const values: Partial<Record<(typeof fieldIds)[number], string>> = {};
  for (const id of fieldIds) {
    const value = fields[id];
    if (value === undefined) return null;
    values[id] = value;
  }
  return { operation: "amortize", ...(values as Required<typeof values>) };
}

export function parseMortgageField(
  raw: string,
  locale: string,
  field: FieldDescriptor,
): TopicFieldParse {
  const trimmed = raw.trim();
  if (trimmed === "" && optionalFields.has(field.id)) {
    return { state: "valid", canonical: "0" };
  }
  if (field.id === "years") {
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
  schemaVersion: 2,
  descriptors: operations,
  parseField: parseMortgageField,
  calculate(
    operationId: string,
    fields: Record<string, string>,
  ): CalculationResult<MortgageResult, MortgageErrorCode> {
    const input = mortgageInput(operationId, fields);
    if (!input) {
      return {
        ok: false,
        error: { code: "invalid-home-price", field: "homePrice" },
      };
    }
    return calculate(input);
  },
};

/** Step arguments that are whole-cent dollar amounts. */
export const moneyArgs = [
  "homePrice",
  "downPayment",
  "loan",
  "payment",
  "finalPayment",
  "totalPaid",
  "interest",
  "propertyTax",
  "monthlyTax",
  "homeInsurance",
  "monthlyInsurance",
  "hoa",
  "totalMonthly",
] as const;
