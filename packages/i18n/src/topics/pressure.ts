export const messages = {
  "pressure.operation.pressure-si": "Pressure",
  "pressure.field.force": "Force",
  "pressure.field.area": "Area",
  "pressure.unit.n": "Newtons (N)",
  "pressure.unit.m2": "Square metres (m²)",
  "pressure.unit.pressure-si": "Pa",
  "pressure.working.pressure-si": "{force} N ÷ {area} m² = {answer} Pa",
  "pressure.result": "Pressure",
  "pressure.error.invalid-field": "Enter a number in every field.",
  "pressure.error.invalid-domain":
    "Force cannot be negative and area must be greater than zero.",
  "pressure.error.output-overflow":
    "The result is outside the supported range.",
  "pressure.visual.caption": "The force spread over the contact area",
  "pressure.visual.answer": "Pressure",
  "pressure.visual.summary":
    "A force of {force} spread over {area} gives an average pressure of {answer}.",
  "pressure.visual.description":
    "The diagram writes the formula with your numbers and draws the force pressing evenly on the contact area.",
  "pressure.visual.alternative":
    "A screen-reader sentence states the force, the area and the resulting average pressure in pascals.",
  "lesson.pressure.intro.title": "What this measures",
  "lesson.pressure.intro.body":
    "Pressure is the force pressing straight onto a surface, divided by the area it is spread over. One pascal is one newton on each square metre.",
  "lesson.pressure.meaning.title": "How to enter values",
  "lesson.pressure.meaning.body":
    "Enter the force in newtons, pressing at right angles to the surface, and the contact area in square metres. A person weighing about 700 N standing on 0.05 m² of shoe sole presses on the floor at 14,000 Pa.",
  "lesson.pressure.formula.pressure-si": "p = F / A",
  "lesson.pressure.variable.item0": "average pressure in pascals",
  "lesson.pressure.variable.item1":
    "force at right angles to the surface in newtons",
  "lesson.pressure.variable.item2": "contact area in square metres",
  "lesson.pressure.example.0": "100 N over 2 m²",
  "lesson.pressure.example.1": "1,000 N over 0.5 m²",
  "lesson.pressure.example.2": "No force on 3 m²",
  "lesson.pressure.mistakes.title": "Common mistakes",
  "lesson.pressure.mistakes.body":
    "Area must be in square metres: 1 cm² is 0.0001 m². Use only the part of the force that acts at right angles to the surface. The result is an average; real contacts can have much higher local peaks.",
  "lesson.pressure.limits.title": "Limits and assumptions",
  "lesson.pressure.limits.body":
    "Inputs use fixed SI units; convert other units before you calculate. This is an idealised textbook relation for consistent measurements, not an engineering design or safety assessment. Values outside the supported decimal range are rejected rather than approximated. Calculations keep up to 30 significant input digits and 50 working digits; only the displayed answer is rounded.",
  "lesson.pressure.sources.title": "Sources",
  "lesson.pressure.sources.body":
    "OpenStax University Physics Volume 1, mechanics: https://openstax.org/details/books/university-physics-volume-1",
  "lesson.pressure.faq.q": "How do I use other units?",
  "lesson.pressure.faq.a":
    "Convert force to newtons and area to square metres first; a mass of 1 kg weighs about 9.81 N. Divide the answer by 1,000 for kilopascals, or by 100,000 for bar.",
} as const;
