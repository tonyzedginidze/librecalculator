# Ratio and Fraction User Experience Design

This document details the frontend design, layout choices, interactive behavior, and numerical representation policies for the **Fractions** (`fractions`) and **Percentage Change** (`percentage-change`) calculator topics.

## Design Philosophy & Visual System

Both calculators follow the Folio warm serif aesthetic, balancing high mathematical precision with intentional, intuitive visual structures.

1. **Typographic Hierarchy & Layout**
   - High-impact serif headers and tabular numeric presentation for exact integers, fractions, and percentage deltas.
   - Primary outputs retain full integer exactness; horizontal scrolling prevents line wrapping or truncation of large 2001-digit integers.

2. **Spatial Composition & Mathematical Alignment**
   - Fraction inputs are arranged in mathematical numerator-over-denominator visual groupings with clear horizontal vinculum styling.
   - Percentage change presents baseline (`oldValue`), new value (`newValue`), signed difference (`delta`), and percentage rate side by side for direct comparison.

3. **Atmospheric Color & Depth**
   - Distinctive surface cards, subtle borders, and contextual callout banners for negative baselines.
   - Interactive hover and focus states with reduced-motion support.

---

## 1. Fractions Experience (`fractions`)

### Operations Supported
- **Add** (`leftNumerator / leftDenominator + rightNumerator / rightDenominator`)
- **Subtract** (`leftNumerator / leftDenominator − rightNumerator / rightDenominator`)
- **Multiply** (`leftNumerator / leftDenominator × rightNumerator / rightDenominator`)
- **Divide** (`leftNumerator / leftDenominator ÷ rightNumerator / rightDenominator`)
- **Reduce** (`numerator / denominator`)

### Numerical & Input Policies
- **Exact Rational Representation**: Results display primary exact `numerator / denominator` (e.g. `5/6`, `-1/4`, `3/2`).
- **Sign-Safe Mixed Display**: Improper fractions provide equivalent mixed display with sign placed outside the whole and fractional parts (e.g. `-7/3` displays as `-2 1/3`, not `-2 + 1/3` or `-2 -1/3`).
- **1000-Digit Integers & Incomplete Sign Parsing**: Inputs support exact integers up to 1000 digits. Incomplete inputs like `"-"` or `"+"` are kept in draft state as incomplete without resetting or throwing errors.
- **No Decimal Truncation**: No grouping or decimal conversion is applied to fraction integer fields.

### Visual Diagram: Bounded Number Line & Part-Whole Model
- Displays a bounded number line spanning `-10` to `10`.
- Exact marker position is computed proportionally on the visual scale.
- Values outside `[-10, 10]` are honestly identified with an "Outside range" status without clamping or distorting the marker.
- Zero denominator inputs show explicit error notices (`fractions.error.zero-denominator`) while preserving user field input.

---

## 2. Percentage Change Experience (`percentage-change`)

### Operations Supported
- **Calculate Percentage Change** (`oldValue`, `newValue`)

### Numerical & Input Policies
- **Signed Baseline & Delta**: Computes exact delta `N − O` and rate `(N − O) / O × 100%`.
- **Negative Baseline UX**: When `oldValue < 0` (`negativeBaseline === true`), an explanatory notice explains the mathematical sign behavior:
  - Example: Moving from `-100` to `-50` produces a signed delta of `+50` but a percentage rate of `-50%`.
  - Example: Moving from `-100` to `-150` produces a signed delta of `-50` but a percentage rate of `+50%`.
  - The UI does not color-code positive rates as green "increases" when the baseline is negative.

### Visual Comparison Card
- Compares Old Baseline, New Value, Delta, and Rate in clear structured key-value cards.
- Provides table alternatives and visual axis indicators for zero, baseline, and new values.

---

## Platform Consistency (DOM & Native)

- **DOM View**: Responsive layout (320px to wide desktop), accessible ARIA region live updates, horizontal overflow scrolling for huge outputs.
- **Native View**: React Native `SafeAreaView`, `KeyboardAvoidingView`, and touch-friendly controls. Uses identical topic adapter logic and presentation contracts.
