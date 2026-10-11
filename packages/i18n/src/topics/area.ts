export const messages = {
  "area.operation.rectangle": "Rectangle",
  "area.operation.triangle": "Triangle",
  "area.operation.circle": "Circle",
  "area.field.width": "Width",
  "area.field.height": "Height",
  "area.field.base": "Base",
  "area.field.radius": "Radius",
  "area.working.rectangle": "{width} m × {height} m = {answer} m²",
  "area.working.triangle": "{base} m × {height} m ÷ 2 = {answer} m²",
  "area.working.circle": "π × ({radius} m)² = {answer} m²",
  "area.visual.description":
    "The selected shape is drawn in the proportions you entered, with each measurement on a dimension line. The shaded region is the area.",
  "area.visual.alternative":
    "The entered measurements and the area are stated in the answer and the working.",
  "area.error.invalid-field": "Enter a valid decimal dimension.",
  "area.error.nonpositive-dimension":
    "Every dimension must be greater than zero.",
  "area.error.output-overflow": "The area is outside the supported range.",
  "area.unit.metre": "metres (m)",
  "area.unit.square-metre": "square metres (m²)",
  "lesson.area.intro.title": "Measuring area",
  "lesson.area.intro.body":
    "Area measures the two-dimensional region inside a boundary. Enter each linear dimension in metres; every answer is returned in square metres (m²). The formula depends on the shape, and a triangle's height must be perpendicular to its base.",
  "lesson.area.formula.rectangle": "A = w × h",
  "lesson.area.formula.triangle":
    "A = b × h ÷ 2, where h is perpendicular to b",
  "lesson.area.formula.circle": "A = πr²",
  "lesson.area.variable.area": "area in square metres",
  "lesson.area.variable.width": "rectangle width in metres",
  "lesson.area.variable.height": "perpendicular height in metres",
  "lesson.area.variable.base": "triangle base in metres",
  "lesson.area.variable.radius":
    "circle radius in metres, from centre to circumference",
  "lesson.area.example.rectangle": "A 3 m by 4 m rectangle",
  "lesson.area.example.triangle":
    "A triangle with base 3 m and perpendicular height 4 m",
  "lesson.area.example.circle": "A circle with radius 1 m",
  "lesson.area.example.scaled-circle":
    "Doubling the radius quadruples the area",
  "lesson.area.mistakes.title": "Common mistakes",
  "lesson.area.mistakes.body":
    "Do not use a triangle's sloping side as its height: height is measured at a right angle to the base, even if that perpendicular falls outside the triangle. A circle uses its radius, not its diameter; if you have a diameter, halve it first. Area uses squared units, so a result in metres (m) is not an area.",
  "lesson.area.limits.title": "Assumptions and limits",
  "lesson.area.limits.body":
    "All entered dimensions must be positive finite canonical decimals, with the shared limit of 30 significant digits and absolute adjusted exponent at most 100. Inputs represent metres, not a guessed or selectable unit. Decimal arithmetic uses 50 significant digits and rounds only for presentation; answers beyond the shared output range are rejected. The circle calculation uses π truncated after 50 decimal places, so π-derived areas are approximations. Comparison fixtures use relative tolerance 1e-12 plus absolute tolerance 1e-12 × the reference scale.",
  "lesson.area.faq.triangle.q":
    "Why does the triangle need a perpendicular height?",
  "lesson.area.faq.triangle.a":
    "The formula is half the area of a parallelogram with the same base and perpendicular altitude. A sloping edge only equals the height for a right triangle; otherwise using it overstates the triangle's area.",
  "lesson.area.faq.circle.q":
    "Does the circle input ask for radius or diameter?",
  "lesson.area.faq.circle.a":
    "It asks for radius: the distance from the centre to the edge. The area formula squares the radius. A diameter is twice the radius, so convert it before entering.",
  "lesson.area.sources.title": "References",
  "lesson.area.sources.body":
    "For geometric measurement and area formulas, see OpenStax Prealgebra 2e, measurement and geometry topics: https://openstax.org/details/books/prealgebra-2e. Formula examples in this lesson are independently checked against direct arithmetic and standard geometric definitions.",
  "area.symbol.metre": "m",
  "area.symbol.square-metre": "m²",
  "area.visual.caption.rectangle": "The shaded region is the area",
  "area.visual.caption.triangle": "The shaded region is the area",
  "area.visual.caption.circle": "The shaded disc is the area",
  "area.visual.summary.rectangle":
    "A rectangle {width} wide and {height} high covers {answer}.",
  "area.visual.summary.triangle":
    "A triangle with base {base} and height {height} covers {answer}.",
  "area.visual.summary.circle":
    "A circle with radius {radius} covers {answer}.",
} as const;
