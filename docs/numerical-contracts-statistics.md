# Statistics numerical contracts

All arithmetic follows the shared decimal input/output limits and 50 significant working digits. Approximate roots use tolerance `1e-12 + 1e-12 × |reference|`. Domain comparisons remain exact. Mean/median/mode and standard deviation are consolidated into the Math pack and keep exactly one pack membership.

- Standard score `(value−mean)/deviation`, signed values/mean and strictly positive deviation. No percentile or normality inference. Fixtures (85−70)/10=1.5, (40−50)/5=−2, (10−10)/2=0.
- Known-sigma interval margin `critical×sigma/√n`; positive sigma and critical, integer n 1–1,000,000. Mean arbitrary signed. Return margin and both mean±margin endpoints. Known population sigma and an appropriate sampling normal model are explicit assumptions; no t distribution or probability-on-fixed-parameter claim. A 95% normal multiplier can be entered as 1.959963984540054; user may supply other positive multipliers. Fixtures mean100 sigma10 n25 critical2 -> margin4 endpoints96/104; mean20 sigma6 n9 critical2 -> margin4 endpoints16/24; mean0 sigma2 n4 critical1 -> margin1 endpoints−1/1.
- Probabilities in [0,1]. Complement 1−A. Independent joint A×B, independence explicitly chosen by the user. Union A+B−intersection, enforcing max(0,A+B−1)≤intersection≤min(A,B). Fixtures complement0.2=0.8; 0.5×0.4=0.2; union0.5+0.4−0.2=0.7.
- Weighted mean Σ(value×weight)/Σweight. Matched semicolon lists, 1–100 observations, total text 25,700 characters per list before tokenization, canonical decimal per observation. Nonnegative weights with positive total; zero weights allowed. Fixtures values10/20/30 weights1/2/1 ->20; values80/100 weights3/1 ->85; values5/100 weights1/0 ->5.

## Video status

Z-score, confidence-interval, probability and weighted-average are explicitly **video pending**. Lessons explain operation assumptions; videos require narration and wide/tall render verification before launch readiness.
