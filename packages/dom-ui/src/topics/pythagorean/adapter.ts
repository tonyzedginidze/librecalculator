import type {
  CalculationResult,
  FieldDescriptor,
} from "../../../../calculators/src/contracts";
import {
  calculate,
  operations,
  type PythagoreanErrorCode,
  type PythagoreanInput,
  type PythagoreanResult,
} from "../../../../calculators/src/pythagorean/index";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter, TopicFieldParse } from "../../topic";

export function pythagoreanInput(
  operation: string,
  fields: Readonly<Record<string, string>>,
): PythagoreanInput | null {
  if (operation === "missing-hypotenuse") {
    const a = fields.a;
    const b = fields.b;
    if (a === undefined || b === undefined) return null;
    return { operation: "missing-hypotenuse", a, b };
  }
  if (operation === "missing-leg") {
    const hypotenuse = fields.hypotenuse;
    const leg = fields.leg;
    if (hypotenuse === undefined || leg === undefined) return null;
    return { operation: "missing-leg", hypotenuse, leg };
  }
  return null;
}

export const adapter: TopicAdapter<PythagoreanResult, PythagoreanErrorCode> = {
  id: "pythagorean",
  schemaVersion: 1,
  descriptors: operations,
  parseField(
    raw: string,
    locale: string,
    _field: FieldDescriptor,
  ): TopicFieldParse {
    return parseLocaleDecimal(raw, locale);
  },
  calculate(
    operationId: string,
    fields: Record<string, string>,
  ): CalculationResult<PythagoreanResult, PythagoreanErrorCode> {
    const input = pythagoreanInput(operationId, fields);
    if (!input) {
      return {
        ok: false,
        error: { code: "invalid-field" },
      };
    }
    return calculate(input);
  },
};
