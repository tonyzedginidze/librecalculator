import type { CalculationResult, OperationDescriptor } from "../contracts";
import {
  type DecimalValue as D,
  parseCanonicalDecimal,
} from "../numeric/decimal";
import {
  type NumericError,
  type NumericResult,
  numericResult,
} from "../runtime/numeric-result";

type Dec = InstanceType<typeof D>;
export const errorCodes = [
  "invalid-field",
  "invalid-domain",
  "output-overflow",
] as const;
export type Input = { operation: string } & Record<string, string>;
const ID = "confidence-interval";
export const operationDescriptors = {
  "normal-interval": {
    id: "normal-interval",
    labelKey: "confidence-interval.operation.normal-interval",
    fields: [
      {
        id: "mean",
        labelKey: "confidence-interval.field.mean",
        defaultValue: "100",
        input: "decimal",
      },
      {
        id: "sigma",
        labelKey: "confidence-interval.field.sigma",
        sign: "nonnegative",
        defaultValue: "15",
        input: "decimal",
      },
      {
        id: "count",
        labelKey: "confidence-interval.field.count",
        defaultValue: "36",
        input: "integer",
      },
      {
        id: "critical",
        labelKey: "confidence-interval.field.critical",
        sign: "nonnegative",
        defaultValue: "1.96",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "confidence-interval.working.normal-interval",
        arguments: {
          mean: "decimal",
          sigma: "decimal",
          count: "decimal",
          critical: "decimal",
          lower: "decimal",
          upper: "decimal",
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
function parseFields(input: Input): Record<string, Dec> | null {
  const descriptor = operations.find((o) => o.id === input.operation);
  if (!descriptor) return null;
  const result: Record<string, Dec> = {};
  for (const f of descriptor.fields) {
    const parsed = parseCanonicalDecimal(input[f.id] ?? "");
    if (!parsed.ok) return null;
    result[f.id] = parsed.value;
  }
  return result;
}
export function calculate(
  input: Input,
): CalculationResult<NumericResult, NumericError> {
  if (!operations.some((o) => o.id === input.operation))
    return fail("invalid-field");
  const fields = parseFields(input);
  if (!fields) return fail("invalid-field");
  const { mean, sigma, count, critical } = fields;
  if (!mean) return fail("invalid-field", "mean");
  if (!sigma) return fail("invalid-field", "sigma");
  if (!count) return fail("invalid-field", "count");
  if (!critical) return fail("invalid-field", "critical");

  if (
    sigma.lte(0) ||
    critical.lte(0) ||
    !count.isInteger() ||
    count.lt(1) ||
    count.gt(1000000)
  )
    return fail("invalid-domain");
  const margin = sigma.div(count.sqrt()).mul(critical);
  return numericResult(ID, input.operation, margin, {
    ...fields,
    lower: mean.sub(margin),
    upper: mean.add(margin),
  });
}
