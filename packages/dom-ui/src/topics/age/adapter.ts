import {
  calculate,
  type Input,
  operations,
} from "../../../../calculators/src/age";
import type {
  NumericError,
  NumericResult,
} from "../../../../calculators/src/runtime/numeric-result";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter } from "../../topic";
export const adapter: TopicAdapter<NumericResult, NumericError> = {
  id: "age",
  schemaVersion: 1,
  descriptors: operations,
  parseField(raw, locale, field) {
    if (field.input === "text") {
      return raw ? { state: "valid", canonical: raw } : { state: "incomplete" };
    }
    return parseLocaleDecimal(raw, locale);
  },
  calculate(operation, fields) {
    return calculate({ operation, ...fields } as Input);
  },
};
