# Financial Calculators UI/UX Experience

## Overview
The financial calculators UI/UX module implements rich, interactive web/desktop DOM and React Native native views for three financial calculators:
1. **Compound Interest Calculator** (`compound-interest`)
2. **Loan Payment Calculator** (`loan-payments`)
3. **Tip Splitting Calculator** (`tip-splitting`)

Each calculator provides answer-first presentation, secondary metric cards, working steps, interactive visuals (SVG growth charts, amortization curves, share allocation cards), quick-select presets, and nominal rate disclosures.

---

## 1. Calculators Detail

### Compound Interest (`compound-interest`)
- **Primary Answer**: Estimated Final Balance ($A = P \times (1 + r/n)^{nt}$).
- **Secondary Metrics**: Starting Principal, Total Interest Earned, Compounding Periods.
- **Controls**: Preset compounding frequency chips (Annual, Semiannual, Quarterly, Monthly, Daily).
- **Visuals**: Interactive SVG growth chart with point inspection of year-by-year ending balance and cumulative interest earned + accessible table alternative.

### Loan Payments (`loan-payments`)
- **Primary Answer**: Regular Monthly Payment ($M = P \times i / (1 - (1+i)^{-N})$).
- **Secondary Metrics**: Adjusted Final Payment, Total Interest, Total Scheduled Payments.
- **Disclosure Notice**: Explicit note indicating nominal annual interest rate (not a fee-inclusive APR quote, excluding fees, taxes, and insurance).
- **Source Reference**: Correctly described CFPB educational reference guidelines on loan amortization payment allocation alongside level-payment annuity relation.
- **Visuals**: Interactive SVG amortization balance curve with point inspection of monthly payment/interest/remaining balance + scroll-contained schedule table (collapsible initial 12 months to prevent rendering 1200 DOM nodes eagerly).

### Tip Splitting (`tip-splitting`)
- **Primary Answer**: Total Bill ($G = S + T$).
- **Secondary Metrics**: Subtotal, Tip Amount.
- **Controls**: Preset tip percentage chips (15%, 18%, 20%, 25%).
- **Visuals**: Per-person share allocation cards showing exact remainder 1-cent allocation ($\text{cents}(G) = q \times N + r$).

---

## 2. Topic Architecture & Files
- **DOM UI Adapters & Views**:
  - `packages/dom-ui/src/topics/compound-interest/{adapter.ts, examples.ts, view.tsx}`
  - `packages/dom-ui/src/topics/loan-payments/{adapter.ts, examples.ts, view.tsx}`
  - `packages/dom-ui/src/topics/tip-splitting/{adapter.ts, examples.ts, view.tsx}`
- **Native Views (React Native)**:
  - `apps/mobile/src/topics/compound-interest/view.tsx` (with interactive SVG growth chart)
  - `apps/mobile/src/topics/loan-payments/view.tsx` (with interactive SVG amortization curve)
  - `apps/mobile/src/topics/tip-splitting/view.tsx` (with native share allocation cards)
- **Scoped Styles**:
  - `packages/design/src/finance.css`
- **Unit Tests**:
  - `packages/dom-ui/src/topics/finance.test.ts`
