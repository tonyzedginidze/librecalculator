import type {
  CalculationResult,
  OperationDescriptor,
  WorkingStep,
} from "../contracts";
import {
  type DecimalValue,
  decimalOutput,
  parseCanonicalDecimal,
} from "../numeric/decimal";
export type Input = {
  operation: "protein-grams" | "carbohydrate-grams" | "fat-grams";
  calories: string;
  protein: string;
  carbohydrate: string;
  fat: string;
  age: string;
};
const fields = [
  {
    id: "calories",
    labelKey: "macros.field.calories",
    unitKey: "macros.unit.kcal",
    sign: "nonnegative",
    defaultValue: "2000",
    input: "decimal",
  },
  {
    id: "protein",
    labelKey: "macros.field.protein",
    unitKey: "macros.unit.percent",
    sign: "nonnegative",
    defaultValue: "20",
    input: "decimal",
  },
  {
    id: "carbohydrate",
    labelKey: "macros.field.carbohydrate",
    unitKey: "macros.unit.percent",
    sign: "nonnegative",
    defaultValue: "50",
    input: "decimal",
  },
  {
    id: "fat",
    labelKey: "macros.field.fat",
    unitKey: "macros.unit.percent",
    sign: "nonnegative",
    defaultValue: "30",
    input: "decimal",
  },
  {
    id: "age",
    labelKey: "macros.field.age",
    unitKey: "macros.unit.years",
    sign: "nonnegative",
    defaultValue: "30",
    input: "integer",
  },
] satisfies OperationDescriptor["fields"];
const working = [
  {
    messageKey: "macros.working.summary",
    arguments: {
      calories: "decimal",
      protein: "decimal",
      carbohydrate: "decimal",
      fat: "decimal",
      age: "decimal",
      question: "message",
      answer: "decimal",
    },
  },
] satisfies OperationDescriptor["working"];
export const operationDescriptors = {
  "protein-grams": {
    id: "protein-grams",
    labelKey: "macros.operation.protein-grams",
    fields,
    working,
  },
  "carbohydrate-grams": {
    id: "carbohydrate-grams",
    labelKey: "macros.operation.carbohydrate-grams",
    fields,
    working,
  },
  "fat-grams": {
    id: "fat-grams",
    labelKey: "macros.operation.fat-grams",
    fields,
    working,
  },
} satisfies Record<Input["operation"], OperationDescriptor>;
export const operations = Object.values(operationDescriptors);
export const errorCodes = [
  "invalid-field",
  "out-of-range",
  "output-overflow",
] as const;
export type ErrorCode = (typeof errorCodes)[number];
export type Macro = "protein" | "carbohydrate" | "fat";
const factors: Record<Macro, number> = { protein: 4, carbohydrate: 4, fat: 9 };
const selectedMacro: Record<Input["operation"], Macro> = {
  "protein-grams": "protein",
  "carbohydrate-grams": "carbohydrate",
  "fat-grams": "fat",
};
export type Result = {
  calculatorId: "macros";
  operation: Input["operation"];
  answer: { kind: "decimal"; value: string };
  working: readonly WorkingStep[];
  visual: {
    kind: "comparison";
    answer: string;
    reference: string;
    /** Every macronutrient's calories and grams for the same split; the selected one equals `answer`. */
    parts: readonly {
      id: Macro;
      kcal: string;
      grams: string;
      selected: boolean;
    }[];
    descriptionKey: string;
    alternativeKey: string;
  };
};
function failure(
  code: ErrorCode,
  field?: string,
): CalculationResult<Result, ErrorCode> {
  return { ok: false, error: { code, ...(field ? { field } : {}) } };
}
export function calculate(input: Input): CalculationResult<Result, ErrorCode> {
  if (!Object.hasOwn(operationDescriptors, input.operation))
    return failure("invalid-field");
  const v = {} as Record<string, InstanceType<typeof DecimalValue>>;
  const calories = parseCanonicalDecimal(input.calories);
  if (!calories.ok) return failure("invalid-field", "calories");
  if (calories.value.lt(100) || calories.value.gt(10000))
    return failure("out-of-range", "calories");
  v.calories = calories.value;
  const protein = parseCanonicalDecimal(input.protein);
  if (!protein.ok) return failure("invalid-field", "protein");
  if (protein.value.lt(0) || protein.value.gt(100))
    return failure("out-of-range", "protein");
  v.protein = protein.value;
  const carbohydrate = parseCanonicalDecimal(input.carbohydrate);
  if (!carbohydrate.ok) return failure("invalid-field", "carbohydrate");
  if (carbohydrate.value.lt(0) || carbohydrate.value.gt(100))
    return failure("out-of-range", "carbohydrate");
  v.carbohydrate = carbohydrate.value;
  const fat = parseCanonicalDecimal(input.fat);
  if (!fat.ok) return failure("invalid-field", "fat");
  if (fat.value.lt(0) || fat.value.gt(100))
    return failure("out-of-range", "fat");
  v.fat = fat.value;
  const age = parseCanonicalDecimal(input.age);
  if (!age.ok) return failure("invalid-field", "age");
  if (age.value.lt(20) || age.value.gt(120) || !/^\d+$/.test(input.age))
    return failure("out-of-range", "age");
  v.age = age.value;
  if (!v.protein.add(v.carbohydrate).add(v.fat).eq(100))
    return failure("out-of-range", "fat");
  const reference = v.calories;
  const macros: readonly Macro[] = ["protein", "carbohydrate", "fat"];
  const parts: Result["visual"]["parts"][number][] = [];
  for (const id of macros) {
    const kcal = v.calories
      .mul(v[id] as InstanceType<typeof DecimalValue>)
      .div(100);
    const kcalText = decimalOutput(kcal);
    const gramsText = decimalOutput(kcal.div(factors[id]));
    if (kcalText === null || gramsText === null)
      return failure("output-overflow");
    parts.push({
      id,
      kcal: kcalText,
      grams: gramsText,
      selected: selectedMacro[input.operation] === id,
    });
  }
  const value = parts.find((p) => p.selected)?.grams ?? null;
  const ref = decimalOutput(reference);
  if (value === null || ref === null) return failure("output-overflow");
  return {
    ok: true,
    result: {
      calculatorId: "macros",
      operation: input.operation,
      answer: { kind: "decimal", value },
      working: [
        {
          id: "summary",
          messageKey: "macros.working.summary",
          args: {
            calories: { kind: "decimal", value: v.calories.toFixed() },
            protein: { kind: "decimal", value: v.protein.toFixed() },
            carbohydrate: { kind: "decimal", value: v.carbohydrate.toFixed() },
            fat: { kind: "decimal", value: v.fat.toFixed() },
            age: { kind: "decimal", value: v.age.toFixed() },
            question: {
              kind: "message",
              key: `macros.operation.${input.operation}`,
            },
            answer: { kind: "decimal", value },
          },
        },
      ],
      visual: {
        kind: "comparison",
        answer: value,
        reference: ref,
        parts,
        descriptionKey: "macros.visual.description",
        alternativeKey: "macros.visual.alternative",
      },
    },
  };
}
