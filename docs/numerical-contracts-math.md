# Math and everyday numerical contracts

The existing discount calculator remains signed arithmetic: discounts can be negative or exceed 100%; outputs are mathematical values with no currency settlement. Percent increase remains the core percentage-change calculator, with its existing signed-baseline convention.

All new arithmetic uses the shared canonical decimal parser (30 significant input digits, 256 characters per observation, exponent magnitude at most 100), the 50-digit Decimal context, no intermediate presentation rounding, and checked output exponent bounds. Malformed fields, undefined domains and overflow fail explicitly. Roots, logarithms and sine have absolute-plus-relative fixture tolerance `1e-12 + 1e-12 × |reference|`; domain errors are exact.

## Dataset centre and spread

`average` and `standard-deviation` accept 1–100 semicolon-separated observations, trimming whitespace at token boundaries. The complete list is capped at 25,700 characters before splitting. Semicolons keep comma decimal locales unambiguous; the adapter normalizes every observation separately.

Mean is sum/n. Median sorts numerically and takes the central value or arithmetic mean of the two middle values. Mode requires one unique highest-frequency value occurring at least twice; all-unique or tied-modal data fails. Population variance is sum((x−mean)²)/n; sample variance uses n−1 and requires at least two observations. Standard deviation is the square root of that variance. Both mean and variance are returned from the same calculation as the answer. No weighted observations or missing-value inference.

Independent fixtures: mean(2,4,6)=4; median(1,2,8,9)=5; mode(2,4,4,6)=4; population deviation(2,4,4,4,5,5,7,9)=2 (mean 5, squared deviations 32, n=8); sample deviation(1,3,5)=2 (mean 3, squared deviations 8, divisor 2); identical observations have deviation zero.

## Ratio comparison

Nonnegative first and positive second quantities; comparison first/second. Scaling requires a positive first and nonnegative target: target×second/first. It reports a quotient or corresponding quantity, not a reduced integer pair. Independent fixtures 2/4=0.5; pair 2:3 scaled to first=10 gives second=15; 0/5=0.

## Scientific arithmetic

Nonnegative square roots; positive natural logarithms; integer exponent within −100 through 100. Zero to a nonpositive exponent fails. Sine explicitly uses degrees, bounded ±1,000,000, reduced modulo 360; quadrant angles give exact 0/±1. Other angles use Decimal π and sine. Independent fixtures √9=3; 2^−3=0.125; ln1=0; sin90°=1. No expression language.

## Reproducible number picker

Integer bounds between ±1,000,000,000, minimum≤maximum, seed 1–2147483646. Park–Miller next seed is `(seed×16807) mod 2147483647`; answer is `minimum + nextSeed mod (maximum−minimum+1)`. Pure, deterministic, inclusive bounds; no clock, OS entropy, hidden state or Number arithmetic. Explicitly predictable and modulo-biased; intended for demonstrations and casual games, not security, statistical sampling or fairness claims. Independent fixtures seed1 next16807 -> range1–6 answer2; seed2 next33614 -> range0–9 answer4; equal endpoints always give that endpoint.

## Fuel economy

Positive kilometres and litres for the same trip. Consumption `fuel/distance×100` L/100 km; efficiency `distance/fuel` km/L. No gallons, miles, currency, emissions or electric consumption inference. Independent fixtures 40L/500km=8 L/100km; 600km/40L=15 km/L; 10L/200km=5 L/100km.

## Video status

Average, standard-deviation, ratio, scientific, random-number and fuel-economy are explicitly **video pending**. Their lessons and numeric examples are complete; narration and wide/tall render verification remain required for launch readiness. Existing discount video status remains governed by its existing source and build evidence.
