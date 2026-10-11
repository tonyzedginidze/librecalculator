export const messages = {
  "flooring.operation.packs": "Packs to buy",
  "flooring.field.length": "Room length",
  "flooring.field.width": "Room width",
  "flooring.field.packArea": "Area per pack",
  "flooring.field.waste": "Cutting allowance",
  "flooring.unit.m": "Metres (m)",
  "flooring.unit.m2": "Square metres (m²)",
  "flooring.unit.percent": "Percent (%)",
  "flooring.answer.one": "pack",
  "flooring.answer.other": "packs",
  "flooring.working.summary":
    "Room area {length} m × {width} m = {reference} m². Add the {waste}% allowance and divide by {packArea} m² per pack, then round up to whole packs = {answer} packs.",
  "flooring.visual.caption": "Packs needed, rounded up to whole packs",
  "flooring.visual.count": "{exact} packs needed → buy {answer}",
  "flooring.visual.label": "one square per pack",
  "flooring.visual.needed": "Packs needed",
  "flooring.visual.buy": "Packs to buy",
  "flooring.visual.summary":
    "The room is {reference} m², or {needed} m² with the allowance. That is {exact} packs of {packArea} m², so buy {answer} whole packs.",
  "flooring.visual.description":
    "Filled squares are packs you use in full; the part-filled square is the share of the last pack you need. The rest of it is spare.",
  "flooring.visual.alternative":
    "The exact pack count before rounding and the whole packs to buy are stated as numbers under the grid.",
  "flooring.error.invalid-field":
    "Enter a positive number. Dimensions and pack area must be greater than zero.",
  "flooring.error.out-of-range":
    "Use dimensions up to 1,000,000 and an allowance from 0 to 100%.",
  "flooring.error.output-overflow": "The result is too large to show.",
  "lesson.flooring.intro.title": "Flooring packs to buy",
  "lesson.flooring.intro.body":
    "Flooring is usually purchased in complete packs. The room area plus a cutting allowance may not divide evenly by a pack’s coverage, so the purchase count rounds up.",
  "lesson.flooring.method.title": "Measure the room and read the pack",
  "lesson.flooring.method.body":
    "Enter the rectangular room dimensions in metres and the coverage printed on one pack. Choose your cutting allowance based on layout and manufacturer guidance; 5 to 10% is common for straight lay, more for diagonal or herringbone.",
  "lesson.flooring.formula": "N = ⌈L × W × (1 + a/100) ÷ p⌉",
  "lesson.flooring.variable.packs": "Whole packs to buy",
  "lesson.flooring.mistakes.title": "Common mistakes",
  "lesson.flooring.mistakes.body":
    "Do not round the room area before calculating packs. A diagonal pattern, irregular room or spare boards can require a different allowance.",
  "lesson.flooring.limits.title": "Assumptions and limits",
  "lesson.flooring.limits.body":
    "One rectangular room; dimensions and pack coverage positive and at most one million. Allowance 0–100%. Always returns a whole pack count. No product compatibility, expansion gap or subfloor engineering is inferred. Material estimates only; verify measurements, product guidance and site requirements before ordering.",
  "lesson.flooring.faq.q": "Why can the surplus exceed the allowance?",
  "lesson.flooring.faq.a":
    "The allowance is applied first. Rounding to a complete pack can add another partial pack of surplus because packs cannot be purchased as fractions.",
  "lesson.flooring.sources.title": "Method and references",
  "lesson.flooring.sources.body":
    "Rectangle area scaled by an explicit percentage allowance, divided by the coverage of one pack and rounded up once at the end. Pack coverage and cutting allowance must come from the chosen product; no standard pack size is assumed.",
  "lesson.flooring.example.1": "20 m² in 2 m² packs",
  "lesson.flooring.example.2": "Rounding a fractional pack up",
  "lesson.flooring.example.3": "A small room with cutting allowance",
} as const;
