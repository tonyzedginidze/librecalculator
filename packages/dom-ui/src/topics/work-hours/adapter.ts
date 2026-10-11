import type {
  NumericError,
  NumericResult,
} from "../../../../calculators/src/runtime/numeric-result";
import {
  calculate,
  type Input,
  operations,
} from "../../../../calculators/src/work-hours";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter } from "../../topic";
export const adapter: TopicAdapter<NumericResult, NumericError> = {
  id: "work-hours",
  schemaVersion: 2,
  descriptors: operations,
  parseField(raw, locale, field) {
    if (field.input === "choice")
      return field.choices?.some((choice) => choice.id === raw)
        ? { state: "valid", canonical: raw }
        : { state: "invalid", reason: "invalid-choice" };
    if (field.input === "text") {
      return raw ? { state: "valid", canonical: raw } : { state: "incomplete" };
    }
    return parseLocaleDecimal(raw, locale);
  },
  calculate(operation, fields) {
    return calculate({ operation, ...fields } as Input);
  },
};
