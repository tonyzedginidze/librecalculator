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
const ID = "age";
export const operationDescriptors = {
  "completed-years": {
    id: "completed-years",
    labelKey: "age.operation.completed-years",
    fields: [
      {
        id: "birth",
        labelKey: "age.field.birth",
        defaultValue: "1990-06-15",
        input: "text",
      },
      {
        id: "asof",
        labelKey: "age.field.asof",
        defaultValue: "2026-10-11",
        input: "text",
      },
    ],
    working: [
      {
        messageKey: "age.working.completed-years",
        arguments: {
          birth: "text",
          asof: "text",
          days: "decimal",
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
type Civil = NonNullable<ReturnType<typeof civilDate>>;
/**
 * Ordinal of the birthday in `year` under this calculator's convention: a
 * February 29 birthday is reached on March 1 in a non-leap year. Returns null
 * outside the supported calendar.
 */
export function birthdayOrdinal(birth: Civil, year: number): number | null {
  const pad = (n: number, width: number) => String(n).padStart(width, "0");
  const exact = civilDate(
    `${pad(year, 4)}-${pad(birth.month, 2)}-${pad(birth.day, 2)}`,
  );
  if (exact) return exact.ordinal;
  if (birth.month === 2 && birth.day === 29)
    return civilDate(`${pad(year, 4)}-03-01`)?.ordinal ?? null;
  return null;
}
export function calculate(
  input: Input,
): CalculationResult<NumericResult, NumericError> {
  if (!operations.some((o) => o.id === input.operation))
    return fail("invalid-field");
  const birth = civilDate(input.birth),
    asof = civilDate(input.asof);
  if (!birth) return fail("invalid-field", "birth");
  if (!asof) return fail("invalid-field", "asof");
  if (asof.ordinal < birth.ordinal) return fail("invalid-domain");
  const birthdayPassed =
    asof.month > birth.month ||
    (asof.month === birth.month && asof.day >= birth.day);
  const answer = new D(asof.year - birth.year - (birthdayPassed ? 0 : 1));
  const outcome = numericResult(ID, input.operation, answer, {
    days: new D(asof.ordinal - birth.ordinal),
  });
  if (!outcome.ok) return outcome;
  const [step] = outcome.result.working;
  if (!step) return outcome;
  return {
    ok: true,
    result: {
      ...outcome.result,
      working: [
        {
          ...step,
          args: {
            ...step.args,
            birth: { kind: "text", value: input.birth ?? "" },
            asof: { kind: "text", value: input.asof ?? "" },
          },
        },
      ],
    },
  };
}
