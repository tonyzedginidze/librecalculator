export const messages = {
  "unit.usd": "USD",
  "unit.percent": "percent (%)",
  "finance.money": "\u0024{amount}",
  "finance.money.negative": "\u2212\u0024{amount}",
  "finance.percent": "{value}%",
  "salary.operation.annual-to-hourly": "Salary to hourly",
  "salary.operation.hourly-to-annual": "Hourly to salary",
  "salary.field.annual": "Annual salary",
  "salary.field.hourly": "Hourly rate",
  "salary.field.hours": "Hours per week",
  "salary.field.weeks": "Paid weeks per year",
  "salary.unit.hours": "hours (h)",
  "salary.unit.weeks": "weeks (weeks)",
  "salary.answer.annual-to-hourly": "Hourly equivalent",
  "salary.answer.hourly-to-annual": "Annual equivalent",
  "salary.answer.value.annual-to-hourly": "{amount} per hour",
  "salary.answer.value.hourly-to-annual": "{amount} per year",
  "salary.working.summary":
    "{question}: {hours} hours \u00d7 {weeks} weeks = scheduled hours per year. Divide an annual salary by those hours for hourly pay, or multiply an hourly rate by them for annual pay: \u0024{pay} \u2192 \u0024{answer}, rounded to cents.",
  "salary.visual.caption": "The same gross pay per period",
  "salary.visual.hourly": "Per hour",
  "salary.visual.weekly": "Per week",
  "salary.visual.monthly": "Per month",
  "salary.visual.annual": "Per year",
  "salary.visual.summary":
    "Gross pay is {hourly} per hour, {weekly} per week, {monthly} per month and {annual} per year.",
  "salary.visual.note":
    "Gross US-dollar pay before tax and deductions. A month is one twelfth of the year; overtime and bonuses are excluded.",
  "salary.visual.description":
    "Four figures show the same gross pay per hour, week, month and year, each rounded once to cents.",
  "salary.visual.alternative":
    "Each period's gross pay is listed as an exact dollar amount.",
  "salary.error.invalid-field":
    "Enter pay in whole cents and hours as a plain number.",
  "salary.error.out-of-range":
    "Use 0.01 to 168 hours per week and 1 to 53 paid weeks.",
  "salary.error.output-overflow":
    "The result exceeds the supported dollar range.",
  "lesson.salary.intro.title": "Salary and hourly pay",
  "lesson.salary.intro.body":
    "An hourly equivalent explains how an annual salary relates to the hours you schedule. It is a gross-pay comparison before deductions, not a payslip calculation.",
  "lesson.salary.method.title": "Choose the question and enter values",
  "lesson.salary.method.body":
    "Choose the direction first. Enter annual dollars for the first operation or hourly dollars for the second. Paid weeks should include paid leave if it is included in the salary.",
  "lesson.salary.formula":
    "H = A \u00f7 (h \u00d7 w), and A = H \u00d7 h \u00d7 w.",
  "lesson.salary.mistakes.title": "Common mistakes",
  "lesson.salary.mistakes.body":
    "Do not use 52 paid weeks for a contract that pays only the weeks worked. Overtime, bonuses and unpaid leave need separate adjustments.",
  "lesson.salary.limits.title": "Assumptions and limits",
  "lesson.salary.limits.body":
    "USD gross pay, constant weekly hours, and 1\u201353 paid weeks. Hourly inputs must be whole cents. Output rounds half-up to cents. No tax, overtime premiums, benefits or employment-law interpretation. Educational estimates only, not financial, tax or investment advice.",
  "lesson.salary.faq.q": "Does this estimate take-home pay?",
  "lesson.salary.faq.a":
    "No. Tax, insurance, retirement contributions and other deductions are outside this comparison.",
  "lesson.salary.sources.title": "Method and references",
  "lesson.salary.sources.body":
    "The hourly and annual equivalents are multiplication and division over scheduled hours. The U.S. Bureau of Labor Statistics publishes hours and earnings data at https://www.bls.gov/ces/ . The examples above are independent fixtures for this method.",
  "lesson.salary.example.1": "A full-time annual salary",
  "lesson.salary.example.2": "Hourly work through the year",
  "lesson.salary.example.3": "A part-time salary",
} as const;
