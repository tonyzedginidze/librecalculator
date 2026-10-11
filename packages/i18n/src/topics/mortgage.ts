export const messages = {
  "unit.usd": "USD",
  "unit.percent": "percent (%)",
  "finance.money": "\u0024{amount}",
  "finance.money.negative": "\u2212\u0024{amount}",
  "finance.percent": "{value}%",
  "mortgage.operation.amortize": "Monthly payment",
  "mortgage.field.principal": "Loan amount",
  "mortgage.field.annualRate": "Interest rate",
  "mortgage.field.months": "Loan term",
  "mortgage.unit.months": "months (months)",
  "mortgage.ui.regular-payment": "Monthly payment",
  "mortgage.ui.final-payment": "Final payment",
  "mortgage.ui.total-interest": "Total interest",
  "mortgage.ui.total-paid": "Total of payments",
  "mortgage.ui.term": "Paid off after",
  "mortgage.ui.term.years": "{years} years",
  "mortgage.ui.term.months": "{months} months",
  "mortgage.ui.apr-disclosure":
    "Principal and interest only, at a fixed nominal rate. Property tax, insurance, PMI, HOA dues and fees are not included, and the rate is not an APR quote. Not financial advice.",
  "mortgage.ui.schedule.heading": "Schedule by year ({years} years)",
  "mortgage.ui.schedule.year": "Year",
  "mortgage.ui.schedule.interest": "Interest",
  "mortgage.ui.schedule.principal": "Principal",
  "mortgage.ui.schedule.balance": "Balance",
  "mortgage.visual.caption": "How much of what you repay is interest",
  "mortgage.visual.principal": "Loan amount",
  "mortgage.visual.interest": "Interest",
  "mortgage.visual.summary":
    "Over the term you repay {total}: {principal} of loan amount and {interest} of interest.",
  "mortgage.working.summary":
    "For a \u0024{principal} loan at {annualRate}% nominal annual interest over {months} months, the regular payment is \u0024{payment}, the adjusted final payment is \u0024{finalPayment}, and scheduled interest totals \u0024{interest}.",
  "mortgage.visual.description":
    "A bar splits the total of payments into the loan amount and the interest, summed from the cent-settled schedule.",
  "mortgage.visual.alternative":
    "The loan amount, total interest and total of payments are listed as exact dollar amounts; the yearly schedule lists interest, principal and the remaining balance, which ends at zero.",
  "mortgage.error.invalid-principal": "Enter a valid loan principal.",
  "mortgage.error.negative-principal": "Loan principal cannot be negative.",
  "mortgage.error.zero-principal": "Loan principal must be greater than zero.",
  "mortgage.error.fractional-cent-principal":
    "Enter a principal amount that is an exact number of cents.",
  "mortgage.error.principal-out-of-range":
    "The principal exceeds the supported USD amount.",
  "mortgage.error.invalid-rate": "Enter a valid annual rate.",
  "mortgage.error.rate-out-of-range":
    "The nominal annual rate must be between 0% and 100% inclusive.",
  "mortgage.error.invalid-months":
    "Enter a whole-number term from 1 through 1200 months.",
  "mortgage.error.non-amortizing-payment":
    "The cent-rounded payment does not reduce principal; this schedule cannot amortize the loan.",
  "mortgage.error.unrepresentable-schedule":
    "This term cannot be represented as monthly cent payments that clear the loan on the final month.",
  "mortgage.error.output-overflow":
    "A payment or schedule total exceeds the supported USD range.",
  "lesson.mortgage.unit.months": "months",
  "lesson.mortgage.intro.title": "How fixed-rate mortgage payments work",
  "lesson.mortgage.intro.body":
    "A fixed-rate mortgage repays financed property principal through monthly interest and principal payments. Early payments usually contain more interest because the balance is larger; as principal falls, the interest portion typically falls too. This calculator estimates a fixed nominal-rate monthly schedule, not an offer or a complete borrowing cost.",
  "lesson.mortgage.formula.payment":
    "M = P × i / (1 − (1 + i)^−N); i = R/1200; when R = 0, M = P/N",
  "lesson.mortgage.variable.principal": "original loan principal",
  "lesson.mortgage.variable.monthly-rate":
    "monthly rate as a decimal fraction; R is nominal annual rate percent and i = R/1200",
  "lesson.mortgage.variable.months": "number of monthly payments",
  "lesson.mortgage.variable.regular-payment":
    "unrounded level-payment estimate before cent settlement",
  "lesson.mortgage.example.zero-rate":
    "A $10.00 zero-interest loan over three months has two $3.33 payments and a $3.34 final payment.",
  "lesson.mortgage.example.one-month":
    "A $100.00 balance at 12% nominal annual interest for one month accrues $1.00 interest and is paid with $101.00.",
  "lesson.mortgage.example.amortization":
    "A $1,000.00 loan at 12% nominal annual interest over 12 months has $88.85 regular payments and an adjusted $88.84 final payment.",
  "lesson.mortgage.schedule.title": "Read the actual schedule",
  "lesson.mortgage.schedule.body":
    "The annuity formula supplies a high-precision estimate for the regular payment. The schedule then settles each month's interest to cents, subtracts that month's principal payment from the prior cent balance, and clears the remaining amount with the final payment. Total paid and total interest are sums of these schedule rows. They are not calculated from a second rounded formula.",
  "lesson.mortgage.settlement.title": "Why the final payment can differ",
  "lesson.mortgage.settlement.body":
    "The mathematical regular payment generally has fractions of a cent. Rounding it and every month's interest changes the cent balance slightly, so the last payment is adjusted to pay the remaining balance and that month's interest exactly. The calculator rejects cent schedules that fail to reduce principal or would pay off before the stated final month.",
  "lesson.mortgage.assumptions.title": "Scope and limitations",
  "lesson.mortgage.assumptions.body":
    "The principal is positive USD in whole cents, the nominal annual rate is fixed from 0% through 100%, and the term is 1–1200 months. The monthly rate is nominal annual rate divided by 12. The schedule assumes one payment each month, no fees, no extra payments, no variable-rate changes, and no taxes or insurance. The entered rate is not a regulated fee-inclusive APR, and this estimate is not a lender quote. Educational estimates only, not financial, tax or investment advice. Property taxes, insurance, escrow and closing costs need a separate budget.",
  "lesson.mortgage.faq.zero.q": "What happens when the rate is zero?",
  "lesson.mortgage.faq.zero.a":
    "The unrounded payment is principal divided by the number of months. That amount is settled to cents for regular payments, and any leftover cents are included in the adjusted final payment. For $10.00 over three months, the schedule is $3.33, $3.33, then $3.34.",
  "lesson.mortgage.faq.final.q": "Why isn't the last payment always the same?",
  "lesson.mortgage.faq.final.a":
    "Each regular payment and monthly interest amount is settled to cents. Those settlements can leave a small remainder, so the final payment is set to the remaining balance plus final-month interest. The schedule's last balance is exactly zero.",
  "lesson.mortgage.faq.apr.q": "Is the annual rate an APR?",
  "lesson.mortgage.faq.apr.a":
    "It is an entered nominal annual interest rate divided by 12 for the monthly model. It does not include fees and must not be interpreted as a regulated, fee-inclusive APR.",
  "lesson.mortgage.sources.title": "Formula and reference",
  "lesson.mortgage.sources.body":
    "This calculator uses the level-payment annuity relation M = P × i / (1 − (1 + i)^−N), with principal P, monthly rate i = R/1200, and N months. At zero rate, payment is P/N. Monthly interest is settled half-up to cents, and the final payment clears the remaining balance. For an educational explanation of how amortization allocates payments between interest and principal, see the Consumer Financial Protection Bureau (CFPB): https://www.consumerfinance.gov/ask-cfpb/what-is-amortization-and-how-could-it-affect-my-auto-loan-en-771/ . This reference explains payment allocation; it is not the source of the annuity equation above.",
} as const;
