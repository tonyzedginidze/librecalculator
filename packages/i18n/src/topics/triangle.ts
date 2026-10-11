export const messages = {
  "triangle.field.base": "Base",
  "triangle.field.height": "Height",
  "triangle.operation.triangle-area": "Area",
  "triangle.working.triangle-area":
    "A = b × h ÷ 2 = {base} m × {height} m ÷ 2 = {answer} m²",
  "triangle.formula.triangle-area": "A = b × h ÷ 2",
  "triangle.example.triangle-area": "Area with base 3 m and height 4 m",
  "triangle.field.sideA": "Side a",
  "triangle.field.sideB": "Side b",
  "triangle.field.sideC": "Side c",
  "triangle.operation.triangle-perimeter": "Perimeter",
  "triangle.working.triangle-perimeter":
    "P = a + b + c = {sideA} m + {sideB} m + {sideC} m = {answer} m",
  "triangle.formula.triangle-perimeter": "P = a + b + c",
  "triangle.example.triangle-perimeter": "Perimeter of a 3–4–5 triangle",
  "triangle.field.area": "Area",
  "triangle.operation.triangle-altitude": "Height",
  "triangle.working.triangle-altitude":
    "h = 2A ÷ b = 2 × {area} m² ÷ {base} m = {answer} m",
  "triangle.formula.triangle-altitude": "h = 2A \u00f7 b",
  "triangle.example.triangle-altitude":
    "Height from an area of 6 m² on a 3 m base",
  "triangle.unit.metre": "m",
  "triangle.unit.square-metre": "m\u00b2",
  "triangle.unit.cubic-metre": "m\u00b3",
  "triangle.error.invalid-field": "Enter a valid decimal measurement.",
  "triangle.error.nonpositive-dimension":
    "Measurements must be greater than zero.",
  "triangle.error.impossible-triangle":
    "The longest side must be shorter than the other two sides combined.",
  "triangle.error.output-overflow":
    "The answer is outside the supported range.",
  "triangle.intro.title": "Triangle measurements",
  "triangle.intro.body":
    "Choose the information you have: base and perpendicular height for area, three side lengths for perimeter, or area and base to recover the perpendicular altitude. These operations do not assume a right triangle.",
  "triangle.visual":
    "The triangle is drawn in the proportions you entered. Base and height sit on dimension lines and the dashed altitude meets the base at a right angle; for perimeter, each side is labelled.",
  "triangle.mistakes.title": "Common mistakes",
  "triangle.mistakes.body":
    "A sloping edge is generally not the height. The altitude meets the base at a right angle and may fall outside an obtuse triangle. Perimeter adds all three edges and cannot be found from base and altitude alone.",
  "triangle.limits.title": "Assumptions and limits",
  "triangle.limits.body":
    "Every measurement must be positive. Area supplied to the altitude operation is in m\u00b2; base and sides are metres. Perimeter requires three sides that satisfy the strict triangle inequality. Base/height operations define area but do not infer a unique triangle or edge lengths. Canonical inputs are limited to 30 significant digits, 256 characters and adjusted exponent magnitude 100. Computation uses 50 significant digits without intermediate presentation rounding; output overflow fails explicitly. Approximate fixtures use absolute tolerance 1e-12 plus relative tolerance 1e-12.",
  "triangle.faq.q": "How do the three measurements relate?",
  "triangle.faq.a":
    "A base of 3 m with perpendicular height 4 m gives area 6 m\u00b2. Area 6 m\u00b2 with base 3 m recovers height 4 m. A separate triangle with side lengths 3 m, 4 m and 5 m has perimeter 12 m.",
  "triangle.sources.title": "Sources",
  "triangle.sources.body":
    "Standard Euclidean measurement formulas: OpenStax Prealgebra 2e, measurement and geometry topics, https://openstax.org/details/books/prealgebra-2e. Worked examples use independent geometric identities.",
  "triangle.unit.field-metre": "Metres (m)",
  "triangle.unit.field-square-metre": "Square metres (m²)",
  "triangle.visual.caption.triangle-area": "The shaded region is the area",
  "triangle.visual.caption.triangle-perimeter":
    "The three outlined sides add up to the perimeter",
  "triangle.visual.caption.triangle-altitude":
    "The dashed altitude is the height above the base",
  "triangle.visual.summary.triangle-area":
    "A triangle with base {base} and height {height} has an area of {answer}.",
  "triangle.visual.summary.triangle-perimeter":
    "A triangle with sides {sideA}, {sideB} and {sideC} has a perimeter of {answer}.",
  "triangle.visual.summary.triangle-altitude":
    "A triangle with area {area} on a base of {base} stands {answer} high.",
} as const;
