import type {
  CalculationResult,
  NumericValue,
  WorkingStep,
} from "../contracts";
import { DecimalValue, decimalOutput } from "../numeric/decimal";
export type NumericError =
  | "invalid-field"
  | "invalid-domain"
  | "output-overflow";
export type NumericResult = {
  calculatorId: string;
  operation: string;
  answer: NumericValue;
  working: readonly WorkingStep[];
  visual: {
    rows: readonly { labelKey: string; value: string }[];
    numberLine: {
      minimum: string;
      maximum: string;
      value: string;
      fraction: string;
    };
  };
};
export function numericResult(
  id: string,
  operation: string,
  answer: InstanceType<typeof DecimalValue>,
  values: Record<string, InstanceType<typeof DecimalValue>>,
): CalculationResult<NumericResult, NumericError> {
  const output = decimalOutput(answer);
  if (output === null) return { ok: false, error: { code: "output-overflow" } };
  const args: Record<string, NumericValue> = {
    answer: { kind: "decimal", value: output },
  };
  const rows = [];
  for (const [key, value] of Object.entries(values)) {
    const text = decimalOutput(value);
    if (text === null) return { ok: false, error: { code: "output-overflow" } };
    args[key] = { kind: "decimal", value: text };
    rows.push({ labelKey: `${id}.field.${key}`, value: text });
  }
  rows.push({ labelKey: `${id}.result`, value: output });
  return {
    ok: true,
    result: {
      calculatorId: id,
      operation,
      answer: { kind: "decimal", value: output },
      working: [
        { id: "substitution", messageKey: `${id}.working.${operation}`, args },
      ],
      visual: {
        rows,
        numberLine: {
          minimum: DecimalValue.max(1, answer.abs()).neg().toFixed(),
          maximum: DecimalValue.max(1, answer.abs()).toFixed(),
          value: output,
          fraction: answer
            .div(DecimalValue.max(1, answer.abs()))
            .add(1)
            .div(2)
            .toFixed(),
        },
      },
    },
  };
}
