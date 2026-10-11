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
const ID = "date-difference";
export const operationDescriptors = {
  "elapsed-days": {
    id: "elapsed-days",
    labelKey: "date-difference.operation.elapsed-days",
    fields: [
      {
        id: "start",
        labelKey: "date-difference.field.start",
        defaultValue: "2026-01-01",
        input: "text",
      },
      {
        id: "end",
        labelKey: "date-difference.field.end",
        defaultValue: "2026-10-11",
        input: "text",
      },
    ],
    working: [
      {
        messageKey: "date-difference.working.elapsed-days",
        arguments: {
          start: "text",
          end: "text",
          answer: "decimal",
        },
      },
    ],
  },
  "inclusive-days": {
    id: "inclusive-days",
    labelKey: "date-difference.operation.inclusive-days",
    fields: [
      {
        id: "start",
        labelKey: "date-difference.field.start",
        defaultValue: "2026-01-01",
        input: "text",
      },
      {
        id: "end",
        labelKey: "date-difference.field.end",
        defaultValue: "2026-10-11",
        input: "text",
      },
    ],
    working: [
      {
        messageKey: "date-difference.working.inclusive-days",
        arguments: {
          start: "text",
          end: "text",
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
function withDates(
  outcome: CalculationResult<NumericResult, NumericError>,
  dates: Readonly<Record<string, string>>,
): CalculationResult<NumericResult, NumericError> {
  if (!outcome.ok) return outcome;
  return {
    ok: true,
    result: {
      ...outcome.result,
      working: outcome.result.working.map((step) => ({
        ...step,
        args: {
          ...step.args,
          ...Object.fromEntries(
            Object.entries(dates).map(([key, value]) => [
              key,
              { kind: "text" as const, value },
            ]),
          ),
        },
      })),
    },
  };
}
export function calculate(
  input: Input,
): CalculationResult<NumericResult, NumericError> {
  if (!operations.some((o) => o.id === input.operation))
    return fail("invalid-field");
  const start = civilDate(input.start),
    end = civilDate(input.end);
  if (!start) return fail("invalid-field", "start");
  if (!end) return fail("invalid-field", "end");
  const difference = end.ordinal - start.ordinal;
  if (input.operation === "inclusive-days" && difference < 0)
    return fail("invalid-domain");
  return withDates(
    numericResult(
      ID,
      input.operation,
      new D(difference + (input.operation === "inclusive-days" ? 1 : 0)),
      {},
    ),
    { start: input.start ?? "", end: input.end ?? "" },
  );
}
