export const messages = {
  "percentage.operation.ofValue": "Find a percentage of a value",
  "percentage.operation.ratio": "Find what percent one value is of another",
  "percentage.field.value": "Value",
  "percentage.field.percentage": "Percentage",
  "percentage.field.part": "Part",
  "percentage.field.whole": "Whole",
  "percentage.working.ofValue": "{second}% of {first} = {answer}",
  "percentage.working.ratio": "{first} ÷ {second} × 100 = {answer}%",
  "percentage.visual.description":
    "A ring shows the rate as a share of a full circle: the percentage applied to the value, or the part as a share of the whole.",
  "percentage.visual.alternative":
    "The filled arc is the rate out of 100%. Rates above 100% fill the ring and are flagged, and a negative answer is stated in the text.",
  "percentage.visual.caption.ofValue": "The rate as a share of the value",
  "percentage.visual.caption.ratio": "The part as a share of the whole",
  "percentage.visual.label.ofValue": "{rate}% of {value}",
  "percentage.visual.label.ratio": "{part} of {whole}",
  "percentage.visual.summary.ofValue":
    "A ring filled to {rate}% shows that {rate}% of {value} is {answer}.",
  "percentage.visual.summary.ratio":
    "A ring filled to {answer}% shows that {part} is {answer}% of {whole}.",
  "percentage.visual.outside":
    "The rate is above 100%, so the ring is full: the answer is larger than the reference.",
  "percentage.visual.negative":
    "The answer is negative; the ring shows its size, and the sign is in the answer.",
  "percentage.error.invalid-field": "Enter a valid decimal number.",
  "percentage.error.zero-denominator": "The whole must not be zero.",
  "percentage.error.output-overflow":
    "The answer is outside the supported range.",
  "lesson.percentage.intro.title": "What does percent mean?",
  "lesson.percentage.intro.body":
    "Percent means “per hundred.” A percentage describes a ratio whose reference scale is 100; it is a way to compare quantities, not a unit by itself. This calculator handles two questions: a stated rate applied to a value, and the rate represented by a part of a non-zero whole.",
  "lesson.percentage.meaning.title":
    "Choose the question that matches your numbers",
  "lesson.percentage.meaning.body":
    "Use “percentage of a value” when you know a base and a rate—for example, finding a 15% discount on a price. Use “part as a percentage of whole” when you know both quantities and want to compare them. Keep the part and whole in the same units. The whole is the reference quantity, so swapping them changes the answer.",
  "lesson.percentage.formula.ofValue": "R = V × p ÷ 100",
  "lesson.percentage.formula.ratio": "p = A ÷ B × 100%",
  "lesson.percentage.variable.value": "base value",
  "lesson.percentage.variable.rate": "percentage rate",
  "lesson.percentage.variable.result": "result in the base value's units",
  "lesson.percentage.variable.part": "part being compared",
  "lesson.percentage.variable.whole": "non-zero reference whole",
  "unit.percent": "percent (%)",
  "lesson.percentage.example.discount": "A 15% discount amount on 80",
  "lesson.percentage.example.negative": "125% of a negative value",
  "lesson.percentage.example.ratio": "18 out of 24",
  "lesson.percentage.example.small": "2.5% of a small value",
  "lesson.percentage.mistakes.title": "Common mistakes",
  "lesson.percentage.mistakes.body":
    "Do not divide by 100 twice: the rate is divided by 100 exactly once in the first formula. In the ratio operation, divide the part by the whole and then multiply by 100. Do not confuse a percentage amount with the new total after an increase or decrease; the amount is only the change or portion. A ratio is undefined when its whole is zero, so that input is rejected rather than shown as infinity.",
  "lesson.percentage.limits.title": "Assumptions and numerical limits",
  "lesson.percentage.limits.body":
    "Inputs are signed finite decimal values with up to 30 significant digits. Editable canonical values do not accept grouping separators or exponent notation; locale-specific decimal entry is normalized at the input boundary. Percentages may be negative or greater than 100, and values may be negative. Arithmetic uses 50 significant working digits and is not rounded until presentation. Results beyond the supported decimal exponent range are rejected. This is arithmetic, not a rule about tax, discounts, or financial settlement.",
  "lesson.percentage.faq.over100.q": "Can a percentage be greater than 100%?",
  "lesson.percentage.faq.over100.a":
    "Yes. It means the compared amount is greater than the reference, or that a rate above 100% is being applied. No artificial 0–100 restriction is imposed.",
  "lesson.percentage.faq.zero.q": "Why can the whole not be zero?",
  "lesson.percentage.faq.zero.a":
    "A ÷ 0 is undefined, so no finite percentage represents a part relative to a zero whole. The other operation can still calculate a percentage of zero.",
  "lesson.percentage.faq.negative.q": "What does a negative answer mean?",
  "lesson.percentage.faq.negative.a":
    "The sign follows the signed quantities and rate. It can describe a signed amount; it is not automatically a negative percentage change, which is a separate calculation with its own baseline convention.",
  "lesson.percentage.sources.title": "Sources and related topics",
  "lesson.percentage.sources.body":
    "The formulas are elementary ratio identities. For background, see OpenStax, Prealgebra 2e, section 6.3 “Solve General Applications of Percent”: https://openstax.org/books/prealgebra-2e/pages/6-3-solve-general-applications-of-percent. The examples above are authored here and checked against independent arithmetic fixtures.",
} as const;
