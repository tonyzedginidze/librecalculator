import { makeUnitPreset } from "../runtime/unit-preset";

export type {
  UnitPresetError as ErrorCode,
  UnitPresetInput as Input,
  UnitPresetResult as Result,
} from "../runtime/unit-preset";
export { unitPresetErrors as errorCodes } from "../runtime/unit-preset";
export const { operationDescriptors, operations, calculate } = makeUnitPreset(
  "temperature",
  ["c", "f", "k"],
  "c",
  "f",
  "20",
);
