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
/** The dataset and all three centres, so one diagram can compare them. */
export type AverageVisual = NumericResult["visual"] & {
  points: readonly string[];
  mean: string;
  median: string;
  /** Null when no single value occurs most often (ties or no repeats). */
  mode: string | null;
};
export type AverageResult = NumericResult & { visual: AverageVisual };
const ID = "average";
export const operationDescriptors = {
  mean: {
    id: "mean",
    labelKey: "average.operation.mean",
    fields: [
      {
        id: "values",
        labelKey: "average.field.values",
        defaultValue: "68;74;81;81;87;92;95",
        input: "text",
      },
    ],
    working: [
      {
        messageKey: "average.working.mean",
        arguments: {
          count: "decimal",
          sum: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  median: {
    id: "median",
    labelKey: "average.operation.median",
    fields: [
      {
        id: "values",
        labelKey: "average.field.values",
        defaultValue: "68;74;81;81;87;92;95",
        input: "text",
      },
    ],
    working: [
      {
        messageKey: "average.working.median",
        arguments: {
          count: "decimal",
          sum: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  mode: {
    id: "mode",
    labelKey: "average.operation.mode",
    fields: [
      {
        id: "values",
        labelKey: "average.field.values",
        defaultValue: "68;74;81;81;87;92;95",
        input: "text",
      },
    ],
    working: [
      {
        messageKey: "average.working.mode",
        arguments: {
          count: "decimal",
          sum: "decimal",
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
function centres(list: readonly Dec[]) {
  const sorted = [...list].sort((a, b) => a.comparedTo(b));
  const sum = list.reduce((a, b) => a.add(b), new D(0));
  const middle = Math.floor(list.length / 2);
  const median =
    list.length % 2
      ? (sorted[middle] ?? new D(0))
      : (sorted[middle - 1] ?? new D(0)).add(sorted[middle] ?? new D(0)).div(2);
  const counts = new Map<string, number>();
  for (const v of list)
    counts.set(v.toFixed(), (counts.get(v.toFixed()) ?? 0) + 1);
  const max = Math.max(...counts.values());
  const winners = [...counts].filter(([, n]) => n === max);
  const mode =
    max < 2 || winners.length !== 1 ? null : new D(winners[0]?.[0] ?? "0");
  return { sorted, sum, mean: sum.div(list.length), median, mode };
}
export function calculate(
  input: Input,
): CalculationResult<AverageResult, NumericError> {
  if (!operations.some((o) => o.id === input.operation))
    return fail("invalid-field");
  const list = parseList(input.values);
  if (!list) return fail("invalid-field", "values");
  const c = centres(list);
  const answer =
    input.operation === "mean"
      ? c.mean
      : input.operation === "median"
        ? c.median
        : c.mode;
  if (answer === null) return fail("invalid-domain", "values");
  const base = numericResult(ID, input.operation, answer, {
    count: new D(list.length),
    sum: c.sum,
  });
  if (!base.ok) return base;
  const out = (d: Dec) => decimalOutput(d);
  const mean = out(c.mean);
  const median = out(c.median);
  const mode = c.mode === null ? null : out(c.mode);
  if (mean === null || median === null || (mode === null && c.mode !== null))
    return fail("output-overflow");
  return {
    ok: true,
    result: {
      ...base.result,
      visual: {
        ...base.result.visual,
        points: c.sorted.map((d) => d.toFixed()),
        mean,
        median,
        mode,
      },
    },
  };
}
