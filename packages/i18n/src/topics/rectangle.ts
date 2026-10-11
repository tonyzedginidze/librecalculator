export const messages = {
  "rectangle.field.width": "Width",
  "rectangle.field.height": "Height",
  "rectangle.operation.rectangle-area": "Area",
  "rectangle.working.rectangle-area":
    "A = w × h = {width} m × {height} m = {answer} m²",
  "rectangle.formula.rectangle-area": "A = w \u00d7 h",
  "rectangle.example.rectangle-area": "Area of a 3 m by 4 m rectangle",
  "rectangle.operation.rectangle-perimeter": "Perimeter",
  "rectangle.working.rectangle-perimeter":
    "P = 2(w + h) = 2 × ({width} m + {height} m) = {answer} m",
  "rectangle.formula.rectangle-perimeter": "P = 2(w + h)",
  "rectangle.example.rectangle-perimeter":
    "Perimeter of a 3 m by 4 m rectangle",
  "rectangle.operation.rectangle-diagonal": "Diagonal",
  "rectangle.working.rectangle-diagonal":
    "d = √(w² + h²) = √({width}² + {height}²) m = {answer} m",
  "rectangle.formula.rectangle-diagonal": "d = \u221a(w\u00b2 + h\u00b2)",
  "rectangle.example.rectangle-diagonal": "Diagonal of a 3 m by 4 m rectangle",
  "rectangle.unit.metre": "m",
  "rectangle.unit.square-metre": "m\u00b2",
  "rectangle.unit.cubic-metre": "m\u00b3",
  "rectangle.error.invalid-field": "Enter a valid decimal measurement.",
  "rectangle.error.nonpositive-dimension":
    "Measurements must be greater than zero.",
  "rectangle.error.impossible-triangle":
    "The longest side must be shorter than the other two sides combined.",
  "rectangle.error.output-overflow":
    "The answer is outside the supported range.",
  "rectangle.intro.title": "Rectangle measurements",
  "rectangle.intro.body":
    "Find a rectangle\u2019s area, the full length of its boundary, or the diagonal joining opposite corners. All operations use the same two perpendicular side measurements in metres.",
  "rectangle.visual":
    "The rectangle is drawn in the proportions you entered, with width and height on dimension lines. The shaded region, the heavy outline or the corner-to-corner line marks the area, perimeter or diagonal.",
  "rectangle.mistakes.title": "Common mistakes",
  "rectangle.mistakes.body":
    "Area counts a flat region in m\u00b2; perimeter measures the boundary in m. The diagonal is a straight shortcut between opposite corners and differs from walking along two sides. Do not apply these formulas to a slanted parallelogram.",
  "rectangle.limits.title": "Assumptions and limits",
  "rectangle.limits.body":
    "A Euclidean rectangle has four right angles. Width and height must be positive. Area and perimeter use product/sum arithmetic; diagonal uses the square root of w\u00b2+h\u00b2 and is approximate at finite decimal precision. Canonical inputs are limited to 30 significant digits, 256 characters and adjusted exponent magnitude 100. Computation uses 50 significant digits without intermediate presentation rounding; output overflow fails explicitly. Approximate fixtures use absolute tolerance 1e-12 plus relative tolerance 1e-12.",
  "rectangle.faq.q": "How do the three measurements relate?",
  "rectangle.faq.a":
    "With sides 3 m and 4 m, area is 12 m\u00b2, perimeter is 14 m and diagonal is 5 m. If both sides double, area becomes 48 m\u00b2 while perimeter becomes 28 m.",
  "rectangle.sources.title": "Sources",
  "rectangle.sources.body":
    "Standard Euclidean measurement formulas: OpenStax Prealgebra 2e, measurement and geometry topics, https://openstax.org/details/books/prealgebra-2e. Worked examples use independent geometric identities.",
  "rectangle.unit.field-metre": "Metres (m)",
  "rectangle.visual.caption.rectangle-area": "The shaded region is the area",
  "rectangle.visual.caption.rectangle-perimeter":
    "The heavy outline is the perimeter",
  "rectangle.visual.caption.rectangle-diagonal":
    "The line from corner to corner is the diagonal",
  "rectangle.visual.summary.rectangle-area":
    "A rectangle {width} wide and {height} high has an area of {answer}.",
  "rectangle.visual.summary.rectangle-perimeter":
    "A rectangle {width} wide and {height} high has a perimeter of {answer}.",
  "rectangle.visual.summary.rectangle-diagonal":
    "A rectangle {width} wide and {height} high has a diagonal of {answer}.",
} as const;
