export const messages = {
  "weighted-average.operation.weighted-mean": "Weighted mean",
  "weighted-average.field.values": "Values, separated by semicolons",
  "weighted-average.field.weights": "Weights, in the same order",
  "weighted-average.field.weightedSum": "Weighted sum",
  "weighted-average.field.totalWeight": "Total weight",
  "weighted-average.working.weighted-mean":
    "Σ(w × x) = {weightedSum}; Σw = {totalWeight}; {weightedSum} ÷ {totalWeight} = {answer}",
  "weighted-average.result": "Weighted mean",
  "weighted-average.error.invalid-field":
    "Enter numbers separated by semicolons, for example 88; 92; 75.",
  "weighted-average.error.invalid-domain":
    "Give one weight per value. Weights cannot be negative and must not all be zero.",
  "weighted-average.error.output-overflow":
    "The result is outside the supported range.",
  "weighted-average.visual.caption":
    "Each value with its share of the total weight, and the weighted mean",
  "weighted-average.visual.row": "Value {index}",
  "weighted-average.visual.row-note": "Weight {weight} · {percent}% of total",
  "weighted-average.visual.mean": "Weighted mean",
  "weighted-average.visual.more":
    "Showing the first {shown} of {count} values.",
  "weighted-average.visual.summary":
    "{count} values with their weights; the weighted mean is {answer}, from a weighted sum of {weightedSum} divided by a total weight of {totalWeight}.",
  "weighted-average.visual.description":
    "The diagram draws each value as a bar, notes its weight as a share of the total, and ends with the weighted mean on the same scale.",
  "weighted-average.visual.alternative":
    "Each value, its weight and the weighted mean are stated in text from the same calculation.",
  "lesson.weighted-average.intro.title": "What a weighted mean is",
  "lesson.weighted-average.intro.body":
    "A weighted mean lets some values count more than others. Multiply each value by its weight, add the products, then divide by the total weight. Course grades, portfolio returns and survey scores are common uses.",
  "lesson.weighted-average.meaning.title": "How to use it",
  "lesson.weighted-average.meaning.body":
    "Type the values separated by semicolons, then the weights in the same order. Weights can be percentages, credits, counts or any relative importance; they do not need to add up to 1 or 100.",
  "lesson.weighted-average.formula.weighted-mean": "x̄w = Σ(wᵢ × xᵢ) / Σwᵢ",
  "lesson.weighted-average.example.0": "Double weight on the middle value",
  "lesson.weighted-average.example.1": "Three times the weight on 80",
  "lesson.weighted-average.example.2": "A zero weight contributes nothing",
  "lesson.weighted-average.mistakes.title": "Common mistakes",
  "lesson.weighted-average.mistakes.body":
    "Divide by the total weight, not by the number of values. Keep each weight next to its value. Negative weights are not supported and all-zero weights have no mean.",
  "lesson.weighted-average.limits.title": "Limits and assumptions",
  "lesson.weighted-average.limits.body":
    "One to 100 values with matching weights. Weights must be zero or more with a positive total. This is a descriptive average only: no survey design, uncertainty or handling of missing data. Inputs keep up to 30 significant digits and the working uses 50; only the displayed answer is rounded.",
  "lesson.weighted-average.sources.title": "Sources",
  "lesson.weighted-average.sources.body":
    "Weighted arithmetic mean definition: Σ(wᵢxᵢ)/Σwᵢ. Independently written examples check unequal and zero weights.",
  "lesson.weighted-average.faq.q": "Do weights need to add up to 100?",
  "lesson.weighted-average.faq.a":
    "No. Multiplying every weight by the same positive number leaves the mean unchanged, because the calculator divides by the actual total.",
  "lesson.weighted-average.variable.item0": "weighted mean",
  "lesson.weighted-average.variable.item1": "value",
  "lesson.weighted-average.variable.item2": "weight of that value",
} as const;
