export const messages = {
  "discount.operation.salePrice": "Find the sale price",
  "discount.operation.discountPercent": "Find the discount percentage",
  "discount.field.original": "Original price",
  "discount.field.discount": "Discount",
  "discount.field.sale": "Sale price",
  "unit.usd": "USD",
  // biome-ignore lint/suspicious/noTemplateCurlyInString: "$" is the currency sign before a {placeholder}
  "discount.working.saved": "${original} × {rate}% = ${saved} saved",
  // biome-ignore lint/suspicious/noTemplateCurlyInString: "$" is the currency sign before a {placeholder}
  "discount.working.sale": "${original} − ${saved} = ${sale}",
  // biome-ignore lint/suspicious/noTemplateCurlyInString: "$" is the currency sign before a {placeholder}
  "discount.working.savedAmount": "${original} − ${sale} = ${saved} saved",
  // biome-ignore lint/suspicious/noTemplateCurlyInString: "$" is the currency sign before a {placeholder}
  "discount.working.percent": "${saved} ÷ ${original} × 100 = {percent}%",
  // biome-ignore lint/suspicious/noTemplateCurlyInString: "$" is the currency sign before a {placeholder}
  "discount.format.money": "${amount}",
  "discount.format.percent": "{amount}%",
  "discount.visual.caption": "What you pay and what you save",
  "discount.visual.captionRise": "Original price against the new price",
  "discount.visual.total": "Original price",
  "discount.visual.paid": "You pay",
  "discount.visual.savedPart": "You save",
  "discount.visual.original": "Original price",
  "discount.visual.new": "New price",
  "discount.visual.summary":
    "Of the original price of {original}, you pay {sale} and save {saved}.",
  "discount.visual.summaryRise":
    "The original price is {original} and the new price is {sale}, a change of {change}.",
  "discount.visual.description":
    "The original price split into the part you pay and the part you save.",
  "discount.visual.alternative":
    "A bar for the original price is divided into the sale price and the amount saved. When the new price is higher than the original, two bars compare the prices instead. The exact amounts are also stated in the answer and the steps.",
  "discount.error.invalid-field": "Enter a valid decimal number.",
  "discount.error.zero-denominator": "The original price must not be zero.",
  "discount.error.output-overflow":
    "The answer is outside the supported range.",
  "lesson.discount.intro.title": "How does a percentage discount work?",
  "lesson.discount.intro.body":
    "A discount of p% removes p hundredths of the original price. The amount saved is the original price times p ÷ 100, and the sale price is what remains after subtracting it. This calculator also works backwards: given an original price and a sale price, it finds the discount percentage.",
  "lesson.discount.meaning.title": "Pick the question you are asking",
  "lesson.discount.meaning.body":
    "Use “sale price” when a tag says something like 15% off and you want to know what you pay and what you save. Use “discount percentage” when you know the old and new price and want to compare deals. The percentage is always measured against the original price, not the sale price.",
  "lesson.discount.formula.salePrice": "S = P − P × d ÷ 100",
  "lesson.discount.formula.discountPercent": "d = (P − S) ÷ P × 100%",
  "lesson.discount.variable.original": "original price",
  "lesson.discount.variable.rate": "discount rate",
  "lesson.discount.variable.sale": "sale price",
  "unit.percent": "percent (%)",
  "lesson.discount.example.fifteen": "15% off a price of 80",
  "lesson.discount.example.cents": "30% off a price of 19.99",
  "lesson.discount.example.markup": "A negative discount (a price rise)",
  "lesson.discount.example.percent": "From 200 down to 150",
  "lesson.discount.mistakes.title": "Common mistakes",
  "lesson.discount.mistakes.body":
    "Do not subtract the percentage from the price directly: 15% off 80 is not 80 − 15. Take the percentage of the price first. Successive discounts do not add up: 20% off followed by 10% off is 28% off in total, not 30%, because the second discount applies to the already reduced price. To find the discount from two prices, divide by the original price, not the sale price.",
  "lesson.discount.limits.title": "Assumptions and numerical limits",
  "lesson.discount.limits.body":
    "Inputs are signed finite decimals with up to 30 significant digits, without grouping separators or exponent notation. Arithmetic uses 50 significant internal digits and nothing is rounded until it is displayed, so a real shop may round the final price to the nearest cent differently. Tax, shipping and coupons are not included. Discounts above 100% or below 0% are allowed and give a negative sale price or a price increase.",
  "lesson.discount.faq.stack.q": "Do two discounts add together?",
  "lesson.discount.faq.stack.a":
    "No. Each discount applies to the price left after the previous one. Run the calculator once per step, using the previous sale price as the next original price.",
  "lesson.discount.faq.zero.q": "Why can the original price not be zero?",
  "lesson.discount.faq.zero.a":
    "A discount percentage is a share of the original price, and dividing by zero is undefined. The sale price operation still works with an original price of zero.",
  "lesson.discount.faq.negative.q": "What does a negative discount mean?",
  "lesson.discount.faq.negative.a":
    "It is a price increase. For example, a discount of −10% on 50 gives a sale price of 55. The same applies in reverse when the sale price is above the original.",
  "lesson.discount.sources.title": "Sources and related topics",
  "lesson.discount.sources.body":
    "The formulas are elementary percent identities. For background, see OpenStax, Prealgebra 2e, section 6.4 “Solve Sales Tax, Commission, and Discount Applications”: https://openstax.org/books/prealgebra-2e/pages/6-4-solve-sales-tax-commission-and-discount-applications. The examples are authored here and checked against independent arithmetic fixtures. See also the percentage and percentage change calculators.",
} as const;
