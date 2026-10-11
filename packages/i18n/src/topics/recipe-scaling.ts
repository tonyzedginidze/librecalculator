export const messages = {
  "recipe-scaling.field.quantity": "Ingredient amount",
  "recipe-scaling.field.scaledQuantity": "Scaled amount",
  "recipe-scaling.field.originalServings": "Recipe serves",
  "recipe-scaling.field.targetServings": "You want to serve",
  "recipe-scaling.unit.quantity": "Any unit",
  "recipe-scaling.unit.serving": "Servings (servings)",
  "recipe-scaling.answer.quantity": "In the same unit you entered.",
  "recipe-scaling.answer.factor": "×",
  "recipe-scaling.symbol.serving": "servings",
  "recipe-scaling.operation.recipe-scale": "Scale an ingredient",
  "recipe-scaling.working.recipe-scale":
    "Q′ = Q × s₂ ÷ s₁ = {quantity} × {targetServings} ÷ {originalServings} = {answer}",
  "recipe-scaling.formula.recipe-scale": "Q′ = Q × s₂ ÷ s₁",
  "recipe-scaling.example.recipe-scale":
    "250 g of flour in a 4-serving recipe, cooked for 12",
  "recipe-scaling.operation.recipe-factor": "Find the scale factor",
  "recipe-scaling.working.recipe-factor":
    "k = s₂ ÷ s₁ = {targetServings} ÷ {originalServings} = {answer}",
  "recipe-scaling.formula.recipe-factor": "k = s₂ ÷ s₁",
  "recipe-scaling.example.recipe-factor":
    "Turning a 4-serving recipe into 12 servings",
  "recipe-scaling.operation.recipe-reverse": "Recover the original",
  "recipe-scaling.working.recipe-reverse":
    "Q = Q′ × s₁ ÷ s₂ = {quantity} × {originalServings} ÷ {targetServings} = {answer}",
  "recipe-scaling.formula.recipe-reverse": "Q = Q′ × s₁ ÷ s₂",
  "recipe-scaling.example.recipe-reverse":
    "750 g in a recipe tripled from 4 to 12 servings",
  "recipe-scaling.variable.quantity": "Amount in the original recipe",
  "recipe-scaling.variable.scaled": "Amount in the scaled recipe",
  "recipe-scaling.variable.factor": "Scale factor",
  "recipe-scaling.error.invalid-field": "Enter a number, such as 250 or 1.5.",
  "recipe-scaling.error.nonpositive-dimension":
    "Servings must be more than zero, and the amount cannot be negative.",
  "recipe-scaling.error.output-overflow":
    "The answer is outside the supported range.",
  "recipe-scaling.visual.caption.recipe-scale":
    "The amount multiplied by the scale factor",
  "recipe-scaling.visual.caption.recipe-factor":
    "How many times bigger the new batch is",
  "recipe-scaling.visual.caption.recipe-reverse":
    "The scaled amount divided back by the factor",
  "recipe-scaling.visual.original": "For {servings} servings",
  "recipe-scaling.visual.scaled": "For {servings} servings",
  "recipe-scaling.visual.factor": "Scale factor",
  "recipe-scaling.visual.target": "Servings wanted",
  "recipe-scaling.visual.source": "Recipe serves",
  "recipe-scaling.visual.summary":
    "{original} for {originalServings} servings times a factor of {factor} gives {scaled} for {targetServings} servings.",
  "recipe-scaling.visual.summary.factor":
    "{targetServings} servings divided by {originalServings} servings gives a scale factor of {factor}.",
  "recipe-scaling.visual.description":
    "The diagram writes the scaling as one equation: the original amount, the factor (servings wanted divided by servings in the recipe) and the scaled amount.",
  "recipe-scaling.visual.alternative":
    "Every number in the equation also appears in the answer and the steps, in the unit you entered.",
  "recipe-scaling.intro.title": "Scale a recipe up or down",
  "recipe-scaling.intro.body":
    "To cook for more or fewer people, multiply every ingredient by the same scale factor: servings wanted divided by servings in the recipe. The amount keeps whatever unit you use, whether grams, cups or teaspoons. Work backwards to find the original amount from a scaled one.",
  "recipe-scaling.mistakes.title": "Common mistakes",
  "recipe-scaling.mistakes.body":
    "Cooking time, pan size and oven temperature do not scale by the same factor as ingredients. A deeper pan needs longer, not hotter. Scale each ingredient separately and round only when you measure. Salt, spices and leavening are often reduced slightly in very large batches; taste as you go.",
  "recipe-scaling.limits.title": "Assumptions and limits",
  "recipe-scaling.limits.body":
    "The amount may be zero; both serving counts must be more than zero and may be fractional, since half a batch is meaningful. The calculation is exact proportional arithmetic. It does not adjust timing, fermentation, seasoning or equipment capacity.",
  "recipe-scaling.faq.q": "Can I scale eggs and other whole items?",
  "recipe-scaling.faq.a":
    "Yes, but round to something you can use. Scaling 2 eggs by 1.5 gives 3 eggs; scaling 3 eggs by 1.5 gives 4.5, so beat 5 eggs and leave out about half of one, or weigh them (a large egg is roughly 50 g without the shell).",
  "recipe-scaling.sources.title": "Sources",
  "recipe-scaling.sources.body":
    "Measurement conventions: NIST SP 811, https://www.nist.gov/pml/special-publication-811.",
} as const;
