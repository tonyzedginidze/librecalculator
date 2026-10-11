export const messages = {
  "baking-ratios.field.ingredient": "Ingredient",
  "baking-ratios.field.flour": "Flour",
  "baking-ratios.field.percentage": "Baker's percentage",
  "baking-ratios.unit.gram": "Grams (g)",
  "baking-ratios.unit.percent": "Percent of flour (%)",
  "baking-ratios.answer.gram": "g",
  "baking-ratios.answer.percent": "%",
  "baking-ratios.variable.percentage": "Baker's percentage",
  "baking-ratios.variable.ingredient": "Ingredient weight",
  "baking-ratios.variable.flour": "Flour weight",
  "baking-ratios.operation.baker-percent": "Find the percentage",
  "baking-ratios.working.baker-percent":
    "p = m ÷ F × 100 = {ingredient} g ÷ {flour} g × 100 = {answer}%",
  "baking-ratios.formula.baker-percent": "p = m ÷ F × 100",
  "baking-ratios.example.baker-percent": "325 g of water with 500 g of flour",
  "baking-ratios.operation.ingredient-mass": "Find the ingredient",
  "baking-ratios.working.ingredient-mass":
    "m = F × p ÷ 100 = {flour} g × {percentage} ÷ 100 = {answer} g",
  "baking-ratios.formula.ingredient-mass": "m = F × p ÷ 100",
  "baking-ratios.example.ingredient-mass":
    "Water for 500 g of flour at 65% hydration",
  "baking-ratios.operation.flour-mass": "Find the flour",
  "baking-ratios.working.flour-mass":
    "F = m × 100 ÷ p = {ingredient} g × 100 ÷ {percentage} = {answer} g",
  "baking-ratios.formula.flour-mass": "F = m × 100 ÷ p",
  "baking-ratios.example.flour-mass":
    "Flour to pair with 325 g of water at 65%",
  "baking-ratios.error.invalid-field": "Enter a number, such as 500 or 65.",
  "baking-ratios.error.nonpositive-dimension":
    "Flour must be more than zero, amounts cannot be negative, and finding flour needs a percentage above zero.",
  "baking-ratios.error.output-overflow":
    "The answer is outside the supported range.",
  "baking-ratios.visual.caption": "The ingredient measured against the flour",
  "baking-ratios.visual.flour": "Flour",
  "baking-ratios.visual.ingredient": "Ingredient",
  "baking-ratios.visual.share": "{percentage}% of flour",
  "baking-ratios.visual.reference": "100%, the reference",
  "baking-ratios.visual.summary":
    "{ingredient} g of ingredient is {percentage}% of {flour} g of flour.",
  "baking-ratios.visual.description":
    "Two bars on one scale: flour is the 100% reference and the ingredient bar is its baker's percentage of that length. Percentages above 100 draw a bar longer than the flour.",
  "baking-ratios.visual.alternative":
    "The weights and the percentage in the diagram are the same numbers stated in the answer and working.",
  "baking-ratios.intro.title": "Every ingredient as a share of flour",
  "baking-ratios.intro.body":
    "Bakers write recipes as percentages of flour weight. Flour is always 100%, and 65% water means 65 g of water for every 100 g of flour. Use it to read a recipe's hydration, scale a dough to any size, or work out how much flour pairs with a known ingredient.",
  "baking-ratios.mistakes.title": "Common mistakes",
  "baking-ratios.mistakes.body":
    "Baker's percentages do not add up to 100%. A dough with 500 g flour and 325 g water is 65% hydration, not 65% of the dough. Weigh everything in grams; cups make the ratios unreliable. When a recipe uses two flours, add them together as the 100%.",
  "baking-ratios.limits.title": "Assumptions and limits",
  "baking-ratios.limits.body":
    "Flour must be more than zero. Ingredient weights and percentages may be zero, except that finding flour needs a percentage above zero. Percentages above 100% are valid. Hydration here counts only the water you add, not the moisture already inside flour, eggs or milk.",
  "baking-ratios.faq.q": "What are typical baker's percentages?",
  "baking-ratios.faq.a":
    "A basic bread dough is often around 60 to 75% water, 2% salt and 1 to 2% instant yeast. Ciabatta can reach 80% water or more, while bagels sit closer to 55%.",
  "baking-ratios.sources.title": "Sources",
  "baking-ratios.sources.body":
    "Measurement conventions: NIST SP 811, https://www.nist.gov/pml/special-publication-811. The baker's percentage convention follows standard professional baking practice.",
} as const;
