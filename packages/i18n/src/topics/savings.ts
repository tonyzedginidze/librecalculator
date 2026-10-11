export const messages = {
  "unit.usd": "USD",
  "unit.percent": "percent (%)",
  "finance.money": "\u0024{amount}",
  "finance.money.negative": "\u2212\u0024{amount}",
  "finance.percent": "{value}%",
  "savings.operation.save": "Project savings",
  "savings.field.principal": "Starting balance",
  "savings.field.deposit": "Monthly deposit",
  "savings.field.annualRate": "Interest rate",
  "savings.field.months": "Saving period",
  "savings.unit.months": "months (months)",
  "savings.answer.save": "Balance at the end",
  "savings.working.summary":
    "Start with \u0024{principal} and repeat balance \u00d7 (1 + {annualRate}/1200) + \u0024{deposit} for {months} months. Starting balance plus deposits = \u0024{reference}; the final balance rounded once to cents = \u0024{answer}.",
  "savings.visual.caption": "What the final balance is made of",
  "savings.visual.total": "Final balance",
  "savings.visual.starting": "Starting balance",
  "savings.visual.deposits": "Your deposits",
  "savings.visual.interest": "Interest earned",
  "savings.visual.summary":
    "The final balance of {answer} is {starting} starting balance, {deposits} of deposits and {interest} of interest.",
  "savings.visual.note":
    "Estimate in US dollars at a constant nominal rate with end-of-month deposits; no fees, taxes or withdrawals. Not financial advice.",
  "savings.visual.description":
    "A bar splits the final balance into the starting balance, the deposits you made and the interest earned, all from the same projection.",
  "savings.visual.alternative":
    "The three parts and the final balance are listed as exact dollar amounts beside the bar.",
  "savings.error.invalid-field":
    "Enter a dollar amount in whole cents, or a plain number without grouping.",
  "savings.error.out-of-range":
    "Use a rate from 0% to 100% and a period of 1 to 1,200 months.",
  "savings.error.output-overflow":
    "The projected balance exceeds the supported dollar range.",
  "lesson.savings.intro.title": "Savings with regular deposits",
  "lesson.savings.intro.body":
    "Regular deposits often matter more than the starting balance. This estimate adds each deposit at the end of the month, after that month\u2019s interest.",
  "lesson.savings.method.title": "Choose the question and enter values",
  "lesson.savings.method.body":
    "Enter the current balance, the same deposit for every month, a nominal annual interest rate, and the number of months. The rate is divided by twelve; an effective annual yield is a different convention.",
  "lesson.savings.formula":
    "Balance = Pq\u207f + D(1 + q + \u2026 + q\u207f\u207b\u00b9), where q = 1 + R/1200.",
  "lesson.savings.mistakes.title": "Common mistakes",
  "lesson.savings.mistakes.body":
    "Do not enter an effective annual yield as a nominal rate without converting it. Beginning-of-month deposits would earn an extra month of interest.",
  "lesson.savings.limits.title": "Assumptions and limits",
  "lesson.savings.limits.body":
    "USD only. Constant interest and end-of-month deposits; no withdrawals, fees or taxes. Interest is retained at high precision and the final balance is rounded once, so an account that settles interest monthly can differ. Educational estimates only, not financial, tax or investment advice.",
  "lesson.savings.faq.q": "Are deposits included in the result?",
  "lesson.savings.faq.a":
    "Yes. The balance includes the starting money, every monthly deposit, and projected interest.",
  "lesson.savings.sources.title": "Method and references",
  "lesson.savings.sources.body":
    "The balance follows from monthly compounding and the finite geometric series. Investor.gov explains compound interest and saving assumptions at https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator . The examples above are independent fixtures for this method.",
  "lesson.savings.example.1": "A year of deposits without interest",
  "lesson.savings.example.2": "One deposit after interest",
  "lesson.savings.example.3": "Two months of growth and deposits",
} as const;
