export type UnitDimension =
  | "length"
  | "mass"
  | "temperature"
  | "area"
  | "volume"
  | "time"
  | "speed";
export type Unit = {
  id: string;
  dimension: UnitDimension;
  labelKey: string;
  factor?: string;
  denominator?: string;
};

export const baseUnits = [
  {
    id: "mm",
    dimension: "length",
    labelKey: "unit-conversion.unit.mm",
    factor: "0.001",
  },
  {
    id: "cm",
    dimension: "length",
    labelKey: "unit-conversion.unit.cm",
    factor: "0.01",
  },
  {
    id: "m",
    dimension: "length",
    labelKey: "unit-conversion.unit.m",
    factor: "1",
  },
  {
    id: "km",
    dimension: "length",
    labelKey: "unit-conversion.unit.km",
    factor: "1000",
  },
  {
    id: "in",
    dimension: "length",
    labelKey: "unit-conversion.unit.in",
    factor: "0.0254",
  },
  {
    id: "ft",
    dimension: "length",
    labelKey: "unit-conversion.unit.ft",
    factor: "0.3048",
  },
  {
    id: "yd",
    dimension: "length",
    labelKey: "unit-conversion.unit.yd",
    factor: "0.9144",
  },
  {
    id: "mi",
    dimension: "length",
    labelKey: "unit-conversion.unit.mi",
    factor: "1609.344",
  },
  {
    id: "mg",
    dimension: "mass",
    labelKey: "unit-conversion.unit.mg",
    factor: "0.000001",
  },
  {
    id: "g",
    dimension: "mass",
    labelKey: "unit-conversion.unit.g",
    factor: "0.001",
  },
  {
    id: "kg",
    dimension: "mass",
    labelKey: "unit-conversion.unit.kg",
    factor: "1",
  },
  {
    id: "oz",
    dimension: "mass",
    labelKey: "unit-conversion.unit.oz",
    factor: "0.028349523125",
  },
  {
    id: "lb",
    dimension: "mass",
    labelKey: "unit-conversion.unit.lb",
    factor: "0.45359237",
  },
  { id: "c", dimension: "temperature", labelKey: "unit-conversion.unit.c" },
  { id: "f", dimension: "temperature", labelKey: "unit-conversion.unit.f" },
  { id: "k", dimension: "temperature", labelKey: "unit-conversion.unit.k" },
  {
    id: "mm2",
    dimension: "area",
    labelKey: "unit-conversion.unit.mm2",
    factor: "0.000001",
  },
  {
    id: "cm2",
    dimension: "area",
    labelKey: "unit-conversion.unit.cm2",
    factor: "0.0001",
  },
  {
    id: "m2",
    dimension: "area",
    labelKey: "unit-conversion.unit.m2",
    factor: "1",
  },
  {
    id: "km2",
    dimension: "area",
    labelKey: "unit-conversion.unit.km2",
    factor: "1000000",
  },
  {
    id: "in2",
    dimension: "area",
    labelKey: "unit-conversion.unit.in2",
    factor: "0.00064516",
  },
  {
    id: "ft2",
    dimension: "area",
    labelKey: "unit-conversion.unit.ft2",
    factor: "0.09290304",
  },
  {
    id: "acre",
    dimension: "area",
    labelKey: "unit-conversion.unit.acre",
    factor: "4046.8564224",
  },
  {
    id: "hectare",
    dimension: "area",
    labelKey: "unit-conversion.unit.hectare",
    factor: "10000",
  },
  {
    id: "ml",
    dimension: "volume",
    labelKey: "unit-conversion.unit.ml",
    factor: "0.000001",
  },
  {
    id: "l",
    dimension: "volume",
    labelKey: "unit-conversion.unit.l",
    factor: "0.001",
  },
  {
    id: "m3",
    dimension: "volume",
    labelKey: "unit-conversion.unit.m3",
    factor: "1",
  },
  {
    id: "us-fluid-ounce",
    dimension: "volume",
    labelKey: "unit-conversion.unit.us-fluid-ounce",
    factor: "0.0000295735295625",
  },
  {
    id: "us-cup",
    dimension: "volume",
    labelKey: "unit-conversion.unit.us-cup",
    factor: "0.0002365882365",
  },
  {
    id: "us-pint",
    dimension: "volume",
    labelKey: "unit-conversion.unit.us-pint",
    factor: "0.000473176473",
  },
  {
    id: "us-quart",
    dimension: "volume",
    labelKey: "unit-conversion.unit.us-quart",
    factor: "0.000946352946",
  },
  {
    id: "us-gallon",
    dimension: "volume",
    labelKey: "unit-conversion.unit.us-gallon",
    factor: "0.003785411784",
  },
  {
    id: "imperial-fluid-ounce",
    dimension: "volume",
    labelKey: "unit-conversion.unit.imperial-fluid-ounce",
    factor: "0.0000284130625",
  },
  {
    id: "imperial-pint",
    dimension: "volume",
    labelKey: "unit-conversion.unit.imperial-pint",
    factor: "0.00056826125",
  },
  {
    id: "imperial-gallon",
    dimension: "volume",
    labelKey: "unit-conversion.unit.imperial-gallon",
    factor: "0.00454609",
  },
  {
    id: "ms",
    dimension: "time",
    labelKey: "unit-conversion.unit.ms",
    factor: "0.001",
  },
  {
    id: "s",
    dimension: "time",
    labelKey: "unit-conversion.unit.s",
    factor: "1",
  },
  {
    id: "min",
    dimension: "time",
    labelKey: "unit-conversion.unit.min",
    factor: "60",
  },
  {
    id: "h",
    dimension: "time",
    labelKey: "unit-conversion.unit.h",
    factor: "3600",
  },
  {
    id: "day",
    dimension: "time",
    labelKey: "unit-conversion.unit.day",
    factor: "86400",
  },
  {
    id: "week",
    dimension: "time",
    labelKey: "unit-conversion.unit.week",
    factor: "604800",
  },
] as const satisfies readonly Unit[];

export const unitCatalog: readonly Unit[] = [
  ...baseUnits,
  {
    id: "m-per-s",
    dimension: "speed",
    labelKey: "unit-conversion.unit.m-per-s",
    factor: "1",
  },
  {
    id: "km-per-h",
    dimension: "speed",
    labelKey: "unit-conversion.unit.km-per-h",
    factor: "1000",
    denominator: "3600",
  },
  {
    id: "mi-per-h",
    dimension: "speed",
    labelKey: "unit-conversion.unit.mi-per-h",
    factor: "1609.344",
    denominator: "3600",
  },
  {
    id: "ft-per-s",
    dimension: "speed",
    labelKey: "unit-conversion.unit.ft-per-s",
    factor: "0.3048",
  },
  {
    id: "knot",
    dimension: "speed",
    labelKey: "unit-conversion.unit.knot",
    factor: "1852",
    denominator: "3600",
  },
  {
    id: "metric-cup",
    dimension: "volume",
    labelKey: "unit-conversion.unit.metric-cup",
    factor: "0.00025",
  },
  {
    id: "metric-teaspoon",
    dimension: "volume",
    labelKey: "unit-conversion.unit.metric-teaspoon",
    factor: "0.000005",
  },
  {
    id: "metric-tablespoon",
    dimension: "volume",
    labelKey: "unit-conversion.unit.metric-tablespoon",
    factor: "0.000015",
  },
  {
    id: "australian-tablespoon",
    dimension: "volume",
    labelKey: "unit-conversion.unit.australian-tablespoon",
    factor: "0.00002",
  },
];
