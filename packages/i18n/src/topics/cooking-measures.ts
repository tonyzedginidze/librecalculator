export const messages = {
  "cooking-measures.operation.convert": "Convert cooking measures",
  "cooking-measures.field.value": "Value",
  "cooking-measures.field.source": "From",
  "cooking-measures.field.target": "To",
  "cooking-measures.working.convert": "{value} {source} = {answer} {target}",
  "cooking-measures.unit.ml": "Millilitres (mL)",
  "cooking-measures.unit.l": "Litres (L)",
  "cooking-measures.unit.us-fluid-ounce": "US fluid ounces (fl oz)",
  "cooking-measures.unit.us-cup": "US cups",
  "cooking-measures.unit.us-pint": "US pints",
  "cooking-measures.unit.us-quart": "US quarts",
  "cooking-measures.unit.us-gallon": "US gallons",
  "cooking-measures.unit.imperial-fluid-ounce": "Imperial fluid ounces",
  "cooking-measures.unit.imperial-pint": "Imperial pints",
  "cooking-measures.unit.imperial-gallon": "Imperial gallons",
  "cooking-measures.unit.metric-cup": "Metric cups (250 mL)",
  "cooking-measures.unit.metric-teaspoon": "Teaspoons (5 mL)",
  "cooking-measures.unit.metric-tablespoon": "Tablespoons (15 mL)",
  "cooking-measures.unit.australian-tablespoon":
    "Australian tablespoons (20 mL)",
  "cooking-measures.symbol.ml": "mL",
  "cooking-measures.symbol.l": "L",
  "cooking-measures.symbol.us-fluid-ounce": "US fl oz",
  "cooking-measures.symbol.us-cup": "US cup",
  "cooking-measures.symbol.us-pint": "US pt",
  "cooking-measures.symbol.us-quart": "US qt",
  "cooking-measures.symbol.us-gallon": "US gal",
  "cooking-measures.symbol.imperial-fluid-ounce": "imp fl oz",
  "cooking-measures.symbol.imperial-pint": "imp pt",
  "cooking-measures.symbol.imperial-gallon": "imp gal",
  "cooking-measures.symbol.metric-cup": "metric cup",
  "cooking-measures.symbol.metric-teaspoon": "tsp",
  "cooking-measures.symbol.metric-tablespoon": "tbsp",
  "cooking-measures.symbol.australian-tablespoon": "AU tbsp",
  "cooking-measures.visual.caption": "The same volume on two scales",
  "cooking-measures.visual.summary":
    "Two aligned scales: {value} {source} on the top scale lines up with {answer} {target} on the bottom scale.",
  "cooking-measures.visual.factor": "1 {source} = {factor} {target}",
  "cooking-measures.visual.description":
    "The marker shows the entered volume on a scale in the source unit; the scale below it is drawn in the target unit, so the reading under the marker is the answer.",
  "cooking-measures.visual.alternative":
    "The answer and the steps state both values with their unit symbols.",
  "cooking-measures.error.invalid-field":
    "Enter a number such as 12 or 0.5 and choose both units.",
  "cooking-measures.error.incompatible-units": "Choose two volume units.",
  "cooking-measures.error.below-absolute-zero":
    "That is colder than absolute zero (0 K, −273.15 °C, −459.67 °F).",
  "cooking-measures.error.output-overflow":
    "The result is too large or too small to show.",
  "cooking-measures.intro.title": "Cups, spoons and millilitres",
  "cooking-measures.intro.body":
    "Convert recipe volumes between US, Imperial and metric kitchen measures. Each cup, pint and spoon is named by its system because a US cup, a metric cup and an Imperial pint are all different sizes.",
  "cooking-measures.formula": "y = x × k",
  "cooking-measures.variable.x": "value in the unit you convert from",
  "cooking-measures.variable.k":
    "conversion factor: millilitres per source unit ÷ millilitres per target unit",
  "cooking-measures.variable.y": "value in the unit you convert to",
  "cooking-measures.limits.title": "Definitions and limits",
  "cooking-measures.limits.body":
    "A US cup is exactly 236.5882365 mL and a metric cup is 250 mL. A teaspoon is 5 mL, a tablespoon 15 mL and an Australian tablespoon 20 mL. An Imperial pint (568.26 mL) is larger than a US pint (473.18 mL). Answers are shown to six significant figures.",
  "cooking-measures.mistakes.title": "Common mistakes",
  "cooking-measures.mistakes.body":
    "These are volumes, not weights: a cup of flour and a cup of sugar weigh different amounts, so use a cup-to-gram converter for that. Do not treat an Australian tablespoon as a standard 15 mL tablespoon.",
  "cooking-measures.faq.q": "How many millilitres are in a cup?",
  "cooking-measures.faq.body":
    "A US cup is about 236.6 mL and a metric cup is exactly 250 mL. One Australian tablespoon is 20 mL, four metric teaspoons.",
  "cooking-measures.sources.title": "References",
  "cooking-measures.sources.body":
    "NIST SP 811, Guide for the Use of the International System of Units, including its conversion factors: https://www.nist.gov/pml/special-publication-811. Metric cup and spoon sizes follow the common 250 mL, 5 mL, 15 mL and 20 mL definitions; check which one your recipe means.",
  "cooking-measures.example.0": "1 US cup to millilitres",
  "cooking-measures.example.1": "1 metric cup to millilitres",
  "cooking-measures.example.2": "1 Australian tablespoon to millilitres",
} as const;
