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
  "test-percentage": {
    id: "test-percentage",
    labelKey: "test-score.operation.test-percentage",
    fields: [
      {
        id: "correct",
        labelKey: "test-score.field.correct",
        defaultValue: "21",
        input: "integer",
      },
      {
        id: "questions",
        labelKey: "test-score.field.questions",
        defaultValue: "25",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "test-score.working.test-percentage",
        arguments: {
          correct: "decimal",
          questions: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "test-missed": {
    id: "test-missed",
    labelKey: "test-score.operation.test-missed",
    fields: [
      {
        id: "questions",
        labelKey: "test-score.field.questions",
        defaultValue: "25",
        input: "integer",
      },
      {
        id: "correct",
        labelKey: "test-score.field.correct",
        defaultValue: "21",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "test-score.working.test-missed",
        arguments: {
          questions: "decimal",
          correct: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "test-needed": {
    id: "test-needed",
    labelKey: "test-score.operation.test-needed",
    fields: [
      {
        id: "target",
        labelKey: "test-score.field.target",
        defaultValue: "80",
        input: "decimal",
        unitKey: "test-score.unit.pct",
        sign: "nonnegative",
      },
      {
        id: "questions",
        labelKey: "test-score.field.questions",
        defaultValue: "25",
        input: "integer",
      },
    ],
    working: [
      {
        messageKey: "test-score.working.test-needed",
        arguments: {
          target: "decimal",
          questions: "decimal",
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
  calculatorId: "test-score";
  operation: string;
  answer: { kind: "decimal"; value: string };
  unitKey: string;
  working: readonly WorkingStep[];
  visual: {
    kind: "test-score";
    dimensions: Record<string, string>;
    answer: string;
    unitKey: string;
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
  const correct = values.correct ?? new DecimalValue(0);
  const questions = values.questions ?? new DecimalValue(0);
  const target = values.target ?? new DecimalValue(0);

  if (
    (input.operation === "test-percentage" ||
      input.operation === "test-missed") &&
    correct.gt(questions)
  )
    return { ok: false, error: { code: "invalid-domain", field: "correct" } };
  let value: InstanceType<typeof DecimalValue>;
  let unitKey: string;
  switch (input.operation) {
    case "test-percentage":
      value = correct.div(questions).mul(100);
      unitKey = "test-score.answer.percent";
      break;
    case "test-missed":
      value = questions.minus(correct);
      unitKey = "test-score.answer.missed";
      break;
    case "test-needed":
      value = target.mul(questions).div(100).ceil();
      unitKey = "test-score.answer.needed";
      break;
    default:
      return { ok: false, error: { code: "invalid-field" } };
  }
  const answer = decimalOutput(value);
  if (answer === null) return { ok: false, error: { code: "output-overflow" } };
  const args = Object.fromEntries(
    Object.entries({ ...dimensions, answer }).map(([key, value]) => [
      key,
      { kind: "decimal" as const, value },
    ]),
  );
  return {
    ok: true,
    result: {
      calculatorId: "test-score",
      operation: input.operation,
      answer: { kind: "decimal", value: answer },
      unitKey,
      working: [
        {
          id: "substitution",
          messageKey: `test-score.working.${input.operation}`,
          args,
        },
      ],
      visual: { kind: "test-score", dimensions, answer, unitKey },
    },
  };
}

function invalidDomain(
  field: string,
  value: InstanceType<typeof DecimalValue>,
  _operation: string,
): boolean {
  return field === "target"
    ? value.lt(0) || value.gt(100)
    : !value.isInteger() ||
        value.lt(field === "questions" ? 1 : 0) ||
        value.gt(1000000);
}
