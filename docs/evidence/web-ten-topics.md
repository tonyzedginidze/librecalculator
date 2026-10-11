# Phase 3 Web Verification Evidence & Diagnostic Matrix

**Date**: 2026-10-09  
**Active Build Version**: `84dd94c3ef5a2d8499b8ce82603281ace193702871c6d67a2a7ab7c3790e2021`  
**Offline Manifest Entries**: 40 assets in `apps/web/dist/sw.js`  
**Active SW Chunks**: `compound-interest.YgPqLIYG.js`, `loan-payments.BTru_9Q8.js`, `Base.CkL4KQf7.css`  
**Preview Server State**: `http://127.0.0.1:4330` (Origin PID `99389` SIGTERM Stopped — `ECONNREFUSED 127.0.0.1:4330`)  
**Execution Environment**: BrowserOS neo real browser session (`web-review`)  

---

## 1. Offline Origin Navigation & SW Diagnostic Summary

| Resource / Layer | Observed Runtime Value | Diagnostic Conclusion |
|---|---|---|
| **Origin Server Status** | `ECONNREFUSED 127.0.0.1:4330` | Origin server down (PID 99389 killed) |
| **SW Cache Fallback** | `sw.js` (`84dd94c3...`) | Service worker served HTML/JS/CSS locally |
| **All 10 Routes Navigation** | 10 / 10 Routes Hydrated | Complete offline app cache navigation PASSED |
| **Offline Computations** | 10 / 10 Routes Computing | Calculations stay local on client |

---

## 2. Ten Topic Routes & Twenty Operations Verification Matrix (Offline Origin)

| Topic Route | Operation / Scenario | Inputs Provided | Rendered Answer / Output | Working Text & Visual Output | Status |
|---|---|---|---|---|---|
| `/calculators/loan-payments/` | 1. Loan Math Scenario A | `$901.50`, `4%`, `2 mo` | `$453.01` regular / `$453.01` final | Month 1 `$453.01` ($3.01 int, rem $451.50); Month 2 `$453.01` ($1.51 int, rem $0) | PASS |
| `/calculators/loan-payments/` | 2. Loan Math Scenario B | `$16.50`, `4%`, `1 mo` | `$16.56` regular / `$16.56` final | Month 1 `$16.56` ($0.06 int, rem $0) | PASS |
| `/calculators/loan-payments/` | 3. Loan Math Scenario C | `$10.00`, `0%`, `3 mo` | `$3.33` regular / `$3.34` final | Month 1 `$3.33`, Month 2 `$3.33`, Month 3 `$3.34` ($0 int) | PASS |
| `/calculators/unit-conversion/` | 4. Length dimension | `1 m` → `ft` | `3.28083989501312...` | `1 m = 3.28083989501312... ft` | PASS |
| `/calculators/unit-conversion/` | 5. Mass dimension | `1 lb` → `kg` | `0.45359237` | `1 lb = 0.45359237 kg` | PASS |
| `/calculators/unit-conversion/` | 6. Area dimension | `1 acre` → `m²` | `4,046.8564224` | `1 acre = 4,046.8564224 m2` | PASS |
| `/calculators/unit-conversion/` | 7. Volume US vs Imp | `1 us-gallon` / `1 imperial-gallon` → `L` | `3.785411784` / `4.54609` | `1 us-gallon = 3.785411784 l` / `1 imperial-gallon = 4.54609 l` | PASS |
| `/calculators/unit-conversion/` | 8. Time dimension | `1 day` → `s` | `86,400` | `1 day = 86,400 s` | PASS |
| `/calculators/unit-conversion/` | 9. Temp & High Precision | `0 °C` → `°F` & `0.000...0001 °F` → `°F` | `32` / `0.000...0001` | `0 c = 32 f` / High precision preserved | PASS |
| `/calculators/percentage-change/` | 10. Positive baseline change | Old `100`, New `50` | `-50%` | Difference `Δ -50`; percentage change `-50%` | PASS |
| `/calculators/percentage-change/` | 11. Negative baseline change | Old `-100`, New `-50` | `-50%` | Difference `Δ 50`; change relative to baseline `-50%` with notice | PASS |
| `/calculators/fractions/` | 12. Fraction addition | `1/2 + 1/3` | `5/6` | Exact rational `5/6`, number line marker | PASS |
| `/calculators/fractions/` | 13. Negative improper to mixed | Reduce `-7/3` | `-7/3` | Mixed Form `-2 1/3` (Whole `2`, Remainder `1/3`, Sign `negative`) | PASS |
| `/calculators/percentage/` | 14. Find percentage of value | Value `100`, Percentage `25` | `25` | `25% of 100 = 25` | PASS |
| `/calculators/percentage/` | 15. Find percent ratio | Part `18`, Whole `24` | `75%` | `18 ÷ 24 × 100 = 75%` (Bar fill `0.75`) | PASS |
| `/calculators/area/` | 16. Area rectangle & circle | Width `3`, Height `4` / Radius `2` | `12 m²` / `12.56637... m²` | 2-power unit output `m²` | PASS |
| `/calculators/volume/` | 17. Volume prism & sphere | Prism `3×4×5` / Radius `2` | `60 m³` / `33.51032... m³` | 3-power unit output `m³` | PASS |
| `/calculators/pythagorean-theorem/` | 18. Hypotenuse & leg | Leg `3,4` -> Hypotenuse / Leg `4`, Hyp `5` | `5 m` / `3 m` | Geometric right triangle solution | PASS |
| `/calculators/compound-interest/` | 19. Annual compounding & Interactive Chart | `$1,000`, Rate `10%`, Term `2 yr`, `1/yr` | `$1,210.00` | Click Year 1 rect updates readout to `Year 1: $1,100 ending balance ($100 interest earned)` | PASS |
| `/calculators/tip-splitting/` | 20. Uneven cent allocation | `$10.00` subtotal, `15%` tip, `3` people | Total `$11.50` | 1 person pays `$3.84`, 2 people pay `$3.83` ($3.84+$3.83+$3.83=$11.50) | PASS |

---

## 3. Detailed UI Defect & Scope Matrix

| Scope Item | Target Route / Context | Operational Result | Final Status |
|---|---|---|---|
| **Offline Origin Navigation** | All 10 routes | Direct URL navigation loaded cached HTML, CSS, and JS from Service Worker while origin HTTP server port 4330 was DOWN (`ECONNREFUSED`). | **PASSED** |
| **Form Layout Normal Flow** | All 10 routes | `form.oc-card` uses `position: static`. History items stack below in normal document flow. | **PASSED** |
| **Pointer History Restore** | `/calculators/percentage/`, `/calculators/fractions/`, `/calculators/unit-conversion/` | BrowserOS SDK `page.click(ref)` succeeded across viewports while offline. Value restored and answer recalculated. | **PASSED** |
| **Compound Interest Chart Interactivity** | `/calculators/compound-interest/` | Point tap on Year 1 rect dynamically updates readout header and text fields. | **PASSED** |
| **Loan Payments Chart Interactivity** | `/calculators/loan-payments/` | SVG chart renders a static trend breakdown path line (`<path>`, `<line>`). No interactive point elements present. Amortization schedule table underneath is fully interactive. | **BLOCKED / STATIC SVG** |
| **Responsive Viewports** | All 10 routes (320px, 390px, 768px, 1440px) | `hasOverflow: false` across all viewports. | **PASSED** |
