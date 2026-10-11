export const messages = {
  "oven-temperature.field.temperature": "Temperature",
  "oven-temperature.field.conventional": "Conventional setting",
  "oven-temperature.field.reduction": "Reduce by",
  "oven-temperature.unit.celsius": "Degrees Celsius (°C)",
  "oven-temperature.unit.fahrenheit": "Degrees Fahrenheit (°F)",
  "oven-temperature.answer.celsius": "°C",
  "oven-temperature.answer.fahrenheit": "°F",
  "oven-temperature.variable.celsius": "Temperature in Celsius",
  "oven-temperature.variable.fahrenheit": "Temperature in Fahrenheit",
  "oven-temperature.variable.fan": "Fan oven setting",
  "oven-temperature.operation.celsius-to-fahrenheit": "°C to °F",
  "oven-temperature.working.celsius-to-fahrenheit":
    "F = C × 9/5 + 32 = {temperature} × 9/5 + 32 = {answer} °F",
  "oven-temperature.formula.celsius-to-fahrenheit": "F = C × 9/5 + 32",
  "oven-temperature.example.celsius-to-fahrenheit":
    "A 180 °C cake recipe on a Fahrenheit oven",
  "oven-temperature.operation.fahrenheit-to-celsius": "°F to °C",
  "oven-temperature.working.fahrenheit-to-celsius":
    "C = (F − 32) × 5/9 = ({temperature} − 32) × 5/9 = {answer} °C",
  "oven-temperature.formula.fahrenheit-to-celsius": "C = (F − 32) × 5/9",
  "oven-temperature.example.fahrenheit-to-celsius": "356 °F back to Celsius",
  "oven-temperature.operation.fan-adjustment": "Fan oven",
  "oven-temperature.working.fan-adjustment":
    "T′ = T − r = {temperature} °C − {reduction} °C = {answer} °C",
  "oven-temperature.formula.fan-adjustment": "T′ = T − r",
  "oven-temperature.example.fan-adjustment":
    "A 180 °C recipe in a fan oven, reduced by 20 °C",
  "oven-temperature.error.invalid-field": "Enter a number, such as 180.",
  "oven-temperature.error.nonpositive-dimension":
    "Temperatures cannot go below absolute zero (−273.15 °C, −459.67 °F), and the reduction cannot be negative.",
  "oven-temperature.error.output-overflow":
    "The answer is outside the supported range.",
  "oven-temperature.visual.caption.convert":
    "The same oven setting on both scales",
  "oven-temperature.visual.caption.fan":
    "Conventional and fan settings on one scale",
  "oven-temperature.visual.summary.convert":
    "{celsius} °C lines up with {fahrenheit} °F.",
  "oven-temperature.visual.summary.fan":
    "The conventional setting of {conventional} °C drops by {reduction} °C to {fan} °C for a fan oven.",
  "oven-temperature.visual.conventional": "Conventional",
  "oven-temperature.visual.fan": "Fan",
  "oven-temperature.visual.reduction": "−{reduction} °C",
  "oven-temperature.visual.description":
    "For a conversion, two rulers share one marker: Celsius above, Fahrenheit below. For a fan oven, one Celsius scale shows the conventional setting, the fan setting and the gap between them.",
  "oven-temperature.visual.alternative":
    "The temperatures in the diagram are the same numbers stated in the answer and the steps.",
  "oven-temperature.intro.title": "Oven settings in °C and °F",
  "oven-temperature.intro.body":
    "Recipes give oven temperatures in Celsius or Fahrenheit, and many assume a conventional oven. Convert between the scales exactly, or lower a conventional setting for a fan (convection) oven by the amount your recipe or oven manual suggests.",
  "oven-temperature.mistakes.title": "Common mistakes",
  "oven-temperature.mistakes.body":
    "Pick the direction first: 180 °C is 356 °F, but 180 °F is only 82 °C. Subtract a fan reduction from the Celsius setting, not from Fahrenheit; a 20 °C reduction is 36 °F. Oven dials are rarely exact, so an oven thermometer helps more than extra decimals.",
  "oven-temperature.limits.title": "Assumptions and limits",
  "oven-temperature.limits.body":
    "Conversions are exact. Temperatures may be negative down to absolute zero (−273.15 °C or −459.67 °F). The fan reduction is a recipe or appliance convention you enter, commonly 20 °C; it is not a physical constant, and the adjusted setting cannot fall below absolute zero. Answers are shown to the nearest degree.",
  "oven-temperature.faq.q": "How much lower should a fan oven be?",
  "oven-temperature.faq.a":
    "Most recipes and manufacturers suggest about 20 °C lower, for example 160 °C fan instead of 180 °C conventional. Check your oven manual, as some fan ovens already compensate automatically.",
  "oven-temperature.sources.title": "Sources",
  "oven-temperature.sources.body":
    "Temperature scale definitions: NIST SP 811, https://www.nist.gov/pml/special-publication-811.",
} as const;
