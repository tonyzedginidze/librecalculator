export const messages = {
  "unit.usd": "USD",
  "unit.percent": "percent (%)",
  "lesson.compound-interest.unit.periods-per-year":
    "compounding periods per year",
  "lesson.compound-interest.unit.years": "years",
  "compound-interest.operation.compound": "Estimate compound growth",
  "compound-interest.field.principal": "Starting amount",
  "compound-interest.field.annualRate": "Annual rate",
  "compound-interest.field.years": "Term",
  "compound-interest.field.frequency": "Compounding",
  "compound-interest.unit.years": "Years (years)",
  "compound-interest.unit.per-year": "Times per year (per year)",
  "compound-interest.ui.presets": "Common schedules",
  "compound-interest.frequency.1": "Yearly",
  "compound-interest.frequency.2": "Twice a year",
  "compound-interest.frequency.4": "Quarterly",
  "compound-interest.frequency.12": "Monthly",
  "compound-interest.frequency.365": "Daily",
  "compound-interest.ui.final-balance": "Final balance",
  "compound-interest.ui.total-interest": "Interest earned",
  "compound-interest.ui.principal": "Starting amount",
  "compound-interest.ui.growth": "Growth",
  "compound-interest.ui.table.heading": "Year by year",
  "compound-interest.ui.table.year": "Year",
  "compound-interest.ui.table.balance": "Balance",
  "compound-interest.ui.table.interest": "Interest so far",
  "compound-interest.working.summary":
    "P = {principal}, r = {annualRate}%, n = {frequency}, t = {years}: A = P × (1 + r ÷ n)^(n × t) = {balance}. Interest = A − P = {interest}.",
  "compound-interest.visual.caption":
    "How much of the final balance is interest",
  "compound-interest.visual.summary":
    "A bar splits the {balance} final balance into the {principal} starting amount and {interest} of interest.",
  "compound-interest.visual.description":
    "The final balance split into the starting amount and the interest it earned, with a year-by-year table of balances rounded to cents.",
  "compound-interest.visual.alternative":
    "A bar shows the starting amount and the interest as parts of the final balance. A year-by-year table lists each year-end balance in USD; its last row equals the answer.",
  "compound-interest.error.invalid-principal":
    "Enter a valid principal amount.",
  "compound-interest.error.negative-principal":
    "The principal cannot be negative.",
  "compound-interest.error.fractional-cent-principal":
    "Enter a principal amount that is an exact number of cents.",
  "compound-interest.error.principal-out-of-range":
    "The principal exceeds the supported USD amount.",
  "compound-interest.error.invalid-rate": "Enter a valid annual rate.",
  "compound-interest.error.rate-out-of-range":
    "The annual rate must be between 0% and 100% inclusive.",
  "compound-interest.error.invalid-years":
    "Enter a whole number of years from 1 through 1000.",
  "compound-interest.error.invalid-frequency":
    "Choose a compounding frequency of 1, 2, 4, 12, or 365 times per year.",
  "compound-interest.error.output-overflow":
    "The estimated result exceeds the supported USD range.",
  "lesson.compound-interest.intro.title": "How compound interest grows",
  "lesson.compound-interest.intro.body":
    "Compound interest applies each period's growth to the current balance, so later periods can earn growth on earlier interest as well as on the original principal. This estimate assumes one starting deposit and a fixed nominal annual rate. It does not add recurring deposits or subtract fees, taxes, or withdrawals.",
  "lesson.compound-interest.formula.balance": "A = P × (1 + (R/100)/n)^(n × t)",
  "lesson.compound-interest.variable.principal": "starting principal",
  "lesson.compound-interest.variable.rate":
    "nominal annual rate R entered as a percentage; r = R/100",
  "lesson.compound-interest.variable.frequency":
    "number of compounding periods in each year",
  "lesson.compound-interest.variable.years": "whole number of years",
  "lesson.compound-interest.variable.balance": "estimated ending balance",
  "lesson.compound-interest.example.annual":
    "$1,000 at 10% compounded yearly for 2 years",
  "lesson.compound-interest.example.zero-rate":
    "$100 at 0% compounded monthly for 2 years",
  "lesson.compound-interest.example.quarterly":
    "$250 at 4% compounded quarterly for 1 year",
  "lesson.compound-interest.method.title": "How to use the estimate",
  "lesson.compound-interest.method.body":
    "Enter the initial USD principal, nominal annual percentage rate, whole-year term, and one of the supported periods-per-year values. The rate is divided by the selected frequency for each discrete period. The year-by-year series is generated from the same growth calculation as the final answer, then each plotted balance is rounded to cents for display.",
  "lesson.compound-interest.rounding.title":
    "Estimate versus account settlement",
  "lesson.compound-interest.rounding.body":
    "The formula keeps full internal precision between compounding periods and rounds the final estimated balance to cents once. It does not model an institution's daily accrual, statement dates, rate changes, minimum-balance rules, or per-period cent rounding. A real account can therefore settle differently.",
  "lesson.compound-interest.assumptions.title": "Limits and assumptions",
  "lesson.compound-interest.assumptions.body":
    "The rate is nominal and fixed from start to finish, the principal is a nonnegative USD amount in whole cents, and the term is 1–1000 whole years. Supported frequencies are annual, semiannual, quarterly, monthly, and daily (365 periods per year). The maximum rate is 100%. The model includes no deposits, withdrawals, fees, taxes, inflation, or currency conversion. Results that exceed the supported amount range are rejected.",
  "lesson.compound-interest.faq.frequency.q":
    "Why are only some compounding frequencies available?",
  "lesson.compound-interest.faq.frequency.a":
    "The supported choices—1, 2, 4, 12, and 365—represent common discrete schedules and keep the number of periods an exact integer for every whole-year term. The daily option means 365 periods per year; it does not model leap days or a particular bank's day-count convention.",
  "lesson.compound-interest.faq.estimate.q":
    "Is the final amount a guaranteed account balance?",
  "lesson.compound-interest.faq.estimate.a":
    "No. It is a mathematical estimate under a fixed-rate discrete-compounding model. Actual products can use different accrual, crediting, rounding, fee, tax, and timing rules.",
  "lesson.compound-interest.faq.deposits.q": "Can I add monthly deposits?",
  "lesson.compound-interest.faq.deposits.a":
    "Not in this calculator. Recurring contributions have timing choices that change the calculation; this result uses only the principal entered at the start.",
  "lesson.compound-interest.sources.title": "Formula reference",
  "lesson.compound-interest.sources.body":
    "The discrete compound-growth formula is also described by the U.S. Securities and Exchange Commission's Investor.gov compound-interest calculator: https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator. This calculator's cent settlement and assumptions are stated above and may differ from account terms.",
} as const;
