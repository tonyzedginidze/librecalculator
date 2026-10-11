export const messages = {
  "temperature.operation.convert": "Convert temperature",
  "temperature.field.value": "Value",
  "temperature.field.source": "From",
  "temperature.field.target": "To",
  "temperature.working.convert": "{value} {source} = {answer} {target}",
  "temperature.unit.c": "Celsius (°C)",
  "temperature.unit.f": "Fahrenheit (°F)",
  "temperature.unit.k": "Kelvin (K)",
  "temperature.symbol.c": "°C",
  "temperature.symbol.f": "°F",
  "temperature.symbol.k": "K",
  "temperature.visual.caption": "The same temperature on two scales",
  "temperature.visual.summary":
    "Two aligned temperature scales: {value} {source} on the top scale lines up with {answer} {target} on the bottom scale.",
  "temperature.visual.note":
    "Ticks: −40° where °C and °F agree, water freezing, body temperature and water boiling.",
  "temperature.visual.description":
    "Both scales are drawn over the same range of temperatures. Ticks line up at −40, where Celsius and Fahrenheit agree, at water's freezing point, at body temperature and at water's boiling point; the marker shows the entered reading.",
  "temperature.visual.alternative":
    "The visible answer and working state both readings with their unit symbols.",
  "temperature.error.invalid-field":
    "Enter a number such as 12 or 0.5 and choose both units.",
  "temperature.error.incompatible-units": "Choose two temperature units.",
  "temperature.error.below-absolute-zero":
    "That is colder than absolute zero (0 K, −273.15 °C, −459.67 °F).",
  "temperature.error.output-overflow":
    "The result is too large or too small to show.",
  "temperature.intro.title": "Three scales, different zero points",
  "temperature.intro.body":
    "Celsius, Fahrenheit and Kelvin place zero in different places, so converting a reading needs an offset as well as a factor. Kelvin starts at absolute zero, the coldest possible temperature.",
  "temperature.formula": "F = C × 9/5 + 32 and K = C + 273.15",
  "temperature.variable.c": "reading in degrees Celsius",
  "temperature.variable.f": "reading in degrees Fahrenheit",
  "temperature.variable.k": "reading in kelvin",
  "temperature.limits.title": "Definitions and limits",
  "temperature.limits.body":
    "Absolute zero is exactly 0 K, −273.15 °C and −459.67 °F; readings below it are rejected. Water freezes at 0 °C (32 °F) and boils at 100 °C (212 °F) at sea level. Answers are shown to six significant figures; the working keeps every digit.",
  "temperature.mistakes.title": "Common mistakes",
  "temperature.mistakes.body":
    "A temperature difference converts without the offset: a rise of 10 °C is a rise of 18 °F, not 50 °F. This calculator converts readings. Kelvin is written without a degree sign.",
  "temperature.faq.q": "Where do Celsius and Fahrenheit meet?",
  "temperature.faq.body":
    "At −40: −40 °C is exactly −40 °F. Room temperature of 20 °C is 68 °F, and a body temperature of 37 °C is 98.6 °F.",
  "temperature.sources.title": "References",
  "temperature.sources.body":
    "NIST SP 811, Guide for the Use of the International System of Units, including its conversion factors: https://www.nist.gov/pml/special-publication-811.",
  "temperature.example.0": "0 °C to Fahrenheit",
  "temperature.example.1": "100 °C to kelvin",
  "temperature.example.2": "−459.67 °F to kelvin",
} as const;
