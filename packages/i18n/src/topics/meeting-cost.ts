export const messages = {
  "unit.usd": "USD",
  "finance.money": "\u0024{amount}",
  "finance.money.negative": "−\u0024{amount}",
  "finance.percent": "{value}%",
  "meeting-cost.operation.meeting-cost": "Cost of a meeting",
  "meeting-cost.operation.budget-minutes": "Minutes for a budget",
  "meeting-cost.field.attendees": "Who is in the meeting",
  "meeting-cost.field.minutes": "Length",
  "meeting-cost.field.frequency": "How often",
  "meeting-cost.field.refocus": "Refocus time per person",
  "meeting-cost.field.overhead": "Overhead multiplier",
  "meeting-cost.field.hours": "Paid hours per year",
  "meeting-cost.field.budget": "Budget for the meeting",
  "meeting-cost.field.people": "People",
  "meeting-cost.field.salary": "Annual salary each",
  "meeting-cost.unit.minutes": "minutes (min)",
  "meeting-cost.unit.hours": "hours (h)",
  "meeting-cost.frequency.once": "Just once",
  "meeting-cost.frequency.daily": "Every working day",
  "meeting-cost.frequency.twice-weekly": "Twice a week",
  "meeting-cost.frequency.weekly": "Weekly",
  "meeting-cost.frequency.biweekly": "Every two weeks",
  "meeting-cost.frequency.monthly": "Monthly",
  "meeting-cost.frequency.quarterly": "Quarterly",
  "meeting-cost.answer.meeting-cost": "Each meeting costs",
  "meeting-cost.answer.budget-minutes": "The budget buys",
  "meeting-cost.answer.value.meeting-cost": "{amount}",
  "meeting-cost.answer.value.budget-minutes": "{minutes} minutes",
  "meeting-cost.answer.room":
    "{people} people at {roomHour} an hour, or {roomMinute} a minute.",
  "meeting-cost.answer.year": "{yearly} a year across {count} meetings",
  "meeting-cost.answer.spent":
    "A {minutes}-minute meeting costs {spent} of the {budget}.",
  "meeting-cost.answer.under-minute":
    "Less than a minute: the room costs {roomMinute} a minute.",
  "meeting-cost.working.room":
    "{people} people with combined salaries of \u0024{salaryTotal} × {overhead} overhead ÷ {hours} paid hours a year = \u0024{roomHour} an hour for the room (the next step uses the unrounded rate).",
  "meeting-cost.working.meeting":
    "\u0024{roomHour} an hour × {minutes} minutes ÷ 60 = \u0024{answer} for each meeting, rounded to cents.",
  "meeting-cost.working.meeting-refocus":
    "\u0024{roomHour} an hour × ({minutes} minutes in the meeting + {refocus} minutes to refocus) ÷ 60 = \u0024{answer} for each meeting, rounded to cents.",
  "meeting-cost.working.year":
    "{frequency} is {count} meetings a year: \u0024{answer} × {count} = \u0024{yearly} a year.",
  "meeting-cost.working.budget":
    "\u0024{budget} ÷ \u0024{roomHour} an hour × 60 ≈ {exact} minutes, rounded down to {answer} whole minutes so the meeting stays within budget.",
  "meeting-cost.ui.add-group": "Add a group",
  "meeting-cost.ui.remove-group": "Remove group {index}",
  "meeting-cost.ui.group": "Group {index}",
  "meeting-cost.ui.times": "×",
  "meeting-cost.ui.custom": "Custom",
  "meeting-cost.ui.fewer": "One fewer person in group {index}",
  "meeting-cost.ui.more": "One more person in group {index}",
  "meeting-cost.ui.assumptions": "Cost assumptions",
  "meeting-cost.ui.assumptions-summary":
    "{overhead} overhead, {hours} paid hours a year",
  "meeting-cost.ui.overhead-option": "×{value}",
  "meeting-cost.ui.overhead-none": "Salary only",
  "meeting-cost.ui.hours-option": "{hours} ({week} h a week)",
  "meeting-cost.unit.min": "min",
  "meeting-cost.unit.h": "h",
  "meeting-cost.ui.preset": "{minutes} min",
  "meeting-cost.ui.refocus-none": "Don’t count",
  "meeting-cost.ui.overhead-note":
    "Overhead covers what an employer pays on top of salary: payroll taxes, benefits, equipment and office. 1.25 to 1.4 is a common range.",
  "meeting-cost.ticker.heading": "Live meeting ticker",
  "meeting-cost.ticker.intro":
    "Start it when the meeting starts and share your screen. It counts at {roomMinute} a minute.",
  "meeting-cost.ticker.start": "Start",
  "meeting-cost.ticker.pause": "Pause",
  "meeting-cost.ticker.resume": "Resume",
  "meeting-cost.ticker.reset": "Reset",
  "meeting-cost.ticker.elapsed": "Elapsed",
  "meeting-cost.ticker.spent": "Spent so far",
  "meeting-cost.ticker.planned": "{percent} of the planned {answer}",
  "meeting-cost.ticker.over": "{over} over the planned {answer}",
  "meeting-cost.ticker.fullscreen": "Full screen",
  "meeting-cost.visual.caption": "Where the money goes",
  "meeting-cost.visual.meeting": "In the meeting",
  "meeting-cost.visual.refocus": "Getting back into work",
  "meeting-cost.visual.group": "{people} × {salary}",
  "meeting-cost.visual.per-meeting": "Per meeting",
  "meeting-cost.visual.monthly": "Per month",
  "meeting-cost.visual.yearly": "Per year",
  "meeting-cost.visual.person-hours": "Person-hours a year",
  "meeting-cost.visual.fte": "Of one person’s paid year",
  "meeting-cost.visual.savings": "What a change saves each year",
  "meeting-cost.visual.minute-saving": "One minute shorter",
  "meeting-cost.visual.person-saving": "One fewer attendee (average pay)",
  "meeting-cost.visual.five-saving": "Five minutes shorter",
  "meeting-cost.visual.halve-saving": "Half as often",
  "meeting-cost.visual.summary":
    "Each meeting costs {answer}: {meetingPart} for the time in the room and {refocusPart} for refocusing. That is {yearly} a year and {personHours} person-hours.",
  "meeting-cost.visual.budget-caption": "What each minute costs",
  "meeting-cost.visual.per-minute": "Per minute",
  "meeting-cost.visual.per-hour": "Per hour",
  "meeting-cost.visual.budget": "Budget",
  "meeting-cost.visual.budget-summary":
    "The room costs {roomMinute} a minute, so {budget} pays for {minutes} whole minutes, which cost {spent}.",
  "meeting-cost.visual.description":
    "A bar splits the cost of one meeting by attendee group, with time in the room and refocus time, then the monthly and yearly cost and what shorter or smaller meetings would save.",
  "meeting-cost.visual.alternative":
    "Each group's share of the cost and every yearly figure is listed as an exact dollar amount.",
  "meeting-cost.error.invalid-field":
    "Enter whole numbers of people and salaries in whole cents.",
  "meeting-cost.error.out-of-range":
    "Use up to 12 groups of 10,000 people, 1 to 1,440 minutes, up to 240 refocus minutes, an overhead of 1 to 5, 1 to 8,784 paid hours and a budget above zero.",
  "meeting-cost.error.no-attendees": "Add at least one person.",
  "meeting-cost.error.zero-cost":
    "Everyone's salary is zero, so the meeting costs nothing.",
  "meeting-cost.error.output-overflow":
    "The result exceeds the supported dollar range.",
  "lesson.meeting-cost.intro.title": "What a meeting really costs",
  "lesson.meeting-cost.intro.body":
    "A meeting is paid for in everyone's time at once. Eight people in a one-hour meeting spend a full working day between them. Putting a dollar figure on that makes it easier to decide which meetings are worth keeping, which can be shorter, and who really needs to be there.",
  "lesson.meeting-cost.method.title": "Choose the question and enter values",
  "lesson.meeting-cost.method.body":
    "Use Cost of a meeting to price a meeting you have or plan. Add one group per pay level: one group of 8 people at an average salary is fine, or split it into the lead, the engineers and the designers. Use Minutes for a budget when you know what a decision is worth and want to know how long the room can spend on it.",
  "lesson.meeting-cost.formula":
    "R = (Σ n × S) × k ÷ H, cost per meeting C = R × (m + f) ÷ 60, cost per year = C × N, and minutes for a budget = B ÷ R × 60.",
  "lesson.meeting-cost.var.room": "Cost of the room per hour",
  "lesson.meeting-cost.var.count": "Meetings per year",
  "lesson.meeting-cost.mistakes.title": "Common mistakes",
  "lesson.meeting-cost.mistakes.body":
    "Using salary alone undercounts the cost: employers also pay taxes, benefits and equipment, which the overhead multiplier adds. Dividing by 52 weeks overcounts how often a weekly meeting happens, because holidays and leave cancel some; this calculator uses 48 working weeks and 240 working days. And the cost is not the whole story: a meeting that prevents a week of wasted work is cheap at any price.",
  "lesson.meeting-cost.limits.title": "Assumptions and limits",
  "lesson.meeting-cost.limits.body":
    "US dollars, annual salaries in whole cents, the same paid hours for everyone, and 48 working weeks or 240 working days a year. Each meeting's cost is rounded half-up to cents once; the yearly cost is that amount times the number of meetings. Preparation, travel, follow-up work and the value the meeting creates are not included. Educational estimates only, not financial, payroll or tax advice.",
  "lesson.meeting-cost.faq.q": "What overhead multiplier should I use?",
  "lesson.meeting-cost.faq.a":
    "If your finance team gives you a fully loaded hourly cost, use one group with that cost × paid hours as the salary and an overhead of 1. Otherwise 1.25 to 1.4 is a common range for US employers; use 1 to count salary only.",
  "lesson.meeting-cost.faq2.q": "Why count refocus time?",
  "lesson.meeting-cost.faq2.a":
    "Work that needs concentration takes time to resume after an interruption. If a meeting splits an afternoon, part of the time after it is lost too. Refocus time is optional and set per person; leave it at zero to count only the meeting itself.",
  "lesson.meeting-cost.sources.title": "Method and references",
  "lesson.meeting-cost.sources.body":
    "The cost is each person's hourly cost times the time spent, summed over the room. The U.S. Bureau of Labor Statistics publishes employer costs for employee compensation, including benefits as a share of pay, at https://www.bls.gov/ect/ . The examples above are independent fixtures for this method.",
  "lesson.meeting-cost.example.1": "A weekly team sync",
  "lesson.meeting-cost.example.2": "A daily standup with refocus time",
  "lesson.meeting-cost.example.3": "A quick one-off chat",
  "lesson.meeting-cost.example.4": "How long a $1,000 decision can take",
} as const;
