export const messages = {
  "unit.percent": "percent (%)",
  "percentage-change.operation.change": "Calculate percentage change",
  "percentage-change.field.oldValue": "Old value",
  "percentage-change.field.newValue": "New value",
  "percentage-change.working.change":
    "{newValue} − {oldValue} = {delta}; {delta} ÷ {oldValue} × 100 = {percentage}%. {interpretation}",
  "percentage-change.working.negativeBaselineNote":
    "Because the baseline is negative, a positive percentage change does not necessarily mean the new value is larger.",
  "percentage-change.working.standardBaselineNote":
    "The old value is the baseline.",
  "percentage-change.visual.description":
    "Two bars on one scale compare the old value with the new value; the gap between them is the difference that the percentage measures against the old value.",
  "percentage-change.visual.alternative":
    "The comparison identifies the old baseline, new value, signed difference, and signed percentage. When the old baseline is negative, the percentage sign alone does not indicate whether the new value is larger.",
  "percentage-change.error.invalid-field":
    "Enter a valid signed decimal value.",
  "percentage-change.error.zero-baseline":
    "The old value must be nonzero because percentage change is undefined for a zero baseline.",
  "percentage-change.error.output-overflow":
    "The difference or percentage change is outside the supported numeric range.",
  "lesson.percentage-change.intro.title":
    "Compare a new value with its baseline",
  "lesson.percentage-change.intro.body":
    "Percentage change describes a signed difference relative to an old, nonzero baseline. The calculator reports both the actual difference and the percentage. Keeping both helps distinguish the direction and size of a change from the convention used to scale it.",
  "lesson.percentage-change.formula.change":
    "Δ = N − O; c = (N − O) ÷ O × 100%",
  "lesson.percentage-change.variable.old": "old signed baseline, with O ≠ 0",
  "lesson.percentage-change.variable.new": "new signed value",
  "lesson.percentage-change.variable.delta": "signed difference, new minus old",
  "lesson.percentage-change.variable.change":
    "signed percentage change relative to the old baseline",
  "lesson.percentage-change.example.increase":
    "A move from 100 to 125 has a difference of 25 and a 25% change.",
  "lesson.percentage-change.example.negative-toward-zero":
    "Moving from −100 to −50 increases the value by 50, but the signed percentage change is −50% because the baseline is −100.",
  "lesson.percentage-change.example.negative-away-zero":
    "Moving from −100 to −150 has a difference of −50 and a +50% change relative to the negative baseline.",
  "lesson.percentage-change.example.to-zero":
    "Moving from 50 to zero has a difference of −50 and a −100% change.",
  "lesson.percentage-change.interpretation.title":
    "Interpret the signed baseline",
  "lesson.percentage-change.interpretation.body":
    "The denominator is the old value itself, not its absolute value. With a positive baseline, the percentage sign and delta sign agree. With a negative baseline, they are opposite: moving from −100 to −50 gives delta +50 and percentage change −50%; moving from −100 to −150 gives delta −50 and percentage change +50%. A positive percentage with a negative baseline therefore need not mean that the new value is larger. Inspect both the returned delta and the baseline sign.",
  "lesson.percentage-change.mistakes.title": "Common interpretation errors",
  "lesson.percentage-change.mistakes.body":
    "Do not divide by the new value or by the absolute value of the old value: the stated convention uses the signed old baseline. Do not confuse percentage change with the new value itself or with the absolute difference. A positive rate is not automatically an increase when the baseline is negative. Always read the actual delta alongside the rate.",
  "lesson.percentage-change.limits.title": "Assumptions and numeric limits",
  "lesson.percentage-change.limits.body":
    "Inputs are signed canonical decimal values parsed by the shared 30-significant-digit parser; calculations use its 50-significant-digit Decimal precision and retain the signed baseline. Old value zero is rejected. Outputs outside the shared decimal exponent bound are rejected. This arithmetic convention does not determine whether a real-world quantity is beneficial, harmful, or meaningful on a ratio scale.",
  "lesson.percentage-change.faq.baseline.q":
    "Why does a positive percentage not always mean an increase?",
  "lesson.percentage-change.faq.baseline.a":
    "The formula divides the signed difference by the old value. A negative old baseline reverses the percentage sign relative to the difference: −100 to −150 has a negative difference but positive percentage change. Check the actual delta and both values.",
  "lesson.percentage-change.faq.zero.q": "Why is a zero old value rejected?",
  "lesson.percentage-change.faq.zero.a":
    "The percentage formula divides by the old baseline. Division by zero is undefined, so no finite percentage change is defined from zero by this convention.",
  "lesson.percentage-change.faq.negative.q":
    "Does the negative-baseline convention use absolute values?",
  "lesson.percentage-change.faq.negative.a":
    "No. The denominator remains the signed old value. Replacing it with its absolute value would define a different measure and conceal the convention used here.",
  "lesson.percentage-change.sources.title": "Formula reference",
  "lesson.percentage-change.sources.body":
    "The percent-of-change setup follows the standard difference-over-reference ratio described in OpenStax Prealgebra 2e, section 6.3, “Solve General Applications of Percent”: https://openstax.org/books/prealgebra-2e/pages/6-3-solve-general-applications-of-percent. The signed-baseline interpretation and examples here are explicitly defined for this calculator; the formula is not a judgment about good or bad outcomes.",
  "percentage-change.answer.delta": "Difference {delta}",
  "percentage-change.visual.caption": "Old value against new value",
  "percentage-change.visual.old": "Old value",
  "percentage-change.visual.new": "New value",
  "percentage-change.visual.increase":
    "An increase of {magnitude}, which is {magnitudePercent}% of the old value.",
  "percentage-change.visual.decrease":
    "A decrease of {magnitude}, which is {magnitudePercent}% of the old value.",
  "percentage-change.visual.increase.negative":
    "An increase of {magnitude}; against a negative old value that is {percentage}%.",
  "percentage-change.visual.decrease.negative":
    "A decrease of {magnitude}; against a negative old value that is {percentage}%.",
  "percentage-change.visual.same": "No change: the two values are equal.",
  "percentage-change.visual.summary":
    "Bars compare the old value {oldValue} with the new value {newValue}: a difference of {delta}, or {percentage}%.",
} as const;
