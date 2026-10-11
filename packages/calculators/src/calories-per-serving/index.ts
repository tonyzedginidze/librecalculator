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
  "portion-calories": {
    id: "portion-calories",
    labelKey: "calories-per-serving.operation.portion-calories",
    fields: [
      {
        id: "totalCalories",
        labelKey: "calories-per-serving.field.totalCalories",
        defaultValue: "2400",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "calories-per-serving.unit.kcal",
      },
      {
        id: "servings",
        labelKey: "calories-per-serving.field.servings",
        defaultValue: "8",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "calories-per-serving.unit.serving",
      },
    ],
    working: [
      {
        messageKey: "calories-per-serving.working.portion-calories",
        arguments: {
          totalCalories: "decimal",
          servings: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "recipe-calories": {
    id: "recipe-calories",
    labelKey: "calories-per-serving.operation.recipe-calories",
    fields: [
      {
        id: "portionCalories",
        labelKey: "calories-per-serving.field.portionCalories",
        defaultValue: "300",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "calories-per-serving.unit.kcal",
      },
      {
        id: "servings",
        labelKey: "calories-per-serving.field.servings",
        defaultValue: "8",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "calories-per-serving.unit.serving",
      },
    ],
    working: [
      {
        messageKey: "calories-per-serving.working.recipe-calories",
        arguments: {
          portionCalories: "decimal",
          servings: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "portion-weight": {
    id: "portion-weight",
    labelKey: "calories-per-serving.operation.portion-weight",
    fields: [
      {
        id: "totalCalories",
        labelKey: "calories-per-serving.field.totalCalories",
        defaultValue: "2400",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "calories-per-serving.unit.kcal",
      },
      {
        id: "totalGrams",
        labelKey: "calories-per-serving.field.totalGrams",
        defaultValue: "1600",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "calories-per-serving.unit.gram",
      },
      {
        id: "portionGrams",
        labelKey: "calories-per-serving.field.portionGrams",
        defaultValue: "250",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "calories-per-serving.unit.gram",
      },
    ],
    working: [
      {
        messageKey: "calories-per-serving.working.portion-weight",
        arguments: {
          totalCalories: "decimal",
          totalGrams: "decimal",
          portionGrams: "decimal",
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
  calculatorId: "calories-per-serving";
  operation: string;
  answer: { kind: "decimal"; value: string };
  unitKey: string;
  working: readonly WorkingStep[];
  visual: {
    kind: "calories-per-serving";
    dimensions: Record<string, string>;
    answer: string;
    unitKey: string;
    totalCalories: string;
    portionCalories: string;
    /** Count-based questions only. */
    servings?: string;
    /** Weight-based question only; remainder is the rest of the batch, floored at zero. */
    totalGrams?: string;
    portionGrams?: string;
    remainderGrams?: string;
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
  const portionCalories = values.portionCalories ?? new DecimalValue(0);
  const portionGrams = values.portionGrams ?? new DecimalValue(0);
  const servings = values.servings ?? new DecimalValue(0);
  const totalCalories = values.totalCalories ?? new DecimalValue(0);
  const totalGrams = values.totalGrams ?? new DecimalValue(0);

  let value: InstanceType<typeof DecimalValue>;
  let unitKey: string;
  switch (input.operation) {
    case "portion-calories":
      value = totalCalories.div(servings);
      unitKey = "calories-per-serving.answer.kcal";
      break;
    case "recipe-calories":
      value = portionCalories.mul(servings);
      unitKey = "calories-per-serving.answer.kcal";
      break;
    case "portion-weight":
      value = totalCalories.mul(portionGrams).div(totalGrams);
      unitKey = "calories-per-serving.answer.kcal";
      break;
    default:
      return { ok: false, error: { code: "invalid-field" } };
  }
  const answer = decimalOutput(value);
  if (answer === null) return { ok: false, error: { code: "output-overflow" } };
  const remainder = totalGrams.minus(portionGrams);
  const parts =
    input.operation === "portion-weight"
      ? {
          totalCalories: dimensions.totalCalories ?? "0",
          portionCalories: answer,
          totalGrams: dimensions.totalGrams ?? "0",
          portionGrams: dimensions.portionGrams ?? "0",
          remainderGrams: remainder.lt(0) ? "0" : remainder.toFixed(),
        }
      : input.operation === "portion-calories"
        ? {
            totalCalories: dimensions.totalCalories ?? "0",
            portionCalories: answer,
            servings: dimensions.servings ?? "0",
          }
        : {
            totalCalories: answer,
            portionCalories: dimensions.portionCalories ?? "0",
            servings: dimensions.servings ?? "0",
          };
  const args = Object.fromEntries(
    Object.entries({ ...dimensions, answer }).map(([key, value]) => [
      key,
      { kind: "decimal" as const, value },
    ]),
  );
  return {
    ok: true,
    result: {
      calculatorId: "calories-per-serving",
      operation: input.operation,
      answer: { kind: "decimal", value: answer },
      unitKey,
      working: [
        {
          id: "substitution",
          messageKey: `calories-per-serving.working.${input.operation}`,
          args,
        },
      ],
      visual: {
        kind: "calories-per-serving",
        dimensions,
        answer,
        unitKey,
        ...parts,
      },
    },
  };
}

function invalidDomain(
  field: string,
  value: InstanceType<typeof DecimalValue>,
): boolean {
  return field === "servings" || field === "totalGrams"
    ? !value.gt(0)
    : value.lt(0);
}
