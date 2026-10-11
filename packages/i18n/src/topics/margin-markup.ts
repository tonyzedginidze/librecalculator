export const messages = {
  "unit.usd": "USD",
  "unit.percent": "percent (%)",
  "finance.money": "\u0024{amount}",
  "finance.money.negative": "\u2212\u0024{amount}",
  "finance.percent": "{value}%",
  "margin-markup.operation.margin": "Profit margin",
  "margin-markup.operation.markup": "Markup on cost",
  "margin-markup.field.cost": "Cost",
  "margin-markup.field.price": "Selling price",
  "margin-markup.answer.margin": "Margin",
  "margin-markup.answer.markup": "Markup",
  "margin-markup.working.summary":
    "{question}: profit is \u0024{price} \u2212 \u0024{cost}. Divide profit by the price \u0024{price} for margin or by the cost \u0024{cost} for markup, then \u00d7 100. Result = {answer}%.",
  "margin-markup.visual.caption.margin":
    "Margin is the profit share of the selling price",
  "margin-markup.visual.caption.markup":
    "Markup is the profit added on top of cost",
  "margin-markup.visual.caption.loss": "Selling below cost loses money",
  "margin-markup.visual.cost": "Cost",
  "margin-markup.visual.price": "Selling price",
  "margin-markup.visual.profit": "Profit",
  "margin-markup.visual.loss": "Loss",
  "margin-markup.visual.summary.margin":
    "The selling price of {price} is {cost} of cost and {profit} of profit, a margin of {answer}.",
  "margin-markup.visual.summary.markup":
    "Adding {profit} of profit to a cost of {cost} gives a price of {price}, a markup of {answer}.",
  "margin-markup.visual.summary.loss":
    "The cost of {cost} is {price} recovered from the sale and {profit} lost, a result of {answer}.",
  "margin-markup.visual.note":
    "Per-unit gross profit in US dollars; shipping, overhead and taxes are not included.",
  "margin-markup.visual.description":
    "A bar splits the selling price into cost and profit. Margin divides the profit by the price; markup divides the same profit by the cost.",
  "margin-markup.visual.alternative":
    "The cost, price and profit or loss are listed as exact dollar amounts beside the bar.",
  "margin-markup.error.invalid-field":
    "Enter cost and price in whole cents, each more than zero.",
  "margin-markup.error.out-of-range":
    "Use values inside the documented field limits.",
  "margin-markup.error.output-overflow":
    "The result exceeds the supported numeric range.",
  "lesson.margin-markup.intro.title": "Profit margin and markup",
  "lesson.margin-markup.intro.body":
    "The same profit has two percentages. Margin compares profit with revenue; markup compares profit with cost. A price of one hundred dollars and cost of eighty dollars has a twenty percent margin and a twenty-five percent markup.",
  "lesson.margin-markup.method.title": "Choose the question and enter values",
  "lesson.margin-markup.method.body":
    "Choose margin for the share of selling price kept as profit, or markup for the percentage added to cost. Enter cost and selling price in dollars.",
  "lesson.margin-markup.formula":
    "Margin = (P \u2212 C) \u00f7 P \u00d7 100. Markup = (P \u2212 C) \u00f7 C \u00d7 100.",
  "lesson.margin-markup.mistakes.title": "Common mistakes",
  "lesson.margin-markup.mistakes.body":
    "A 25% markup is not a 25% margin. Include relevant unit costs consistently; this calculator does not infer shipping, overhead or taxes.",
  "lesson.margin-markup.limits.title": "Assumptions and limits",
  "lesson.margin-markup.limits.body":
    "Both cost and price must be positive whole-cent USD amounts. Selling below cost produces a negative percentage. This is a unit gross-profit comparison, not business net profit. Educational estimates only, not financial, tax or investment advice.",
  "lesson.margin-markup.faq.q": "Can the result be negative?",
  "lesson.margin-markup.faq.a":
    "Yes. A selling price below cost represents a loss, so both margin and markup are negative.",
  "lesson.margin-markup.sources.title": "Method and references",
  "lesson.margin-markup.sources.body":
    "Margin and markup divide the same per-unit profit by different bases: the selling price or the cost. The U.S. Small Business Administration covers pricing and business finances at https://www.sba.gov/business-guide/manage-your-business/manage-your-finances . The examples above are independent fixtures for both ratios.",
  "lesson.margin-markup.example.1": "Margin on an $80 cost",
  "lesson.margin-markup.example.2": "Markup on the same transaction",
  "lesson.margin-markup.example.3": "Selling below cost",
} as const;
