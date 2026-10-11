export const messages = {
  "duration.operation.convert": "Convert duration",
  "duration.field.value": "Value",
  "duration.field.source": "From",
  "duration.field.target": "To",
  "duration.working.convert": "{value} {source} = {answer} {target}",
  "duration.unit.ms": "Milliseconds (ms)",
  "duration.unit.s": "Seconds (s)",
  "duration.unit.min": "Minutes (min)",
  "duration.unit.h": "Hours (h)",
  "duration.unit.day": "Days (d)",
  "duration.unit.week": "Weeks (wk)",
  "duration.symbol.ms": "ms",
  "duration.symbol.s": "s",
  "duration.symbol.min": "min",
  "duration.symbol.h": "h",
  "duration.symbol.day": "d",
  "duration.symbol.week": "wk",
  "duration.visual.caption": "The same duration on two scales",
  "duration.visual.summary":
    "Two aligned scales: {value} {source} on the top scale lines up with {answer} {target} on the bottom scale.",
  "duration.visual.factor": "1 {source} = {factor} {target}",
  "duration.visual.description":
    "The marker shows the entered duration on a scale in the source unit; the scale below it is drawn in the target unit, so the reading under the marker is the answer.",
  "duration.visual.alternative":
    "The answer and the steps state both values with their unit symbols.",
  "duration.error.invalid-field":
    "Enter a number such as 12 or 0.5 and choose both units.",
  "duration.error.incompatible-units": "Choose two duration units.",
  "duration.error.below-absolute-zero":
    "That is colder than absolute zero (0 K, −273.15 °C, −459.67 °F).",
  "duration.error.output-overflow":
    "The result is too large or too small to show.",
  "duration.intro.title": "Fixed units of elapsed time",
  "duration.intro.body":
    "Convert an elapsed time between milliseconds, seconds, minutes, hours, days and weeks. Every unit here is a fixed number of seconds, so the conversion is one exact factor.",
  "duration.formula": "y = x × k",
  "duration.variable.x": "value in the unit you convert from",
  "duration.variable.k":
    "conversion factor: seconds per source unit ÷ seconds per target unit",
  "duration.variable.y": "value in the unit you convert to",
  "duration.limits.title": "Definitions and limits",
  "duration.limits.body":
    "A minute is 60 s, an hour 3,600 s, a day 86,400 s and a week 604,800 s. Months and years are left out because their length varies. Answers are shown to six significant figures; the calculation keeps every digit.",
  "duration.mistakes.title": "Common mistakes",
  "duration.mistakes.body":
    "Hours are not decimal clock time: 1.5 h is 1 hour 30 minutes, not 1 hour 50 minutes. A calendar day that crosses a daylight-saving change can last 23 or 25 hours; this converter always uses 24.",
  "duration.faq.q": "How many hours is 90 minutes?",
  "duration.faq.body":
    "1.5 hours, that is one hour and thirty minutes. Two days are 48 hours, and 1,500 milliseconds are 1.5 seconds.",
  "duration.sources.title": "References",
  "duration.sources.body":
    "NIST SP 811, Guide for the Use of the International System of Units, including its conversion factors: https://www.nist.gov/pml/special-publication-811.",
  "duration.example.0": "1 hour to minutes",
  "duration.example.1": "2 days to hours",
  "duration.example.2": "1,500 milliseconds to seconds",
} as const;
