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
  "celsius-to-fahrenheit": {
    id: "celsius-to-fahrenheit",
    labelKey: "oven-temperature.operation.celsius-to-fahrenheit",
    fields: [
      {
        id: "temperature",
        labelKey: "oven-temperature.field.temperature",
        defaultValue: "180",
        input: "decimal",
        unitKey: "oven-temperature.unit.celsius",
      },
    ],
    working: [
      {
        messageKey: "oven-temperature.working.celsius-to-fahrenheit",
        arguments: {
          temperature: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "fahrenheit-to-celsius": {
    id: "fahrenheit-to-celsius",
    labelKey: "oven-temperature.operation.fahrenheit-to-celsius",
    fields: [
      {
        id: "temperature",
        labelKey: "oven-temperature.field.temperature",
        defaultValue: "350",
        input: "decimal",
        unitKey: "oven-temperature.unit.fahrenheit",
      },
    ],
    working: [
      {
        messageKey: "oven-temperature.working.fahrenheit-to-celsius",
        arguments: {
          temperature: "decimal",
          answer: "decimal",
        },
      },
    ],
  },
  "fan-adjustment": {
    id: "fan-adjustment",
    labelKey: "oven-temperature.operation.fan-adjustment",
    fields: [
      {
        id: "temperature",
        labelKey: "oven-temperature.field.conventional",
        defaultValue: "180",
        input: "decimal",
        unitKey: "oven-temperature.unit.celsius",
      },
      {
        id: "reduction",
        labelKey: "oven-temperature.field.reduction",
        defaultValue: "20",
        input: "decimal",
        sign: "nonnegative",
        unitKey: "oven-temperature.unit.celsius",
      },
    ],
    working: [
      {
        messageKey: "oven-temperature.working.fan-adjustment",
        arguments: {
          temperature: "decimal",
          reduction: "decimal",
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
  calculatorId: "oven-temperature";
  operation: string;
  answer: { kind: "decimal"; value: string };
  unitKey: string;
  working: readonly WorkingStep[];
  visual: {
    kind: "oven-temperature";
    dimensions: Record<string, string>;
    answer: string;
    unitKey: string;
    /** Conversions: the same setting on both scales. */
    celsius?: string;
    fahrenheit?: string;
    /** Fan adjustment: conventional and fan settings in °C and the entered reduction. */
    conventional?: string;
    fan?: string;
    reduction?: string;
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
  const reduction = values.reduction ?? new DecimalValue(0);
  const temperature = values.temperature ?? new DecimalValue(0);

  let value: InstanceType<typeof DecimalValue>;
  let unitKey: string;
  switch (input.operation) {
    case "celsius-to-fahrenheit":
      value = temperature.mul(9).div(5).plus(32);
      unitKey = "oven-temperature.answer.fahrenheit";
      break;
    case "fahrenheit-to-celsius":
      value = temperature.minus(32).mul(5).div(9);
      unitKey = "oven-temperature.answer.celsius";
      break;
    case "fan-adjustment":
      value = temperature.minus(reduction);
      unitKey = "oven-temperature.answer.celsius";
      break;
    default:
      return { ok: false, error: { code: "invalid-field" } };
  }
  if (input.operation === "fan-adjustment" && value.lt("-273.15"))
    return {
      ok: false,
      error: { code: "nonpositive-dimension", field: "temperature" },
    };
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
      calculatorId: "oven-temperature",
      operation: input.operation,
      answer: { kind: "decimal", value: answer },
      unitKey,
      working: [
        {
          id: "substitution",
          messageKey: `oven-temperature.working.${input.operation}`,
          args,
        },
      ],
      visual: {
        kind: "oven-temperature",
        dimensions,
        answer,
        unitKey,
        ...(input.operation === "celsius-to-fahrenheit"
          ? { celsius: dimensions.temperature ?? "0", fahrenheit: answer }
          : input.operation === "fahrenheit-to-celsius"
            ? { celsius: answer, fahrenheit: dimensions.temperature ?? "0" }
            : {
                conventional: dimensions.temperature ?? "0",
                fan: answer,
                reduction: dimensions.reduction ?? "0",
              }),
      },
    },
  };
}

function invalidDomain(
  field: string,
  value: InstanceType<typeof DecimalValue>,
  operation: string,
): boolean {
  return field === "temperature"
    ? value.lt(operation === "fahrenheit-to-celsius" ? "-459.67" : "-273.15")
    : value.lt(0);
}
