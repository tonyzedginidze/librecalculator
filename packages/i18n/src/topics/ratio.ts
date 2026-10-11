export const messages = {
  "ratio.operation.quotient": "Simplify to one",
  "ratio.operation.scale-ratio": "Scale a ratio",
  "ratio.field.first": "First amount (A)",
  "ratio.field.second": "Second amount (B)",
  "ratio.field.target": "New first amount",
  "ratio.working.quotient":
    "{first} ÷ {second} = {answer}, so {first} : {second} = {answer} : 1",
  "ratio.working.scale-ratio": "{target} × {second} ÷ {first} = {answer}",
  "ratio.result": "Result",
  "ratio.unit.quotient": ": 1",
  "ratio.error.invalid-field": "Enter a number in every field.",
  "ratio.error.invalid-domain":
    "Amounts cannot be negative, the second amount must be above zero, and scaling needs a first amount above zero.",
  "ratio.error.output-overflow": "The result is outside the supported range.",
  "ratio.visual.caption": "The ratio and its equivalent",
  "ratio.visual.colon": ":",
  "ratio.visual.equals": "=",
  "ratio.visual.first": "A",
  "ratio.visual.second": "B",
  "ratio.visual.unit": "One B",
  "ratio.visual.value": "A ÷ B",
  "ratio.visual.newFirst": "New A",
  "ratio.visual.newSecond": "New B",
  "ratio.visual.summaryQuotient":
    "{first} to {second} is the same ratio as {answer} to 1.",
  "ratio.visual.summaryScale":
    "{first} to {second} is the same ratio as {target} to {answer}.",
  "ratio.visual.description":
    "The ratio you entered beside the equivalent ratio the calculator found.",
  "ratio.visual.alternative":
    "Two ratios are written side by side with an equals sign: the one entered and its equivalent, either reduced to a value per one or scaled to a new first amount. The exact numbers are stated in the answer and working.",
  "lesson.ratio.formula.quotient": "q = A ÷ B",
  "lesson.ratio.formula.scale-ratio": "B′ = A′ × B ÷ A",
  "lesson.ratio.variable.quotient": "value of the ratio (A per one B)",
  "lesson.ratio.variable.first": "first amount",
  "lesson.ratio.variable.second": "second amount",
  "lesson.ratio.variable.newFirst": "new first amount",
  "lesson.ratio.variable.newSecond": "matching new second amount",
  "lesson.ratio.intro.title": "What a ratio tells you",
  "lesson.ratio.intro.body":
    "A ratio compares two quantities in a specified order. The quotient first ÷ second describes how much of the second quantity corresponds to one first value. Scaling preserves the same relative amounts while changing the size.",
  "lesson.ratio.meaning.title": "Choose the question",
  "lesson.ratio.meaning.body":
    "Choose simplify to one to find A ÷ B, the value of the ratio, so 16 : 9 becomes 1.78 : 1. Choose scale to keep the same proportion at a new size: enter the original pair and a new first amount, and the calculator finds the matching second amount, so 16 : 9 at a width of 1,920 needs a height of 1,080. Keep the order and units consistent.",
  "lesson.ratio.example.0": "Two compared with four",
  "lesson.ratio.example.1": "Scale a two to three mixture",
  "lesson.ratio.example.2": "A zero first quantity",
  "lesson.ratio.mistakes.title": "Common mistakes",
  "lesson.ratio.mistakes.body":
    "Swapping the two quantities reciprocates a ratio and changes the meaning. Ratios between amounts with different units are rates, so retain their units. In a two to three mixture, the first share is two fifths of the combined total, not two thirds.",
  "lesson.ratio.limits.title": "Assumptions and limits",
  "lesson.ratio.limits.body":
    "Amounts cannot be negative. The second amount must be above zero, and scaling also needs a first amount above zero. Repeating decimals are evaluated at 50 significant digits and rounded only for display. The calculator does not reduce whole-number pairs such as 4 : 6 to 2 : 3 or infer units.",
  "lesson.ratio.sources.title": "Sources",
  "lesson.ratio.sources.body":
    "OpenStax Prealgebra 2e, ratios and proportions: https://openstax.org/details/books/prealgebra-2e",
  "lesson.ratio.faq.q": "Can a quantity be zero?",
  "lesson.ratio.faq.a":
    "A zero first quantity is valid for comparison and gives zero. Scaling from a zero first quantity is undefined because it would require division by zero.",
} as const;
