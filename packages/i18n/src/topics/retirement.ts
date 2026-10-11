export const messages = {
  "unit.usd": "USD",
  "unit.percent": "percent (%)",
  "finance.money": "\u0024{amount}",
  "finance.money.negative": "\u2212\u0024{amount}",
  "finance.percent": "{value}%",
  "retirement.operation.project": "Project retirement savings",
  "retirement.field.balance": "Current savings",
  "retirement.field.contribution": "Yearly contribution",
  "retirement.field.annualRate": "Annual return",
  "retirement.field.years": "Years to retirement",
  "retirement.unit.years": "years (years)",
  "retirement.answer.project": "Balance at retirement",
  "retirement.working.summary":
    "Start with \u0024{balance}. Each year multiply by (1 + {annualRate}/100), then add \u0024{contribution}; repeat {years} times. Savings plus contributions = \u0024{reference}. Projected balance rounded once to cents = \u0024{answer}.",
  "retirement.visual.caption": "Where the projected balance comes from",
  "retirement.visual.total": "Projected balance",
  "retirement.visual.starting": "Current savings",
  "retirement.visual.contributions": "Contributions",
  "retirement.visual.growth": "Investment growth",
  "retirement.visual.summary":
    "The projected balance of {answer} is {starting} of current savings, {contributions} of contributions and {growth} of growth.",
  "retirement.visual.note":
    "Nominal US dollars at a constant return with year-end contributions; no fees, taxes, inflation or market swings. Not financial advice.",
  "retirement.visual.description":
    "A bar splits the projected balance into current savings, total contributions and investment growth from the same projection.",
  "retirement.visual.alternative":
    "The three parts and the projected balance are listed as exact dollar amounts beside the bar.",
  "retirement.error.invalid-field":
    "Enter a dollar amount in whole cents, or a plain number without grouping.",
  "retirement.error.out-of-range":
    "Use a return from 0% to 100% and 1 to 100 years.",
  "retirement.error.output-overflow":
    "The projected balance exceeds the supported dollar range.",
  "lesson.retirement.intro.title": "Retirement savings projection",
  "lesson.retirement.intro.body":
    "This projection asks what a starting balance and regular annual contributions could grow to. It does not determine whether that balance is enough to retire or guarantee investment performance.",
  "lesson.retirement.method.title": "Choose the question and enter values",
  "lesson.retirement.method.body":
    "Enter today\u2019s retirement balance, the same annual contribution, a constant growth assumption, and the years remaining. Contributions are added at each year\u2019s end.",
  "lesson.retirement.formula":
    "Starting from B, repeat t times: balance \u2190 balance \u00d7 (1 + R/100) + C.",
  "lesson.retirement.mistakes.title": "Common mistakes",
  "lesson.retirement.mistakes.body":
    "A nominal future balance is not today\u2019s purchasing power. Contributions at the start of a year would grow longer. Do not interpret a constant growth scenario as guaranteed returns.",
  "lesson.retirement.limits.title": "Assumptions and limits",
  "lesson.retirement.limits.body":
    "USD, nonnegative constant annual growth from 0% to 100%, 1\u2013100 years, and year-end contributions. Fees, taxes, inflation, contribution limits, withdrawals and market volatility are excluded. Educational estimates only, not financial, tax or investment advice.",
  "lesson.retirement.faq.q": "Can I use this as a retirement income plan?",
  "lesson.retirement.faq.a":
    "No. The result is only an accumulation scenario. Income planning needs spending, life expectancy, inflation, taxes and uncertain investment returns.",
  "lesson.retirement.sources.title": "Method and references",
  "lesson.retirement.sources.body":
    "The projection repeats one year of compound growth followed by a year-end contribution. Investor.gov explains compounding and offers related tools at https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator . The examples above are independent fixtures for this method.",
  "lesson.retirement.example.1": "A decade of contributions without growth",
  "lesson.retirement.example.2": "1 year at 10%",
  "lesson.retirement.example.3": "2 annual contributions at 10%",
} as const;
