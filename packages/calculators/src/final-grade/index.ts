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
  "final-required": {
    id: "final-required",
    labelKey: "final-grade.operation.final-required",
    fields: [
      {
        id: "current",
        labelKey: "final-grade.field.current",
        defaultValue: "82",
        input: "decimal",
        unitKey: "final-grade.unit.pct",
        sign: "nonnegative",
      },
      {
        id: "target",
        labelKey: "final-grade.field.target",
        defaultValue: "85",
        input: "decimal",
        unitKey: "final-grade.unit.pct",
        sign: "nonnegative",
      },
      {
        id: "finalWeight",
        labelKey: "final-grade.field.finalWeight",
        defaultValue: "30",
        input: "decimal",
        unitKey: "final-grade.unit.pct",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "final-grade.working.final-required",
        arguments: {
          current: "decimal",
          target: "decimal",
          finalWeight: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "final-projected": {
    id: "final-projected",
    labelKey: "final-grade.operation.final-projected",
    fields: [
      {
        id: "current",
        labelKey: "final-grade.field.current",
        defaultValue: "82",
        input: "decimal",
        unitKey: "final-grade.unit.pct",
        sign: "nonnegative",
      },
      {
        id: "finalScore",
        labelKey: "final-grade.field.finalScore",
        defaultValue: "92",
        input: "decimal",
        unitKey: "final-grade.unit.pct",
        sign: "nonnegative",
      },
      {
        id: "finalWeight",
        labelKey: "final-grade.field.finalWeight",
        defaultValue: "30",
        input: "decimal",
        unitKey: "final-grade.unit.pct",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "final-grade.working.final-projected",
        arguments: {
          current: "decimal",
          finalScore: "decimal",
          finalWeight: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "final-current-needed": {
    id: "final-current-needed",
    labelKey: "final-grade.operation.final-current-needed",
    fields: [
      {
        id: "target",
        labelKey: "final-grade.field.target",
        defaultValue: "85",
        input: "decimal",
        unitKey: "final-grade.unit.pct",
        sign: "nonnegative",
      },
      {
        id: "finalScore",
        labelKey: "final-grade.field.finalScore",
        defaultValue: "92",
        input: "decimal",
        unitKey: "final-grade.unit.pct",
        sign: "nonnegative",
      },
      {
        id: "finalWeight",
        labelKey: "final-grade.field.finalWeight",
        defaultValue: "30",
        input: "decimal",
        unitKey: "final-grade.unit.pct",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "final-grade.working.final-current-needed",
        arguments: {
          target: "decimal",
          finalScore: "decimal",
          finalWeight: "decimal",
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
  calculatorId: "final-grade";
  operation: string;
  answer: { kind: "decimal"; value: string };
  unitKey: string;
  working: readonly WorkingStep[];
  visual: {
    kind: "final-grade";
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
  const current = values.current ?? new DecimalValue(0);
  const finalScore = values.finalScore ?? new DecimalValue(0);
  const finalWeight = values.finalWeight ?? new DecimalValue(0);
  const target = values.target ?? new DecimalValue(0);

  let value: InstanceType<typeof DecimalValue>;
  let unitKey: string;
  switch (input.operation) {
    case "final-required":
      value = target
        .minus(current.mul(new DecimalValue(100).minus(finalWeight)).div(100))
        .mul(100)
        .div(finalWeight);
      unitKey = "final-grade.answer.percent";
      break;
    case "final-projected":
      value = current
        .mul(new DecimalValue(100).minus(finalWeight))
        .plus(finalScore.mul(finalWeight))
        .div(100);
      unitKey = "final-grade.answer.percent";
      break;
    case "final-current-needed":
      value = target
        .mul(100)
        .minus(finalScore.mul(finalWeight))
        .div(new DecimalValue(100).minus(finalWeight));
      unitKey = "final-grade.answer.percent";
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
      calculatorId: "final-grade",
      operation: input.operation,
      answer: { kind: "decimal", value: answer },
      unitKey,
      working: [
        {
          id: "substitution",
          messageKey: `final-grade.working.${input.operation}`,
          args,
        },
      ],
      visual: { kind: "final-grade", dimensions, answer, unitKey },
    },
  };
}

function invalidDomain(
  field: string,
  value: InstanceType<typeof DecimalValue>,
  operation: string,
): boolean {
  return (
    value.lt(0) ||
    (field === "finalWeight" &&
      (value.gt(100) ||
        (operation === "final-required" && value.eq(0)) ||
        (operation === "final-current-needed" && value.eq(100))))
  );
}
