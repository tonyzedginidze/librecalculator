export const messages = {
  "macros.operation.protein-grams": "Protein grams",
  "macros.operation.carbohydrate-grams": "Carbohydrate grams",
  "macros.operation.fat-grams": "Fat grams",
  "macros.field.calories": "Daily energy",
  "macros.field.protein": "Protein share",
  "macros.field.carbohydrate": "Carbohydrate share",
  "macros.field.fat": "Fat share",
  "macros.field.age": "Age",
  "macros.unit.kcal": "Kilocalories per day (kcal/day)",
  "macros.unit.percent": "Percent of calories (%)",
  "macros.unit.years": "Years (years)",
  "macros.answer.unit": "g/day",
  "macros.working.summary":
    "{question}: {calories} kcal/day split protein {protein}%, carbohydrate {carbohydrate}%, fat {fat}%. The selected share\u2019s calories \u00f7 4 kcal/g (protein, carbohydrate) or 9 kcal/g (fat) = {answer} g/day. Adult age context: {age}.",
  "macros.visual.description":
    "The bar splits the daily energy by calorie share. Each part lists its grams: calories \u00f7 4 for protein and carbohydrate, \u00f7 9 for fat. The split is your scenario, not a recommendation.",
  "macros.visual.alternative":
    "The exact numbers and their units are stated in the visible text. Predictions and scenario inputs are not medical measurements or prescriptions.",
  "macros.visual.caption": "Daily energy split by calorie share, with grams",
  "macros.visual.summary":
    "{calories} kcal/day: protein {proteinKcal} kcal is {proteinGrams} g, carbohydrate {carbohydrateKcal} kcal is {carbohydrateGrams} g, fat {fatKcal} kcal is {fatGrams} g.",
  "macros.visual.total": "Daily energy",
  "macros.visual.kcal": "kcal/day",
  "macros.visual.protein": "Protein",
  "macros.visual.carbohydrate": "Carbohydrate",
  "macros.visual.fat": "Fat",
  "macros.visual.part": "{grams} g \u00b7 {kcal} kcal",
  "macros.error.invalid-field":
    "Enter a valid number in the stated metric units.",
  "macros.error.out-of-range": "Use values inside the documented field limits.",
  "macros.error.output-overflow":
    "The result exceeds the supported numeric or money range.",
  "lesson.macros.intro.title": "Macronutrient energy allocation",
  "lesson.macros.intro.body":
    "This calculator converts an energy split that you choose into grams. It does not choose a diet, a calorie target or a recommended macronutrient ratio.",
  "lesson.macros.method.title": "Choose the question and enter values",
  "lesson.macros.method.body":
    "Enter the energy scenario and three calorie percentages that add to exactly one hundred. Choose which macronutrient\u2019s gram amount to display; the same inputs can be used for all three.",
  "lesson.macros.formula":
    "Protein g = E \u00d7 p \u00f7 100 \u00f7 4; carbohydrate g = E \u00d7 c \u00f7 100 \u00f7 4; fat g = E \u00d7 f \u00f7 100 \u00f7 9. E is daily kcal; p, c and f are calorie shares in percent that add up to 100.",
  "lesson.macros.mistakes.title": "Common mistakes",
  "lesson.macros.mistakes.body":
    "A percentage of calories is not a percentage of grams. Fat contributes more energy per gram, so a thirty-percent fat calorie share does not mean thirty percent of the total gram weight.",
  "lesson.macros.limits.title": "Assumptions and limits",
  "lesson.macros.limits.body":
    "Adult context 20\u2013120; energy 100\u201310000kcal/day; each share 0\u2013100% and exact total 100%. General 4/4/9 factors; specific foods, fibre, alcohol and sugar alcohols can differ. No diet prescription, allergies or clinical nutrition assessment. Educational information only, not medical advice, diagnosis or an individualized nutrition plan.",
  "lesson.macros.faq.q": "Are the default percentages recommended?",
  "lesson.macros.faq.a":
    "No. They demonstrate the arithmetic only. Appropriate intake depends on individual circumstances and should not be inferred from these defaults.",
  "lesson.macros.sources.title": "Method and references",
  "lesson.macros.sources.body":
    "USDA National Agricultural Library describes general energy factors of 4kcal/g for protein and carbohydrate and 9kcal/g for fat: https://www.nal.usda.gov/programs/fnic . These are arithmetic factors rather than an endorsement of a calorie level or distribution.",
  "lesson.macros.example.1": "Protein in an eighteen-hundred-calorie scenario",
  "lesson.macros.example.2": "Carbohydrate in the same scenario",
  "lesson.macros.example.3": "Fat in the same scenario",
} as const;
