export const messages = {
  "force.operation.force-si": "Net force",
  "force.field.mass": "Mass",
  "force.field.acceleration": "Acceleration",
  "force.unit.kg": "Kilograms (kg)",
  "force.unit.mps2": "Metres per second squared (m/s²)",
  "force.unit.force-si": "N",
  "force.working.force-si": "{mass} kg × {acceleration} m/s² = {answer} N",
  "force.result": "Net force",
  "force.error.invalid-field": "Enter a number in every field.",
  "force.error.invalid-domain": "Mass must be greater than zero.",
  "force.error.output-overflow": "The result is outside the supported range.",
  "force.visual.caption": "Mass times acceleration, drawn as the push it needs",
  "force.visual.answer": "Net force",
  "force.visual.summary":
    "Accelerating {mass} at {acceleration} takes a net force of {answer}.",
  "force.visual.description":
    "The diagram writes Newton’s second law with your numbers and draws the mass with an arrow for the net force, pointing in the direction of the acceleration.",
  "force.visual.alternative":
    "A screen-reader sentence states the mass, the acceleration and the resulting net force in newtons.",
  "lesson.force.intro.title": "What this measures",
  "lesson.force.intro.body":
    "Newton’s second law links the net force on an object to its mass and acceleration: F = m × a. It holds for an object of constant mass seen from a non-accelerating frame.",
  "lesson.force.meaning.title": "How to enter values",
  "lesson.force.meaning.body":
    "Enter the mass in kilograms and the acceleration in metres per second squared along one direction. A negative acceleration (slowing down, or speeding up the other way) gives a negative force. A 1,200 kg car accelerating at 2.5 m/s² needs 3,000 N.",
  "lesson.force.formula.force-si": "F = m × a",
  "lesson.force.variable.item0": "net force in newtons",
  "lesson.force.variable.item1": "mass in kilograms",
  "lesson.force.variable.item2": "acceleration in metres per second squared",
  "lesson.force.example.0": "10 kg accelerating at 2 m/s²",
  "lesson.force.example.1": "3 kg slowing at −4 m/s²",
  "lesson.force.example.2": "5 kg at constant velocity",
  "lesson.force.mistakes.title": "Common mistakes",
  "lesson.force.mistakes.body":
    "Mass and weight are different: weight is itself a force. The result is the net force, the sum of every force acting, not one push or pull. Zero acceleration means the forces balance, not that there are no forces.",
  "lesson.force.limits.title": "Limits and assumptions",
  "lesson.force.limits.body":
    "Inputs use fixed SI units; convert other units before you calculate. This is an idealised textbook relation for consistent measurements, not an engineering design or safety assessment. Values outside the supported decimal range are rejected rather than approximated. Calculations keep up to 30 significant input digits and 50 working digits; only the displayed answer is rounded.",
  "lesson.force.sources.title": "Sources",
  "lesson.force.sources.body":
    "OpenStax University Physics Volume 1, mechanics: https://openstax.org/details/books/university-physics-volume-1",
  "lesson.force.faq.q": "How do I use other units?",
  "lesson.force.faq.a":
    "Convert mass to kilograms and acceleration to m/s² first. One pound is about 0.4536 kg, and one g of acceleration is about 9.81 m/s².",
} as const;
