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
const ID = "weighted-average";
export const operationDescriptors = {
  "weighted-mean": {
    id: "weighted-mean",
    labelKey: "weighted-average.operation.weighted-mean",
    fields: [
      {
        id: "values",
        labelKey: "weighted-average.field.values",
        defaultValue: "88; 92; 75",
        input: "text",
      },
      {
        id: "weights",
        labelKey: "weighted-average.field.weights",
        defaultValue: "20; 30; 50",
        input: "text",
      },
    ],
    working: [
      {
        messageKey: "weighted-average.working.weighted-mean",
        arguments: {
          weightedSum: "decimal",
          totalWeight: "decimal",
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
function parseList(raw: string | undefined): Dec[] | null {
  if (!raw || raw.length > 25700) return null;
  const tokens = raw.split(";");
  if (tokens.length > 100) return null;
  const values: Dec[] = [];
  for (const token of tokens) {
    const parsed = parseCanonicalDecimal(token.trim());
    if (!parsed.ok) return null;
    values.push(parsed.value);
  }
  return values;
}
/** Each observation with its weight and that weight as a percentage of the total. */
export type WeightedPoint = { value: string; weight: string; percent: string };
export type WeightedResult = NumericResult & {
  visual: NumericResult["visual"] & { points: readonly WeightedPoint[] };
};
export function pointsOf(result: NumericResult): readonly WeightedPoint[] {
  return (result as WeightedResult).visual.points ?? [];
}
export function calculate(
  input: Input,
): CalculationResult<WeightedResult, NumericError> {
  if (!operations.some((o) => o.id === input.operation))
    return fail("invalid-field");
  const list = parseList(input.values),
    weights = parseList(input.weights);
  if (!list || !weights) return fail("invalid-field");
  if (list.length !== weights.length || weights.some((v) => v.lt(0)))
    return fail("invalid-domain");
  const totalWeight = weights.reduce((a, b) => a.add(b), new D(0));
  if (totalWeight.isZero()) return fail("invalid-domain", "weights");
  const weightedSum = list.reduce(
    (sum, value, i) => sum.add(value.mul(weights[i] ?? new D(0))),
    new D(0),
  );
  const base = numericResult(
    ID,
    input.operation,
    weightedSum.div(totalWeight),
    {
      weightedSum,
      totalWeight,
    },
  );
  if (!base.ok) return base;
  const points: WeightedPoint[] = [];
  for (const [i, value] of list.entries()) {
    const weight = weights[i] ?? new D(0);
    const v = decimalOutput(value),
      w = decimalOutput(weight),
      percent = decimalOutput(weight.div(totalWeight).mul(100));
    if (v === null || w === null || percent === null)
      return fail("output-overflow");
    points.push({ value: v, weight: w, percent });
  }
  return {
    ok: true,
    result: { ...base.result, visual: { ...base.result.visual, points } },
  };
}
