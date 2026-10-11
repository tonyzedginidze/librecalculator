export const messages = {
  "test-score.operation.test-percentage": "Score as a percent",
  "test-score.operation.test-missed": "Questions missed",
  "test-score.operation.test-needed": "Correct answers needed",
  "test-score.field.correct": "Correct answers",
  "test-score.field.questions": "Questions",
  "test-score.field.target": "Target score",
  "test-score.unit.pct": "percent (%)",
  "test-score.answer.percent": "%",
  "test-score.answer.missed": "missed",
  "test-score.answer.needed": "correct answers",
  "test-score.working.test-percentage":
    "s = k ÷ n × 100 = {correct} ÷ {questions} × 100 = {answer}%",
  "test-score.working.test-missed":
    "m = n − k = {questions} − {correct} = {answer}",
  "test-score.working.test-needed":
    "k = ⌈T × n ÷ 100⌉ = ⌈{target} × {questions} ÷ 100⌉ = {answer}",
  "test-score.formula.test-percentage": "s = k ÷ n × 100",
  "test-score.formula.test-missed": "m = n − k",
  "test-score.formula.test-needed": "k = ⌈T × n ÷ 100⌉",
  "test-score.symbol.s": "Score",
  "test-score.symbol.m": "Questions missed",
  "test-score.symbol.k-min": "Fewest correct answers that reach the target",
  "test-score.example.test-percentage": "16 right out of 20",
  "test-score.example.test-missed": "20 questions, 16 right",
  "test-score.example.test-needed": "An 80% target on 20 questions",
  "test-score.visual.caption.test-percentage":
    "Each square is one question; filled squares are correct",
  "test-score.visual.caption.test-missed":
    "Each square is one question; empty squares were missed",
  "test-score.visual.caption.test-needed":
    "Each square is one question; fill these to reach the target",
  "test-score.visual.summary.test-percentage":
    "{correct} of {questions} questions correct, a score of {answer}%.",
  "test-score.visual.summary.test-missed":
    "{correct} of {questions} questions correct, so {answer} missed.",
  "test-score.visual.summary.test-needed":
    "At least {answer} of {questions} questions must be correct to reach {target}%.",
  "test-score.visual.grid": "{filled} of {total}",
  "test-score.visual.correct": "correct",
  "test-score.visual.missed": "{missed} missed",
  "test-score.visual.needed": "needed for {target}%",
  "test-score.visual.lesson":
    "Under the answer, a grid draws one square per question when the test has 200 questions or fewer. Filled squares are correct answers, or the fewest correct answers that reach the target.",
  "test-score.visual.alternative":
    "The same numbers appear in the answer and the steps, so the diagram is never the only place to read them.",
  "test-score.error.invalid-field": "Enter a whole number, such as 20.",
  "test-score.error.invalid-domain":
    "Use 1 to 1,000,000 questions, correct answers from 0 to the number of questions, and a target from 0 to 100%.",
  "test-score.error.output-overflow":
    "The answer is outside the supported range.",
  "test-score.intro.title": "How test scores are calculated",
  "test-score.intro.body":
    "Turn correct answers into a percent, count the questions missed, or find the fewest correct answers that reach a target. Every question counts the same and is either right or wrong.",
  "test-score.mistakes.title": "Common mistakes",
  "test-score.mistakes.body":
    "Round the correct answers needed up, never to the nearest whole number: a target can fall between two counts. Partial credit, negative marking and questions worth different points need the grade calculator instead.",
  "test-score.limits.title": "Assumptions and limits",
  "test-score.limits.body":
    "The test has 1 to 1,000,000 questions. Correct answers are a whole number from zero to the number of questions, and the target is 0 to 100%. Counts stay exact; percentages are not rounded in the steps.",
  "test-score.faq.q": "How do the worked examples fit together?",
  "test-score.faq.a":
    "16 right out of 20 is 80%, with 4 missed. An 80% target needs at least 16 right. A 75% target on a 7-question test needs 6 right, because 5 right is only 71.4%.",
  "test-score.sources.title": "Sources",
  "test-score.sources.body":
    "Percentage arithmetic as in OpenStax Prealgebra 2e, https://openstax.org/details/books/prealgebra-2e. Your teacher or institution decides pass marks and rounding; this calculator does not replace those policies.",
} as const;
