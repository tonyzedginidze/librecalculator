export const messages = {
  "pythagorean.operation.missing-hypotenuse": "Find the hypotenuse",
  "pythagorean.operation.missing-leg": "Find a missing leg",
  "pythagorean.field.leg-a": "Leg a",
  "pythagorean.field.leg-b": "Leg b",
  "pythagorean.field.hypotenuse": "Hypotenuse c",
  "pythagorean.field.known-leg": "Known leg a",
  "pythagorean.working.missing-hypotenuse":
    "c = √({a}² + {b}²) = {hypotenuse} m",
  "pythagorean.working.missing-leg":
    "b = √({hypotenuse}² − {leg}²) = {answer} m",
  "pythagorean.visual.description":
    "The right triangle is drawn in the proportions of its sides. Legs a and b meet at the right angle; the side you solved for is drawn in the accent colour.",
  "pythagorean.visual.alternative":
    "The diagram represents a right triangle: a and b are perpendicular legs, c is the hypotenuse opposite the right angle. The solved side is labeled from the same calculation result.",
  "pythagorean.error.invalid-field": "Enter valid side lengths.",
  "pythagorean.error.nonpositive-side":
    "Every given side must be greater than zero.",
  "pythagorean.error.impossible-triangle":
    "The hypotenuse must be strictly longer than the known leg.",
  "pythagorean.error.output-overflow":
    "The answer is outside the supported range.",
  "pythagorean.unit.metre": "metres (m)",
  "lesson.pythagorean.intro.title": "The Pythagorean theorem",
  "lesson.pythagorean.intro.body":
    "In a right triangle, the square of the hypotenuse equals the sum of the squares of the two perpendicular legs. Choose exactly which kind of side is missing; all entered lengths are metres and the answer is also in metres.",
  "lesson.pythagorean.formula.hypotenuse": "c² = a² + b²; c = √(a² + b²)",
  "lesson.pythagorean.formula.leg": "a² + b² = c²; b = √(c² − a²), with c > a",
  "lesson.pythagorean.variable.a": "leg a, in metres",
  "lesson.pythagorean.variable.b": "leg b, in metres",
  "lesson.pythagorean.variable.c":
    "hypotenuse c, in metres, opposite the right angle",
  "lesson.pythagorean.example.classic": "The 3–4–5 right triangle",
  "lesson.pythagorean.example.missing-leg": "Given hypotenuse 5 m and leg 3 m",
  "lesson.pythagorean.example.scaled": "A scaled 5–12–13 triangle",
  "lesson.pythagorean.example.decimal":
    "A right triangle with 1.5 m and 2 m legs",
  "lesson.pythagorean.mistakes.title": "Common mistakes",
  "lesson.pythagorean.mistakes.body":
    "The hypotenuse is always opposite the right angle and is strictly longer than either leg. Do not apply the formula to a non-right triangle. When solving for a leg, subtract the known leg's square from the hypotenuse's square; reversing the subtraction makes the radicand negative. Do not compare side lengths by rounding first: the feasibility check is exact on the canonical decimal inputs.",
  "lesson.pythagorean.limits.title": "Assumptions and precision",
  "lesson.pythagorean.limits.body":
    "Exactly one side is missing. Given sides must be positive finite canonical decimals, up to 30 significant digits and adjusted exponent magnitude 100. For a missing leg, the input hypotenuse must be strictly greater than the known leg; equality is degenerate and rejected without a tolerance. Decimal arithmetic and square roots use 50 significant digits, with no intermediate presentation rounding. Root results are approximate; fixtures use 1e-12 relative plus 1e-12 absolute tolerance. Inputs and output are explicitly metres.",
  "lesson.pythagorean.faq.hypotenuse.q": "How do I identify the hypotenuse?",
  "lesson.pythagorean.faq.hypotenuse.a":
    "It is the side opposite the right-angle corner and is the longest side in a nondegenerate right triangle. The two sides that form the right angle are the legs.",
  "lesson.pythagorean.faq.impossible.q":
    "Why is an equal hypotenuse and leg rejected?",
  "lesson.pythagorean.faq.impossible.a":
    "If c equals a, then b² = c² − a² = 0, so the remaining leg has zero length and the triangle is degenerate, not a valid triangle with positive sides.",
  "lesson.pythagorean.sources.title": "References",
  "lesson.pythagorean.sources.body":
    "For right-triangle geometry and the Pythagorean theorem, see OpenStax Prealgebra 2e, geometry topics: https://openstax.org/details/books/prealgebra-2e. The theorem and worked examples are checked against the identity a² + b² = c² using independent arithmetic fixtures.",
  "pythagorean.symbol.metre": "m",
  "pythagorean.visual.side.a": "a = {value}",
  "pythagorean.visual.side.b": "b = {value}",
  "pythagorean.visual.side.c": "c = {value}",
  "pythagorean.visual.caption.missing-hypotenuse":
    "The highlighted side is the hypotenuse c",
  "pythagorean.visual.caption.missing-leg":
    "The highlighted side is the missing leg b",
  "pythagorean.visual.summary.missing-hypotenuse":
    "Legs of {a} and {b} meet at a right angle; the hypotenuse is {answer}.",
  "pythagorean.visual.summary.missing-leg":
    "With hypotenuse {hypotenuse} and leg {leg}, the other leg is {answer}.",
} as const;
