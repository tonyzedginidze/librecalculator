export const messages = {
  "density.operation.density-si": "Density",
  "density.field.mass": "Mass",
  "density.field.volume": "Volume",
  "density.unit.kg": "Kilograms (kg)",
  "density.unit.m3": "Cubic metres (m³)",
  "density.unit.density-si": "kg/m³",
  "density.working.density-si": "{mass} kg ÷ {volume} m³ = {answer} kg/m³",
  "density.result": "Density",
  "density.error.invalid-field": "Enter a number in every field.",
  "density.error.invalid-domain":
    "Mass cannot be negative and volume must be greater than zero.",
  "density.error.output-overflow": "The result is outside the supported range.",
  "density.visual.caption": "Mass divided by volume, next to water",
  "density.visual.answer": "Density",
  "density.visual.summary":
    "{mass} in {volume} has a density of {answer}, compared with about {water} for water.",
  "density.visual.water": "Water",
  "density.visual.sample": "Your sample",
  "density.visual.sinks": "Denser than water, so a solid piece of it sinks.",
  "density.visual.floats":
    "Less dense than water, so a solid piece of it floats.",
  "density.visual.same": "The same density as water.",
  "density.visual.description":
    "The diagram writes the formula with your numbers and places the result on a scale next to fresh water, about 1,000 kg/m³.",
  "density.visual.alternative":
    "A screen-reader sentence states the mass, the volume, the density and the density of water for comparison.",
  "lesson.density.intro.title": "What this measures",
  "lesson.density.intro.body":
    "Density tells you how much mass is packed into each cubic metre. The same mass squeezed into a smaller volume is denser.",
  "lesson.density.meaning.title": "How to enter values",
  "lesson.density.meaning.body":
    "Enter the mass in kilograms and the volume in cubic metres. A one-litre block (0.001 m³) of aluminium has a mass of 2.7 kg, so its density is 2,700 kg/m³.",
  "lesson.density.formula.density-si": "ρ = m / V",
  "lesson.density.variable.item0": "density in kilograms per cubic metre",
  "lesson.density.variable.item1": "mass in kilograms",
  "lesson.density.variable.item2": "volume in cubic metres",
  "lesson.density.example.0": "10 kg in 2 m³",
  "lesson.density.example.1": "1,000 kg in 1 m³",
  "lesson.density.example.2": "An empty 3 m³ volume",
  "lesson.density.mistakes.title": "Common mistakes",
  "lesson.density.mistakes.body":
    "Volume must be in cubic metres: one litre is 0.001 m³, not 1. For powders, gravel or foam the measured volume includes gaps, so the result is a bulk density lower than that of the solid material.",
  "lesson.density.limits.title": "Limits and assumptions",
  "lesson.density.limits.body":
    "Inputs use fixed SI units; convert other units before you calculate. This is an idealised textbook relation for consistent measurements, not an engineering design or safety assessment. Values outside the supported decimal range are rejected rather than approximated. Calculations keep up to 30 significant input digits and 50 working digits; only the displayed answer is rounded.",
  "lesson.density.sources.title": "Sources",
  "lesson.density.sources.body":
    "OpenStax University Physics Volume 1, mechanics: https://openstax.org/details/books/university-physics-volume-1",
  "lesson.density.faq.q": "How do I use other units?",
  "lesson.density.faq.a":
    "Convert mass to kilograms and volume to cubic metres first: litres ÷ 1,000 give m³. To read the answer in g/cm³, divide kg/m³ by 1,000.",
} as const;
