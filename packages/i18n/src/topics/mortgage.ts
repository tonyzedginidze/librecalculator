export const messages = {
  "unit.usd": "USD",
  "unit.percent": "percent (%)",
  "finance.money": "\u0024{amount}",
  "finance.money.negative": "\u2212\u0024{amount}",
  "finance.percent": "{value}%",
  "mortgage.operation.amortize": "Monthly payment",
  "mortgage.field.homePrice": "Home price",
  "mortgage.field.downPayment": "Down payment",
  "mortgage.field.annualRate": "Interest rate",
  "mortgage.field.years": "Loan term",
  "mortgage.field.propertyTax": "Property tax",
  "mortgage.field.homeInsurance": "Home insurance",
  "mortgage.field.hoa": "HOA dues",
  "mortgage.unit.years": "years (years)",
  "mortgage.unit.per-year": "dollars per year ($/yr)",
  "mortgage.unit.per-month": "dollars per month ($/mo)",
  "mortgage.ui.regular-payment": "Monthly principal and interest",
  "mortgage.ui.total-monthly": "Total monthly payment",
  "mortgage.ui.principal-interest": "Principal and interest",
  "mortgage.ui.loan-amount": "Loan amount",
  "mortgage.ui.loan-amount.value": "{loan} ({percent} down)",
  "mortgage.ui.final-payment": "Final payment",
  "mortgage.ui.total-interest": "Total interest",
  "mortgage.ui.total-paid": "Total of loan payments",
  "mortgage.ui.term": "Paid off after",
  "mortgage.ui.term.years": "{years} years",
  "mortgage.ui.apr-disclosure":
    "Property tax, insurance and HOA are your own estimates, spread evenly over 12 months; leave them blank to see principal and interest only. PMI, closing costs and fees are not included, and the rate is not an APR quote. Not financial advice.",
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
  "mortgage.visual.monthly.caption": "Where each monthly payment goes",
  "mortgage.visual.monthly.tax": "Property tax",
  "mortgage.visual.monthly.insurance": "Home insurance",
  "mortgage.visual.monthly.hoa": "HOA dues",
  "mortgage.visual.monthly.summary":
    "Each month you pay {total}: {payment} principal and interest, {tax} property tax, {insurance} home insurance and {hoa} HOA dues.",
  "mortgage.working.loan":
    "Loan amount: \u0024{homePrice} home price − \u0024{downPayment} down payment = \u0024{loan}.",
  "mortgage.working.payment":
    "Borrowing \u0024{loan} at {annualRate}% a year for {years} years means {months} monthly payments of \u0024{payment} for principal and interest.",
  "mortgage.working.final-payment":
    "Rounding each month to the cent leaves a small difference, so the last payment is \u0024{finalPayment}.",
  "mortgage.working.totals":
    "Adding up the schedule, you repay \u0024{totalPaid} in total, of which \u0024{interest} is interest.",
  "mortgage.working.costs":
    "Monthly costs: \u0024{propertyTax} property tax ÷ 12 = \u0024{monthlyTax}, and \u0024{homeInsurance} home insurance ÷ 12 = \u0024{monthlyInsurance}.",
  "mortgage.working.total-monthly":
    "Total monthly payment: \u0024{payment} + \u0024{monthlyTax} + \u0024{monthlyInsurance} + \u0024{hoa} HOA = \u0024{totalMonthly}.",
  "mortgage.visual.description":
    "A bar splits the total of loan payments into the loan amount and the interest, summed from the cent-settled schedule. When you enter tax, insurance or HOA, a second bar splits the monthly payment into those parts.",
  "mortgage.visual.alternative":
    "The loan amount, total interest and total of loan payments are listed as exact dollar amounts; the monthly breakdown lists each part of the payment; the yearly schedule lists interest, principal and the remaining balance, which ends at zero.",
  "mortgage.error.invalid-home-price": "Enter a valid home price.",
  "mortgage.error.negative-home-price": "The home price cannot be negative.",
  "mortgage.error.zero-home-price": "The home price must be greater than zero.",
  "mortgage.error.fractional-cent-home-price":
    "Enter a home price that is an exact number of cents.",
  "mortgage.error.home-price-out-of-range":
    "The home price exceeds the supported USD amount.",
  "mortgage.error.invalid-down-payment": "Enter a valid down payment.",
  "mortgage.error.negative-down-payment":
    "The down payment cannot be negative.",
  "mortgage.error.fractional-cent-down-payment":
    "Enter a down payment that is an exact number of cents.",
  "mortgage.error.down-payment-out-of-range":
    "The down payment exceeds the supported USD amount.",
  "mortgage.error.down-payment-not-below-price":
    "The down payment must be less than the home price, or there is no loan.",
  "mortgage.error.invalid-rate": "Enter a valid annual rate.",
  "mortgage.error.rate-out-of-range":
    "The interest rate must be between 0% and 100% inclusive.",
  "mortgage.error.invalid-years":
    "Enter a whole-number term from 1 through 100 years.",
  "mortgage.error.invalid-property-tax":
    "Enter a valid yearly property tax, or leave it blank.",
  "mortgage.error.negative-property-tax": "Property tax cannot be negative.",
  "mortgage.error.fractional-cent-property-tax":
    "Enter a property tax that is an exact number of cents.",
  "mortgage.error.property-tax-out-of-range":
    "The property tax exceeds the supported USD amount.",
  "mortgage.error.invalid-home-insurance":
    "Enter a valid yearly home insurance cost, or leave it blank.",
  "mortgage.error.negative-home-insurance":
    "Home insurance cannot be negative.",
  "mortgage.error.fractional-cent-home-insurance":
    "Enter a home insurance cost that is an exact number of cents.",
  "mortgage.error.home-insurance-out-of-range":
    "The home insurance cost exceeds the supported USD amount.",
  "mortgage.error.invalid-hoa":
    "Enter valid monthly HOA dues, or leave them blank.",
  "mortgage.error.negative-hoa": "HOA dues cannot be negative.",
  "mortgage.error.fractional-cent-hoa":
    "Enter HOA dues that are an exact number of cents.",
  "mortgage.error.hoa-out-of-range":
    "The HOA dues exceed the supported USD amount.",
  "mortgage.error.non-amortizing-payment":
    "The cent-rounded payment does not reduce the loan; this schedule cannot pay it off.",
  "mortgage.error.unrepresentable-schedule":
    "This term cannot be represented as monthly cent payments that clear the loan on the final month.",
  "mortgage.error.output-overflow":
    "A payment or schedule total exceeds the supported USD range.",
  "lesson.mortgage.unit.months": "months",
  "lesson.mortgage.intro.title": "How a fixed-rate mortgage payment works",
  "lesson.mortgage.intro.body":
    "You borrow the home price minus your down payment. A fixed-rate mortgage repays that loan with the same monthly principal and interest payment for the whole term, usually 30 or 15 years. Early payments are mostly interest because the balance is large; as the balance falls, more of each payment goes to principal. Many lenders also collect property tax and home insurance with the payment, and some homes have HOA dues, so the amount you actually pay each month is higher than principal and interest alone.",
  "lesson.mortgage.formula.payment":
    "P = home price − down payment; M = P × i / (1 − (1 + i)^−N); i = R/1200; N = 12 × years; when R = 0, M = P/N",
  "lesson.mortgage.variable.principal":
    "loan amount: home price minus down payment",
  "lesson.mortgage.variable.monthly-rate":
    "monthly rate as a decimal fraction; R is the annual interest rate in percent and i = R/1200",
  "lesson.mortgage.variable.months":
    "number of monthly payments, 12 for each year of the term",
  "lesson.mortgage.variable.regular-payment":
    "monthly principal and interest before rounding to the cent",
  "lesson.mortgage.formula.total.title": "Your total monthly payment",
  "lesson.mortgage.formula.total.body":
    "Total monthly payment = M + property tax ÷ 12 + home insurance ÷ 12 + HOA dues. Property tax and insurance are usually quoted per year, so each is divided by 12 and rounded to the cent. HOA dues are already monthly. Leave any of them blank if they do not apply or you pay them separately.",
  "lesson.mortgage.example.typical": "Example: $320,000 at 6.5% for 30 years",
  "lesson.mortgage.example.costs": "Example: adding tax, insurance and HOA",
  "lesson.mortgage.example.fifteen": "Example: the same loan over 15 years",
  "lesson.mortgage.example.one-year": "Example: $1,000 at 12% for one year",
  "lesson.mortgage.example.typical.body":
    "A $400,000 home with $80,000 (20%) down leaves a $320,000 loan. At 6.5% for 30 years, principal and interest come to $2,022.62 a month, and about $408,000 of the total repaid is interest.",
  "lesson.mortgage.example.costs.body":
    "Add $4,800 a year in property tax, $1,500 a year in home insurance and $50 a month in HOA dues to the same loan. Tax adds $400 and insurance $125 a month, so the total monthly payment is $2,597.62.",
  "lesson.mortgage.example.one-year.body":
    "A small loan shows the cent rounding clearly. Twelve monthly payments of $88.85 would overpay by a cent, so the final payment is $88.84 and the total repaid is $1,066.19.",
  "lesson.mortgage.example.fifteen.body":
    "Shortening the term to 15 years raises the payment to $2,787.54 but cuts total interest from $408,140.64 to $181,758.21.",
  "lesson.mortgage.schedule.title": "Read the actual schedule",
  "lesson.mortgage.schedule.body":
    "The formula gives a high-precision regular payment, which is rounded to the cent. The schedule then rounds each month's interest to the cent, subtracts the principal part of the payment from the balance, and lets the final payment clear whatever is left. Total paid and total interest are sums of these schedule rows, not a second rounded formula.",
  "lesson.mortgage.settlement.title": "Why the final payment can differ",
  "lesson.mortgage.settlement.body":
    "The mathematical payment usually has fractions of a cent. Rounding it and every month's interest shifts the balance slightly, so the last payment is adjusted to pay the remaining balance and that month's interest exactly. The calculator rejects cent schedules that fail to reduce the loan or would pay it off before the final month.",
  "lesson.mortgage.assumptions.title": "Scope and limitations",
  "lesson.mortgage.assumptions.body":
    "The home price is positive USD in whole cents, the down payment is zero or more and less than the price, the annual rate is fixed from 0% through 100%, and the term is 1–100 whole years. The schedule assumes one payment each month, no extra payments and no rate changes. Property tax, insurance and HOA are the amounts you enter, held constant; real tax and insurance bills change over time. PMI, which lenders often require with less than 20% down, closing costs and fees are not included. The rate is not a regulated, fee-inclusive APR, and this estimate is not a lender quote. Educational estimates only, not financial, tax or investment advice.",
  "lesson.mortgage.faq.term.q": "Should I pick a 15-year or a 30-year term?",
  "lesson.mortgage.faq.term.a":
    "A 15-year loan has a higher monthly payment but far less total interest, because the balance is paid down twice as fast. A 30-year loan keeps the payment lower. Compare both here with the same rate, although 15-year loans are often offered at a lower rate.",
  "lesson.mortgage.faq.down.q": "How does the down payment change the payment?",
  "lesson.mortgage.faq.down.a":
    "Every dollar of down payment is a dollar you do not borrow, so the principal and interest payment falls in proportion to the loan amount. Putting less than 20% down often adds PMI, which this calculator does not include.",
  "lesson.mortgage.faq.zero.q": "What happens when the rate is zero?",
  "lesson.mortgage.faq.zero.a":
    "The payment is the loan amount divided by the number of months, rounded to the cent, and any leftover cents go into the final payment. A $12,000 loan over one year at 0% is twelve payments of $1,000.",
  "lesson.mortgage.faq.apr.q": "Is the interest rate an APR?",
  "lesson.mortgage.faq.apr.a":
    "No. It is the nominal annual interest rate, divided by 12 for each month. An APR also folds in lender fees, so it is usually a little higher than the rate used here.",
  "lesson.mortgage.sources.title": "Formula and reference",
  "lesson.mortgage.sources.body":
    "This calculator uses the level-payment annuity relation M = P × i / (1 − (1 + i)^−N), with loan amount P, monthly rate i = R/1200, and N months. At zero rate, the payment is P/N. Monthly interest is rounded half-up to cents, and the final payment clears the remaining balance. For how amortization splits payments between interest and principal, see the Consumer Financial Protection Bureau (CFPB): https://www.consumerfinance.gov/ask-cfpb/what-is-amortization-and-how-could-it-affect-my-auto-loan-en-771/ . That page explains payment allocation; it is not the source of the annuity equation above.",
} as const;
