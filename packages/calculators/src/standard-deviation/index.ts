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
/** The dataset, its mean and the band one standard deviation either side. */
export type DeviationVisual = NumericResult["visual"] & {
  points: readonly string[];
  mean: string;
  low: string;
  high: string;
  /** How many values lie within one standard deviation of the mean, inclusive. */
  within: string;
};
export type DeviationResult = NumericResult & { visual: DeviationVisual };
const ID = "standard-deviation";
export const operationDescriptors = {
  population: {
    id: "population",
    labelKey: "standard-deviation.operation.population",
    fields: [
      {
        id: "values",
        labelKey: "standard-deviation.field.values",
        defaultValue: "22;25;19;31;24;28;21;26",
        input: "text",
      },
    ],
    working: [
      {
        messageKey: "standard-deviation.working.population",
        arguments: {
          mean: "decimal",
          variance: "decimal",
          count: "decimal",
          divisor: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  sample: {
    id: "sample",
    labelKey: "standard-deviation.operation.sample",
    fields: [
      {
        id: "values",
        labelKey: "standard-deviation.field.values",
        defaultValue: "22;25;19;31;24;28;21;26",
        input: "text",
      },
    ],
    working: [
      {
        messageKey: "standard-deviation.working.sample",
        arguments: {
          mean: "decimal",
          variance: "decimal",
          count: "decimal",
          divisor: "decimal",
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
): { ok: false; error: { code: NumericError; field?: string } } {
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
export function calculate(
  input: Input,
): CalculationResult<DeviationResult, NumericError> {
  if (!operations.some((o) => o.id === input.operation))
    return fail("invalid-field");
  const list = parseList(input.values);
  if (!list) return fail("invalid-field", "values");
  if (input.operation === "sample" && list.length < 2)
    return fail("invalid-domain", "values");
  const mean = list.reduce((a, b) => a.add(b), new D(0)).div(list.length);
  const sumSquares = list.reduce((a, b) => a.add(b.sub(mean).pow(2)), new D(0));
  const divisor = new D(list.length - (input.operation === "sample" ? 1 : 0));
  const variance = sumSquares.div(divisor);
  const deviation = variance.sqrt();
  const base = numericResult(ID, input.operation, deviation, {
    mean,
    variance,
    count: new D(list.length),
    divisor,
  });
  if (!base.ok) return base;
  const meanOut = decimalOutput(mean);
  const low = decimalOutput(mean.sub(deviation));
  const high = decimalOutput(mean.add(deviation));
  if (meanOut === null || low === null || high === null)
    return fail("output-overflow");
  return {
    ok: true,
    result: {
      ...base.result,
      visual: {
        ...base.result.visual,
        points: [...list]
          .sort((a, b) => a.comparedTo(b))
          .map((d) => d.toFixed()),
        mean: meanOut,
        low,
        high,
        within: String(
          list.filter((x) => x.sub(mean).abs().lte(deviation)).length,
        ),
      },
    },
  };
}
