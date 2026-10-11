export const messages = {
  "final-grade.operation.final-required": "Score needed on the final",
  "final-grade.operation.final-projected": "Projected course grade",
  "final-grade.operation.final-current-needed": "Coursework grade needed",
  "final-grade.field.current": "Current grade",
  "final-grade.field.target": "Target grade",
  "final-grade.field.finalScore": "Final exam score",
  "final-grade.field.finalWeight": "Final exam weight",
  "final-grade.unit.pct": "percent (%)",
  "final-grade.answer.percent": "%",
  "final-grade.working.final-required":
    "f = (T − c × (1 − w)) ÷ w = ({target} − {current} × (1 − {finalWeight}%)) ÷ {finalWeight}% = {answer}%",
  "final-grade.working.final-projected":
    "G = c × (1 − w) + f × w = {current} × (1 − {finalWeight}%) + {finalScore} × {finalWeight}% = {answer}%",
  "final-grade.working.final-current-needed":
    "c = (T − f × w) ÷ (1 − w) = ({target} − {finalScore} × {finalWeight}%) ÷ (1 − {finalWeight}%) = {answer}%",
  "final-grade.formula.final-required": "f = (T − c × (1 − w)) ÷ w",
  "final-grade.formula.final-projected": "G = c × (1 − w) + f × w",
  "final-grade.formula.final-current-needed": "c = (T − f × w) ÷ (1 − w)",
  "final-grade.symbol.w": "Final exam weight, as a fraction (30% = 0.3)",
  "final-grade.symbol.G": "Course grade",
  "final-grade.example.final-required":
    "From 80% to 83% with a final worth 30%",
  "final-grade.example.final-projected": "80% coursework and a 90% final",
  "final-grade.example.final-current-needed": "An 83% target after a 90% final",
  "final-grade.visual.caption.final-required":
    "The final has to pull your grade from where it is to the target",
  "final-grade.visual.caption.final-projected":
    "The course grade lands between coursework and the final",
  "final-grade.visual.caption.final-current-needed":
    "Coursework has to make up the rest of the target",
  "final-grade.visual.summary.final-required":
    "From a current {current}% to a target {target}%, a final worth {finalWeight}% needs {answer}%.",
  "final-grade.visual.summary.final-projected":
    "Coursework at {current}% and a final at {finalScore}%, worth {finalWeight}%, give {answer}% overall.",
  "final-grade.visual.summary.final-current-needed":
    "With a {finalScore}% final worth {finalWeight}%, reaching {target}% needs {answer}% on coursework.",
  "final-grade.visual.current": "Now",
  "final-grade.visual.target": "Target",
  "final-grade.visual.final": "Final",
  "final-grade.visual.course": "Course",
  "final-grade.visual.needed": "Needed",
  "final-grade.visual.coursework": "Coursework",
  "final-grade.visual.over": "Above 100% needs extra credit",
  "final-grade.visual.under": "Below 0%: even a zero meets the target",
  "final-grade.visual.lesson":
    "Under the answer, a percent scale marks the inputs and the result. The course grade is a weighted average, so it always sits between the coursework grade and the final exam score; the heavier the final, the closer it pulls.",
  "final-grade.visual.alternative":
    "The same numbers appear in the answer and working, so the diagram is never the only place to read them.",
  "final-grade.error.invalid-field": "Enter a number, such as 82 or 87.5.",
  "final-grade.error.invalid-domain":
    "Use grades of zero or more and a weight from 0 to 100%, above 0 to solve for the final and below 100 to solve for coursework.",
  "final-grade.error.output-overflow":
    "The answer is outside the supported range.",
  "final-grade.intro.title": "How the final exam changes your grade",
  "final-grade.intro.body":
    "Your course grade is a weighted average of coursework and the final exam. Find the final score you need for a target, project the course grade from a final score, or find the coursework grade a target needs. Current grade means your average on everything except the final.",
  "final-grade.mistakes.title": "Common mistakes",
  "final-grade.mistakes.body":
    "Enter the final’s weight as a share of the whole course. Do not use a current grade that already counts the unwritten final as zero. A required score above 100% needs extra credit; a negative one means even a zero would reach the target.",
  "final-grade.limits.title": "Assumptions and limits",
  "final-grade.limits.body":
    "Grades and targets are zero or more and may exceed 100% for extra credit. Weight lies from 0 to 100%: above 0 to solve for the final, below 100 to solve for coursework. Results above 100 or below 0 are shown as they are, not clamped. No letter-grade, rounding or curve policy is assumed.",
  "final-grade.faq.q": "How do the worked examples fit together?",
  "final-grade.faq.a":
    "With coursework at 80% and a final worth 30%, a 90% exam gives 83% overall. To reach 83% you need 90% on the final, and with a 90% final, 83% needs 80% coursework.",
  "final-grade.sources.title": "Sources",
  "final-grade.sources.body":
    "Weighted-average arithmetic as in OpenStax Prealgebra 2e, https://openstax.org/details/books/prealgebra-2e. Your syllabus and institution decide weights, rounding and curves; this calculator does not replace those policies.",
} as const;
