export const messages = {
  "bmr.operation.male-equation": "Male equation",
  "bmr.operation.female-equation": "Female equation",
  "bmr.field.weight": "Body weight",
  "bmr.field.height": "Height",
  "bmr.field.age": "Age",
  "bmr.unit.kg": "Kilograms (kg)",
  "bmr.unit.cm": "Centimetres (cm)",
  "bmr.unit.years": "Years (years)",
  "bmr.answer.unit": "kcal/day",
  "bmr.working.summary":
    "{question}: 10 \u00d7 {weight} + 6.25 \u00d7 {height} \u2212 5 \u00d7 {age} = {reference}. Adding the published constant (+5 male, \u2212161 female) gives {answer} kcal/day.",
  "bmr.visual.description":
    "Each bar is one term of the selected equation in kcal/day: weight and height add energy, age subtracts it, and the published constant shifts the total. The terms add up to the resting estimate.",
  "bmr.visual.alternative":
    "The exact numbers and their units are stated in the visible text. Predictions and scenario inputs are not medical measurements or prescriptions.",
  "bmr.visual.caption": "How each term builds the resting estimate",
  "bmr.visual.summary":
    "Weight adds {weight}, height adds {height}, age subtracts {age} and the constant adds {constant}, for a resting estimate of {answer} kcal/day.",
  "bmr.visual.weight": "10 \u00d7 weight",
  "bmr.visual.height": "6.25 \u00d7 height",
  "bmr.visual.age": "\u22125 \u00d7 age",
  "bmr.visual.constant": "Equation constant",
  "bmr.visual.total": "Resting estimate",
  "bmr.error.invalid-field": "Enter a valid number in the stated metric units.",
  "bmr.error.out-of-range": "Use values inside the documented field limits.",
  "bmr.error.output-overflow":
    "The result exceeds the supported numeric or money range.",
  "lesson.bmr.intro.title": "Resting energy estimate",
  "lesson.bmr.intro.body":
    "This calculator uses the simplified Mifflin\u2013St Jeor resting-energy equations. Often searched for as BMR, the output estimates resting energy expenditure, not a measured basal metabolism or a daily food target.",
  "lesson.bmr.method.title": "Choose the question and enter values",
  "lesson.bmr.method.body":
    "Choose the published sex-specific coefficient, then enter adult measurements and age. The source study used male and female groups; this selection describes its equation coefficients rather than gender identity.",
  "lesson.bmr.formula":
    "Resting kcal/day = 10w + 6.25h \u2212 5A + s, with w in kg, h in cm, A in years and s = +5 (male) or \u2212161 (female).",
  "lesson.bmr.mistakes.title": "Common mistakes",
  "lesson.bmr.mistakes.body":
    "Resting energy is only one component of daily expenditure. Do not treat the result as the amount to eat or subtract a diet deficit automatically.",
  "lesson.bmr.limits.title": "Assumptions and limits",
  "lesson.bmr.limits.body":
    "Adults aged 20\u201378, weight 20\u2013350kg, height 100\u2013250cm, positive modeled result. Input bounds do not establish accuracy. Not for children, pregnancy, breastfeeding, acute illness or a treatment plan; body composition and individual metabolism can differ. Educational information only, not medical advice, diagnosis or an individualized nutrition plan.",
  "lesson.bmr.faq.q": "Is this a laboratory metabolic measurement?",
  "lesson.bmr.faq.a":
    "No. It is a prediction from measurements and the selected published coefficient. Laboratory resting-energy measurement can produce a different result.",
  "lesson.bmr.sources.title": "Method and references",
  "lesson.bmr.sources.body":
    "Mifflin MD and colleagues, 1990, A new predictive equation for resting energy expenditure in healthy individuals: https://pubmed.ncbi.nlm.nih.gov/2305711/ . The simplified sex-specific equations are reproduced from the abstract; the study included adults aged 19\u201378.",
  "lesson.bmr.example.1": "Male coefficient at 70 kg",
  "lesson.bmr.example.2": "Female coefficient for the same measurements",
  "lesson.bmr.example.3": "A different adult male scenario",
} as const;
