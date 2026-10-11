export const messages = {
  "power.operation.power-si": "Average power",
  "power.field.energy": "Energy",
  "power.field.time": "Time",
  "power.unit.j": "Joules (J)",
  "power.unit.s": "Seconds (s)",
  "power.unit.power-si": "W",
  "power.working.power-si": "{energy} J ÷ {time} s = {answer} W",
  "power.result": "Average power",
  "power.error.invalid-field": "Enter a number in every field.",
  "power.error.invalid-domain": "Time must be greater than zero.",
  "power.error.output-overflow": "The result is outside the supported range.",
  "power.visual.caption": "Energy divided by time",
  "power.visual.answer": "Average power",
  "power.visual.summary":
    "Transferring {energy} in {time} is an average power of {answer}.",
  "power.visual.description":
    "The diagram writes the formula with your numbers: energy divided by time equals average power.",
  "power.visual.alternative":
    "A screen-reader sentence states the energy, the time and the resulting average power in watts.",
  "lesson.power.intro.title": "What this measures",
  "lesson.power.intro.body":
    "Power is how quickly energy is transferred. One watt is one joule every second, so the same energy delivered faster means more power.",
  "lesson.power.meaning.title": "How to enter values",
  "lesson.power.meaning.body":
    "Enter the energy in joules and the time in seconds. A kettle that uses 360,000 J in 3 minutes (180 s) runs at 2,000 W. Energy can be negative if you count energy flowing out; the power then has the same sign.",
  "lesson.power.formula.power-si": "P = E / t",
  "lesson.power.variable.item0": "average power in watts",
  "lesson.power.variable.item1": "energy transferred in joules",
  "lesson.power.variable.item2": "elapsed time in seconds",
  "lesson.power.example.0": "1,000 J in 10 s",
  "lesson.power.example.1": "60 J released over 3 s",
  "lesson.power.example.2": "No energy over 5 s",
  "lesson.power.mistakes.title": "Common mistakes",
  "lesson.power.mistakes.body":
    "Energy and power are different: joules say how much, watts say how fast. An average over the whole interval does not show peaks. Kilowatt-hours are energy, not power: 1 kWh is 3,600,000 J.",
  "lesson.power.limits.title": "Limits and assumptions",
  "lesson.power.limits.body":
    "Inputs use fixed SI units; convert other units before you calculate. This is an idealised textbook relation for consistent measurements, not an engineering design or safety assessment. Values outside the supported decimal range are rejected rather than approximated. Calculations keep up to 30 significant input digits and 50 working digits; only the displayed answer is rounded.",
  "lesson.power.sources.title": "Sources",
  "lesson.power.sources.body":
    "OpenStax University Physics Volume 1, mechanics: https://openstax.org/details/books/university-physics-volume-1",
  "lesson.power.faq.q": "How do I use other units?",
  "lesson.power.faq.a":
    "Convert energy to joules and time to seconds first: 1 kWh is 3,600,000 J and 1 minute is 60 s. Divide the answer by 1,000 for kilowatts.",
} as const;
