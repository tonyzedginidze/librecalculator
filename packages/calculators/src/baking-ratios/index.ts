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
  "baker-percent": {
    id: "baker-percent",
    labelKey: "baking-ratios.operation.baker-percent",
    fields: [
      {
        id: "ingredient",
        labelKey: "baking-ratios.field.ingredient",
        defaultValue: "325",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "baking-ratios.unit.gram",
      },
      {
        id: "flour",
        labelKey: "baking-ratios.field.flour",
        defaultValue: "500",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "baking-ratios.unit.gram",
      },
    ],
    working: [
      {
        messageKey: "baking-ratios.working.baker-percent",
        arguments: {
          ingredient: "decimal",
          flour: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "ingredient-mass": {
    id: "ingredient-mass",
    labelKey: "baking-ratios.operation.ingredient-mass",
    fields: [
      {
        id: "flour",
        labelKey: "baking-ratios.field.flour",
        defaultValue: "500",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "baking-ratios.unit.gram",
      },
      {
        id: "percentage",
        labelKey: "baking-ratios.field.percentage",
        defaultValue: "65",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "baking-ratios.unit.percent",
      },
    ],
    working: [
      {
        messageKey: "baking-ratios.working.ingredient-mass",
        arguments: {
          flour: "decimal",
          percentage: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "flour-mass": {
    id: "flour-mass",
    labelKey: "baking-ratios.operation.flour-mass",
    fields: [
      {
        id: "ingredient",
        labelKey: "baking-ratios.field.ingredient",
        defaultValue: "325",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "baking-ratios.unit.gram",
      },
      {
        id: "percentage",
        labelKey: "baking-ratios.field.percentage",
        defaultValue: "65",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "baking-ratios.unit.percent",
      },
    ],
    working: [
      {
        messageKey: "baking-ratios.working.flour-mass",
        arguments: {
          ingredient: "decimal",
          percentage: "decimal",
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
  calculatorId: "baking-ratios";
  operation: string;
  answer: { kind: "decimal"; value: string };
  unitKey: string;
  working: readonly WorkingStep[];
  visual: {
    kind: "baking-ratios";
    dimensions: Record<string, string>;
    answer: string;
    unitKey: string;
    /** All three quantities after solving for the missing one. */
    flour: string;
    ingredient: string;
    percentage: string;
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
      return {
        ok: false,
        error: { code: "nonpositive-dimension", field: field.id },
      };
    values[field.id] = parsed.value;
    dimensions[field.id] = parsed.canonical;
  }
  const flour = values.flour ?? new DecimalValue(0);
  const ingredient = values.ingredient ?? new DecimalValue(0);
  const percentage = values.percentage ?? new DecimalValue(0);

  let value: InstanceType<typeof DecimalValue>;
  let unitKey: string;
  switch (input.operation) {
    case "baker-percent":
      value = ingredient.div(flour).mul(100);
      unitKey = "baking-ratios.answer.percent";
      break;
    case "ingredient-mass":
      value = flour.mul(percentage).div(100);
      unitKey = "baking-ratios.answer.gram";
      break;
    case "flour-mass":
      value = ingredient.mul(100).div(percentage);
      unitKey = "baking-ratios.answer.gram";
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
      calculatorId: "baking-ratios",
      operation: input.operation,
      answer: { kind: "decimal", value: answer },
      unitKey,
      working: [
        {
          id: "substitution",
          messageKey: `baking-ratios.working.${input.operation}`,
          args,
        },
      ],
      visual: {
        kind: "baking-ratios",
        dimensions,
        answer,
        unitKey,
        flour: dimensions.flour ?? answer,
        ingredient: dimensions.ingredient ?? answer,
        percentage: dimensions.percentage ?? answer,
      },
    },
  };
}

function invalidDomain(
  field: string,
  value: InstanceType<typeof DecimalValue>,
  operation: string,
): boolean {
  return field === "flour" ||
    (field === "percentage" && operation === "flour-mass")
    ? !value.gt(0)
    : value.lt(0);
}
