export const messages = {
  "unit.usd": "USD",
  "unit.percent": "percent (%)",
  "finance.money": "\u0024{amount}",
  "finance.money.negative": "\u2212\u0024{amount}",
  "finance.percent": "{value}%",
  "roi.operation.return": "Calculate return",
  "roi.field.investment": "Amount invested",
  "roi.field.proceeds": "Amount received",
  "roi.field.fees": "Fees and costs",
  "roi.answer.return": "Return on investment",
  "roi.working.summary":
    "(\u0024{proceeds} \u2212 \u0024{fees} \u2212 \u0024{investment}) \u00f7 \u0024{investment} \u00d7 100 = {answer}%.",
  "roi.visual.caption": "What went in and what came back",
  "roi.visual.investment": "Invested",
  "roi.visual.net": "Received after fees",
  "roi.visual.profit": "Profit",
  "roi.visual.loss": "Loss",
  "roi.visual.summary":
    "You invested {investment} and received {net} after fees, a result of {profit} or {answer}.",
  "roi.visual.note":
    "Total return, not annualized. Excludes dividends, taxes and the time the money was invested. Not financial advice.",
  "roi.visual.description":
    "Bars compare the amount invested, the amount received after fees and the resulting profit or loss on one dollar scale.",
  "roi.visual.alternative":
    "The invested amount, net proceeds and profit or loss are listed as exact dollar amounts beside the bars.",
  "roi.error.invalid-field":
    "Enter dollar amounts in whole cents. The amount invested must be more than zero.",
  "roi.error.out-of-range": "Use values inside the documented field limits.",
  "roi.error.output-overflow":
    "The result exceeds the supported numeric range.",
  "lesson.roi.intro.title": "Investment return",
  "lesson.roi.intro.body":
    "A return percentage puts profit or loss in proportion to the initial investment. It helps compare amounts, but it does not measure risk or how long the investment took.",
  "lesson.roi.method.title": "Choose the question and enter values",
  "lesson.roi.method.body":
    "Enter the initial investment and the gross amount received when it is sold. Enter selling fees separately so they are deducted once.",
  "lesson.roi.formula": "ROI = (G \u2212 F \u2212 I) \u00f7 I \u00d7 100.",
  "lesson.roi.mistakes.title": "Common mistakes",
  "lesson.roi.mistakes.body":
    "Do not treat gross proceeds as profit. If costs are already deducted from your proceeds, enter zero fees to avoid deducting them twice.",
  "lesson.roi.limits.title": "Assumptions and limits",
  "lesson.roi.limits.body":
    "Simple, unannualized return. Fees can exceed proceeds and produce a loss larger than the investment. No tax calculation, dividends, cash-flow timing, or risk adjustment is inferred. Educational estimates only, not financial, tax or investment advice.",
  "lesson.roi.faq.q": "Is this an annual return?",
  "lesson.roi.faq.a":
    "No. A 20% result is the total return for the transaction regardless of whether it lasted a month or several years.",
  "lesson.roi.sources.title": "Method and references",
  "lesson.roi.sources.body":
    "ROI is the net profit divided by the amount invested, times 100. Investor.gov introduces investment returns, fees and risk at https://www.investor.gov/introduction-investing . The examples above are independent fixtures for this formula.",
  "lesson.roi.example.1": "Selling with a fee",
  "lesson.roi.example.2": "A loss",
  "lesson.roi.example.3": "Break even",
} as const;
