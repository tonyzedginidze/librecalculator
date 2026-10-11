export const messages = {
  "energy.operation.energy-si": "Kinetic energy",
  "energy.field.mass": "Mass",
  "energy.field.speed": "Speed",
  "energy.unit.kg": "Kilograms (kg)",
  "energy.unit.mps": "Metres per second (m/s)",
  "energy.unit.energy-si": "J",
  "energy.working.energy-si": "{mass} kg × ({speed} m/s)² ÷ 2 = {answer} J",
  "energy.result": "Kinetic energy",
  "energy.error.invalid-field": "Enter a number in every field.",
  "energy.error.invalid-domain":
    "Mass must be greater than zero and speed cannot be negative.",
  "energy.error.output-overflow": "The result is outside the supported range.",
  "energy.visual.caption":
    "Your kinetic energy, and the same mass at twice the speed",
  "energy.visual.answer": "Kinetic energy",
  "energy.visual.summary":
    "{mass} moving at {speed} carries {answer} of kinetic energy; at {doubledSpeed} it would carry {doubledEnergy}.",
  "energy.visual.squared": "({value})²",
  "energy.visual.at": "At {speed}",
  "energy.visual.doubled-speed": "Twice the speed",
  "energy.visual.doubled-energy": "Energy at twice the speed",
  "energy.visual.doubled-note":
    "Same mass at twice the speed: four times the energy.",
  "energy.visual.description":
    "The diagram writes the formula with your numbers, then compares the energy at your speed with the energy of the same mass moving twice as fast.",
  "energy.visual.alternative":
    "A screen-reader sentence states the mass, the speed, the kinetic energy and the energy at twice the speed.",
  "lesson.energy.intro.title": "What this measures",
  "lesson.energy.intro.body":
    "Kinetic energy is the energy an object has because it is moving. Because speed is squared, doubling the speed multiplies the energy by four.",
  "lesson.energy.meaning.title": "How to enter values",
  "lesson.energy.meaning.body":
    "Enter the mass in kilograms and the speed in metres per second. A 1,500 kg car at 20 m/s (72 km/h) carries 300,000 J.",
  "lesson.energy.formula.energy-si": "Eₖ = m × v² / 2",
  "lesson.energy.variable.item0": "kinetic energy in joules",
  "lesson.energy.variable.item1": "mass in kilograms",
  "lesson.energy.variable.item2": "speed in metres per second",
  "lesson.energy.example.0": "2 kg moving at 3 m/s",
  "lesson.energy.example.1": "10 kg at rest",
  "lesson.energy.example.2": "4 kg moving at 5 m/s",
  "lesson.energy.mistakes.title": "Common mistakes",
  "lesson.energy.mistakes.body":
    "Square the speed, not the mass. Convert km/h to m/s (divide by 3.6) before calculating. The value depends on the frame you measure speed from.",
  "lesson.energy.limits.title": "Limits and assumptions",
  "lesson.energy.limits.body":
    "Inputs use fixed SI units; convert other units before you calculate. This is an idealised textbook relation for consistent measurements, not an engineering design or safety assessment. Values outside the supported decimal range are rejected rather than approximated. Calculations keep up to 30 significant input digits and 50 internal digits; only the displayed answer is rounded.",
  "lesson.energy.sources.title": "Sources",
  "lesson.energy.sources.body":
    "OpenStax University Physics Volume 1, mechanics: https://openstax.org/details/books/university-physics-volume-1",
  "lesson.energy.faq.q": "How do I use other units?",
  "lesson.energy.faq.a":
    "Convert mass to kilograms and speed to metres per second first; km/h ÷ 3.6 gives m/s. The answer is in joules; divide by 1,000 for kilojoules.",
} as const;
