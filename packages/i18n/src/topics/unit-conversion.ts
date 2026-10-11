/** Unit name with its symbol in brackets, and the bare symbol for figures. */
const unitNames = {
  mm: ["Millimetre (mm)", "mm"],
  cm: ["Centimetre (cm)", "cm"],
  m: ["Metre (m)", "m"],
  km: ["Kilometre (km)", "km"],
  in: ["Inch (in)", "in"],
  ft: ["Foot (ft)", "ft"],
  yd: ["Yard (yd)", "yd"],
  mi: ["Mile (mi)", "mi"],
  mg: ["Milligram (mg)", "mg"],
  g: ["Gram (g)", "g"],
  kg: ["Kilogram (kg)", "kg"],
  oz: ["Ounce, avoirdupois (oz)", "oz"],
  lb: ["Pound (lb)", "lb"],
  c: ["Degree Celsius (°C)", "°C"],
  f: ["Degree Fahrenheit (°F)", "°F"],
  k: ["Kelvin (K)", "K"],
  mm2: ["Square millimetre (mm²)", "mm²"],
  cm2: ["Square centimetre (cm²)", "cm²"],
  m2: ["Square metre (m²)", "m²"],
  km2: ["Square kilometre (km²)", "km²"],
  in2: ["Square inch (in²)", "in²"],
  ft2: ["Square foot (ft²)", "ft²"],
  acre: ["Acre (ac)", "ac"],
  hectare: ["Hectare (ha)", "ha"],
  ml: ["Millilitre (mL)", "mL"],
  l: ["Litre (L)", "L"],
  m3: ["Cubic metre (m³)", "m³"],
  "us-fluid-ounce": ["US fluid ounce (US fl oz)", "US fl oz"],
  "us-cup": ["US cup", "US cup"],
  "us-pint": ["US liquid pint (US pt)", "US pt"],
  "us-quart": ["US liquid quart (US qt)", "US qt"],
  "us-gallon": ["US liquid gallon (US gal)", "US gal"],
  "imperial-fluid-ounce": ["Imperial fluid ounce (imp fl oz)", "imp fl oz"],
  "imperial-pint": ["Imperial pint (imp pt)", "imp pt"],
  "imperial-gallon": ["Imperial gallon (imp gal)", "imp gal"],
  ms: ["Millisecond (ms)", "ms"],
  s: ["Second (s)", "s"],
  min: ["Minute (min)", "min"],
  h: ["Hour (h)", "h"],
  day: ["Day (d)", "d"],
  week: ["Week (wk)", "wk"],
} as const;

export const messages = {
  "unit-conversion.operation.convert": "Convert units",
  "unit-conversion.field.value": "Value",
  "unit-conversion.field.source": "From",
  "unit-conversion.field.target": "To",
  "unit-conversion.working.convert": "{value} {source} = {answer} {target}",
  "unit-conversion.visual.description":
    "Two rulers measure the same span in the two units: the cursor marks the entered quantity on the top ruler and its converted value on the bottom one. Temperatures, negative values and zero are shown as a plain equation instead, because offset scales do not share a zero.",
  "unit-conversion.visual.alternative":
    "The conversion maps the entered quantity to the equivalent quantity in the target unit. For temperature, both readings are also given in kelvin, the absolute scale used for the conversion.",
  "unit-conversion.visual.caption": "The same quantity on two scales",
  "unit-conversion.visual.caption.equation": "The same quantity in two units",
  "unit-conversion.visual.from": "Entered",
  "unit-conversion.visual.to": "Converted",
  "unit-conversion.visual.equals": "=",
  "unit-conversion.visual.kelvin":
    "Both readings equal {kelvin} K on the absolute scale.",
  "unit-conversion.visual.summary":
    "{value} {source} is the same quantity as {answer} {target}.",
  "unit-conversion.error.invalid-field":
    "Enter a valid value and choose supported units.",
  "unit-conversion.error.incompatible-units":
    "Choose units from the same dimension.",
  "unit-conversion.error.below-absolute-zero":
    "Temperature cannot be below absolute zero (0 K).",
  "unit-conversion.error.output-overflow":
    "The answer is outside the supported range.",
  ...Object.fromEntries(
    Object.entries(unitNames).map(([id, [label]]) => [
      `unit-conversion.unit.${id}`,
      label,
    ]),
  ),
  ...Object.fromEntries(
    Object.entries(unitNames).map(([id, [, symbol]]) => [
      `unit-conversion.symbol.${id}`,
      symbol,
    ]),
  ),
  "lesson.unit-conversion.intro.title": "How unit conversion works",
  "lesson.unit-conversion.intro.body":
    "Convert a signed decimal quantity between supported units in the same dimension: length, mass, temperature, area, volume, or elapsed time. The catalog is deliberately explicit; currency and calendar-relative units are not included.",
  "lesson.unit-conversion.formula.linear":
    "y = x × fₛ ÷ fₜ. Convert the source quantity to the SI base unit, then divide by the target unit's SI factor.",
  "lesson.unit-conversion.formula.temperature":
    "K = C + 273.15; K = (F − 32) × 5 ÷ 9 + 273.15. Convert through absolute temperature rather than applying a ratio to the degree values.",
  "lesson.unit-conversion.variable.value": "entered signed quantity",
  "lesson.unit-conversion.variable.source-factor": "source unit's SI factor",
  "lesson.unit-conversion.variable.target-factor": "target unit's SI factor",
  "lesson.unit-conversion.variable.answer": "equivalent target quantity",
  "lesson.unit-conversion.variable.kelvin": "absolute temperature",
  "lesson.unit-conversion.variable.celsius": "Celsius temperature",
  "lesson.unit-conversion.variable.fahrenheit": "Fahrenheit temperature",
  "lesson.unit-conversion.example.inch-metre":
    "Exact international inch to metre",
  "lesson.unit-conversion.example.pound-kilogram":
    "International pound to kilogram",
  "lesson.unit-conversion.example.us-gallon": "US liquid gallon to litre",
  "lesson.unit-conversion.example.imperial-gallon": "Imperial gallon to litre",
  "lesson.unit-conversion.example.freezing":
    "Water's freezing point on two scales",
  "lesson.unit-conversion.example.acre": "Acre to square metres",
  "lesson.unit-conversion.example.day": "Elapsed day to seconds",
  "lesson.unit-conversion.mistakes.title": "Common mistakes",
  "lesson.unit-conversion.mistakes.body":
    "Do not treat US customary and Imperial volume as interchangeable: their gallons differ substantially. Temperature scales have different zero points, so multiplying or dividing Celsius or Fahrenheit values by a scale ratio is wrong; use the affine offset through Kelvin. A negative value is valid for linear dimensions and signed temperature readings, but no physical temperature below 0 K is accepted.",
  "lesson.unit-conversion.limits.title": "Precision and supported units",
  "lesson.unit-conversion.limits.body":
    "Inputs are signed canonical decimals, up to 30 significant digits, with no grouping or exponent notation; locale-aware normalization belongs at the input edge. Arithmetic uses 50 significant digits without intermediate presentation rounding. Decimal factors are exact terminating SI definitions where specified; divisions that repeat are rounded by decimal.js to 50 significant digits. The documented comparison tolerance is 1e-12 plus 1e-12 times the absolute reference value. Temperature is converted through Kelvin and rejects values below 0 K exactly, without a tolerance. Time units are fixed elapsed durations (a day is 86,400 seconds and a week is seven days); months and years are not fixed units here.",
  "lesson.unit-conversion.faq.temperature.q":
    "Why does temperature need a different formula?",
  "lesson.unit-conversion.faq.temperature.a":
    "Celsius and Fahrenheit are offset scales. First map the reading to Kelvin using the scale's exact affine relation, then map Kelvin to the destination scale. Kelvin is absolute, so values below zero are invalid.",
  "lesson.unit-conversion.faq.gallons.q":
    "Are US and Imperial gallons the same?",
  "lesson.unit-conversion.faq.gallons.a":
    "No. A US liquid gallon is exactly 3.785411784 litres, while an Imperial gallon is exactly 4.54609 litres. Select the labeled system rather than relying on the word gallon alone.",
  "lesson.unit-conversion.sources.title": "Standards and references",
  "lesson.unit-conversion.sources.body":
    "SI base-unit definitions and prefixes: NIST, The International System of Units (SI), https://www.nist.gov/pml/owm/metric-si/si-units. Inch, pound, US gallon, and Imperial gallon factors follow exact international definitions documented by NIST Special Publication 811, https://www.nist.gov/pml/special-publication-811. The acre factor is 4,046.8564224 m². Unit factors are encoded as decimal constants and these independent values are covered by engine fixtures.",
  "unit-conversion.dimension.length": "Length",
  "unit-conversion.dimension.mass": "Mass",
  "unit-conversion.dimension.temperature": "Temperature",
  "unit-conversion.dimension.area": "Area",
  "unit-conversion.dimension.volume": "Volume",
  "unit-conversion.dimension.time": "Time",
} as const;
