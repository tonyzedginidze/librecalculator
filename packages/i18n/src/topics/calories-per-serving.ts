export const messages = {
  "calories-per-serving.field.totalCalories": "Whole recipe",
  "calories-per-serving.field.servings": "Servings",
  "calories-per-serving.field.portionCalories": "Per serving",
  "calories-per-serving.field.totalGrams": "Cooked weight",
  "calories-per-serving.field.portionGrams": "Your portion",
  "calories-per-serving.unit.kcal": "Kilocalories (kcal)",
  "calories-per-serving.unit.serving": "Servings (servings)",
  "calories-per-serving.unit.gram": "Grams (g)",
  "calories-per-serving.answer.kcal": "kcal",
  "calories-per-serving.answer.gram": "g",
  "calories-per-serving.answer.servings": "servings",
  "calories-per-serving.variable.portion": "Calories in the portion",
  "calories-per-serving.variable.total": "Calories in the whole recipe",
  "calories-per-serving.operation.portion-calories": "Per serving",
  "calories-per-serving.working.portion-calories":
    "e = E ÷ n = {totalCalories} kcal ÷ {servings} = {answer} kcal",
  "calories-per-serving.formula.portion-calories": "e = E ÷ n",
  "calories-per-serving.example.portion-calories":
    "A 1,000 kcal recipe shared four ways",
  "calories-per-serving.operation.recipe-calories": "Whole recipe",
  "calories-per-serving.working.recipe-calories":
    "E = e × n = {portionCalories} kcal × {servings} = {answer} kcal",
  "calories-per-serving.formula.recipe-calories": "E = e × n",
  "calories-per-serving.example.recipe-calories":
    "Four servings of 250 kcal each",
  "calories-per-serving.operation.portion-weight": "By portion weight",
  "calories-per-serving.working.portion-weight":
    "e = E × m ÷ M = {totalCalories} kcal × {portionGrams} g ÷ {totalGrams} g = {answer} kcal",
  "calories-per-serving.formula.portion-weight": "e = E × m ÷ M",
  "calories-per-serving.example.portion-weight":
    "A 200 g portion of an 800 g, 1,000 kcal batch",
  "calories-per-serving.error.invalid-field":
    "Enter a number, such as 2400 or 8.",
  "calories-per-serving.error.nonpositive-dimension":
    "Servings and cooked weight must be more than zero, and calories and portions cannot be negative.",
  "calories-per-serving.error.output-overflow":
    "The answer is outside the supported range.",
  "calories-per-serving.visual.caption.portion-calories":
    "One serving out of the whole recipe",
  "calories-per-serving.visual.caption.recipe-calories":
    "Servings added up to the whole recipe",
  "calories-per-serving.visual.caption.portion-weight":
    "Your portion's share of the cooked batch",
  "calories-per-serving.visual.one-serving": "in one of {servings} servings",
  "calories-per-serving.visual.per-serving": "Per serving",
  "calories-per-serving.visual.servings": "Servings",
  "calories-per-serving.visual.whole": "Whole recipe",
  "calories-per-serving.visual.portion": "Your portion",
  "calories-per-serving.visual.rest": "Rest of the batch",
  "calories-per-serving.visual.batch": "Cooked batch, {totalCalories} kcal",
  "calories-per-serving.visual.summary.count":
    "{totalCalories} kcal shared across {servings} servings is {portionCalories} kcal each.",
  "calories-per-serving.visual.summary.weight":
    "A {portionGrams} g portion of a {totalGrams} g batch holding {totalCalories} kcal provides {portionCalories} kcal.",
  "calories-per-serving.visual.description":
    "Counting servings, the grid shows one cell per serving with your serving highlighted, or the equation adds equal servings into the whole. Weighing a portion, the bar splits the cooked batch into your portion and the rest.",
  "calories-per-serving.visual.alternative":
    "The calories, servings and weights in the diagram are the same numbers stated in the answer and working.",
  "calories-per-serving.intro.title": "Calories in a homemade serving",
  "calories-per-serving.intro.body":
    "Add up the calories of every ingredient, then share the total out. Split it into equal servings, rebuild the total from a per-serving figure, or weigh the cooked dish and your portion for an estimate that does not depend on cutting equal slices.",
  "calories-per-serving.mistakes.title": "Common mistakes",
  "calories-per-serving.mistakes.body":
    "Weigh the dish after cooking. Water evaporates, so a stew can lose weight without losing calories, and dividing by the raw weight underestimates each gram. Counting servings only works if the servings really are equal.",
  "calories-per-serving.limits.title": "Assumptions and limits",
  "calories-per-serving.limits.body":
    "Servings and cooked weight must be more than zero; calories and portions may be zero, and servings may be fractional. A portion heavier than one batch is allowed, for example when two batches are combined. Estimates assume the food is evenly mixed and the ingredient totals are accurate. Answers are shown to the nearest kilocalorie. Educational estimate only, not dietary advice.",
  "calories-per-serving.faq.q": "Are Calories and kcal the same?",
  "calories-per-serving.faq.a":
    "Yes. The Calorie with a capital C on food labels is one kilocalorie (kcal). One kcal is 4.184 kJ, so 300 kcal is about 1,255 kJ.",
  "calories-per-serving.sources.title": "Sources",
  "calories-per-serving.sources.body":
    "Ingredient nutrition data: USDA FoodData Central, https://fdc.nal.usda.gov/. Measurement conventions: NIST SP 811, https://www.nist.gov/pml/special-publication-811.",
} as const;
