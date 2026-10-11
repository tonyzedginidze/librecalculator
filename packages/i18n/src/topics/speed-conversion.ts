export const messages = {
  "speed-conversion.operation.convert": "Convert speed",
  "speed-conversion.field.value": "Value",
  "speed-conversion.field.source": "From",
  "speed-conversion.field.target": "To",
  "speed-conversion.working.convert": "{value} {source} = {answer} {target}",
  "speed-conversion.unit.m-per-s": "Metres per second (m/s)",
  "speed-conversion.unit.km-per-h": "Kilometres per hour (km/h)",
  "speed-conversion.unit.mi-per-h": "Miles per hour (mph)",
  "speed-conversion.unit.ft-per-s": "Feet per second (ft/s)",
  "speed-conversion.unit.knot": "Knots (kn)",
  "speed-conversion.symbol.m-per-s": "m/s",
  "speed-conversion.symbol.km-per-h": "km/h",
  "speed-conversion.symbol.mi-per-h": "mph",
  "speed-conversion.symbol.ft-per-s": "ft/s",
  "speed-conversion.symbol.knot": "kn",
  "speed-conversion.visual.caption": "The same speed on two scales",
  "speed-conversion.visual.summary":
    "Two aligned scales: {value} {source} on the top scale lines up with {answer} {target} on the bottom scale.",
  "speed-conversion.visual.factor": "1 {source} = {factor} {target}",
  "speed-conversion.visual.description":
    "The marker shows the entered speed on a scale in the source unit; the scale below it is drawn in the target unit, so the reading under the marker is the answer.",
  "speed-conversion.visual.alternative":
    "The visible answer and working state both values with their unit symbols.",
  "speed-conversion.error.invalid-field":
    "Enter a number such as 12 or 0.5 and choose both units.",
  "speed-conversion.error.incompatible-units": "Choose two speed units.",
  "speed-conversion.error.below-absolute-zero":
    "That is colder than absolute zero (0 K, −273.15 °C, −459.67 °F).",
  "speed-conversion.error.output-overflow":
    "The result is too large or too small to show.",
  "speed-conversion.intro.title": "Speed in any unit",
  "speed-conversion.intro.body":
    "Convert a speed between metres per second, kilometres per hour, miles per hour, feet per second and knots. Each speed unit is a distance unit divided by a time unit, so the factor combines both.",
  "speed-conversion.formula": "y = x × k",
  "speed-conversion.variable.x": "value in the unit you convert from",
  "speed-conversion.variable.k":
    "conversion factor: metres per second per source unit ÷ metres per second per target unit",
  "speed-conversion.variable.y": "value in the unit you convert to",
  "speed-conversion.limits.title": "Definitions and limits",
  "speed-conversion.limits.body":
    "1 km/h is exactly 1,000/3,600 m/s, 1 mph is exactly 1,609.344/3,600 m/s, and 1 knot is one nautical mile (1,852 m) per hour. The fractions are kept exact; answers are shown to six significant figures.",
  "speed-conversion.mistakes.title": "Common mistakes",
  "speed-conversion.mistakes.body":
    "A knot is not a mile per hour: 1 kn is about 1.151 mph. This converter changes units only; to find a speed from a distance and a time, use the speed calculator.",
  "speed-conversion.faq.q": "How fast is 100 km/h in mph?",
  "speed-conversion.faq.body":
    "About 62.14 mph. Going the other way, 60 mph is exactly 96.56064 km/h, and 36 km/h is exactly 10 m/s.",
  "speed-conversion.sources.title": "References",
  "speed-conversion.sources.body":
    "NIST SP 811, Guide for the Use of the International System of Units, including its conversion factors: https://www.nist.gov/pml/special-publication-811.",
  "speed-conversion.example.0": "36 km/h to metres per second",
  "speed-conversion.example.1": "60 mph to kilometres per hour",
  "speed-conversion.example.2": "1 knot to kilometres per hour",
} as const;
