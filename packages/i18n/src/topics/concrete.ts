export const messages = {
  "concrete.operation.slab": "Slab volume",
  "concrete.field.length": "Length",
  "concrete.field.width": "Width",
  "concrete.field.depth": "Depth",
  "concrete.field.waste": "Allowance",
  "concrete.unit.m": "Metres (m)",
  "concrete.unit.percent": "Percent (%)",
  "concrete.answer.unit": "m³",
  "concrete.working.summary":
    "{length} m × {width} m × {depth} m = {reference} m³. Add the {waste}% allowance: {reference} × (1 + {waste}/100) = {answer} m³.",
  "concrete.visual.caption": "The slab and the concrete to order",
  "concrete.visual.length": "L {value} m",
  "concrete.visual.width": "W {value} m",
  "concrete.visual.depth": "D {value} m",
  "concrete.visual.net": "Slab volume",
  "concrete.visual.allowance": "Allowance {waste}%",
  "concrete.visual.order": "To order",
  "concrete.visual.summary":
    "A slab {length} m long, {width} m wide and {depth} m deep holds {reference} m³. A {waste}% allowance adds {allowance} m³, so order {answer} m³.",
  "concrete.visual.description":
    "The drawing exaggerates the depth so it stays visible; the volumes below it are exact. The allowance is extra concrete for an uneven base and losses, not part of the slab.",
  "concrete.visual.alternative":
    "The slab volume, the allowance volume and the total to order are stated as numbers beside the drawing.",
  "concrete.error.invalid-field":
    "Enter a positive number. Dimensions must be greater than zero.",
  "concrete.error.out-of-range":
    "Use dimensions up to 1,000,000 m and an allowance from 0 to 100%.",
  "concrete.error.output-overflow": "The result is too large to show.",
  "lesson.concrete.intro.title": "Concrete for a slab",
  "lesson.concrete.intro.body":
    "A rectangular slab’s volume is its area multiplied by its depth. An explicit allowance lets you plan additional concrete for uneven excavation or losses without hiding that assumption.",
  "lesson.concrete.method.title": "Measure the slab and choose an allowance",
  "lesson.concrete.method.body":
    "Measure length, width and depth in metres. Convert centimetres to metres before entering depth: a 10 cm slab is 0.1 m. Set an allowance based on the actual site and supplier; zero gives the geometric volume.",
  "lesson.concrete.formula": "V = L × W × D × (1 + a/100)",
  "lesson.concrete.variable.volume": "Volume to order (m³)",
  "lesson.concrete.mistakes.title": "Common mistakes",
  "lesson.concrete.mistakes.body":
    "Ten centimetres is 0.1 metres, not 10 metres. Do not use this volume calculation to determine structural thickness or reinforcement.",
  "lesson.concrete.limits.title": "Assumptions and limits",
  "lesson.concrete.limits.body":
    "Rectangular solid slab only. Positive dimensions no larger than one million metres; allowance 0–100%. No footings, voids, reinforcing displacement, dry-bag yield, delivery rounding or structural design is inferred. Material estimates only; verify measurements, product guidance and site requirements before ordering.",
  "lesson.concrete.faq.q": "How many ready-mix bags are needed?",
  "lesson.concrete.faq.a":
    "Divide the volume by the stated wet yield per bag and round up. Yield varies by product; this calculator deliberately gives volume rather than assuming a bag size.",
  "lesson.concrete.sources.title": "Method and references",
  "lesson.concrete.sources.body":
    "Volume of a rectangular solid, length × width × depth, scaled by an explicit percentage allowance. Product yields and site allowances must come from the chosen supplier; no standard product yield is assumed.",
  "lesson.concrete.example.1": "A five by four metre slab, 10 cm deep",
  "lesson.concrete.example.2": "A one-metre cube without allowance",
  "lesson.concrete.example.3": "A small 20 cm pad",
} as const;
