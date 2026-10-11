export const messages = {
  "paint.operation.litres": "Paint volume",
  "paint.field.area": "Wall area",
  "paint.field.coats": "Coats",
  "paint.field.coverage": "Coverage",
  "paint.field.waste": "Allowance",
  "paint.unit.m2": "Square metres (m²)",
  "paint.unit.coverage": "Square metres per litre (m²/L)",
  "paint.unit.percent": "Percent (%)",
  "paint.answer.unit": "L",
  "paint.working.summary":
    "{area} m² × {coats} coats ÷ {coverage} m²/L = {reference} L. Add the {waste}% allowance: {reference} × (1 + {waste}/100) = {answer} L.",
  "paint.visual.caption": "How the litres are built up",
  "paint.visual.painted": "{area} m² × {coats} coats",
  "paint.visual.coverage": "Coverage",
  "paint.visual.area-value": "{value} m\u00b2",
  "paint.visual.coverage-value": "{value} m\u00b2/L",
  "paint.visual.factor": "{waste}% allowance",
  "paint.visual.result": "Paint to buy",
  "paint.visual.summary":
    "{area} square metres painted {coats} times is {painted} square metres. At {coverage} square metres per litre that needs {reference} litres; with a {waste}% allowance, buy {answer} litres.",
  "paint.visual.description":
    "Coverage on the label is for one coat on a smooth, primed surface. Round the litres up to the can sizes you can buy.",
  "paint.visual.alternative":
    "The painted area, the coverage rate, the allowance factor and the litres are stated as numbers in the diagram.",
  "paint.error.invalid-field":
    "Enter a positive number. Area and coverage must be greater than zero.",
  "paint.error.out-of-range":
    "Use 1 to 100 coats, area and coverage up to 1,000,000 and an allowance from 0 to 100%.",
  "paint.error.output-overflow": "The result is too large to show.",
  "lesson.paint.intro.title": "Paint coverage estimate",
  "lesson.paint.intro.body":
    "Paint quantity depends on the surface area, the number of coats and the product’s coverage. Entering the coverage yourself keeps the estimate tied to the paint you intend to use.",
  "lesson.paint.method.title": "Measure the walls and read the label",
  "lesson.paint.method.body":
    "Use net paintable area after subtracting doors and windows. Read the coverage rate from the product label (often 10 to 14 m² per litre), enter the coat count, then add any allowance explicitly.",
  "lesson.paint.formula": "P = A × n ÷ c × (1 + a/100)",
  "lesson.paint.variable.paint": "Paint to buy (L)",
  "lesson.paint.mistakes.title": "Common mistakes",
  "lesson.paint.mistakes.body":
    "The coverage rate normally applies to one coat. Doubling coats doubles the volume; it does not double the coverage. Rough or absorbent surfaces may use more than the label estimate.",
  "lesson.paint.limits.title": "Assumptions and limits",
  "lesson.paint.limits.body":
    "Positive area and coverage up to one million in their stated units; 1–100 integer coats; 0–100% allowance. Litres are an estimate before rounding to available container sizes. No surface preparation, primer choice or drying time is inferred. Material estimates only; verify measurements, product guidance and site requirements before ordering.",
  "lesson.paint.faq.q": "Should I round up to cans?",
  "lesson.paint.faq.a":
    "Yes when purchasing. Divide the calculated litres by your selected container size and round up, while checking that the product is appropriate for the surface.",
  "lesson.paint.sources.title": "Method and references",
  "lesson.paint.sources.body":
    "Area × coats gives the total area painted; dividing by the label coverage gives litres, scaled by an explicit percentage allowance. Coverage must come from the chosen product; no standard rate is assumed.",
  "lesson.paint.example.1": "Two coats on forty square metres",
  "lesson.paint.example.2": "One coat on a small wall",
  "lesson.paint.example.3": "Three coats with an allowance",
} as const;
