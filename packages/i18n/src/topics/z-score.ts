export const messages = {
  "z-score.operation.standard-score": "Z-score of a value",
  "z-score.field.value": "Value",
  "z-score.field.mean": "Mean",
  "z-score.field.deviation": "Standard deviation",
  "z-score.working.standard-score":
    "z = ({value} − {mean}) ÷ {deviation} = {answer}",
  "z-score.result": "Z-score",
  "z-score.unit.standard-score": "σ",
  "z-score.error.invalid-field": "Enter a number in every field.",
  "z-score.error.invalid-domain":
    "The standard deviation must be greater than zero.",
  "z-score.error.output-overflow": "The result is outside the supported range.",
  "z-score.visual.caption":
    "Where the value sits, in standard deviations from the mean",
  "z-score.visual.mean": "Mean",
  "z-score.visual.value": "Value",
  "z-score.visual.z": "z",
  "z-score.visual.note":
    "The bell curve is a reference shape for scale. A z-score alone does not assume normal data or give a percentile.",
  "z-score.visual.summary.above":
    "On a reference bell curve, the value {value} lies {distance} standard deviations above the mean of {mean}, so z = {answer}. The tail beyond the value is shaded.",
  "z-score.visual.summary.below":
    "On a reference bell curve, the value {value} lies {distance} standard deviations below the mean of {mean}, so z = {answer}. The tail beyond the value is shaded.",
  "z-score.visual.summary.at":
    "On a reference bell curve, the value {value} sits exactly at the mean of {mean}, so z = 0.",
  "z-score.visual.description":
    "The diagram places the value on a bell-shaped reference curve. The top scale counts standard deviations from the mean; the bottom scale shows the matching raw values.",
  "z-score.visual.alternative":
    "The value, the mean and the z-score are stated in text. The shaded tail runs from the value outward; no percentile is calculated.",
  "lesson.z-score.intro.title": "What a z-score tells you",
  "lesson.z-score.intro.body":
    "A z-score (standard score) says how many standard deviations a value lies from a mean. Positive means above the mean, negative means below. Because it has no units, it lets you compare values measured on different scales, such as a test score and a race time.",
  "lesson.z-score.meaning.title": "How to use it",
  "lesson.z-score.meaning.body":
    "Enter the value, the mean of the group you are comparing against, and that group’s standard deviation. All three must describe the same quantity in the same units. The standard deviation must be greater than zero.",
  "lesson.z-score.formula.standard-score": "z = (x − μ) / σ",
  "lesson.z-score.example.0": "A test score of 85 when the class mean is 70",
  "lesson.z-score.example.1": "2 standard deviations below the mean",
  "lesson.z-score.example.2": "A value exactly at the mean",
  "lesson.z-score.mistakes.title": "Common mistakes",
  "lesson.z-score.mistakes.body":
    "A positive score means above the mean, not automatically better. Do not enter the variance in the standard-deviation field, and do not mix the mean of one group with the spread of another.",
  "lesson.z-score.limits.title": "Limits and assumptions",
  "lesson.z-score.limits.body":
    "This calculator standardizes one value using the mean and standard deviation you supply. It does not estimate them, assume a normal distribution, compute a percentile or p-value, or flag outliers. Inputs keep up to 30 significant digits and the calculation uses 50; only the displayed answer is rounded.",
  "lesson.z-score.sources.title": "Sources",
  "lesson.z-score.sources.body":
    "OpenStax Introductory Statistics 2e, normal distribution and standardization: https://openstax.org/details/books/introductory-statistics-2e",
  "lesson.z-score.faq.q": "Does a z-score of 2 mean a fixed percentile?",
  "lesson.z-score.faq.a":
    "Only if you also assume a distribution. Standardizing alone does not determine a percentile; reading one off a normal table adds the assumption that the data are normal.",
  "lesson.z-score.variable.item0": "z-score",
  "lesson.z-score.variable.item1": "value",
  "lesson.z-score.variable.item2": "mean",
  "lesson.z-score.variable.item3": "standard deviation",
} as const;
