import {
  calculate,
  type ErrorCode,
  type Input,
  operationDescriptors,
  operations,
  type Result,
} from "../../../../calculators/src/oven-temperature";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter } from "../../topic";
export const adapter: TopicAdapter<Result, ErrorCode> = {
  id: "oven-temperature",
  schemaVersion: 1,
  descriptors: operations,
  parseField(raw, locale) {
    return parseLocaleDecimal(raw, locale);
  },
  calculate(operation, fields) {
    if (!Object.hasOwn(operationDescriptors, operation))
      return { ok: false, error: { code: "invalid-field" } };
    return calculate({ operation, ...fields } as Input);
  },
};
