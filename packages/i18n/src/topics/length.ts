export const messages = {
  "length.operation.convert": "Convert length",
  "length.field.value": "Value",
  "length.field.source": "From",
  "length.field.target": "To",
  "length.working.convert": "{value} {source} = {answer} {target}",
  "length.unit.mm": "Millimetres (mm)",
  "length.unit.cm": "Centimetres (cm)",
  "length.unit.m": "Metres (m)",
  "length.unit.km": "Kilometres (km)",
  "length.unit.in": "Inches (in)",
  "length.unit.ft": "Feet (ft)",
  "length.unit.yd": "Yards (yd)",
  "length.unit.mi": "Miles (mi)",
  "length.symbol.mm": "mm",
  "length.symbol.cm": "cm",
  "length.symbol.m": "m",
  "length.symbol.km": "km",
  "length.symbol.in": "in",
  "length.symbol.ft": "ft",
  "length.symbol.yd": "yd",
  "length.symbol.mi": "mi",
  "length.visual.caption": "The same length on two rulers",
  "length.visual.summary":
    "Two aligned scales: {value} {source} on the top scale lines up with {answer} {target} on the bottom scale.",
  "length.visual.factor": "1 {source} = {factor} {target}",
  "length.visual.description":
    "The marker shows the entered length on a ruler in the source unit; the ruler below it is drawn in the target unit at the same scale, so the reading under the marker is the answer.",
  "length.visual.alternative":
    "The visible answer and working state both values with their unit symbols.",
  "length.error.invalid-field":
    "Enter a number such as 12 or 0.5 and choose both units.",
  "length.error.incompatible-units": "Choose two length units.",
  "length.error.below-absolute-zero":
    "That is colder than absolute zero (0 K, −273.15 °C, −459.67 °F).",
  "length.error.output-overflow":
    "The result is too large or too small to show.",
  "length.intro.title": "Metric and imperial lengths",
  "length.intro.body":
    "Pick the unit you measured in and the unit you need. Metric units step by powers of ten; inches, feet, yards and miles are fixed multiples of the metre, so every conversion is a single exact factor.",
  "length.formula": "y = x × k",
  "length.variable.x": "value in the unit you convert from",
  "length.variable.k":
    "conversion factor: metres per source unit ÷ metres per target unit",
  "length.variable.y": "value in the unit you convert to",
  "length.limits.title": "Definitions and limits",
  "length.limits.body":
    "An international inch is exactly 0.0254 m, so a foot is exactly 0.3048 m and a mile exactly 1,609.344 m. The older US survey foot is not offered. Answers are shown to six significant figures; the working keeps every digit.",
  "length.mistakes.title": "Common mistakes",
  "length.mistakes.body":
    "Length is not area: one metre is 3.28 feet, but one square metre is 10.76 square feet. Do not round a factor such as 2.54 before multiplying a large number. A negative value is treated as an offset in the opposite direction.",
  "length.faq.q": "How many centimetres are in an inch?",
  "length.faq.body":
    "Exactly 2.54 cm. The inch has been defined as 25.4 mm since 1959, so 12 inches are 30.48 cm and 3 feet are 0.9144 m.",
  "length.sources.title": "References",
  "length.sources.body":
    "NIST SP 811, Guide for the Use of the International System of Units, including its conversion factors: https://www.nist.gov/pml/special-publication-811.",
  "length.example.0": "1 inch to metres",
  "length.example.1": "3 feet to metres",
  "length.example.2": "1 mile to kilometres",
} as const;
