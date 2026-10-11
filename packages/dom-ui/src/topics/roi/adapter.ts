import {
  calculate,
  type ErrorCode,
  type Input,
  operations,
  type Result,
} from "../../../../calculators/src/roi";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter } from "../../topic";
export const adapter: TopicAdapter<Result, ErrorCode> = {
  id: "roi",
  schemaVersion: 1,
  descriptors: operations,
  parseField(raw, locale, field) {
    if (field.input === "integer") {
      const text = raw.trim();
      return text === ""
        ? { state: "incomplete" }
        : /^\d+$/.test(text)
          ? { state: "valid", canonical: text }
          : { state: "invalid", reason: "invalid-character" };
    }
    return parseLocaleDecimal(raw, locale);
  },
  calculate(operation, fields) {
    return calculate({ ...fields, operation } as Input);
  },
};

/** Working-step arguments that are whole-cent dollar amounts. */
export const moneyArgs = ["proceeds", "fees", "investment"] as const;
