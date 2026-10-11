import type { CalculationResult, OperationDescriptor } from "../contracts";
import {
  type DecimalValue as D,
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
const ID = "z-score";
export const operationDescriptors = {
  "standard-score": {
    id: "standard-score",
    labelKey: "z-score.operation.standard-score",
    fields: [
      {
        id: "value",
        labelKey: "z-score.field.value",
        defaultValue: "85",
        input: "decimal",
      },
      {
        id: "mean",
        labelKey: "z-score.field.mean",
        defaultValue: "70",
        input: "decimal",
      },
      {
        id: "deviation",
        labelKey: "z-score.field.deviation",
        sign: "nonnegative",
        defaultValue: "10",
        input: "decimal",
      },
    ],
    working: [
      {
        messageKey: "z-score.working.standard-score",
        arguments: {
          value: "decimal",
          mean: "decimal",
          deviation: "decimal",
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
/** Raw values one, two and three deviations either side of the mean, for a σ axis. */
export type ZScoreResult = NumericResult & {
  visual: NumericResult["visual"] & {
    scale: readonly { z: number; value: string }[];
  };
};
export const SCALE_STEPS = [-3, -2, -1, 0, 1, 2, 3] as const;
export function isZScoreResult(result: NumericResult): result is ZScoreResult {
  return "scale" in result.visual;
}
export function calculate(
  input: Input,
): CalculationResult<ZScoreResult, NumericError> {
  if (!operations.some((o) => o.id === input.operation))
    return fail("invalid-field");
  const fields = parseFields(input);
  if (!fields) return fail("invalid-field");
  if (!fields.deviation) return fail("invalid-field", "deviation");
  if (!fields.mean) return fail("invalid-field", "mean");
  if (!fields.value) return fail("invalid-field", "value");

  if (fields.deviation.lte(0)) return fail("invalid-domain", "deviation");
  const base = numericResult(
    ID,
    input.operation,
    fields.value.sub(fields.mean).div(fields.deviation),
    fields,
  );
  if (!base.ok) return base;
  const scale = [];
  for (const z of SCALE_STEPS) {
    const value = decimalOutput(fields.mean.add(fields.deviation.mul(z)));
    if (value === null) return fail("output-overflow");
    scale.push({ z, value });
  }
  return {
    ok: true,
    result: { ...base.result, visual: { ...base.result.visual, scale } },
  };
}
