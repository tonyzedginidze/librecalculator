import { makeUnitPreset } from "../runtime/unit-preset";

export type {
  UnitPresetError as ErrorCode,
  UnitPresetInput as Input,
  UnitPresetResult as Result,
} from "../runtime/unit-preset";
export { unitPresetErrors as errorCodes } from "../runtime/unit-preset";
export const { operationDescriptors, operations, calculate } = makeUnitPreset(
  "cooking-measures",
  [
    "ml",
    "l",
    "us-fluid-ounce",
    "us-cup",
    "us-pint",
    "us-quart",
    "us-gallon",
    "imperial-fluid-ounce",
    "imperial-pint",
    "imperial-gallon",
    "metric-cup",
    "metric-teaspoon",
    "metric-tablespoon",
    "australian-tablespoon",
  ],
  "us-cup",
  "ml",
);
