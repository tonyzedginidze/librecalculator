import type {
  CalculationResult,
  FieldDescriptor,
} from "../../../../calculators/src/contracts";
import {
  calculate,
  operations,
  type TipSplittingErrorCode,
  type TipSplittingInput,
  type TipSplittingResult,
} from "../../../../calculators/src/tip-splitting/index";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter, TopicFieldParse } from "../../topic";

export function tipSplittingInput(
  operation: string,
  fields: Readonly<Record<string, string>>,
): TipSplittingInput | null {
  if (operation === "split") {
    const subtotal = fields.subtotal;
    const tipRate = fields.tipRate;
    const people = fields.people;
    if (
      subtotal === undefined ||
      tipRate === undefined ||
      people === undefined
    ) {
      return null;
    }
    return { operation: "split", subtotal, tipRate, people };
  }
  return null;
}

export function parseTipField(
  raw: string,
  locale: string,
  field: FieldDescriptor,
): TopicFieldParse {
  if (field.id === "people") {
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

export const adapter: TopicAdapter<TipSplittingResult, TipSplittingErrorCode> =
  {
    id: "tip-splitting",
    schemaVersion: 1,
    descriptors: operations,
    parseField: parseTipField,
    calculate(
      operationId: string,
      fields: Record<string, string>,
    ): CalculationResult<TipSplittingResult, TipSplittingErrorCode> {
      const input = tipSplittingInput(operationId, fields);
      if (!input) {
        return {
          ok: false,
          error: { code: "invalid-subtotal", field: "subtotal" },
        };
      }
      return calculate(input);
    },
  };
