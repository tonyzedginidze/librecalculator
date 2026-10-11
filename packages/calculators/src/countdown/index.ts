import type { CalculationResult, OperationDescriptor } from "../contracts";
import { DecimalValue as D } from "../numeric/decimal";
import { civilDate } from "../runtime/civil-date";
import {
  type NumericError,
  type NumericResult,
  numericResult,
} from "../runtime/numeric-result";

export const errorCodes = [
  "invalid-field",
  "invalid-domain",
  "output-overflow",
] as const;
export type Input = { operation: string } & Record<string, string>;
const ID = "countdown";
export const operationDescriptors = {
  "days-until": {
    id: "days-until",
    labelKey: "countdown.operation.days-until",
    fields: [
      {
        id: "reference",
        labelKey: "countdown.field.reference",
        defaultValue: "2026-10-11",
        input: "text",
      },
      {
        id: "target",
        labelKey: "countdown.field.target",
        defaultValue: "2026-12-25",
        input: "text",
      },
    ],
    working: [
      {
        messageKey: "countdown.working.days-until",
        arguments: {
          reference: "text",
          target: "text",
          answer: "decimal",
        },
      },
    ],
  },
} satisfies Record<string, OperationDescriptor>;
export const operations = Object.values(operationDescriptors);
function fail(
  code: NumericError,
  field?: string,
): CalculationResult<NumericResult, NumericError> {
  return { ok: false, error: { code, ...(field ? { field } : {}) } };
}
export function calculate(
  input: Input,
): CalculationResult<NumericResult, NumericError> {
  if (!operations.some((o) => o.id === input.operation))
    return fail("invalid-field");
  const reference = civilDate(input.reference),
    target = civilDate(input.target);
  if (!reference) return fail("invalid-field", "reference");
  if (!target) return fail("invalid-field", "target");
  const days = new D(target.ordinal - reference.ordinal);
  // Whole weeks and leftover days of the distance, for the "10 weeks 5 days" reading.
  const weeks = days.abs().div(7).floor();
  const outcome = numericResult(ID, input.operation, days, {
    weeks,
    remainder: days.abs().sub(weeks.mul(7)),
  });
  if (!outcome.ok) return outcome;
  return {
    ok: true,
    result: {
      ...outcome.result,
      working: outcome.result.working.map((step) => ({
        ...step,
        args: {
          ...step.args,
          reference: { kind: "text", value: input.reference ?? "" },
          target: { kind: "text", value: input.target ?? "" },
        },
      })),
    },
  };
}
