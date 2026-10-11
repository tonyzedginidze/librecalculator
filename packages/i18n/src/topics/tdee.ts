export const messages = {
  "tdee.operation.daily-energy": "Daily energy",
  "tdee.field.resting": "Resting energy",
  "tdee.field.factor": "Whole-day factor",
  "tdee.field.age": "Age",
  "tdee.unit.kcal": "Kilocalories per day (kcal/day)",
  "tdee.unit.years": "Years (years)",
  "tdee.answer.unit": "kcal/day",
  "tdee.working.summary":
    "Resting energy {resting} kcal/day \u00d7 whole-day factor {factor} = {answer} kcal/day. Adult age context: {age}. No calorie deficit or exercise add-on is inferred.",
  "tdee.visual.description":
    "The bar is the daily scenario in kcal/day: the entered resting energy plus the part added by the whole-day factor. The factor is an explicit scenario assumption.",
  "tdee.visual.alternative":
    "The exact numbers and their units are stated in the visible text. Predictions and scenario inputs are not medical measurements or prescriptions.",
  "tdee.visual.caption": "Resting energy and the part the factor adds",
  "tdee.visual.summary":
    "{answer} kcal/day in total: {resting} kcal/day resting energy plus {extra} kcal/day added by the factor of {factor}.",
  "tdee.visual.total": "Daily scenario",
  "tdee.visual.resting": "Resting energy",
  "tdee.visual.extra": "Added by the factor",
  "tdee.error.invalid-field":
    "Enter a valid number in the stated metric units.",
  "tdee.error.out-of-range": "Use values inside the documented field limits.",
  "tdee.error.output-overflow":
    "The result exceeds the supported numeric or money range.",
  "lesson.tdee.intro.title": "Daily energy expenditure scenario",
  "lesson.tdee.intro.body":
    "Daily energy expenditure includes more than resting metabolism. This transparent scenario multiplies an entered resting estimate by a factor you choose. It gives no weight-loss target or recommended food intake.",
  "lesson.tdee.method.title": "Choose the question and enter values",
  "lesson.tdee.method.body":
    "Enter a resting-energy estimate or measurement and a whole-day multiplier. The factor must already account for the day\u2019s activity and other expenditure; no automatic exercise calories are added.",
  "lesson.tdee.formula":
    "Daily kcal/day = R \u00d7 f, with R the resting energy in kcal/day and f the whole-day factor.",
  "lesson.tdee.mistakes.title": "Common mistakes",
  "lesson.tdee.mistakes.body":
    "Adding exercise calories again after using a factor that includes exercise can count activity twice. A descriptive activity label does not determine an individual\u2019s exact multiplier.",
  "lesson.tdee.limits.title": "Assumptions and limits",
  "lesson.tdee.limits.body":
    "Adults aged 20\u2013120; resting estimate 400\u20135000kcal/day, factor 1\u20132.5. The multiplier is a user assumption, not a calibrated measurement. Excludes children, pregnancy, breastfeeding, clinical nutrition and automatic calorie deficits. Educational information only, not medical advice, diagnosis or an individualized nutrition plan.",
  "lesson.tdee.faq.q": "How is the factor chosen?",
  "lesson.tdee.faq.a":
    "The calculator does not choose it for you. The factor is an explicit scenario assumption; individualized estimates may require professional assessment or measurements over time.",
  "lesson.tdee.sources.title": "Method and references",
  "lesson.tdee.sources.body":
    "FAO/WHO/UNU Human energy requirements explains whole-day expenditure as a multiple of basal metabolism: https://www.fao.org/4/y5686e/y5686e04.htm . This calculator applies the multiplier arithmetically to the entered resting estimate; it does not equate a predicted resting rate with a measured basal rate.",
  "lesson.tdee.example.1": "1,600 kcal at a factor of 1.5",
  "lesson.tdee.example.2": "Resting-only reference",
  "lesson.tdee.example.3": "1,800 kcal at a factor of 2",
} as const;
