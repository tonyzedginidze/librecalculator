export const messages = {
  "age.operation.completed-years": "Age in years",
  "age.field.birth": "Date of birth",
  "age.field.asof": "Age on",
  "age.answer.one": "{years} year",
  "age.answer.other": "{years} years",
  "age.working.completed-years":
    "{birth} to {asof} spans {days} days and {answer} birthdays, so the age is {answer} completed years.",
  "age.error.invalid-field":
    "Enter a real date as YYYY-MM-DD, for example 1990-06-15.",
  "age.error.invalid-domain":
    "The date of birth must be on or before the age-on date.",
  "age.error.output-overflow": "The result is outside the supported range.",
  "age.visual.caption": "From birth to the chosen date",
  "age.visual.start": "Born",
  "age.visual.end": "Age on",
  "age.visual.marker": "Age {years}",
  "age.visual.span": "{years} years · {days} days",
  "age.visual.summary":
    "A timeline from birth on {birth} to {asof}, marked at round birthdays: {years} completed years, {days} days in total.",
  "age.visual.description":
    "The diagram draws a timeline from the date of birth to the age-on date, marks round birthdays along it, and states the completed years and the total days.",
  "age.visual.alternative":
    "A text summary gives the same two dates, the completed years and the elapsed days.",
  "lesson.age.intro.title": "What this measures",
  "lesson.age.intro.body":
    "Age in completed years counts the birthdays that have already happened. It is calendar arithmetic, not a number of days divided by 365.",
  "lesson.age.meaning.title": "How to use it",
  "lesson.age.meaning.body":
    "Enter a date of birth and the date you want the age on, both as YYYY-MM-DD. The age-on date can be in the past or the future but cannot come before the birth. A February 29 birthday counts as reached on March 1 in a non-leap year.",
  "lesson.age.formula.completed-years": "A = y − b − k",
  "lesson.age.variable.item0": "age in completed years",
  "lesson.age.variable.item1": "year of birth",
  "lesson.age.variable.item2": "year of the age-on date",
  "lesson.age.variable.item3":
    "1 if the birthday has not yet come round in year y, otherwise 0",
  "lesson.age.example.0": "A leap-day birthday",
  "lesson.age.example.1": "The day before a birthday",
  "lesson.age.example.2": "On the day of birth",
  "lesson.age.mistakes.title": "Common mistakes",
  "lesson.age.mistakes.body":
    "Dividing elapsed days by 365 goes wrong around leap years and birthdays. Check the age-on date instead of assuming today. The leap-day convention here is mathematical and may differ from a legal age rule.",
  "lesson.age.limits.title": "Limits and assumptions",
  "lesson.age.limits.body":
    "Gregorian calendar dates from 0001 through 9999. No clock, timezone or legal adulthood rules. February 29 birthdays count as reached on March 1 in non-leap years.",
  "lesson.age.sources.title": "Sources",
  "lesson.age.sources.body":
    "Gregorian leap-year rule and civil date arithmetic. Independent checks include a leap-day birthday and the day before a birthday.",
  "lesson.age.faq.q": "Why ask for an age-on date?",
  "lesson.age.faq.a":
    "An explicit date makes the result reproducible and lets you find an age at a past or future event without relying on your device clock.",
} as const;
