export const messages = {
  "unit.usd": "USD",
  "unit.percent": "percent (%)",
  "lesson.tip-splitting.unit.people": "people",
  "tip-splitting.operation.split": "Calculate tip and split the total",
  "tip-splitting.field.subtotal": "Bill",
  "tip-splitting.field.tipRate": "Tip",
  "tip-splitting.field.people": "People",
  "tip-splitting.ui.presets": "Common tips",
  "tip-splitting.ui.per-person": "Each person pays",
  "tip-splitting.ui.leftover-one":
    "One person pays {extraShare} so the cents add up to {total}.",
  "tip-splitting.ui.leftover-many":
    "{extraCount} people pay {extraShare} so the cents add up to {total}.",
  "tip-splitting.ui.tip-amount": "Tip",
  "tip-splitting.ui.total-bill": "Total with tip",
  "tip-splitting.ui.bill": "Bill",
  "tip-splitting.ui.people": "People",
  "tip-splitting.ui.each": "Each",
  "tip-splitting.working.summary":
    "{subtotal} + {tipRate}% tip ({tip}) = {total} for {people} people",
  "tip-splitting.working.even": "{total} ÷ {people} people = {baseShare} each",
  "tip-splitting.working.uneven":
    "{total} ÷ {people} people does not split evenly: {baseCount} × {baseShare} + {extraCount} × {extraShare} = {total}",
  "tip-splitting.working.single": "One person pays the whole {total}",
  "tip-splitting.visual.caption": "What the total is made of, and each share",
  "tip-splitting.visual.summary":
    "A bar splits the {total} total into the {subtotal} bill and the {tip} tip; divided by {people} people that is {share} each.",
  "tip-splitting.visual.description":
    "The total split into bill and tip, then divided by the number of people.",
  "tip-splitting.visual.alternative":
    "A bar shows the bill and the tip as parts of the total. Below it, the total divided by the number of people gives each share; when cents do not divide evenly, a few people pay one cent more so the shares add up exactly.",
  "tip-splitting.error.invalid-subtotal": "Enter a valid subtotal.",
  "tip-splitting.error.negative-subtotal": "The subtotal cannot be negative.",
  "tip-splitting.error.fractional-cent-subtotal":
    "Enter a subtotal that is an exact number of cents.",
  "tip-splitting.error.subtotal-out-of-range":
    "The subtotal exceeds the supported USD amount.",
  "tip-splitting.error.invalid-rate": "Enter a valid tip percentage.",
  "tip-splitting.error.rate-out-of-range":
    "The tip percentage must be between 0% and 1000% inclusive.",
  "tip-splitting.error.invalid-people":
    "Enter a whole number of people from 1 through 10000.",
  "tip-splitting.error.output-overflow":
    "The tipped total exceeds the supported USD amount.",
  "lesson.tip-splitting.intro.title": "Add a tip and divide the bill",
  "lesson.tip-splitting.intro.body":
    "This calculator applies the entered tip percentage to the subtotal you provide, rounds the total tip to cents once, and splits the resulting total among a whole number of people. It does not infer tax, decide what a customary tip should be, or know whether a gratuity was already included.",
  "lesson.tip-splitting.formula.split":
    "T = round-cent(S × p/100); G = S + T; cents(G) = q × N + r",
  "lesson.tip-splitting.variable.subtotal": "entered bill subtotal before tip",
  "lesson.tip-splitting.variable.rate": "tip rate as a percentage",
  "lesson.tip-splitting.variable.tip": "tip amount rounded once to cents",
  "lesson.tip-splitting.variable.people": "positive integer number of people",
  "lesson.tip-splitting.variable.total": "subtotal plus settled tip",
  "lesson.tip-splitting.example.remainder":
    "$10.00 with a 15% tip, split 3 ways",
  "lesson.tip-splitting.example.even": "$100.00 with a 20% tip, split 4 ways",
  "lesson.tip-splitting.example.zero": "$0.00 with a 1000% tip, 1 person",
  "lesson.tip-splitting.allocation.title": "How leftover cents are assigned",
  "lesson.tip-splitting.allocation.body":
    "After the tip is settled, convert USD total G to integer cents(G) and divide by people count N to obtain integer quotient q (base share in cents) and remainder r (0 ≤ r < N). Exactly N − r people receive q cents; the first r people receive q + 1 cents. The result reports only these two share groups and their counts, and their count-weighted sum equals cents(G) exactly.",
  "lesson.tip-splitting.rounding.title": "Tip rounding happens once",
  "lesson.tip-splitting.rounding.body":
    "The tip is calculated from the entered subtotal and percentage, then the total tip is rounded half-up to the nearest cent once. The settled tip is added to the subtotal before the split. Per-person rounding does not alter the total and cannot lose or create cents.",
  "lesson.tip-splitting.assumptions.title": "Assumptions and limits",
  "lesson.tip-splitting.assumptions.body":
    "Subtotal is nonnegative USD in whole cents, tip rate is 0%–1000%, and the number of people is 1–10000. The tip applies only to the supplied subtotal. No tax, fees, currency conversion, or already-included gratuity is inferred. The result is arithmetic allocation, not a recommendation about tipping.",
  "lesson.tip-splitting.faq.remainder.q":
    "Why can people have different shares?",
  "lesson.tip-splitting.faq.remainder.a":
    "A total in cents may not divide evenly by the number of people. To preserve the exact total, the first remainder shares are one cent higher; everyone else pays the base share. The count and both amounts are shown.",
  "lesson.tip-splitting.faq.tax.q": "Does the calculator include tax?",
  "lesson.tip-splitting.faq.tax.a":
    "No. The tip is calculated on the subtotal entered, and no separate tax amount is assumed or added. Include tax in your entered subtotal only if that is the basis you intend to use.",
  "lesson.tip-splitting.faq.included.q":
    "What if a gratuity is already on the bill?",
  "lesson.tip-splitting.faq.included.a":
    "The calculator cannot inspect a bill or detect an included gratuity. Check the bill first and avoid adding the same tip twice.",
  "lesson.tip-splitting.sources.title": "Rounding and allocation policy",
  "lesson.tip-splitting.sources.body":
    "Tip conventions vary by location and service; this calculator does not prescribe a customary rate. Its explicit policy is to settle the total tip once to cents and allocate any indivisible remainder as one cent to each of the first affected shares, preserving the exact total.",
} as const;
