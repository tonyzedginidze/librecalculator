export const messages = {
  "roofing.operation.roof-area": "Roof surface area",
  "roofing.field.length": "Footprint length",
  "roofing.field.width": "Footprint width",
  "roofing.field.rise": "Rise",
  "roofing.field.run": "Run",
  "roofing.field.waste": "Allowance",
  "roofing.unit.m": "Metres (m)",
  "roofing.unit.percent": "Percent (%)",
  "roofing.answer.unit": "m²",
  "roofing.working.summary":
    "Footprint {length} m × {width} m = {reference} m². Slope factor √(1 + ({rise}/{run})²) = {factor}, so the sloped surface is {sloped} m². Add the {waste}% allowance = {answer} m².",
  "roofing.visual.caption": "Pitch, slope factor and roof area",
  "roofing.visual.rise": "rise {value}",
  "roofing.visual.run": "run {value}",
  "roofing.visual.factor": "slope × {value}",
  "roofing.visual.footprint": "Footprint",
  "roofing.visual.sloped": "Sloped surface",
  "roofing.visual.order": "With {waste}% allowance",
  "roofing.visual.summary":
    "A pitch of {rise} in {run} makes each slope {factor} times longer than its run. The {reference} m² footprint becomes {sloped} m² of roof, or {answer} m² with a {waste}% allowance.",
  "roofing.visual.description":
    "The section shows one gable end. The sloped edge is longer than the run by the slope factor, and so is the roof area compared with its footprint.",
  "roofing.visual.alternative":
    "The rise, run, slope factor, footprint, sloped area and area with allowance are stated as numbers in the diagram.",
  "roofing.error.invalid-field":
    "Enter a number. Footprint and run must be greater than zero; rise may be zero.",
  "roofing.error.out-of-range":
    "Use values up to 1,000,000 and an allowance from 0 to 100%.",
  "roofing.error.output-overflow": "The result is too large to show.",
  "lesson.roofing.intro.title": "Simple pitched roof area",
  "lesson.roofing.intro.body":
    "A pitched surface has more area than its horizontal footprint. The slope factor converts the projected area into surface area for a simple roof with one consistent pitch.",
  "lesson.roofing.method.title": "Measure the footprint and the pitch",
  "lesson.roofing.method.body":
    "Measure the horizontal footprint including any overhang you want covered. Enter the pitch as a rise and run in the same units. The ratio is unitless, so a 6-in-12 pitch can be entered as 6 and 12.",
  "lesson.roofing.formula": "S = L × W × √(1 + (r/R)²) × (1 + a/100)",
  "lesson.roofing.variable.surface": "Roof surface area (m²)",
  "lesson.roofing.mistakes.title": "Common mistakes",
  "lesson.roofing.mistakes.body":
    "Do not enter the sloping rafter length as footprint width. Do not apply one pitch factor to sections that have different pitches.",
  "lesson.roofing.limits.title": "Assumptions and limits",
  "lesson.roofing.limits.body":
    "Simple roof with uniform slope and rectangular projected footprint. Dimensions and rise/run are bounded to one million; run is positive, rise may be zero; allowance 0–100%. Valleys, dormers, hips, penetrations and fastening specifications require separate assessment. Material estimates only; verify measurements, product guidance and site requirements before ordering.",
  "lesson.roofing.faq.q": "Does this size rafters or roof loads?",
  "lesson.roofing.faq.a":
    "No. It estimates surface area only. Structural strength, snow and wind loads, access and installation requirements need appropriate professional assessment.",
  "lesson.roofing.sources.title": "Method and references",
  "lesson.roofing.sources.body":
    "By Pythagoras, a slope with rise r over run R is √(1 + (r/R)²) times longer than its run, so a uniform roof’s area is its footprint times that factor. Material allowances must come from the chosen product and installer.",
  "lesson.roofing.example.1": "Flat footprint without allowance",
  "lesson.roofing.example.2": "A 3:4 slope on a 10 m × 8 m footprint",
  "lesson.roofing.example.3": "The same slope with a 10% allowance",
} as const;
