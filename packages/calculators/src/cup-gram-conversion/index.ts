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
  "cups-to-grams": {
    id: "cups-to-grams",
    labelKey: "cup-gram-conversion.operation.cups-to-grams",
    fields: [
      {
        id: "cups",
        labelKey: "cup-gram-conversion.field.cups",
        defaultValue: "2",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "cup-gram-conversion.unit.cup",
      },
      {
        id: "gramsPerCup",
        labelKey: "cup-gram-conversion.field.gramsPerCup",
        defaultValue: "120",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "cup-gram-conversion.unit.grams-per-cup",
      },
    ],
    working: [
      {
        messageKey: "cup-gram-conversion.working.cups-to-grams",
        arguments: {
          cups: "decimal",
          gramsPerCup: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "grams-to-cups": {
    id: "grams-to-cups",
    labelKey: "cup-gram-conversion.operation.grams-to-cups",
    fields: [
      {
        id: "grams",
        labelKey: "cup-gram-conversion.field.grams",
        defaultValue: "300",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "cup-gram-conversion.unit.gram",
      },
      {
        id: "gramsPerCup",
        labelKey: "cup-gram-conversion.field.gramsPerCup",
        defaultValue: "120",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "cup-gram-conversion.unit.grams-per-cup",
      },
    ],
    working: [
      {
        messageKey: "cup-gram-conversion.working.grams-to-cups",
        arguments: {
          grams: "decimal",
          gramsPerCup: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "half-cup-grams": {
    id: "half-cup-grams",
    labelKey: "cup-gram-conversion.operation.half-cup-grams",
    fields: [
      {
        id: "gramsPerCup",
        labelKey: "cup-gram-conversion.field.gramsPerCup",
        defaultValue: "120",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "cup-gram-conversion.unit.grams-per-cup",
      },
    ],
    working: [
      {
        messageKey: "cup-gram-conversion.working.half-cup-grams",
        arguments: {
          gramsPerCup: "decimal",
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
export type ErrorCode =
  | "invalid-field"
  | "nonpositive-dimension"
  | "output-overflow";
export const errorCodes = [
  "invalid-field",
  "nonpositive-dimension",
  "output-overflow",
] as const;
export type Result = {
  calculatorId: "cup-gram-conversion";
  operation: string;
  answer: { kind: "decimal"; value: string };
  unitKey: string;
  working: readonly WorkingStep[];
  visual: {
    kind: "cup-gram-conversion";
    dimensions: Record<string, string>;
    answer: string;
    unitKey: string;
    /** The same amount read in cups and in grams, plus the calibration linking them. */
    cups: string;
    grams: string;
    gramsPerCup: string;
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
    if (invalidDomain(field.id, parsed.value))
      return {
        ok: false,
        error: { code: "nonpositive-dimension", field: field.id },
      };
    values[field.id] = parsed.value;
    dimensions[field.id] = parsed.canonical;
  }
  const cups = values.cups ?? new DecimalValue(0);
  const grams = values.grams ?? new DecimalValue(0);
  const gramsPerCup = values.gramsPerCup ?? new DecimalValue(0);

  let value: InstanceType<typeof DecimalValue>;
  let unitKey: string;
  switch (input.operation) {
    case "cups-to-grams":
      value = cups.mul(gramsPerCup);
      unitKey = "cup-gram-conversion.answer.gram";
      break;
    case "grams-to-cups":
      value = grams.div(gramsPerCup);
      unitKey = "cup-gram-conversion.answer.cup";
      break;
    case "half-cup-grams":
      value = gramsPerCup.div(2);
      unitKey = "cup-gram-conversion.answer.gram";
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
      calculatorId: "cup-gram-conversion",
      operation: input.operation,
      answer: { kind: "decimal", value: answer },
      unitKey,
      working: [
        {
          id: "substitution",
          messageKey: `cup-gram-conversion.working.${input.operation}`,
          args,
        },
      ],
      visual: {
        kind: "cup-gram-conversion",
        dimensions,
        answer,
        unitKey,
        cups:
          input.operation === "grams-to-cups"
            ? answer
            : input.operation === "half-cup-grams"
              ? "0.5"
              : (dimensions.cups ?? "0"),
        grams:
          input.operation === "grams-to-cups"
            ? (dimensions.grams ?? "0")
            : answer,
        gramsPerCup: dimensions.gramsPerCup ?? "0",
      },
    },
  };
}

function invalidDomain(
  field: string,
  value: InstanceType<typeof DecimalValue>,
): boolean {
  return field === "gramsPerCup" ? !value.gt(0) : value.lt(0);
}
