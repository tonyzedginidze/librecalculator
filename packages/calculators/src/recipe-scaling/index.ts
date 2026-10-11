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

const quantityField = (defaultValue: string, labelKey: string) =>
  ({
    id: "quantity",
    labelKey,
    defaultValue,
    input: "decimal",
    unitKey: "recipe-scaling.unit.quantity",
    sign: "nonnegative",
  }) as const;
const servingFields = [
  {
    id: "originalServings",
    labelKey: "recipe-scaling.field.originalServings",
    defaultValue: "4",
    input: "decimal",
    unitKey: "recipe-scaling.unit.serving",
    sign: "nonnegative",
  },
  {
    id: "targetServings",
    labelKey: "recipe-scaling.field.targetServings",
    defaultValue: "6",
    input: "decimal",
    unitKey: "recipe-scaling.unit.serving",
    sign: "nonnegative",
  },
] as const;

export const operationDescriptors = {
  "recipe-scale": {
    id: "recipe-scale",
    labelKey: "recipe-scaling.operation.recipe-scale",
    fields: [
      quantityField("250", "recipe-scaling.field.quantity"),
      ...servingFields,
    ],
    working: [
      {
        messageKey: "recipe-scaling.working.recipe-scale",
        arguments: {
          quantity: "decimal",
          originalServings: "decimal",
          targetServings: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "recipe-factor": {
    id: "recipe-factor",
    labelKey: "recipe-scaling.operation.recipe-factor",
    fields: [...servingFields],
    working: [
      {
        messageKey: "recipe-scaling.working.recipe-factor",
        arguments: {
          originalServings: "decimal",
          targetServings: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "recipe-reverse": {
    id: "recipe-reverse",
    labelKey: "recipe-scaling.operation.recipe-reverse",
    fields: [
      quantityField("375", "recipe-scaling.field.scaledQuantity"),
      ...servingFields,
    ],
    working: [
      {
        messageKey: "recipe-scaling.working.recipe-reverse",
        arguments: {
          quantity: "decimal",
          originalServings: "decimal",
          targetServings: "decimal",
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
  calculatorId: "recipe-scaling";
  operation: string;
  answer: { kind: "decimal"; value: string };
  unitKey: string;
  working: readonly WorkingStep[];
  visual: {
    kind: "recipe-scaling";
    dimensions: Record<string, string>;
    answer: string;
    unitKey: string;
    /** target ÷ original servings, the multiplier applied to every ingredient. */
    factor: string;
    originalServings: string;
    targetServings: string;
    /** Quantity for the original yield (absent for the factor question). */
    originalQuantity?: string;
    /** Quantity for the target yield (absent for the factor question). */
    scaledQuantity?: string;
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
    if (field.id === "quantity" ? parsed.value.lt(0) : !parsed.value.gt(0))
      return {
        ok: false,
        error: { code: "nonpositive-dimension", field: field.id },
      };
    values[field.id] = parsed.value;
    dimensions[field.id] = parsed.canonical;
  }
  const originalServings = values.originalServings ?? new DecimalValue(1);
  const targetServings = values.targetServings ?? new DecimalValue(1);
  const quantity = values.quantity ?? new DecimalValue(0);
  const factor = decimalOutput(targetServings.div(originalServings));
  if (factor === null) return { ok: false, error: { code: "output-overflow" } };

  let value: InstanceType<typeof DecimalValue>;
  let unitKey: string;
  switch (input.operation) {
    case "recipe-scale":
      value = quantity.mul(targetServings).div(originalServings);
      unitKey = "recipe-scaling.answer.quantity";
      break;
    case "recipe-factor":
      value = targetServings.div(originalServings);
      unitKey = "recipe-scaling.answer.factor";
      break;
    case "recipe-reverse":
      value = quantity.mul(originalServings).div(targetServings);
      unitKey = "recipe-scaling.answer.quantity";
      break;
    default:
      return { ok: false, error: { code: "invalid-field" } };
  }
  const answer = decimalOutput(value);
  if (answer === null) return { ok: false, error: { code: "output-overflow" } };
  const quantities =
    input.operation === "recipe-scale"
      ? { originalQuantity: dimensions.quantity ?? "0", scaledQuantity: answer }
      : input.operation === "recipe-reverse"
        ? {
            originalQuantity: answer,
            scaledQuantity: dimensions.quantity ?? "0",
          }
        : {};
  const args = Object.fromEntries(
    Object.entries({ ...dimensions, answer }).map(([key, value]) => [
      key,
      { kind: "decimal" as const, value },
    ]),
  );
  return {
    ok: true,
    result: {
      calculatorId: "recipe-scaling",
      operation: input.operation,
      answer: { kind: "decimal", value: answer },
      unitKey,
      working: [
        {
          id: "substitution",
          messageKey: `recipe-scaling.working.${input.operation}`,
          args,
        },
      ],
      visual: {
        kind: "recipe-scaling",
        dimensions,
        answer,
        unitKey,
        factor,
        originalServings: dimensions.originalServings ?? "1",
        targetServings: dimensions.targetServings ?? "1",
        ...quantities,
      },
    },
  };
}
