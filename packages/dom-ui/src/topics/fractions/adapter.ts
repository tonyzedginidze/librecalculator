import type {
  CalculationResult,
  FieldDescriptor,
} from "../../../../calculators/src/contracts";
import {
  calculate,
  type FractionErrorCode,
  type FractionInput,
  type FractionResult,
  operations,
} from "../../../../calculators/src/fractions/index";
import type { TopicAdapter, TopicFieldParse } from "../../topic";

export function parseFractionInteger(raw: string): TopicFieldParse {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "-" || trimmed === "+") {
    return { state: "incomplete" };
  }
  if (!/^[+-]?\d+$/.test(trimmed)) {
    return { state: "invalid", reason: "invalid-character" };
  }
  const magnitudeDigits = trimmed.replace(/^[+-]/, "").replace(/^0+/, "");
  const digitCount = magnitudeDigits.length === 0 ? 1 : magnitudeDigits.length;
  if (digitCount > 1000) {
    return { state: "invalid", reason: "too-long" };
  }
  return { state: "valid", canonical: trimmed };
}

export function fractionInput(
  operation: string,
  fields: Readonly<Record<string, string>>,
): FractionInput | null {
  if (operation === "reduce") {
    const numerator = fields.numerator;
    const denominator = fields.denominator;
    if (numerator === undefined || denominator === undefined) return null;
    return { operation: "reduce", numerator, denominator };
  }
  if (
    operation === "add" ||
    operation === "subtract" ||
    operation === "multiply" ||
    operation === "divide"
  ) {
    const leftNumerator = fields.leftNumerator;
    const leftDenominator = fields.leftDenominator;
    const rightNumerator = fields.rightNumerator;
    const rightDenominator = fields.rightDenominator;
    if (
      leftNumerator === undefined ||
      leftDenominator === undefined ||
      rightNumerator === undefined ||
      rightDenominator === undefined
    ) {
      return null;
    }
    return {
      operation,
      leftNumerator,
      leftDenominator,
      rightNumerator,
      rightDenominator,
    };
  }
  return null;
}

export const adapter: TopicAdapter<FractionResult, FractionErrorCode> = {
  id: "fractions",
  schemaVersion: 1,
  descriptors: operations,
  parseField(
    raw: string,
    _locale: string,
    _field: FieldDescriptor,
  ): TopicFieldParse {
    return parseFractionInteger(raw);
  },
  calculate(
    operationId: string,
    fields: Record<string, string>,
  ): CalculationResult<FractionResult, FractionErrorCode> {
    const input = fractionInput(operationId, fields);
    if (!input) {
      return {
        ok: false,
        error: { code: "invalid-integer" },
      };
    }
    return calculate(input);
  },
};
