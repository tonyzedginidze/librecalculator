import type {
  CalculationResult,
  OperationDescriptor,
  WorkingStep,
} from "../contracts";
import {
  DecimalValue,
  decimalOutput,
  parseCanonicalDecimal,
} from "../numeric/decimal";
export const operationDescriptors = {
  "grade-percent": {
    id: "grade-percent",
    labelKey: "grade.operation.grade-percent",
    fields: [
      {
        id: "earned",
        labelKey: "grade.field.earned",
        defaultValue: "42",
        input: "decimal",
        unitKey: "grade.unit.pts",
        sign: "nonnegative",
      },
      {
        id: "possible",
        labelKey: "grade.field.possible",
        defaultValue: "50",
        input: "decimal",
        unitKey: "grade.unit.pts",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "grade.working.grade-percent",
        arguments: {
          earned: "decimal",
          possible: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "grade-contribution": {
    id: "grade-contribution",
    labelKey: "grade.operation.grade-contribution",
    fields: [
      {
        id: "percentage",
        labelKey: "grade.field.percentage",
        defaultValue: "84",
        input: "decimal",
        unitKey: "grade.unit.pct",
        sign: "nonnegative",
      },
      {
        id: "weight",
        labelKey: "grade.field.weight",
        defaultValue: "25",
        input: "decimal",
        unitKey: "grade.unit.pct",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "grade.working.grade-contribution",
        arguments: {
          percentage: "decimal",
          weight: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "grade-required-points": {
    id: "grade-required-points",
    labelKey: "grade.operation.grade-required-points",
    fields: [
      {
        id: "target",
        labelKey: "grade.field.target",
        defaultValue: "90",
        input: "decimal",
        unitKey: "grade.unit.pct",
        sign: "nonnegative",
      },
      {
        id: "possible",
        labelKey: "grade.field.possible",
        defaultValue: "50",
        input: "decimal",
        unitKey: "grade.unit.pts",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "grade.working.grade-required-points",
        arguments: {
          target: "decimal",
          possible: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
} satisfies Record<string, OperationDescriptor>;
export const operations = Object.values(operationDescriptors);
export type Input = { operation: keyof typeof operationDescriptors } & Record<
  string,
  string
>;
export type ErrorCode = "invalid-field" | "invalid-domain" | "output-overflow";
export const errorCodes = [
  "invalid-field",
  "invalid-domain",
  "output-overflow",
] as const;
export type Result = {
  calculatorId: "grade";
  operation: string;
  answer: { kind: "decimal"; value: string };
  unitKey: string;
  working: readonly WorkingStep[];
  visual: {
    kind: "grade";
    dimensions: Record<string, string>;
    answer: string;
    unitKey: string;
    /**
     * Complementary parts of the same whole, as canonical decimals: `remainder` is the
     * share not earned (points missed, weight lost, or margin above the target points);
     * `outside` is the rest of the course outside this assessment's weight.
     * Negative when extra credit pushes a score above its whole.
     */
    parts: { remainder: string; outside?: string };
  };
};
export function calculate(input: Input): CalculationResult<Result, ErrorCode> {
  const descriptor = operationDescriptors[input.operation];
  if (!descriptor) return { ok: false, error: { code: "invalid-field" } };
  const values: Record<string, InstanceType<typeof DecimalValue>> = {};
  const dimensions: Record<string, string> = {};
  for (const field of descriptor.fields) {
    const parsed = parseCanonicalDecimal(input[field.id] ?? "");
    if (!parsed.ok)
      return { ok: false, error: { code: "invalid-field", field: field.id } };
    if (invalidDomain(field.id, parsed.value, input.operation))
      return { ok: false, error: { code: "invalid-domain", field: field.id } };
    values[field.id] = parsed.value;
    dimensions[field.id] = parsed.canonical;
  }
  const earned = values.earned ?? new DecimalValue(0);
  const percentage = values.percentage ?? new DecimalValue(0);
  const possible = values.possible ?? new DecimalValue(0);
  const target = values.target ?? new DecimalValue(0);
  const weight = values.weight ?? new DecimalValue(0);

  let value: InstanceType<typeof DecimalValue>;
  let unitKey: string;
  let remainder: InstanceType<typeof DecimalValue>;
  let outside: InstanceType<typeof DecimalValue> | null = null;
  switch (input.operation) {
    case "grade-percent":
      value = earned.div(possible).mul(100);
      unitKey = "grade.answer.percent";
      remainder = possible.minus(earned);
      break;
    case "grade-contribution":
      value = percentage.mul(weight).div(100);
      unitKey = "grade.answer.course-points";
      remainder = weight.minus(value);
      outside = new DecimalValue(100).minus(weight);
      break;
    case "grade-required-points":
      value = target.mul(possible).div(100);
      unitKey = "grade.answer.points";
      remainder = possible.minus(value);
      break;
    default:
      return { ok: false, error: { code: "invalid-field" } };
  }
  const answer = decimalOutput(value);
  const remainderText = decimalOutput(remainder);
  const outsideText = outside === null ? null : decimalOutput(outside);
  if (answer === null || remainderText === null || (outside && !outsideText))
    return { ok: false, error: { code: "output-overflow" } };
  const parts = outsideText
    ? { remainder: remainderText, outside: outsideText }
    : { remainder: remainderText };
  const args = Object.fromEntries(
    Object.entries({ ...dimensions, answer }).map(([key, value]) => [
      key,
      { kind: "decimal" as const, value },
    ]),
  );
  return {
    ok: true,
    result: {
      calculatorId: "grade",
      operation: input.operation,
      answer: { kind: "decimal", value: answer },
      unitKey,
      working: [
        {
          id: "substitution",
          messageKey: `grade.working.${input.operation}`,
          args,
        },
      ],
      visual: { kind: "grade", dimensions, answer, unitKey, parts },
    },
  };
}

function invalidDomain(
  field: string,
  value: InstanceType<typeof DecimalValue>,
  _operation: string,
): boolean {
  return field === "possible"
    ? !value.gt(0)
    : value.lt(0) || (field === "weight" && value.gt(100));
}
