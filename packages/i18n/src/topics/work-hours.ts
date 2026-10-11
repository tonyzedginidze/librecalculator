export const messages = {
  "work-hours.operation.paid-hours": "Paid hours",
  "work-hours.field.start": "Start time",
  "work-hours.field.end": "End time",
  "work-hours.field.overnight": "Shift ends",
  "work-hours.choice.same-day": "Same day",
  "work-hours.choice.next-day": "Next day",
  "work-hours.field.break": "Unpaid break",
  "work-hours.unit.min": "Minutes (min)",
  "work-hours.answer.one": "{hours} hour",
  "work-hours.answer.other": "{hours} hours",
  "work-hours.working.paid-hours":
    "{start} to {end} is {elapsed} min. {elapsed} min − {break} min break = {paid} min paid. {paid} ÷ 60 = {answer} hours",
  "work-hours.error.invalid-field":
    "Enter times as 24-hour HH:MM, for example 09:00 or 17:30, and the break in whole minutes.",
  "work-hours.error.invalid-domain":
    "The end must come after the start (choose “Next day” for an overnight shift), the shift can be at most 24 hours, and the break cannot be longer than the shift.",
  "work-hours.error.output-overflow":
    "The result is outside the supported range.",
  "work-hours.visual.caption": "Paid time and break within the shift",
  "work-hours.visual.total": "Shift {start}–{end}",
  "work-hours.visual.paid": "Paid",
  "work-hours.visual.break": "Unpaid break",
  "work-hours.visual.hours": "{hours} h",
  "work-hours.visual.minutes": "{minutes} min",
  "work-hours.visual.hours-minutes": "{hours} h {minutes} min",
  "work-hours.visual.summary":
    "A bar for the shift from {start} to {end}, {shift} long, split into {paid} paid and {break} unpaid break.",
  "work-hours.visual.description":
    "The diagram shows the whole shift as one bar, split into paid time and the unpaid break.",
  "work-hours.visual.alternative":
    "A text summary gives the shift times, the shift length, the paid time and the break.",
  "lesson.work-hours.intro.title": "What this measures",
  "lesson.work-hours.intro.body":
    "Paid hours are the time from start to end minus any unpaid break, written as decimal hours. Seven hours and thirty minutes is 7.5 hours, which is the number most timesheets and payroll tools expect.",
  "lesson.work-hours.meaning.title": "How to use it",
  "lesson.work-hours.meaning.body":
    "Enter start and end as 24-hour HH:MM times and the unpaid break in whole minutes. If the shift finishes after midnight, set the shift end to next day. Asking avoids guessing whether an earlier end time is an overnight shift or a typo.",
  "lesson.work-hours.formula.paid-hours": "H = (e − s + 1440n − b) ÷ 60",
  "lesson.work-hours.variable.item0": "paid hours",
  "lesson.work-hours.variable.item1": "start time in minutes after midnight",
  "lesson.work-hours.variable.item2": "end time in minutes after midnight",
  "lesson.work-hours.variable.item3":
    "1 if the shift ends the next day, else 0",
  "lesson.work-hours.variable.item4": "unpaid break in minutes",
  "lesson.work-hours.example.0": "09:00 to 17:00 with a 30-minute break",
  "lesson.work-hours.example.1": "An overnight shift",
  "lesson.work-hours.example.2": "A short shift",
  "lesson.work-hours.mistakes.title": "Common mistakes",
  "lesson.work-hours.mistakes.body":
    "Thirty minutes is 0.5 hours, not 0.30 hours. Do not subtract a break twice or forget to mark an overnight shift. Whether a break is paid depends on your employer; enter only the unpaid part.",
  "lesson.work-hours.limits.title": "Limits and assumptions",
  "lesson.work-hours.limits.body":
    "Wall-clock arithmetic for shifts up to 24 hours, with no daylight saving correction, overtime, wages or legal break rules. Equal start and end times with next day give a full 24-hour shift. The break cannot exceed the shift.",
  "lesson.work-hours.sources.title": "Sources",
  "lesson.work-hours.sources.body":
    "Exact conversion: 60 minutes = 1 hour. Independently written shift checks.",
  "lesson.work-hours.faq.q":
    "Why do I have to say the shift ends the next day?",
  "lesson.work-hours.faq.a":
    "An end time earlier than the start could be an overnight shift or a typing mistake. Choosing next day records which one you mean.",
} as const;
