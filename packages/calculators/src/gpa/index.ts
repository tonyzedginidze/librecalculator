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
  "gpa-average": {
    id: "gpa-average",
    labelKey: "gpa.operation.gpa-average",
    fields: [
      {
        id: "qualityPoints",
        labelKey: "gpa.field.qualityPoints",
        defaultValue: "49.5",
        input: "decimal",
        unitKey: "gpa.unit.qp",
        sign: "nonnegative",
      },
      {
        id: "credits",
        labelKey: "gpa.field.credits",
        defaultValue: "15",
        input: "decimal",
        unitKey: "gpa.unit.cr",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "gpa.working.gpa-average",
        arguments: {
          qualityPoints: "decimal",
          credits: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "gpa-combined": {
    id: "gpa-combined",
    labelKey: "gpa.operation.gpa-combined",
    fields: [
      {
        id: "previousGpa",
        labelKey: "gpa.field.previousGpa",
        defaultValue: "3.2",
        input: "decimal",
        sign: "nonnegative",
      },
      {
        id: "previousCredits",
        labelKey: "gpa.field.previousCredits",
        defaultValue: "60",
        input: "decimal",
        unitKey: "gpa.unit.cr",
        sign: "nonnegative",
      },
      {
        id: "newGpa",
        labelKey: "gpa.field.newGpa",
        defaultValue: "3.6",
        input: "decimal",
        sign: "nonnegative",
      },
      {
        id: "newCredits",
        labelKey: "gpa.field.newCredits",
        defaultValue: "15",
        input: "decimal",
        unitKey: "gpa.unit.cr",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "gpa.working.gpa-combined",
        arguments: {
          previousGpa: "decimal",
          previousCredits: "decimal",
          newGpa: "decimal",
          newCredits: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "gpa-target": {
    id: "gpa-target",
    labelKey: "gpa.operation.gpa-target",
    fields: [
      {
        id: "targetGpa",
        labelKey: "gpa.field.targetGpa",
        defaultValue: "3.5",
        input: "decimal",
        sign: "nonnegative",
      },
      {
        id: "totalCredits",
        labelKey: "gpa.field.totalCredits",
        defaultValue: "120",
        input: "decimal",
        unitKey: "gpa.unit.cr",
        sign: "nonnegative",
      },
    ],
    working: [
      {
        messageKey: "gpa.working.gpa-target",
        arguments: {
          targetGpa: "decimal",
          totalCredits: "decimal",
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
  calculatorId: "gpa";
  operation: string;
  answer: { kind: "decimal"; value: string };
  unitKey: string;
  working: readonly WorkingStep[];
  visual: {
    kind: "gpa";
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
  const credits = values.credits ?? new DecimalValue(0);
  const newCredits = values.newCredits ?? new DecimalValue(0);
  const newGpa = values.newGpa ?? new DecimalValue(0);
  const previousCredits = values.previousCredits ?? new DecimalValue(0);
  const previousGpa = values.previousGpa ?? new DecimalValue(0);
  const qualityPoints = values.qualityPoints ?? new DecimalValue(0);
  const targetGpa = values.targetGpa ?? new DecimalValue(0);
  const totalCredits = values.totalCredits ?? new DecimalValue(0);

  let value: InstanceType<typeof DecimalValue>;
  let unitKey: string;
  switch (input.operation) {
    case "gpa-average":
      value = qualityPoints.div(credits);
      unitKey = "gpa.answer.gpa";
      break;
    case "gpa-combined":
      value = previousGpa
        .mul(previousCredits)
        .plus(newGpa.mul(newCredits))
        .div(previousCredits.plus(newCredits));
      unitKey = "gpa.answer.gpa";
      break;
    case "gpa-target":
      value = targetGpa.mul(totalCredits);
      unitKey = "gpa.answer.qp";
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
      calculatorId: "gpa",
      operation: input.operation,
      answer: { kind: "decimal", value: answer },
      unitKey,
      working: [
        {
          id: "substitution",
          messageKey: `gpa.working.${input.operation}`,
          args,
        },
      ],
      visual: { kind: "gpa", dimensions, answer, unitKey },
    },
  };
}

function invalidDomain(
  field: string,
  value: InstanceType<typeof DecimalValue>,
  _operation: string,
): boolean {
  return field.toLowerCase().includes("credits") ? !value.gt(0) : value.lt(0);
}
