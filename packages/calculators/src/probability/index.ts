import type { CalculationResult, OperationDescriptor } from "../contracts";
import {
  DecimalValue as D,
  decimalOutput,
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
const ID = "probability";
export const operationDescriptors = {
  complement: {
    id: "complement",
    labelKey: "probability.operation.complement",
    fields: [
      {
        id: "first",
        labelKey: "probability.field.first",
        sign: "nonnegative",
        defaultValue: "0.3",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "probability.working.complement",
        arguments: {
          first: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "independent-both": {
    id: "independent-both",
    labelKey: "probability.operation.independent-both",
    fields: [
      {
        id: "first",
        labelKey: "probability.field.first",
        sign: "nonnegative",
        defaultValue: "0.5",
        input: "decimal",
      },
      {
        id: "second",
        labelKey: "probability.field.second",
        sign: "nonnegative",
        defaultValue: "0.4",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "probability.working.independent-both",
        arguments: {
          first: "decimal",
          second: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "event-union": {
    id: "event-union",
    labelKey: "probability.operation.event-union",
    fields: [
      {
        id: "first",
        labelKey: "probability.field.first",
        sign: "nonnegative",
        defaultValue: "0.5",
        input: "decimal",
      },
      {
        id: "second",
        labelKey: "probability.field.second",
        sign: "nonnegative",
        defaultValue: "0.4",
        input: "decimal",
      },
      {
        id: "intersection",
        labelKey: "probability.field.intersection",
        sign: "nonnegative",
        defaultValue: "0.2",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "probability.working.event-union",
        arguments: {
          first: "decimal",
          second: "decimal",
          intersection: "decimal",
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
): CalculationResult<never, NumericError> {
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
/** The four disjoint parts of the sample space for two-event operations. */
export type ProbabilityRegions = {
  aOnly: string;
  both: string;
  bOnly: string;
  neither: string;
};
export type ProbabilityResult = NumericResult & {
  visual: NumericResult["visual"] & { regions?: ProbabilityRegions };
};
export function regionsOf(result: NumericResult): ProbabilityRegions | null {
  return (result as ProbabilityResult).visual.regions ?? null;
}
export function calculate(
  input: Input,
): CalculationResult<ProbabilityResult, NumericError> {
  if (!operations.some((o) => o.id === input.operation))
    return fail("invalid-field");
  const fields = parseFields(input);
  if (!fields) return fail("invalid-field");
  if (Object.values(fields).some((v) => v.lt(0) || v.gt(1)))
    return fail("invalid-domain");
  const first = fields.first;
  if (!first) return fail("invalid-field");
  const second = fields.second ?? new D(0);
  const intersection = fields.intersection ?? new D(0);
  if (!first) return fail("invalid-field", "first");

  let answer: Dec;
  let both: Dec | null = null;
  if (input.operation === "complement") answer = new D(1).sub(first);
  else if (input.operation === "independent-both") {
    answer = first.mul(second);
    both = answer;
  } else {
    if (
      intersection.gt(D.min(first, second)) ||
      intersection.lt(D.max(0, first.add(second).sub(1)))
    )
      return fail("invalid-domain", "intersection");
    answer = first.add(second).sub(intersection);
    both = intersection;
  }
  const base = numericResult(ID, input.operation, answer, fields);
  if (!base.ok || both === null) return base;
  const parts = {
    aOnly: decimalOutput(first.sub(both)),
    both: decimalOutput(both),
    bOnly: decimalOutput(second.sub(both)),
    neither: decimalOutput(new D(1).sub(first).sub(second).add(both)),
  };
  if (Object.values(parts).some((v) => v === null))
    return fail("output-overflow");
  const regions = parts as ProbabilityRegions;
  return {
    ok: true,
    result: { ...base.result, visual: { ...base.result.visual, regions } },
  };
}
