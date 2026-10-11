export const messages = {
  "average.operation.mean": "Mean",
  "average.operation.median": "Median",
  "average.operation.mode": "Mode",
  "average.field.values": "Values, separated by semicolons",
  "average.field.count": "Count",
  "average.field.sum": "Sum",
  "average.working.mean": "Sum {sum} ÷ {count} values = {answer}",
  "average.working.median":
    "{count} values (sum {sum}), sorted; the middle value is {answer}",
  "average.working.mode":
    "{count} values (sum {sum}); the most frequent value is {answer}",
  "average.result": "Result",
  "average.error.invalid-field":
    "Enter between 1 and 100 numbers separated by semicolons, for example 4;7;7;9.",
  "average.error.invalid-domain":
    "There is no single mode: no value repeats, or two values tie for most frequent.",
  "average.error.output-overflow": "The result is outside the supported range.",
  "average.visual.caption": "Your values with the mean, median and mode",
  "average.visual.mean": "Mean",
  "average.visual.median": "Median",
  "average.visual.mode": "Mode",
  "average.visual.join": "{first} · {second}",
  "average.visual.summary":
    "A dot plot of {count} values from {min} to {max}. Mean {mean}, median {median}{modeText}.",
  "average.visual.summaryMode": ", mode {mode}",
  "average.visual.noMode": "No single mode: no value repeats, or values tie.",
  "average.visual.description":
    "A dot plot stacks repeated values, with markers for the mean, median and mode.",
  "average.visual.alternative":
    "Each value is a dot on a number line; equal values stack. Labelled markers show the mean, median and mode, and the selected one is highlighted. The exact numbers are stated in the answer and the steps.",
  "lesson.average.formula.mean": "x̄ = Σxᵢ ÷ n",
  "lesson.average.formula.median": "M = middle of x₍₁₎ ≤ … ≤ x₍ₙ₎",
  "lesson.average.formula.mode": "Mo = the value that occurs most often",
  "lesson.average.variable.mean": "mean",
  "lesson.average.variable.median": "median",
  "lesson.average.variable.mode": "mode",
  "lesson.average.variable.value": "a value in the list",
  "lesson.average.variable.sorted": "values sorted from smallest to largest",
  "lesson.average.variable.count": "number of values",
  "lesson.average.intro.title": "What mean, median and mode tell you",
  "lesson.average.intro.body":
    "A dataset can have several different centres. The mean balances every observation; the median locates the middle after sorting; the mode identifies the most frequent value. Their disagreement can reveal skew or outliers.",
  "lesson.average.meaning.title": "Choose the centre you need",
  "lesson.average.meaning.body":
    "Enter between one and 100 values separated by semicolons, all in the same unit. Choose the mean for an arithmetic balance point, the median when a few very large or small values should not dominate, or the mode for the most common value. Every value has equal weight.",
  "lesson.average.example.0": "Mean of 2, 4 and 6",
  "lesson.average.example.1": "Median of 1, 2, 8 and 9",
  "lesson.average.example.2": "Mode of 2, 4, 4 and 6",
  "lesson.average.mistakes.title": "Common mistakes",
  "lesson.average.mistakes.body":
    "Do not average averages unless their group sizes are equal. Sort before finding the median, and use the mean of the two central values when the count is even. A mode is not the largest value. Lists with tied frequencies or no repeated value have no single mode and are rejected.",
  "lesson.average.limits.title": "Assumptions and limits",
  "lesson.average.limits.body":
    "This is unweighted descriptive arithmetic. Leave out missing values deliberately. The mode needs exactly one most frequent value occurring at least twice; ties are not resolved by picking one. Values use up to 30 significant digits and 50 internal digits; the answer is rounded to two decimals only for display.",
  "lesson.average.sources.title": "Sources",
  "lesson.average.sources.body":
    "OpenStax Introductory Statistics 2e, descriptive statistics: https://openstax.org/details/books/introductory-statistics-2e",
  "lesson.average.faq.q": "Why do mean and median differ?",
  "lesson.average.faq.a":
    "Large or small outliers move the mean because every value contributes to its sum. The median depends on order and the middle positions, so it often moves less.",
} as const;
