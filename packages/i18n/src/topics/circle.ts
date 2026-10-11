export const messages = {
  "circle.field.radius": "Radius",
  "circle.operation.circle-area": "Area",
  "circle.working.circle-area": "A = πr² = π × ({radius} m)² = {answer} m²",
  "circle.formula.circle-area": "A = \u03c0r\u00b2",
  "circle.example.circle-area": "Area of a circle with radius 1 m",
  "circle.operation.circle-circumference": "Circumference",
  "circle.working.circle-circumference":
    "C = 2πr = 2π × {radius} m = {answer} m",
  "circle.formula.circle-circumference": "C = 2\u03c0r",
  "circle.example.circle-circumference":
    "Circumference of a circle with radius 1 m",
  "circle.operation.circle-diameter": "Diameter",
  "circle.working.circle-diameter": "d = 2r = 2 × {radius} m = {answer} m",
  "circle.formula.circle-diameter": "d = 2r",
  "circle.example.circle-diameter": "Diameter of a circle with radius 1 m",
  "circle.unit.metre": "m",
  "circle.unit.square-metre": "m\u00b2",
  "circle.unit.cubic-metre": "m\u00b3",
  "circle.error.invalid-field": "Enter a valid decimal measurement.",
  "circle.error.nonpositive-dimension":
    "Measurements must be greater than zero.",
  "circle.error.impossible-triangle":
    "The longest side must be shorter than the other two sides combined.",
  "circle.error.output-overflow": "The answer is outside the supported range.",
  "circle.intro.title": "Circle measurements",
  "circle.intro.body":
    "Use a circle\u2019s radius to find the enclosed area, the distance around its circumference, or its diameter. Radius is the distance from centre to edge; all supplied lengths are metres.",
  "circle.visual":
    "The circle shows the radius from the centre. The shaded disc, the heavy rim or the line through the centre marks the area, circumference or diameter.",
  "circle.mistakes.title": "Common mistakes",
  "circle.mistakes.body":
    "A diameter is twice the radius. Entering a diameter into the radius field makes the computed area four times too large. Circumference measures a length in m; area measures a region in m\u00b2.",
  "circle.limits.title": "Assumptions and limits",
  "circle.limits.body":
    "The shape is an exact Euclidean circle. Radius must be positive. Diameter is 2r; area \u03c0r\u00b2 and circumference 2\u03c0r are approximate because \u03c0 has a finite internal representation. Canonical inputs are limited to 30 significant digits, 256 characters and adjusted exponent magnitude 100. Computation uses 50 significant digits without intermediate presentation rounding; output overflow fails explicitly. Approximate fixtures use absolute tolerance 1e-12 plus relative tolerance 1e-12.",
  "circle.faq.q": "How do the three measurements relate?",
  "circle.faq.a":
    "For radius 1 m, area is \u03c0 m\u00b2, circumference is 2\u03c0 m and diameter is 2 m. Doubling radius multiplies area by four and circumference by two.",
  "circle.sources.title": "Sources",
  "circle.sources.body":
    "Standard Euclidean measurement formulas: OpenStax Prealgebra 2e, measurement and geometry topics, https://openstax.org/details/books/prealgebra-2e. Worked examples use independent geometric identities.",
  "circle.unit.field-metre": "Metres (m)",
  "circle.visual.caption.circle-area": "The shaded disc is the area",
  "circle.visual.caption.circle-circumference":
    "The heavy rim is the circumference",
  "circle.visual.caption.circle-diameter":
    "The line through the centre is the diameter",
  "circle.visual.summary.circle-area":
    "A circle with radius {radius} has an area of {answer}.",
  "circle.visual.summary.circle-circumference":
    "A circle with radius {radius} has a circumference of {answer}.",
  "circle.visual.summary.circle-diameter":
    "A circle with radius {radius} has a diameter of {answer}.",
} as const;
