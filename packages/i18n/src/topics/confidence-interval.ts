export const messages = {
  "confidence-interval.operation.normal-interval": "Interval for a mean",
  "confidence-interval.field.mean": "Sample mean",
  "confidence-interval.field.sigma": "Population standard deviation",
  "confidence-interval.field.count": "Sample size",
  "confidence-interval.field.critical": "Critical value",
  "confidence-interval.field.lower": "Lower bound",
  "confidence-interval.field.upper": "Upper bound",
  "confidence-interval.result": "Margin of error",
  "confidence-interval.working.normal-interval":
    "E = {critical} × {sigma} ÷ √{count} = {answer}; {mean} − {answer} = {lower} and {mean} + {answer} = {upper}",
  "confidence-interval.answer.range": "{lower} to {upper}",
  "confidence-interval.answer.margin": "{mean} ± {margin}",
  "confidence-interval.error.invalid-field": "Enter a number in every field.",
  "confidence-interval.error.invalid-domain":
    "Use a standard deviation and critical value above zero and a whole-number sample size from 1 to 1,000,000.",
  "confidence-interval.error.output-overflow":
    "The result is outside the supported range.",
  "confidence-interval.visual.caption":
    "The interval reaches one margin of error either side of the sample mean",
  "confidence-interval.visual.mean": "Mean",
  "confidence-interval.visual.lower": "Lower",
  "confidence-interval.visual.upper": "Upper",
  "confidence-interval.visual.range": "± {margin} margin of error",
  "confidence-interval.visual.summary":
    "A number line with the sample mean {mean} in the middle and a shaded interval from {lower} to {upper}, which is {margin} on each side.",
  "confidence-interval.visual.description":
    "The diagram shows the sample mean on a number line with the interval shaded from the lower bound to the upper bound, one margin of error on each side.",
  "confidence-interval.visual.alternative":
    "The sample mean, the margin of error and both bounds are stated in text and come from the same calculation.",
  "lesson.confidence-interval.intro.title": "What this interval shows",
  "lesson.confidence-interval.intro.body":
    "A confidence interval for a mean is the sample mean plus or minus a margin of error. The margin is a critical value times the standard error σ/√n, so it shrinks as the sample grows and widens when you ask for more confidence.",
  "lesson.confidence-interval.meaning.title": "How to use it",
  "lesson.confidence-interval.meaning.body":
    "Enter the sample mean, the population standard deviation (σ, known in advance), the sample size and the critical value for the confidence level you want. Common two-sided values are 1.645 for 90%, 1.96 for 95% and 2.576 for 99%.",
  "lesson.confidence-interval.formula.normal-interval":
    "E = z* × σ / √n; interval x̄ − E to x̄ + E",
  "lesson.confidence-interval.example.0": "A two-standard-error interval",
  "lesson.confidence-interval.example.1": "A small sample of nine",
  "lesson.confidence-interval.example.2": "A one-standard-error margin",
  "lesson.confidence-interval.mistakes.title": "Common mistakes",
  "lesson.confidence-interval.mistakes.body":
    "Do not enter a sample standard deviation and treat the result as a t interval. A 95% level describes how often the method captures the true mean over repeated samples; it is not the probability that this particular interval contains it. Independent sampling matters.",
  "lesson.confidence-interval.limits.title": "Limits and assumptions",
  "lesson.confidence-interval.limits.body":
    "Assumes a known population σ, independent observations and a sample mean that is normally distributed or close to it for a large sample. Sample size 1 to 1,000,000; σ and the critical value above zero. It does not look up t critical values or check sampling assumptions. Inputs keep up to 30 significant digits and the working uses 50; only the displayed answer is rounded.",
  "lesson.confidence-interval.sources.title": "Sources",
  "lesson.confidence-interval.sources.body":
    "NIST Engineering Statistics Handbook, confidence limits for the mean: https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm",
  "lesson.confidence-interval.faq.q": "Why is 1.96 used for 95%?",
  "lesson.confidence-interval.faq.a":
    "In a standard normal distribution, 95% of the area lies within 1.96 standard deviations of the centre (more precisely 1.959964). Using that multiplier on the standard error gives a two-sided 95% interval.",
  "lesson.confidence-interval.variable.item0": "margin of error",
  "lesson.confidence-interval.variable.item1": "sample mean",
  "lesson.confidence-interval.variable.item2": "population standard deviation",
  "lesson.confidence-interval.variable.item3": "sample size",
  "lesson.confidence-interval.variable.item4": "critical value",
} as const;
