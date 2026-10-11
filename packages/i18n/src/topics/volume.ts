export const messages = {
  "volume.operation.prism": "Rectangular prism",
  "volume.operation.cylinder": "Cylinder",
  "volume.operation.sphere": "Sphere",
  "volume.field.width": "Width",
  "volume.field.height": "Height",
  "volume.field.depth": "Depth",
  "volume.field.radius": "Radius",
  "volume.working.prism": "{width} m × {height} m × {depth} m = {answer} m³",
  "volume.working.cylinder": "π × ({radius} m)² × {height} m = {answer} m³",
  "volume.working.sphere": "4π × ({radius} m)³ ÷ 3 = {answer} m³",
  "volume.visual.description":
    "The selected solid is drawn in the proportions you entered, with each measurement on a dimension line. The shaded body is the volume.",
  "volume.visual.alternative":
    "The entered measurements and the volume are stated in the answer and the working.",
  "volume.error.invalid-field": "Enter a valid decimal dimension.",
  "volume.error.nonpositive-dimension":
    "Every dimension must be greater than zero.",
  "volume.error.output-overflow": "The volume is outside the supported range.",
  "volume.unit.metre": "metres (m)",
  "volume.unit.cubic-metre": "cubic metres (m³)",
  "lesson.volume.intro.title": "Measuring volume",
  "lesson.volume.intro.body":
    "Volume measures three-dimensional space enclosed by a solid. Enter all linear dimensions in metres. Answers are in cubic metres (m³); this calculator covers a rectangular prism, a right circular cylinder, and a sphere.",
  "lesson.volume.formula.prism": "V = w × h × d",
  "lesson.volume.formula.cylinder": "V = πr²h",
  "lesson.volume.formula.sphere": "V = 4πr³ ÷ 3",
  "lesson.volume.variable.volume": "volume in cubic metres",
  "lesson.volume.variable.width": "prism width in metres",
  "lesson.volume.variable.height": "height in metres",
  "lesson.volume.variable.depth": "prism depth in metres",
  "lesson.volume.variable.radius":
    "radius in metres, from the axis or centre to the curved surface",
  "lesson.volume.example.prism": "A 2 m × 3 m × 4 m rectangular prism",
  "lesson.volume.example.cylinder": "A cylinder of radius 2 m and height 3 m",
  "lesson.volume.example.sphere": "A sphere of radius 3 m",
  "lesson.volume.example.scaled-sphere":
    "Doubling a sphere's radius multiplies its volume by eight",
  "lesson.volume.mistakes.title": "Common mistakes",
  "lesson.volume.mistakes.body":
    "Use radius, not diameter, for the cylinder and sphere; the formulas square the radius and the sphere also cubes it. Do not omit a prism's depth. Keep units consistent—mixing centimetres and metres changes the numerical product and requires converting first. Volume has cubic units, not square units.",
  "lesson.volume.limits.title": "Assumptions and limits",
  "lesson.volume.limits.body":
    "Every required dimension must be positive and finite. Inputs are canonical decimals with the shared 30-significant-digit and adjusted-exponent limits and are interpreted as metres. The engine uses 50 significant digits and does not round intermediate products for display. The sphere and cylinder use π truncated after 50 decimal places; their answers are approximations with a comparison tolerance of 1e-12 relative plus 1e-12 absolute at the reference scale. Results beyond the shared output range are rejected.",
  "lesson.volume.faq.units.q": "Why are answers in cubic metres?",
  "lesson.volume.faq.units.a":
    "Multiplying three lengths multiplies their units three times, producing m × m × m = m³. Circle-based solids also combine a cross-sectional area in m² with a length in m.",
  "lesson.volume.faq.radius.q":
    "Why is radius squared in the cylinder formula?",
  "lesson.volume.faq.radius.a":
    "A cylinder's volume is its circular base area, πr², multiplied by its perpendicular height. The radius appears twice because it determines the base area.",
  "lesson.volume.sources.title": "References",
  "lesson.volume.sources.body":
    "For standard solid-volume formulas and measurement context, see OpenStax Prealgebra 2e, measurement and geometry topics: https://openstax.org/details/books/prealgebra-2e. The formulas are standard geometric identities; examples are independently checked against those identities.",
  "volume.symbol.metre": "m",
  "volume.symbol.cubic-metre": "m³",
  "volume.visual.caption.prism": "The shaded box is the volume",
  "volume.visual.caption.cylinder": "The shaded body is the volume",
  "volume.visual.caption.sphere": "The shaded body is the volume",
  "volume.visual.summary.prism":
    "A box {width} wide, {height} high and {depth} deep holds {answer}.",
  "volume.visual.summary.cylinder":
    "A cylinder with radius {radius} and height {height} holds {answer}.",
  "volume.visual.summary.sphere":
    "A sphere with radius {radius} holds {answer}.",
} as const;
