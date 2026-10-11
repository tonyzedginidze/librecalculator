export const messages = {
  "mass.operation.convert": "Convert mass",
  "mass.field.value": "Value",
  "mass.field.source": "From",
  "mass.field.target": "To",
  "mass.working.convert": "{value} {source} = {answer} {target}",
  "mass.unit.mg": "Milligrams (mg)",
  "mass.unit.g": "Grams (g)",
  "mass.unit.kg": "Kilograms (kg)",
  "mass.unit.oz": "Ounces (oz)",
  "mass.unit.lb": "Pounds (lb)",
  "mass.symbol.mg": "mg",
  "mass.symbol.g": "g",
  "mass.symbol.kg": "kg",
  "mass.symbol.oz": "oz",
  "mass.symbol.lb": "lb",
  "mass.visual.caption": "The same mass on two scales",
  "mass.visual.summary":
    "Two aligned scales: {value} {source} on the top scale lines up with {answer} {target} on the bottom scale.",
  "mass.visual.factor": "1 {source} = {factor} {target}",
  "mass.visual.description":
    "The marker shows the entered mass on a scale in the source unit; the scale below it is drawn in the target unit, so the reading under the marker is the answer.",
  "mass.visual.alternative":
    "The visible answer and working state both values with their unit symbols.",
  "mass.error.invalid-field":
    "Enter a number such as 12 or 0.5 and choose both units.",
  "mass.error.incompatible-units": "Choose two mass units.",
  "mass.error.below-absolute-zero":
    "That is colder than absolute zero (0 K, −273.15 °C, −459.67 °F).",
  "mass.error.output-overflow": "The result is too large or too small to show.",
  "mass.intro.title": "Pounds, ounces and kilograms",
  "mass.intro.body":
    "Convert between metric masses and avoirdupois pounds and ounces, the everyday units on kitchen and bathroom scales. Everyday speech calls this weight; the arithmetic is the same.",
  "mass.formula": "y = x × k",
  "mass.variable.x": "value in the unit you convert from",
  "mass.variable.k":
    "conversion factor: kilograms per source unit ÷ kilograms per target unit",
  "mass.variable.y": "value in the unit you convert to",
  "mass.limits.title": "Definitions and limits",
  "mass.limits.body":
    "One pound is exactly 0.45359237 kg and one ounce is exactly 1/16 lb (28.349523125 g). Troy ounces, used for precious metals, are not offered. Answers are shown to six significant figures; the working keeps every digit.",
  "mass.mistakes.title": "Common mistakes",
  "mass.mistakes.body":
    "A fluid ounce measures volume, not mass, so it cannot be converted here. A pound of flour and a pound of water fill different cups; converting to cups needs the ingredient's density.",
  "mass.faq.q": "How many kilograms is a pound?",
  "mass.faq.body":
    "Exactly 0.45359237 kg, a little under half a kilogram. So 150 lb is about 68.04 kg, and 1 kg is about 2.205 lb.",
  "mass.sources.title": "References",
  "mass.sources.body":
    "NIST SP 811, Guide for the Use of the International System of Units, including its conversion factors: https://www.nist.gov/pml/special-publication-811.",
  "mass.example.0": "1 pound to kilograms",
  "mass.example.1": "1 kilogram to grams",
  "mass.example.2": "16 ounces to pounds",
} as const;
