export const messages = {
  "grade.operation.grade-percent": "Score as a percent",
  "grade.operation.grade-contribution": "Weighted contribution",
  "grade.operation.grade-required-points": "Points for a target",
  "grade.field.earned": "Points earned",
  "grade.field.possible": "Points possible",
  "grade.field.percentage": "Score",
  "grade.field.weight": "Weight in course",
  "grade.field.target": "Target score",
  "grade.unit.pts": "points (pts)",
  "grade.unit.pct": "percent (%)",
  "grade.answer.percent": "%",
  "grade.answer.points": "points",
  "grade.answer.course-points": "percentage points",
  "grade.working.grade-percent":
    "p = e ÷ t × 100 = {earned} ÷ {possible} × 100 = {answer}%",
  "grade.working.grade-contribution":
    "c = p × w ÷ 100 = {percentage} × {weight} ÷ 100 = {answer} percentage points",
  "grade.working.grade-required-points":
    "e = T × t ÷ 100 = {target} × {possible} ÷ 100 = {answer} points",
  "grade.formula.grade-percent": "p = e ÷ t × 100",
  "grade.formula.grade-contribution": "c = p × w ÷ 100",
  "grade.formula.grade-required-points": "e = T × t ÷ 100",
  "grade.symbol.p": "Score",
  "grade.symbol.e": "Points earned",
  "grade.symbol.t": "Points possible",
  "grade.symbol.c": "Contribution to the course grade",
  "grade.symbol.T": "Target score",
  "grade.example.grade-percent": "40 out of 50 points",
  "grade.example.grade-contribution": "An 80% score worth 30% of the course",
  "grade.example.grade-required-points": "An 80% target on a 50-point test",
  "grade.visual.caption.grade-percent": "Points earned out of points possible",
  "grade.visual.caption.grade-contribution":
    "What this assessment adds to the 100-point course grade",
  "grade.visual.caption.grade-required-points":
    "Points needed out of points possible",
  "grade.visual.caption.extra": "Extra credit takes the score past its total",
  "grade.visual.summary.grade-percent":
    "{earned} of {possible} points earned, {remainder} missed: {answer}%.",
  "grade.visual.summary.grade-contribution":
    "A {percentage}% score on an assessment worth {weight}% adds {answer} percentage points; {remainder} points of its weight were lost and {outside} points come from the rest of the course.",
  "grade.visual.summary.grade-required-points":
    "A {target}% target on {possible} points needs {answer} points, leaving {remainder} points of room.",
  "grade.visual.summary.extra":
    "The result {answer} exceeds the whole because extra credit is included.",
  "grade.visual.total.points": "Points possible",
  "grade.visual.total.course": "Course grade",
  "grade.visual.earned": "Earned",
  "grade.visual.missed": "Missed",
  "grade.visual.added": "Added by this score",
  "grade.visual.lost": "Lost within its weight",
  "grade.visual.outside": "Rest of the course",
  "grade.visual.needed": "Needed",
  "grade.visual.room": "Room to spare",
  "grade.visual.score": "Score",
  "grade.visual.weight": "Weight",
  "grade.visual.result": "Result",
  "grade.visual.lesson":
    "Under the answer, a bar splits the whole into its parts: points earned and missed, or what one weighted assessment adds to the course grade beside what it lost and what the rest of the course still decides.",
  "grade.visual.alternative":
    "The same numbers appear in the answer and working, so the diagram is never the only place to read them.",
  "grade.error.invalid-field": "Enter a number, such as 42 or 87.5.",
  "grade.error.invalid-domain":
    "Use scores of zero or more, points possible above zero and a weight from 0 to 100%.",
  "grade.error.output-overflow": "The answer is outside the supported range.",
  "grade.intro.title": "How grade percentages work",
  "grade.intro.body":
    "A score as a percent is points earned divided by points possible, times 100. When an assessment counts for part of a course, its contribution is that percent times its weight. Raw points, percentages and weights are different quantities, so the calculator keeps them apart.",
  "grade.mistakes.title": "Common mistakes",
  "grade.mistakes.body":
    "40 out of 50 is 80%, not 40%. If that test is worth 30% of the course, it adds 24 percentage points, not 80. A weighted contribution is one piece of the course grade, not the course grade itself.",
  "grade.limits.title": "Assumptions and limits",
  "grade.limits.body":
    "Points earned may exceed points possible to represent extra credit; nothing is capped. Points possible must be above zero, and weight lies from 0 to 100%. Letter-grade cutoffs and rounding rules belong to your institution.",
  "grade.faq.q": "How do the worked examples fit together?",
  "grade.faq.a":
    "40 out of 50 is 80%. An 80% test worth 30% of the course adds 24 percentage points. An 80% target on a 50-point test means 40 points.",
  "grade.sources.title": "Sources",
  "grade.sources.body":
    "Percentage and weighted-average arithmetic as in OpenStax Prealgebra 2e, https://openstax.org/details/books/prealgebra-2e. Your institution’s handbook decides cutoffs, rounding and weighting policy; this calculator does not replace those policies.",
} as const;
