export const messages = {
  "countdown.operation.days-until": "Days until",
  "countdown.field.reference": "Count from",
  "countdown.field.target": "Event date",
  "countdown.answer.one": "{days} day to go",
  "countdown.answer.other": "{days} days to go",
  "countdown.answer.past-one": "{days} day ago",
  "countdown.answer.past": "{days} days ago",
  "countdown.answer.today": "Today",
  "countdown.working.days-until":
    "Day number of {target} − day number of {reference} = {answer} days",
  "countdown.error.invalid-field":
    "Enter a real date as YYYY-MM-DD, for example 2026-12-25.",
  "countdown.error.invalid-domain":
    "These dates are outside the supported calendar.",
  "countdown.error.output-overflow":
    "The result is outside the supported range.",
  "countdown.visual.caption": "Time left until the event",
  "countdown.visual.caption-past": "Time since the event",
  "countdown.visual.reference": "Count from",
  "countdown.visual.target": "Event",
  "countdown.visual.weeks.one": "{weeks} week",
  "countdown.visual.weeks.other": "{weeks} weeks",
  "countdown.visual.days.one": "{remainder} day",
  "countdown.visual.days.other": "{remainder} days",
  "countdown.visual.span": "{weeksText} and {daysText}",
  "countdown.visual.summary":
    "A timeline from {reference} to the event on {target}: {span} to go.",
  "countdown.visual.summary-past":
    "A timeline from the event on {target} to {reference}: it was {span} ago.",
  "countdown.visual.description":
    "The diagram draws a timeline from the count-from date to the event, marks the month boundaries in between, and restates the distance in weeks and days.",
  "countdown.visual.alternative":
    "A text summary gives the same two dates and the distance in days and in weeks.",
  "lesson.countdown.intro.title": "What this measures",
  "lesson.countdown.intro.body":
    "A countdown counts the calendar days left until an event. A positive number means the event is still ahead; a negative number says how many days ago it happened.",
  "lesson.countdown.meaning.title": "How to use it",
  "lesson.countdown.meaning.body":
    "Enter the date to count from, usually today, and the event date, both as YYYY-MM-DD. Both dates are explicit so the answer is reproducible. It does not tick or read your device clock.",
  "lesson.countdown.formula.days-until": "D = T − N",
  "lesson.countdown.variable.item0": "days until the event, negative if past",
  "lesson.countdown.variable.item1":
    "day number of the count-from date, counted from 0001-01-01",
  "lesson.countdown.variable.item2":
    "day number of the event date, counted from 0001-01-01",
  "lesson.countdown.example.0": "Count toward the new year",
  "lesson.countdown.example.1": "The event is today",
  "lesson.countdown.example.2": "An event already passed",
  "lesson.countdown.mistakes.title": "Common mistakes",
  "lesson.countdown.mistakes.body":
    "Calendar days are not exact 24-hour periods in a timezone. The event day itself is not an extra day. A past date gives a negative result instead of being clamped to zero.",
  "lesson.countdown.limits.title": "Limits and assumptions",
  "lesson.countdown.limits.body":
    "Gregorian dates 0001–9999, with no time of day, clock, alarms, timezone, holidays or notifications. It uses the same day numbering as the date difference calculator.",
  "lesson.countdown.sources.title": "Sources",
  "lesson.countdown.sources.body":
    "Gregorian calendar arithmetic. December 20 to January 1 crosses twelve day boundaries.",
  "lesson.countdown.faq.q": "Can I count down to a past event?",
  "lesson.countdown.faq.a":
    "Yes. The answer then reads as days ago, and the number in the working is negative.",
} as const;
