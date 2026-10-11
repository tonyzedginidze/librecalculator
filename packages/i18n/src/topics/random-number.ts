export const messages = {
  "random-number.operation.seeded-integer": "Pick a whole number",
  "random-number.field.minimum": "From",
  "random-number.field.maximum": "To",
  "random-number.field.seed": "Seed",
  "random-number.field.nextSeed": "Next seed",
  "random-number.working.seeded-integer":
    "Seed {seed} → {nextSeed}; {minimum} + ({nextSeed} mod ({maximum} − {minimum} + 1)) = {answer}. Use {nextSeed} as the next seed for another pick.",
  "random-number.result": "Result",
  "random-number.error.invalid-field": "Enter a whole number in every field.",
  "random-number.error.invalid-domain":
    "Use whole numbers between −1,000,000,000 and 1,000,000,000 with From no larger than To, and a seed from 1 to 2,147,483,646.",
  "random-number.error.output-overflow":
    "The result is outside the supported range.",
  "random-number.visual.caption": "Where the pick lands in your range",
  "random-number.visual.pick": "Pick",
  "random-number.visual.range":
    "{count} whole numbers from {minimum} to {maximum} could be picked. Change the seed for another pick.",
  "random-number.visual.summary":
    "The pick {answer} lies in the range {minimum} to {maximum}, which holds {count} whole numbers.",
  "random-number.visual.description":
    "The range from the smallest to the largest allowed number, with the pick marked.",
  "random-number.visual.alternative":
    "A number line runs from the smallest to the largest allowed whole number and a marker shows the pick. The exact numbers are stated in the answer and working.",
  "lesson.random-number.formula.seeded-integer":
    "s′ = (16807 × s) mod 2147483647; r = a + (s′ mod (b − a + 1))",
  "lesson.random-number.variable.result": "picked number",
  "lesson.random-number.variable.seed": "seed",
  "lesson.random-number.variable.nextSeed": "next seed",
  "lesson.random-number.variable.min": "smallest allowed number",
  "lesson.random-number.variable.max": "largest allowed number",
  "lesson.random-number.intro.title": "A repeatable random pick",
  "lesson.random-number.intro.body":
    "A seeded picker makes the same choice whenever its seed and range are the same. This is useful for reproducible examples, casual games and repeatable demonstrations. Change the seed to make another deterministic choice.",
  "lesson.random-number.meaning.title": "Range and seed",
  "lesson.random-number.meaning.body":
    "Enter the smallest and largest whole numbers you allow (both included) and a seed from 1 to 2,147,483,646. The same range and seed always give the same pick, so a result can be checked or shared. For a new pick, change the seed or enter the next seed shown in the working. The calculator never reads the clock or system randomness.",
  "lesson.random-number.example.0": "First seeded six-sided pick",
  "lesson.random-number.example.1": "A range containing one number",
  "lesson.random-number.example.2": "Second seed on a ten-number range",
  "lesson.random-number.mistakes.title": "Common mistakes",
  "lesson.random-number.mistakes.body":
    "Reusing a seed deliberately repeats a result. The maximum endpoint is included. This simple generator is predictable and has small modulo bias; do not use it for security, lotteries, statistical sampling or decisions requiring verified fairness.",
  "lesson.random-number.limits.title": "Assumptions and limits",
  "lesson.random-number.limits.body":
    "Uses Park–Miller recurrence next = seed × 16807 mod 2147483647, then minimum + (next mod range size). It is a pedagogical pseudorandom mapping, not true randomness or cryptographic entropy. Results stay in the requested inclusive interval. Numeric observations use up to 30 significant input digits and 50 working digits; no presentation rounding enters the calculation.",
  "lesson.random-number.sources.title": "Sources",
  "lesson.random-number.sources.body":
    "Park and Miller, Random Number Generators: Good Ones Are Hard to Find, Communications of the ACM 31 (1988). Recurrence and all example modular products are explicitly documented here.",
  "lesson.random-number.faq.q": "Why does clicking again give the same number?",
  "lesson.random-number.faq.a":
    "The calculator is reproducible by design. Enter the displayed next seed, or choose another seed, to advance the deterministic sequence.",
} as const;
