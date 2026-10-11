export const messages = {
  "water-intake.operation.water-volume": "Daily volume",
  "water-intake.field.weight": "Body weight",
  "water-intake.field.rate": "Your factor",
  "water-intake.field.age": "Age",
  "water-intake.unit.kg": "Kilograms (kg)",
  "water-intake.unit.rate": "Millilitres per kilogram per day (mL/kg/day)",
  "water-intake.unit.years": "Years (years)",
  "water-intake.answer.unit": "L/day",
  "water-intake.working.summary":
    "{weight} kg \u00d7 your {rate} mL/kg/day factor = {reference} mL/day. Divide by 1000 = {answer} L/day. Adult age context: {age}; this is not a prescribed drinking target.",
  "water-intake.visual.description":
    "The same scenario volume is stated in millilitres and counted in 250 mL glasses. It is a conversion, not a personal drinking target, and food also contributes water.",
  "water-intake.visual.alternative":
    "The exact numbers and their units are stated in the visible text. Predictions and scenario inputs are not medical measurements or prescriptions.",
  "water-intake.visual.caption": "The same volume counted in 250 mL glasses",
  "water-intake.visual.summary":
    "{litres} L/day is {millilitres} mL/day, or {glasses} glasses of {glass} mL.",
  "water-intake.visual.label": "glasses of {glass} mL ({millilitres} mL/day)",
  "water-intake.error.invalid-field":
    "Enter a valid number in the stated metric units.",
  "water-intake.error.out-of-range":
    "Use values inside the documented field limits.",
  "water-intake.error.output-overflow":
    "The result exceeds the supported numeric or money range.",
  "lesson.water-intake.intro.title": "Water-volume planning scenario",
  "lesson.water-intake.intro.body":
    "This is a unit-conversion scenario for a factor you supply. Weight alone does not determine hydration needs, and the default factor is an arithmetic example rather than a recommendation.",
  "lesson.water-intake.method.title": "Choose the question and enter values",
  "lesson.water-intake.method.body":
    "Enter weight and the factor for the scenario you wish to explore. The output converts millilitres to litres. It does not infer whether the factor should include beverages, food water or other sources.",
  "lesson.water-intake.formula":
    "L/day = w \u00d7 r \u00f7 1000, with w the body weight in kg and r your factor in mL/kg/day.",
  "lesson.water-intake.mistakes.title": "Common mistakes",
  "lesson.water-intake.mistakes.body":
    "Do not treat this computed volume as an amount everyone should drink. Activity, climate, illness, pregnancy and breastfeeding change individual needs; fluids from food can also contribute.",
  "lesson.water-intake.limits.title": "Assumptions and limits",
  "lesson.water-intake.limits.body":
    "Adult context 20\u2013120, weight 20\u2013350kg, scenario factor 1\u201350mL/kg/day. This is not a clinical hydration guideline or advice for fluid restriction, kidney or heart disease, illness, pregnancy, breastfeeding or endurance exercise. Educational information only, not medical advice, diagnosis or an individualized nutrition plan.",
  "lesson.water-intake.faq.q": "Is 30 mL per kilogram a prescribed target?",
  "lesson.water-intake.faq.a":
    "No. It is the example value used to demonstrate the conversion. The calculator does not prescribe a factor or personal fluid target.",
  "lesson.water-intake.sources.title": "Method and references",
  "lesson.water-intake.sources.body":
    "CDC explains that water needs vary with age, activity, pregnancy and breastfeeding and that food can contribute water: https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/ . CDC is cited for these limitations, not as the source or endorsement of the user-entered mL/kg factor.",
  "lesson.water-intake.example.1": "70 kg at a chosen 30 mL/kg",
  "lesson.water-intake.example.2": "80 kg at 25 mL/kg",
  "lesson.water-intake.example.3": "60 kg at 40 mL/kg",
} as const;
