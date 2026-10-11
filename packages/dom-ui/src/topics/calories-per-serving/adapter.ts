import {
  calculate,
  type ErrorCode,
  type Input,
  operationDescriptors,
  operations,
  type Result,
} from "../../../../calculators/src/calories-per-serving";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter } from "../../topic";
export const adapter: TopicAdapter<Result, ErrorCode> = {
  id: "calories-per-serving",
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
