export const messages = {
  "lesson.fractions.unit.integer": "integer",
  "lesson.fractions.unit.rational": "exact rational number",
  "fractions.operation.add": "Add two fractions",
  "fractions.operation.subtract": "Subtract two fractions",
  "fractions.operation.multiply": "Multiply two fractions",
  "fractions.operation.divide": "Divide two fractions",
  "fractions.operation.reduce": "Reduce one fraction",
  "fractions.field.leftNumerator": "First numerator",
  "fractions.field.leftDenominator": "First denominator",
  "fractions.field.rightNumerator": "Second numerator",
  "fractions.field.rightDenominator": "Second denominator",
  "fractions.field.numerator": "Numerator",
  "fractions.field.denominator": "Denominator",
  "fractions.working.add": "{left} + {right} = {answer}",
  "fractions.working.subtract": "{left} − {right} = {answer}",
  "fractions.working.multiply": "{left} × {right} = {answer}",
  "fractions.working.divide": "{left} ÷ {right} = {answer}",
  "fractions.working.reduce":
    "Reduce {input} by the greatest common divisor {divisor} to get {answer}.",
  "fractions.visual.description":
    "The calculation is shown as an equation of exact fractions. When the answer is a small positive fraction, a grid shades its parts, one row per whole.",
  "fractions.visual.alternative":
    "Each term of the equation is written as an exact fraction. In the grid, each row is one whole split into equal parts, and the shaded cells count the numerator.",
  "fractions.error.invalid-integer":
    "Enter a whole integer using digits and an optional leading sign.",
  "fractions.error.integer-too-large":
    "Each integer magnitude is limited to 1000 digits.",
  "fractions.error.zero-denominator": "A fraction denominator cannot be zero.",
  "fractions.error.division-by-zero": "A fraction cannot be divided by zero.",
  "fractions.error.output-too-large":
    "The exact result exceeds the supported 2001-digit output bound.",
  "lesson.fractions.intro.title": "Fractions as exact numbers",
  "lesson.fractions.intro.body":
    "A fraction a/b represents a divided by b, with b nonzero. Equivalent fractions name the same rational value, so reducing common factors changes its form but not its value. This calculator keeps results exact as integer numerator and denominator; it does not convert them to rounded decimals.",
  "lesson.fractions.formula.fraction":
    "a/b + c/d = (ad + bc)/bd; a/b − c/d = (ad − bc)/bd; (a/b)(c/d) = ac/bd; (a/b) ÷ (c/d) = ad/bc",
  "lesson.fractions.variable.numerator": "signed integer numerator",
  "lesson.fractions.variable.denominator": "nonzero integer denominator",
  "lesson.fractions.variable.other-numerator":
    "second signed integer numerator",
  "lesson.fractions.variable.other-denominator":
    "second nonzero integer denominator",
  "lesson.fractions.variable.value": "exact value represented by the fraction",
  "lesson.fractions.example.add":
    "Use a common denominator: one half plus one third equals five sixths.",
  "lesson.fractions.example.subtract":
    "One half minus three quarters is negative one quarter.",
  "lesson.fractions.example.multiply":
    "Two thirds times nine fourths reduces to three halves, or one and one half.",
  "lesson.fractions.example.divide":
    "Two thirds divided by four fifths is five sixths.",
  "lesson.fractions.example.reduce":
    "A negative numerator and negative denominator make a positive fraction; reduce negative 42 over negative 56 to three quarters.",
  "lesson.fractions.mixed.title": "Improper fractions and mixed numbers",
  "lesson.fractions.mixed.body":
    "For a signed improper fraction, divide the numerator's magnitude by the positive denominator. The quotient is the whole part and the remainder forms a proper fraction. Put the sign before the whole mixed value: −7/3 is −2 1/3, not −1 2/3. The exact signed n/d remains the primary result; the mixed form is an equivalent display.",
  "lesson.fractions.mistakes.title": "Common fraction mistakes",
  "lesson.fractions.mistakes.body":
    "Addition and subtraction need a common denominator; add or subtract the corresponding numerators only after scaling. Multiplication multiplies numerators and denominators. Division multiplies by the reciprocal of a nonzero divisor. Never add denominators directly, and do not move a negative sign into only part of a mixed number. The engine normalizes signs and reduces all answers automatically.",
  "lesson.fractions.limits.title": "Exactness and input limits",
  "lesson.fractions.limits.body":
    "Enter signed whole integers only. Each input magnitude is limited to 1000 digits; exact normalized output numerator and denominator are limited to 2001 digits. Denominators must be nonzero, and division also rejects a zero fraction. The shaded-parts grid appears only for positive answers with a small denominator; other answers are shown as exact fractions alone. No decimal approximation is used.",
  "lesson.fractions.faq.denominators.q": "Why must a denominator be nonzero?",
  "lesson.fractions.faq.denominators.a":
    "A fraction means numerator divided by denominator. Division by zero is undefined, so a zero denominator has no rational value and is rejected.",
  "lesson.fractions.faq.negative.q": "How is a negative mixed number written?",
  "lesson.fractions.faq.negative.a":
    "The sign applies to the complete mixed value. For example, −7/3 is −2 1/3: the magnitude is two and one third, and the whole result is negative.",
  "lesson.fractions.faq.zero.q": "What does a zero fraction reduce to?",
  "lesson.fractions.faq.zero.a":
    "Any valid zero fraction reduces to 0/1. Its denominator is still required to be nonzero on input.",
  "lesson.fractions.sources.title": "Fraction references",
  "lesson.fractions.sources.body":
    "For standard fraction operations, see OpenStax Prealgebra 2e, “Multiply and Divide Fractions”: https://openstax.org/books/prealgebra-2e/pages/4-2-multiply-and-divide-fractions and “Add and Subtract Fractions”: https://openstax.org/books/prealgebra-2e/pages/4-3-add-and-subtract-fractions. The exact integer bounds and mixed-number sign convention used here are stated in this lesson.",
  "fractions.answer.mixed": "Mixed number {mixed}",
  "fractions.visual.caption": "The calculation as exact fractions",
  "fractions.visual.first": "First",
  "fractions.visual.second": "Second",
  "fractions.visual.result": "Result",
  "fractions.visual.entered": "Entered",
  "fractions.visual.reduced": "Lowest terms",
  "fractions.visual.op.add": "+",
  "fractions.visual.op.subtract": "−",
  "fractions.visual.op.multiply": "×",
  "fractions.visual.op.divide": "÷",
  "fractions.visual.op.equals": "=",
  "fractions.visual.grid": "shaded, {denominator} parts make one whole",
  "fractions.visual.summary": "{equation}. The result is {answer}.",
} as const;
