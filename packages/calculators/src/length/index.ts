import { makeUnitPreset } from "../runtime/unit-preset";

export type {
  UnitPresetError as ErrorCode,
  UnitPresetInput as Input,
  UnitPresetResult as Result,
} from "../runtime/unit-preset";
export { unitPresetErrors as errorCodes } from "../runtime/unit-preset";
export const { operationDescriptors, operations, calculate } = makeUnitPreset(
  "length",
  ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"],
  "in",
  "cm",
  "12",
);
