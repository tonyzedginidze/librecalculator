export const messages = {
  "unit.usd": "USD",
  "unit.percent": "percent (%)",
  "finance.money": "\u0024{amount}",
  "finance.money.negative": "\u2212\u0024{amount}",
  "finance.percent": "{value}%",
  "inflation.operation.future-cost": "Future cost",
  "inflation.operation.purchasing-power": "Buying power",
  "inflation.field.amount": "Amount",
  "inflation.field.annualRate": "Inflation rate",
  "inflation.field.years": "Years",
  "inflation.unit.years": "years (years)",
  "inflation.answer.future-cost": "Future cost",
  "inflation.answer.purchasing-power": "Worth in today\u2019s dollars",
  "inflation.working.summary":
    "{question}: the price factor is (1 + {annualRate}/100)^{years}. Multiply \u0024{amount} by it for a future cost, or divide \u0024{amount} by it for buying power. Rounded to cents = \u0024{answer}.",
  "inflation.visual.future-cost.caption":
    "The same purchase now and in {years} years",
  "inflation.visual.future-cost.before": "Costs today",
  "inflation.visual.future-cost.after": "Costs in {years} years",
  "inflation.visual.future-cost.summary":
    "Something that costs {amount} today would cost {answer} in {years} years.",
  "inflation.visual.purchasing-power.caption":
    "What future cash buys in today\u2019s prices",
  "inflation.visual.purchasing-power.before": "Cash in {years} years",
  "inflation.visual.purchasing-power.after": "Worth today",
  "inflation.visual.purchasing-power.summary":
    "{amount} received in {years} years buys what {answer} buys today.",
  "inflation.visual.note":
    "A constant-rate scenario in US dollars, not official price-index data or a forecast.",
  "inflation.visual.description":
    "Two bars on one dollar scale compare the entered amount with its inflation-adjusted equivalent.",
  "inflation.visual.alternative":
    "Both amounts are listed as exact dollar figures beside the bars.",
  "inflation.error.invalid-field":
    "Enter a dollar amount in whole cents and a plain rate without grouping.",
  "inflation.error.out-of-range":
    "Use an inflation rate from 0% to 100% and 0 to 100 years.",
  "inflation.error.output-overflow":
    "The result exceeds the supported dollar range.",
  "lesson.inflation.intro.title": "Inflation and purchasing power",
  "lesson.inflation.intro.body":
    "Inflation raises the amount needed to buy the same basket. Cash held unchanged buys less when prices increase. These are two directions of the same constant-rate estimate.",
  "lesson.inflation.method.title": "Choose the question and enter values",
  "lesson.inflation.method.body":
    "Choose future cost to project a current price, or purchasing power to express a fixed future cash amount in today\u2019s dollars. Enter a constant annual rate; it is a scenario, not historical CPI data.",
  "lesson.inflation.formula":
    "Future cost = A \u00d7 (1 + R/100)\u1d57. Buying power today = A \u00f7 (1 + R/100)\u1d57.",
  "lesson.inflation.mistakes.title": "Common mistakes",
  "lesson.inflation.mistakes.body":
    "Do not subtract the annual percentage repeatedly: price changes compound. A future-cost result and a purchasing-power result use multiplication and division respectively.",
  "lesson.inflation.limits.title": "Assumptions and limits",
  "lesson.inflation.limits.body":
    "USD, nonnegative inflation from 0% to 100%, and whole years from 0 to 100. No live price-index data or forecast is supplied. Deflation is outside this calculator\u2019s domain. Educational estimates only, not financial, tax or investment advice.",
  "lesson.inflation.faq.q": "Does this use current inflation data?",
  "lesson.inflation.faq.a":
    "No. The rate is the scenario you enter. Actual inflation varies over time and between spending categories.",
  "lesson.inflation.sources.title": "Method and references",
  "lesson.inflation.sources.body":
    "The projection compounds a constant annual rate. Official U.S. inflation is measured by the Consumer Price Index from the Bureau of Labor Statistics at https://www.bls.gov/cpi/ ; this calculator does not use that data. The examples above are independent fixtures for the formula.",
  "lesson.inflation.example.1": "Two years at ten percent",
  "lesson.inflation.example.2": "Cash buying power after inflation",
  "lesson.inflation.example.3": "No inflation",
} as const;
