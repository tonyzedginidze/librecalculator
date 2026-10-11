import type { DecimalValue } from "./decimal";
import { decimalOutput } from "./decimal";
import type { Unit } from "./unit-catalog";
export function convertUnitValue(
  value: InstanceType<typeof DecimalValue>,
  source: Unit,
  target: Unit,
):
  | { ok: true; value: InstanceType<typeof DecimalValue>; kelvin?: string }
  | {
      ok: false;
      code:
        | "incompatible-units"
        | "invalid-field"
        | "below-absolute-zero"
        | "output-overflow";
    } {
  if (source.dimension !== target.dimension)
    return { ok: false, code: "incompatible-units" };
  if (source.dimension === "temperature") {
    // Exact source comparison precedes affine arithmetic so rounding cannot admit sub-zero temperatures.
    if (
      value.lt(
        source.id === "c" ? "-273.15" : source.id === "f" ? "-459.67" : "0",
      )
    )
      return { ok: false, code: "below-absolute-zero" };
    const kelvin =
      source.id === "k"
        ? value
        : source.id === "c"
          ? value.plus("273.15")
          : value.minus(32).mul(5).div(9).plus("273.15");
    const converted =
      source.id === target.id
        ? value
        : target.id === "k"
          ? kelvin
          : target.id === "c"
            ? kelvin.minus("273.15")
            : kelvin.minus("273.15").mul(9).div(5).plus(32);
    const text = decimalOutput(kelvin);
    if (text === null) return { ok: false, code: "output-overflow" };
    return { ok: true, value: converted, kelvin: text };
  }
  if (!source.factor || !target.factor)
    return { ok: false, code: "invalid-field" };
  return {
    ok: true,
    value:
      source.id === target.id
        ? value
        : value
            .mul(source.factor)
            .mul(target.denominator ?? "1")
            .div(target.factor)
            .div(source.denominator ?? "1"),
  };
}
