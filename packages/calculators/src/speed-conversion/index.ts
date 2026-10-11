import { makeUnitPreset } from "../runtime/unit-preset";

export type {
  UnitPresetError as ErrorCode,
  UnitPresetInput as Input,
  UnitPresetResult as Result,
} from "../runtime/unit-preset";
export { unitPresetErrors as errorCodes } from "../runtime/unit-preset";
export const { operationDescriptors, operations, calculate } = makeUnitPreset(
  "speed-conversion",
  ["m-per-s", "km-per-h", "mi-per-h", "ft-per-s", "knot"],
  "km-per-h",
  "mi-per-h",
  "100",
);
