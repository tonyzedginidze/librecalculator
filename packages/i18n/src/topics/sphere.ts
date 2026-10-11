export const messages = {
  "sphere.field.radius": "Radius",
  "sphere.operation.sphere-volume": "Volume",
  "sphere.working.sphere-volume":
    "V = 4πr³ ÷ 3 = 4π × ({radius} m)³ ÷ 3 = {answer} m³",
  "sphere.formula.sphere-volume": "V = 4\u03c0r\u00b3 \u00f7 3",
  "sphere.example.sphere-volume": "Volume of a sphere with radius 3 m",
  "sphere.operation.sphere-surface": "Surface area",
  "sphere.working.sphere-surface":
    "S = 4πr² = 4π × ({radius} m)² = {answer} m²",
  "sphere.formula.sphere-surface": "S = 4\u03c0r\u00b2",
  "sphere.example.sphere-surface": "Surface area of a sphere with radius 3 m",
  "sphere.operation.sphere-diameter": "Diameter",
  "sphere.working.sphere-diameter": "d = 2r = 2 × {radius} m = {answer} m",
  "sphere.formula.sphere-diameter": "d = 2r",
  "sphere.example.sphere-diameter": "Diameter of a sphere with radius 3 m",
  "sphere.unit.metre": "m",
  "sphere.unit.square-metre": "m\u00b2",
  "sphere.unit.cubic-metre": "m\u00b3",
  "sphere.error.invalid-field": "Enter a valid decimal measurement.",
  "sphere.error.nonpositive-dimension":
    "Measurements must be greater than zero.",
  "sphere.error.impossible-triangle":
    "The longest side must be shorter than the other two sides combined.",
  "sphere.error.output-overflow": "The answer is outside the supported range.",
  "sphere.intro.title": "Sphere measurements",
  "sphere.intro.body":
    "Calculate the volume inside a sphere, its exterior surface area, or its diameter from radius. These operations distinguish cubic space from a curved two-dimensional surface.",
  "sphere.visual":
    "The sphere shows its radius from the centre along the equator. The shaded body, the heavy outline or the line through the centre marks the volume, surface area or diameter.",
  "sphere.mistakes.title": "Common mistakes",
  "sphere.mistakes.body":
    "A sphere has no flat base and uses neither cylinder height nor a circle\u2019s planar area as its surface. The diameter crosses the whole sphere through its centre, while radius reaches only from centre to surface.",
  "sphere.limits.title": "Assumptions and limits",
  "sphere.limits.body":
    "The shape is an ideal Euclidean sphere with positive radius. Volume 4\u03c0r\u00b3/3 and surface 4\u03c0r\u00b2 are finite-precision approximations; diameter 2r does not use \u03c0. Wall thickness and hollow interiors are not modelled. Canonical inputs are limited to 30 significant digits, 256 characters and adjusted exponent magnitude 100. Computation uses 50 significant digits without intermediate presentation rounding; output overflow fails explicitly. Approximate fixtures use absolute tolerance 1e-12 plus relative tolerance 1e-12.",
  "sphere.faq.q": "How do the three measurements relate?",
  "sphere.faq.a":
    "A radius of 3 m gives volume 36\u03c0 m\u00b3 and surface 36\u03c0 m\u00b2. The numeric coefficients match for this radius, but the physical quantities and units are different. Diameter is 6 m.",
  "sphere.sources.title": "Sources",
  "sphere.sources.body":
    "Standard Euclidean measurement formulas: OpenStax Prealgebra 2e, measurement and geometry topics, https://openstax.org/details/books/prealgebra-2e. Worked examples use independent geometric identities.",
  "sphere.unit.field-metre": "Metres (m)",
  "sphere.visual.caption.sphere-volume": "The shaded body is the volume",
  "sphere.visual.caption.sphere-surface":
    "The heavy outline stands for the whole outer surface",
  "sphere.visual.caption.sphere-diameter":
    "The line through the centre is the diameter",
  "sphere.visual.summary.sphere-volume":
    "A sphere with radius {radius} has a volume of {answer}.",
  "sphere.visual.summary.sphere-surface":
    "A sphere with radius {radius} has a surface area of {answer}.",
  "sphere.visual.summary.sphere-diameter":
    "A sphere with radius {radius} has a diameter of {answer}.",
} as const;
