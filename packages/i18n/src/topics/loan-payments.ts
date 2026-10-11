export const messages = {
  "unit.usd": "USD",
  "unit.percent": "percent (%)",
  "loan-payments.operation.amortize": "Estimate fixed-rate loan payments",
  "loan-payments.field.principal": "Loan amount",
  "loan-payments.field.annualRate": "Annual rate",
  "loan-payments.field.months": "Term",
  "loan-payments.unit.months": "Months (months)",
  "loan-payments.ui.regular-payment": "Monthly payment",
  "loan-payments.ui.final-payment": "Final payment",
  "loan-payments.ui.total-interest": "Total interest",
  "loan-payments.ui.total-paid": "Total paid",
  "loan-payments.ui.principal": "Loan amount",
  "loan-payments.ui.apr-disclosure":
    "Nominal annual rate. Excludes fees, taxes, and insurance; not a fee-inclusive APR quote.",
  "loan-payments.ui.schedule.heading": "Amortization schedule ({count} months)",
  "loan-payments.ui.schedule.month": "Month",
  "loan-payments.ui.schedule.payment": "Payment",
  "loan-payments.ui.schedule.interest": "Interest",
  "loan-payments.ui.schedule.principal": "Principal",
  "loan-payments.ui.schedule.balance": "Balance",
  "loan-payments.working.summary":
    "P = {principal}, i = {annualRate}% ÷ 12, N = {months}: M = P × i ÷ (1 − (1 + i)^−N) = {payment} a month. The final payment is {finalPayment}; interest totals {interest}.",
  "loan-payments.visual.caption": "Where the money you repay goes",
  "loan-payments.visual.summary":
    "A bar splits the {total} you repay into the {principal} borrowed and {interest} of interest.",
  "loan-payments.visual.description":
    "Total repaid split into the amount borrowed and the interest, with the month-by-month schedule.",
  "loan-payments.visual.alternative":
    "A bar shows the amount borrowed and the interest as parts of the total repaid. A month-by-month schedule lists each payment, its interest and principal portions, and the remaining balance; the final balance is zero.",
  "loan-payments.error.invalid-principal": "Enter a valid loan principal.",
  "loan-payments.error.negative-principal":
    "Loan principal cannot be negative.",
  "loan-payments.error.zero-principal":
    "Loan principal must be greater than zero.",
  "loan-payments.error.fractional-cent-principal":
    "Enter a principal amount that is an exact number of cents.",
  "loan-payments.error.principal-out-of-range":
    "The principal exceeds the supported USD amount.",
  "loan-payments.error.invalid-rate": "Enter a valid annual rate.",
  "loan-payments.error.rate-out-of-range":
    "The nominal annual rate must be between 0% and 100% inclusive.",
  "loan-payments.error.invalid-months":
    "Enter a whole-number term from 1 through 1200 months.",
  "loan-payments.error.non-amortizing-payment":
    "The cent-rounded payment does not reduce principal; this schedule cannot amortize the loan.",
  "loan-payments.error.unrepresentable-schedule":
    "This term cannot be represented as monthly cent payments that clear the loan on the final month.",
  "loan-payments.error.output-overflow":
    "A payment or schedule total exceeds the supported USD range.",
  "lesson.loan-payments.unit.months": "months",
  "lesson.loan-payments.intro.title": "How fixed-rate loan payments work",
  "lesson.loan-payments.intro.body":
    "A level-payment loan is designed so each regular payment covers that month's interest and pays down part of the balance. Early payments usually contain more interest because the balance is larger; as principal falls, the interest portion typically falls too. This calculator estimates a fixed nominal-rate monthly schedule, not an offer or a complete borrowing cost.",
  "lesson.loan-payments.formula.payment":
    "M = P × i / (1 − (1 + i)^−N); i = R/1200; when R = 0, M = P/N",
  "lesson.loan-payments.variable.principal": "original loan principal",
  "lesson.loan-payments.variable.monthly-rate":
    "monthly rate as a decimal fraction; R is nominal annual rate percent and i = R/1200",
  "lesson.loan-payments.variable.months": "number of monthly payments",
  "lesson.loan-payments.variable.regular-payment":
    "unrounded level-payment estimate before cent settlement",
  "lesson.loan-payments.example.zero-rate":
    "A $10.00 zero-interest loan over three months has two $3.33 payments and a $3.34 final payment.",
  "lesson.loan-payments.example.one-month":
    "A $100.00 balance at 12% nominal annual interest for one month accrues $1.00 interest and is paid with $101.00.",
  "lesson.loan-payments.example.amortization":
    "A $1,000.00 loan at 12% nominal annual interest over 12 months has $88.85 regular payments and an adjusted $88.84 final payment.",
  "lesson.loan-payments.schedule.title": "Read the actual schedule",
  "lesson.loan-payments.schedule.body":
    "The annuity formula supplies a high-precision estimate for the regular payment. The schedule then settles each month's interest to cents, subtracts that month's principal payment from the prior cent balance, and clears the remaining amount with the final payment. Total paid and total interest are sums of these schedule rows. They are not calculated from a second rounded formula.",
  "lesson.loan-payments.settlement.title": "Why the final payment can differ",
  "lesson.loan-payments.settlement.body":
    "The mathematical regular payment generally has fractions of a cent. Rounding it and every month's interest changes the cent balance slightly, so the last payment is adjusted to pay the remaining balance and that month's interest exactly. The calculator rejects cent schedules that fail to reduce principal or would pay off before the stated final month.",
  "lesson.loan-payments.assumptions.title": "Scope and limitations",
  "lesson.loan-payments.assumptions.body":
    "The principal is positive USD in whole cents, the nominal annual rate is fixed from 0% through 100%, and the term is 1–1200 months. The monthly rate is nominal annual rate divided by 12. The schedule assumes one payment each month, no fees, no extra payments, no variable-rate changes, and no taxes or insurance. The entered rate is not a regulated fee-inclusive APR, and this estimate is not a lender quote.",
  "lesson.loan-payments.faq.zero.q": "What happens when the rate is zero?",
  "lesson.loan-payments.faq.zero.a":
    "The unrounded payment is principal divided by the number of months. That amount is settled to cents for regular payments, and any leftover cents are included in the adjusted final payment. For $10.00 over three months, the schedule is $3.33, $3.33, then $3.34.",
  "lesson.loan-payments.faq.final.q":
    "Why isn't the last payment always the same?",
  "lesson.loan-payments.faq.final.a":
    "Each regular payment and monthly interest amount is settled to cents. Those settlements can leave a small remainder, so the final payment is set to the remaining balance plus final-month interest. The schedule's last balance is exactly zero.",
  "lesson.loan-payments.faq.apr.q": "Is the annual rate an APR?",
  "lesson.loan-payments.faq.apr.a":
    "It is an entered nominal annual interest rate divided by 12 for the monthly model. It does not include fees and must not be interpreted as a regulated, fee-inclusive APR.",
  "lesson.loan-payments.sources.title": "Formula and reference",
  "lesson.loan-payments.sources.body":
    "This calculator uses the level-payment annuity relation M = P × i / (1 − (1 + i)^−N), with principal P, monthly rate i = R/1200, and N months. At zero rate, payment is P/N. Monthly interest is settled half-up to cents, and the final payment clears the remaining balance. For an educational explanation of how amortization allocates payments between interest and principal, see the Consumer Financial Protection Bureau (CFPB): https://www.consumerfinance.gov/ask-cfpb/what-is-amortization-and-how-could-it-affect-my-auto-loan-en-771/ . This reference explains payment allocation; it is not the source of the annuity equation above.",
} as const;
