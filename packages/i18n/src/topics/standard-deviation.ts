export const messages = {
  "standard-deviation.operation.population": "Population",
  "standard-deviation.operation.sample": "Sample",
  "standard-deviation.field.values": "Values, separated by semicolons",
  "standard-deviation.field.mean": "Mean",
  "standard-deviation.field.variance": "Variance",
  "standard-deviation.field.count": "Count",
  "standard-deviation.field.divisor": "Divisor",
  "standard-deviation.working.population":
    "Mean {mean} of {count} values; variance = sum of squared deviations ÷ {divisor} = {variance}; σ = √{variance} = {answer}",
  "standard-deviation.working.sample":
    "Mean {mean} of {count} values; variance = sum of squared deviations ÷ {divisor} (n − 1) = {variance}; s = √{variance} = {answer}",
  "standard-deviation.result": "Result",
  "standard-deviation.error.invalid-field":
    "Enter between 1 and 100 numbers separated by semicolons, for example 4;7;7;9.",
  "standard-deviation.error.invalid-domain":
    "A sample needs at least two values.",
  "standard-deviation.error.output-overflow":
    "The result is outside the supported range.",
  "standard-deviation.visual.caption":
    "Your values with the mean and one standard deviation either side",
  "standard-deviation.visual.mean": "Mean",
  "standard-deviation.visual.low": "−1 SD",
  "standard-deviation.visual.high": "+1 SD",
  "standard-deviation.visual.band":
    "{inside} of {count} values fall within {low} to {high}",
  "standard-deviation.visual.summary":
    "A dot plot of {count} values from {min} to {max}. Mean {mean}; one standard deviation either side spans {low} to {high}, containing {inside} values.",
  "standard-deviation.visual.description":
    "A dot plot of the values with the mean and a shaded band one standard deviation either side.",
  "standard-deviation.visual.alternative":
    "Each value is a dot on a number line; equal values stack. A marker shows the mean and a shaded band covers one standard deviation below and above it. The exact numbers are stated in the answer and working.",
  "lesson.standard-deviation.formula.population": "σ = √(Σ(xᵢ − μ)² ÷ n)",
  "lesson.standard-deviation.formula.sample": "s = √(Σ(xᵢ − x̄)² ÷ (n − 1))",
  "lesson.standard-deviation.variable.sigma": "population standard deviation",
  "lesson.standard-deviation.variable.s": "sample standard deviation",
  "lesson.standard-deviation.variable.value": "a value in the list",
  "lesson.standard-deviation.variable.mu": "population mean",
  "lesson.standard-deviation.variable.mean": "sample mean",
  "lesson.standard-deviation.variable.count": "number of values",
  "lesson.standard-deviation.intro.title": "What standard deviation measures",
  "lesson.standard-deviation.intro.body":
    "Standard deviation measures typical spread around an arithmetic mean in the original units. Squaring deviations prevents opposite signs from cancelling, and taking a square root restores the units.",
  "lesson.standard-deviation.meaning.title": "Population or sample?",
  "lesson.standard-deviation.meaning.body":
    "Choose population when your values are the entire group you want to describe, such as every test score in one class. Choose sample when they are a sample used to estimate the spread of a larger group. Enter values separated by semicolons; a sample needs at least two.",
  "lesson.standard-deviation.example.0": "A population with mean five",
  "lesson.standard-deviation.example.1": "Three observations used as a sample",
  "lesson.standard-deviation.example.2": "Identical values have no spread",
  "lesson.standard-deviation.mistakes.title": "Common mistakes",
  "lesson.standard-deviation.mistakes.body":
    "Do not confuse variance with standard deviation: variance has squared units. Do not divide by n for the usual sample variance estimate; its divisor is n − 1. A small spread does not prove accuracy if every measurement shares a bias.",
  "lesson.standard-deviation.limits.title": "Assumptions and limits",
  "lesson.standard-deviation.limits.body":
    "The calculator describes unweighted numerical observations and assumes no measurement error model. Sample variance uses Bessel’s correction; sample standard deviation itself is not an unbiased estimate in general. It does not establish normality or a confidence interval. Numeric observations use up to 30 significant input digits and 50 working digits; no presentation rounding enters the calculation.",
  "lesson.standard-deviation.sources.title": "Sources",
  "lesson.standard-deviation.sources.body":
    "NIST Engineering Statistics Handbook, measures of scale: https://www.itl.nist.gov/div898/handbook/eda/section3/eda356.htm",
  "lesson.standard-deviation.faq.q":
    "Why divide by one fewer observation for samples?",
  "lesson.standard-deviation.faq.a":
    "Estimating the mean from the same observations uses one degree of freedom. Dividing the squared deviations by n − 1 gives the conventional unbiased variance estimate for independent observations from one population.",
} as const;
