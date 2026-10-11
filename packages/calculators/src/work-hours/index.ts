import type { CalculationResult, OperationDescriptor } from "../contracts";
import { DecimalValue as D, parseCanonicalDecimal } from "../numeric/decimal";
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
const ID = "work-hours";
/** The shift-end choice maps to the contract's next-day flag 0 or 1. */
export const endDayFlags = { "same-day": 0, "next-day": 1 } as const;
export const operationDescriptors = {
  "paid-hours": {
    id: "paid-hours",
    labelKey: "work-hours.operation.paid-hours",
    fields: [
      {
        id: "start",
        labelKey: "work-hours.field.start",
        defaultValue: "09:00",
        input: "text",
      },
      {
        id: "end",
        labelKey: "work-hours.field.end",
        defaultValue: "17:30",
        input: "text",
      },
      {
        id: "overnight",
        labelKey: "work-hours.field.overnight",
        defaultValue: "same-day",
        input: "choice",
        choices: [
          { id: "same-day", labelKey: "work-hours.choice.same-day" },
          { id: "next-day", labelKey: "work-hours.choice.next-day" },
        ],
      },
      {
        id: "break",
        labelKey: "work-hours.field.break",
        unitKey: "work-hours.unit.min",
        defaultValue: "30",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "work-hours.working.paid-hours",
        arguments: {
          start: "text",
          end: "text",
          elapsed: "decimal",
          break: "decimal",
          paid: "decimal",
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
  const clock = (raw: string | undefined) => {
    if (!raw || !/^([01]\d|2[0-3]):[0-5]\d$/.test(raw)) return null;
    return Number(raw.slice(0, 2)) * 60 + Number(raw.slice(3));
  };
  const start = clock(input.start),
    end = clock(input.end);
  if (start === null) return fail("invalid-field", "start");
  if (end === null) return fail("invalid-field", "end");
  const pause = parseCanonicalDecimal(input.break ?? "");
  const flag = Object.hasOwn(endDayFlags, input.overnight ?? "")
    ? endDayFlags[input.overnight as keyof typeof endDayFlags]
    : null;
  if (flag === null) return fail("invalid-field", "overnight");
  if (!pause.ok) return fail("invalid-field", "break");
  if (!pause.value.isInteger() || pause.value.lt(0))
    return fail("invalid-domain");
  const elapsed = new D(end - start + 1440 * flag);
  if (elapsed.lt(0) || elapsed.gt(1440)) return fail("invalid-domain");
  if (pause.value.gt(elapsed)) return fail("invalid-domain");
  const paid = elapsed.sub(pause.value);
  const outcome = numericResult(ID, input.operation, paid.div(60), {
    elapsed,
    break: pause.value,
    paid,
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
          start: { kind: "text", value: input.start ?? "" },
          end: { kind: "text", value: input.end ?? "" },
        },
      })),
    },
  };
}
