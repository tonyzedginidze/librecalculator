export const messages = {
  "date-difference.operation.elapsed-days": "Days between",
  "date-difference.operation.inclusive-days": "Days, both ends counted",
  "date-difference.field.start": "Start date",
  "date-difference.field.end": "End date",
  "date-difference.answer.one": "{days} day",
  "date-difference.answer.other": "{days} days",
  "date-difference.working.elapsed-days":
    "Day number of {end} − day number of {start} = {answer} days",
  "date-difference.working.inclusive-days":
    "Day number of {end} − day number of {start} + 1 = {answer} days, counting both dates",
  "date-difference.error.invalid-field":
    "Enter a real date as YYYY-MM-DD, for example 2026-01-01.",
  "date-difference.error.invalid-domain":
    "To count both ends, the end date must not be before the start date.",
  "date-difference.error.output-overflow":
    "The result is outside the supported range.",
  "date-difference.visual.elapsed-days.caption":
    "The span between the two dates",
  "date-difference.visual.inclusive-days.caption":
    "The span between the two dates, both included",
  "date-difference.visual.elapsed-days.span": "{days} days",
  "date-difference.visual.inclusive-days.span":
    "{days} days, both ends counted",
  "date-difference.visual.reversed": "{days} days, the end is before the start",
  "date-difference.visual.start": "Start",
  "date-difference.visual.end": "End",
  "date-difference.visual.elapsed-days.summary":
    "A timeline from {start} to {end} with month or year boundaries marked: {days} days apart.",
  "date-difference.visual.inclusive-days.summary":
    "A timeline from {start} to {end} with month or year boundaries marked: {days} days when both dates are counted.",
  "date-difference.visual.description":
    "The diagram draws a timeline between the two dates, marks the month or year boundaries it crosses, and states the number of days.",
  "date-difference.visual.alternative":
    "A text summary gives the same two dates and the number of days.",
  "lesson.date-difference.intro.title": "What this measures",
  "lesson.date-difference.intro.body":
    "Days between measures the distance from one date to another. Counting both ends instead counts every named date from the start through the end, so it is always one more.",
  "lesson.date-difference.meaning.title": "How to use it",
  "lesson.date-difference.meaning.body":
    "Enter both dates as YYYY-MM-DD. Choose days between for a duration such as a notice period; swapping the dates makes it negative. Choose both ends counted when every listed date matters, such as days on a trip or an attendance list. That mode needs the end to be on or after the start.",
  "lesson.date-difference.formula.elapsed-days": "D = E − S",
  "lesson.date-difference.formula.inclusive-days": "D = E − S + 1",
  "lesson.date-difference.variable.item0": "number of days",
  "lesson.date-difference.variable.item1":
    "day number of the start date, counted from 0001-01-01",
  "lesson.date-difference.variable.item2":
    "day number of the end date, counted from 0001-01-01",
  "lesson.date-difference.example.0": "Cross a leap day",
  "lesson.date-difference.example.1": "Reverse the direction",
  "lesson.date-difference.example.2": "Count all 3 named dates",
  "lesson.date-difference.mistakes.title": "Common mistakes",
  "lesson.date-difference.mistakes.body":
    "A same-day span has zero days between but one date when both ends are counted. Calendar days are not exact 24-hour periods across daylight saving changes. Use the unambiguous year-month-day form.",
  "lesson.date-difference.limits.title": "Limits and assumptions",
  "lesson.date-difference.limits.body":
    "Gregorian calendar, years 0001–9999. Dates have no time of day, timezone, holiday or workday meaning. Counting both ends rejects reversed dates.",
  "lesson.date-difference.sources.title": "Sources",
  "lesson.date-difference.sources.body":
    "Gregorian calendar leap-year rule. Check: February 28 to March 1 is two days in 2024 and one day in 2023.",
  "lesson.date-difference.faq.q": "Does this account for leap years?",
  "lesson.date-difference.faq.a":
    "Yes. Years divisible by four are leap years, except century years unless they are divisible by 400.",
} as const;
