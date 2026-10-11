import type {
  CalculationResult,
  FieldDescriptor,
} from "../../../../calculators/src/contracts";
import {
  calculate,
  operations,
  type VolumeErrorCode,
  type VolumeInput,
  type VolumeResult,
} from "../../../../calculators/src/volume/index";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter, TopicFieldParse } from "../../topic";

export function volumeInput(
  operation: string,
  fields: Readonly<Record<string, string>>,
): VolumeInput | null {
  if (operation === "prism") {
    const width = fields.width;
    const height = fields.height;
    const depth = fields.depth;
    if (width === undefined || height === undefined || depth === undefined) {
      return null;
    }
    return { operation: "prism", width, height, depth };
  }
  if (operation === "cylinder") {
    const radius = fields.radius;
    const height = fields.height;
    if (radius === undefined || height === undefined) return null;
    return { operation: "cylinder", radius, height };
  }
  if (operation === "sphere") {
    const radius = fields.radius;
    if (radius === undefined) return null;
    return { operation: "sphere", radius };
  }
  return null;
}

export const adapter: TopicAdapter<VolumeResult, VolumeErrorCode> = {
  id: "volume",
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
  ): CalculationResult<VolumeResult, VolumeErrorCode> {
    const input = volumeInput(operationId, fields);
    if (!input) {
      return {
        ok: false,
        error: { code: "invalid-field" },
      };
    }
    return calculate(input);
  },
};
