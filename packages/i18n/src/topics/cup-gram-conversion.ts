export const messages = {
  "cup-gram-conversion.field.cups": "Cups",
  "cup-gram-conversion.field.grams": "Weight",
  "cup-gram-conversion.field.gramsPerCup": "One cup weighs",
  "cup-gram-conversion.unit.cup": "Cups (cups)",
  "cup-gram-conversion.unit.gram": "Grams (g)",
  "cup-gram-conversion.unit.grams-per-cup": "Grams per cup (g/cup)",
  "cup-gram-conversion.answer.gram": "g",
  "cup-gram-conversion.answer.cups": "cups",
  "cup-gram-conversion.answer.cup": "cup",
  "cup-gram-conversion.answer.grams-per-cup": "g/cup",
  "cup-gram-conversion.variable.grams": "Weight",
  "cup-gram-conversion.variable.cups": "Volume in cups",
  "cup-gram-conversion.variable.half": "Weight of half a cup",
  "cup-gram-conversion.operation.cups-to-grams": "Cups to grams",
  "cup-gram-conversion.working.cups-to-grams":
    "m = c × k = {cups} × {gramsPerCup} g = {answer} g",
  "cup-gram-conversion.formula.cups-to-grams": "m = c × k",
  "cup-gram-conversion.example.cups-to-grams":
    "2 cups of flour at 120 g per cup",
  "cup-gram-conversion.operation.grams-to-cups": "Grams to cups",
  "cup-gram-conversion.working.grams-to-cups":
    "c = m ÷ k = {grams} g ÷ {gramsPerCup} g = {answer} cups",
  "cup-gram-conversion.formula.grams-to-cups": "c = m ÷ k",
  "cup-gram-conversion.example.grams-to-cups":
    "240 g of flour at 120 g per cup",
  "cup-gram-conversion.operation.half-cup-grams": "Half a cup",
  "cup-gram-conversion.working.half-cup-grams":
    "h = k ÷ 2 = {gramsPerCup} g ÷ 2 = {answer} g",
  "cup-gram-conversion.formula.half-cup-grams": "h = k ÷ 2",
  "cup-gram-conversion.example.half-cup-grams":
    "Half a cup of flour at 120 g per cup",
  "cup-gram-conversion.error.invalid-field":
    "Enter a number, such as 2 or 120.",
  "cup-gram-conversion.error.nonpositive-dimension":
    "The weight of one cup must be more than zero, and amounts cannot be negative.",
  "cup-gram-conversion.error.output-overflow":
    "The answer is outside the supported range.",
  "cup-gram-conversion.visual.caption":
    "The same amount on a cup scale and a gram scale",
  "cup-gram-conversion.visual.summary":
    "{cups} cups lines up with {grams} g when one cup weighs {gramsPerCup} g.",
  "cup-gram-conversion.visual.description":
    "Two rulers share one position: cups above, grams below. Each whole cup on the top ruler sits over the weight of one cup on the bottom ruler, so the marker reads the same amount in both units.",
  "cup-gram-conversion.visual.alternative":
    "The cups, grams and grams-per-cup values in the diagram are the same numbers stated in the answer and working.",
  "cup-gram-conversion.intro.title":
    "Cups measure volume, grams measure weight",
  "cup-gram-conversion.intro.body":
    "A cup of flour and a cup of sugar take up the same space but weigh different amounts. To convert, you need the weight of one cup of your ingredient, measured the way your recipe fills the cup. Enter it once and convert in either direction.",
  "cup-gram-conversion.mistakes.title": "Common mistakes",
  "cup-gram-conversion.mistakes.body":
    "Do not use one cup weight for every ingredient. Scooping flour straight from the bag packs it, so a cup can weigh 140 g instead of 120 g. US, metric and imperial cups also differ in size (about 237, 250 and 284 ml).",
  "cup-gram-conversion.limits.title": "Assumptions and limits",
  "cup-gram-conversion.limits.body":
    "The weight of one cup must be more than zero; cups and grams may be zero. The result is proportional to the cup weight you enter, so it is only as accurate as that number. The calculator does not hold a density table and does not guess.",
  "cup-gram-conversion.faq.q": "How much does a cup of flour weigh?",
  "cup-gram-conversion.faq.a":
    "Spooned into a US cup and levelled, all-purpose flour weighs about 120 to 125 g. Granulated sugar is closer to 200 g and water about 237 g. Weigh one cup of your own ingredient for the most reliable number.",
  "cup-gram-conversion.sources.title": "Sources",
  "cup-gram-conversion.sources.body":
    "Measurement conventions: NIST SP 811, https://www.nist.gov/pml/special-publication-811. US cup volume: NIST Handbook 133 and FDA labelling rules define the US cup as 240 ml for nutrition labels and about 236.6 ml as a customary unit.",
} as const;
