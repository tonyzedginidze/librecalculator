export const messages = {
  "gpa.operation.gpa-average": "Term GPA",
  "gpa.operation.gpa-combined": "Combine two terms",
  "gpa.operation.gpa-target": "Points for a target",
  "gpa.field.qualityPoints": "Quality points",
  "gpa.field.credits": "Credits",
  "gpa.field.previousGpa": "Current GPA",
  "gpa.field.previousCredits": "Credits so far",
  "gpa.field.newGpa": "New term GPA",
  "gpa.field.newCredits": "New term credits",
  "gpa.field.targetGpa": "Target GPA",
  "gpa.field.totalCredits": "Credits",
  "gpa.unit.qp": "quality points (QP)",
  "gpa.unit.cr": "credits (cr)",
  "gpa.answer.gpa": "GPA",
  "gpa.answer.qp": "quality points",
  "gpa.working.gpa-average":
    "GPA = Q ÷ C = {qualityPoints} ÷ {credits} = {answer}",
  "gpa.working.gpa-combined":
    "GPA = (G₁ × C₁ + G₂ × C₂) ÷ (C₁ + C₂) = ({previousGpa} × {previousCredits} + {newGpa} × {newCredits}) ÷ ({previousCredits} + {newCredits}) = {answer}",
  "gpa.working.gpa-target":
    "Q = G × C = {targetGpa} × {totalCredits} = {answer} quality points",
  "gpa.formula.gpa-average": "GPA = Q ÷ C",
  "gpa.formula.gpa-combined": "GPA = (G₁ × C₁ + G₂ × C₂) ÷ (C₁ + C₂)",
  "gpa.formula.gpa-target": "Q = G × C",
  "gpa.example.gpa-average": "42 quality points over 12 credits",
  "gpa.example.gpa-combined": "Two 12-credit terms at 3.0 and 3.5",
  "gpa.example.gpa-target": "A 4.0 target over 12 credits",
  "gpa.visual.caption.gpa-average": "Quality points divided by credits",
  "gpa.visual.caption.gpa-combined":
    "The combined GPA leans toward the term with more credits",
  "gpa.visual.caption.gpa-target": "Target GPA times credits",
  "gpa.visual.summary.gpa-average":
    "{qualityPoints} quality points divided by {credits} credits gives a GPA of {answer}.",
  "gpa.visual.summary.gpa-combined":
    "A GPA of {previousGpa} over {previousCredits} credits and {newGpa} over {newCredits} credits combine to {answer}.",
  "gpa.visual.summary.gpa-target":
    "A {targetGpa} GPA over {totalCredits} credits needs {answer} quality points.",
  "gpa.visual.term": "{credits} credits",
  "gpa.visual.previous": "So far",
  "gpa.visual.new": "New term",
  "gpa.visual.combined": "Combined",
  "gpa.visual.qp": "Quality points",
  "gpa.visual.credits": "Credits",
  "gpa.visual.gpa": "GPA",
  "gpa.visual.target": "Target GPA",
  "gpa.visual.lesson":
    "Under the answer, the term GPA appears as quality points divided by credits. When two terms are combined, bars compare each term with the combined GPA, which always lands between them and nearer the term with more credits.",
  "gpa.visual.alternative":
    "The same numbers appear in the answer and working, so the diagram is never the only place to read them.",
  "gpa.error.invalid-field": "Enter a number, such as 3.5 or 15.",
  "gpa.error.invalid-domain":
    "Use zero or more grade points and more than zero credits.",
  "gpa.error.output-overflow": "The answer is outside the supported range.",
  "gpa.intro.title": "How GPA is calculated",
  "gpa.intro.body":
    "A grade point average is a credit-weighted average. Each course gives grade points times its credits, called quality points. Add the quality points, then divide by the credits that count toward GPA. Use your institution’s own grade-point scale; this calculator assumes no letter-grade conversion.",
  "gpa.mistakes.title": "Common mistakes",
  "gpa.mistakes.body":
    "Do not average term GPAs without weighting them by credits: a 15-credit term counts five times as much as a 3-credit term. Leave out pass/fail and other non-GPA courses the same way your institution does.",
  "gpa.limits.title": "Assumptions and limits",
  "gpa.limits.body":
    "Grade points and quality points are zero or more; credits are more than zero and may be fractional. Both terms must use the same grade-point scale. Repeat-course replacement, pass/fail exclusions and official transcript rounding are not applied.",
  "gpa.faq.q": "How do the worked examples fit together?",
  "gpa.faq.a":
    "42 quality points over 12 credits is a 3.5 GPA. Two 12-credit terms at 3.0 and 3.5 combine to 3.25, exactly halfway because the credits are equal. A 4.0 target over 12 credits needs 48 quality points.",
  "gpa.sources.title": "Sources",
  "gpa.sources.body":
    "Weighted-average arithmetic as in OpenStax Prealgebra 2e, https://openstax.org/details/books/prealgebra-2e. Your institution’s handbook decides grade-point values, GPA exclusions, rounding and thresholds; this calculator does not replace those policies.",
} as const;
