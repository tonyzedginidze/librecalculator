import {
  calculate,
  type FuelEconomyResult,
  type Input,
  operations,
} from "../../../../calculators/src/fuel-economy";
import type { NumericError } from "../../../../calculators/src/runtime/numeric-result";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter } from "../../topic";
export const adapter: TopicAdapter<FuelEconomyResult, NumericError> = {
  id: "fuel-economy",
  schemaVersion: 1,
  descriptors: operations,
  parseField(raw, locale, field) {
    if (field.input === "text") {
      if (!raw) return { state: "incomplete" };
      const tokens = raw.split(";");
      if (tokens.length > 100)
        return { state: "invalid", reason: "invalid-number" };
      const values = [];
      for (const token of tokens) {
        const parsed = parseLocaleDecimal(token.trim(), locale);
        if (parsed.state !== "valid") return parsed;
        values.push(parsed.canonical);
      }
      return { state: "valid", canonical: values.join(";") };
    }
    return parseLocaleDecimal(raw, locale);
  },
  calculate(operation, fields) {
    return calculate({ operation, ...fields } as Input);
  },
};
