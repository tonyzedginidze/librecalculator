export const messages = {
  "cylinder.field.radius": "Radius",
  "cylinder.field.height": "Height",
  "cylinder.operation.cylinder-volume": "Volume",
  "cylinder.working.cylinder-volume":
    "V = πr²h = π × ({radius} m)² × {height} m = {answer} m³",
  "cylinder.formula.cylinder-volume": "V = \u03c0r\u00b2h",
  "cylinder.example.cylinder-volume": "Volume with radius 2 m and height 3 m",
  "cylinder.operation.cylinder-surface": "Total surface area",
  "cylinder.working.cylinder-surface":
    "S = 2πr(r + h) = 2π × {radius} m × ({radius} m + {height} m) = {answer} m²",
  "cylinder.formula.cylinder-surface": "S = 2\u03c0r(r + h)",
  "cylinder.example.cylinder-surface":
    "Total surface with radius 2 m and height 3 m",
  "cylinder.operation.cylinder-lateral": "Curved surface area",
  "cylinder.working.cylinder-lateral":
    "L = 2πrh = 2π × {radius} m × {height} m = {answer} m²",
  "cylinder.formula.cylinder-lateral": "L = 2\u03c0rh",
  "cylinder.example.cylinder-lateral":
    "Curved surface with radius 2 m and height 3 m",
  "cylinder.unit.metre": "m",
  "cylinder.unit.square-metre": "m\u00b2",
  "cylinder.unit.cubic-metre": "m\u00b3",
  "cylinder.error.invalid-field": "Enter a valid decimal measurement.",
  "cylinder.error.nonpositive-dimension":
    "Measurements must be greater than zero.",
  "cylinder.error.impossible-triangle":
    "The longest side must be shorter than the other two sides combined.",
  "cylinder.error.output-overflow":
    "The answer is outside the supported range.",
  "cylinder.intro.title": "Cylinder measurements",
  "cylinder.intro.body":
    "Find a right circular cylinder\u2019s volume, total exterior surface including both end disks, or only its curved side surface. Enter radius and the perpendicular distance between the circular ends in metres.",
  "cylinder.visual":
    "The cylinder is drawn in the proportions you entered, with the radius across the top and the height on a dimension line. Shading marks the volume, the whole outer surface, or only the curved side.",
  "cylinder.mistakes.title": "Common mistakes",
  "cylinder.mistakes.body":
    "Total surface adds the two circular ends to the curved side. An open container has a different surface; choose curved surface when excluding both ends. A slanted cylinder does not meet the assumptions of this surface formula.",
  "cylinder.limits.title": "Assumptions and limits",
  "cylinder.limits.body":
    "The cylinder is right circular, with positive radius and perpendicular height. Volume \u03c0r\u00b2h, total surface 2\u03c0r(r+h), and curved surface 2\u03c0rh all use finite-precision \u03c0 and are labelled approximate. No material thickness or wastage is included. Canonical inputs are limited to 30 significant digits, 256 characters and adjusted exponent magnitude 100. Computation uses 50 significant digits without intermediate presentation rounding; output overflow fails explicitly. Approximate fixtures use absolute tolerance 1e-12 plus relative tolerance 1e-12.",
  "cylinder.faq.q": "How do the three measurements relate?",
  "cylinder.faq.a":
    "For radius 2 m and height 3 m, volume is 12\u03c0 m\u00b3, curved surface is 12\u03c0 m\u00b2 and total surface is 20\u03c0 m\u00b2. The extra 8\u03c0 m\u00b2 accounts for both end disks.",
  "cylinder.sources.title": "Sources",
  "cylinder.sources.body":
    "Standard Euclidean measurement formulas: OpenStax Prealgebra 2e, measurement and geometry topics, https://openstax.org/details/books/prealgebra-2e. Worked examples use independent geometric identities.",
  "cylinder.unit.field-metre": "Metres (m)",
  "cylinder.visual.caption.cylinder-volume": "The shaded body is the volume",
  "cylinder.visual.caption.cylinder-surface":
    "The outlined side and both end discs make the total surface",
  "cylinder.visual.caption.cylinder-lateral":
    "Only the curved side counts; the end discs are left out",
  "cylinder.visual.summary.cylinder-volume":
    "A cylinder with radius {radius} and height {height} holds {answer}.",
  "cylinder.visual.summary.cylinder-surface":
    "A cylinder with radius {radius} and height {height} has a total surface area of {answer}.",
  "cylinder.visual.summary.cylinder-lateral":
    "A cylinder with radius {radius} and height {height} has a curved surface area of {answer}.",
} as const;
