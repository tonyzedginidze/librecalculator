import type {
  UnitPresetError,
  UnitPresetInput,
  UnitPresetResult,
} from "../../../../calculators/src/runtime/unit-preset";
import {
  calculate,
  operations,
} from "../../../../calculators/src/speed-conversion";
import { parseLocaleDecimal } from "../../../../i18n/src/en";
import type { TopicAdapter } from "../../topic";
export const adapter: TopicAdapter<UnitPresetResult, UnitPresetError> = {
  id: "speed-conversion",
  schemaVersion: 1,
  descriptors: operations,
  parseField(raw, locale, field) {
    if (field.input === "choice")
      return field.choices?.some((choice) => choice.id === raw)
        ? { state: "valid", canonical: raw }
        : { state: "invalid", reason: "invalid-choice" };
    return parseLocaleDecimal(raw, locale);
  },
  calculate(operation, fields) {
    return calculate({ operation, ...fields } as UnitPresetInput);
  },
};
