export const messages = {
  "speed.operation.speed-si": "Average speed",
  "speed.field.distance": "Distance",
  "speed.field.time": "Time",
  "speed.unit.m": "Metres (m)",
  "speed.unit.s": "Seconds (s)",
  "speed.unit.speed-si": "m/s",
  "speed.working.speed-si": "{distance} m ÷ {time} s = {answer} m/s",
  "speed.result": "Average speed",
  "speed.error.invalid-field": "Enter a number in every field.",
  "speed.error.invalid-domain":
    "Distance cannot be negative and time must be greater than zero.",
  "speed.error.output-overflow": "The result is outside the supported range.",
  "speed.visual.caption": "Distance divided by time",
  "speed.visual.answer": "Average speed",
  "speed.visual.summary":
    "{distance} covered in {time} gives an average speed of {answer}.",
  "speed.visual.description":
    "The diagram writes the formula with your numbers: distance divided by time equals average speed.",
  "speed.visual.alternative":
    "A screen-reader sentence states the distance, the time and the resulting average speed in metres per second.",
  "lesson.speed.intro.title": "What this measures",
  "lesson.speed.intro.body":
    "Average speed is the total distance travelled divided by the time it took. It describes the whole trip, not how fast you were going at any single moment.",
  "lesson.speed.meaning.title": "How to enter values",
  "lesson.speed.meaning.body":
    "Enter the distance in metres and the elapsed time in seconds. Time must be greater than zero. A 5 km run that takes 25 minutes is 5,000 m in 1,500 s.",
  "lesson.speed.formula.speed-si": "v = d / t",
  "lesson.speed.variable.item0": "average speed in metres per second",
  "lesson.speed.variable.item1": "distance travelled in metres",
  "lesson.speed.variable.item2": "elapsed time in seconds",
  "lesson.speed.example.0": "120 m in 10 s",
  "lesson.speed.example.1": "Standing still for 5 s",
  "lesson.speed.example.2": "1,500 m in 300 s",
  "lesson.speed.mistakes.title": "Common mistakes",
  "lesson.speed.mistakes.body":
    "Use the path actually travelled, not the straight-line displacement. The average over a whole trip is not the mean of the speeds in each part when those parts take different times. Convert minutes and kilometres to seconds and metres first.",
  "lesson.speed.limits.title": "Limits and assumptions",
  "lesson.speed.limits.body":
    "Inputs use fixed SI units; convert other units before you calculate. This is an idealised textbook relation for consistent measurements, not an engineering design or safety assessment. Values outside the supported decimal range are rejected rather than approximated. Calculations keep up to 30 significant input digits and 50 working digits; only the displayed answer is rounded.",
  "lesson.speed.sources.title": "Sources",
  "lesson.speed.sources.body":
    "OpenStax University Physics Volume 1, mechanics: https://openstax.org/details/books/university-physics-volume-1",
  "lesson.speed.faq.q": "How do I use other units?",
  "lesson.speed.faq.a":
    "Convert each input to the labelled SI unit first: kilometres × 1,000 for metres, minutes × 60 for seconds. To read the answer in km/h, multiply m/s by 3.6.",
} as const;
