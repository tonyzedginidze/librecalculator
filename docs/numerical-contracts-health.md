# Adult health calculator numerical contracts

These are educational arithmetic estimates, not medical advice, diagnosis, treatment, nutritional prescriptions or individual health targets. There is no automatic weight-loss calorie deficit, recommended macro split, prescribed fluid volume or single “ideal” weight. All formulas use canonical decimal input, 30 significant input digits and 50-digit Decimal arithmetic. Outputs outside adjusted exponent magnitude 100 fail rather than clamp. Age is ASCII integer years. The adult-age gate is 20–120 unless a formula has a narrower research-range gate. Common weight bounds are 20–350kg and height 100–250cm; input controls do not establish that a prediction is valid for an individual. Population equations exclude children and should not be used for pregnancy, breastfeeding or clinical nutrition.

## BMI

`weight kg ×10000 / height cm²`, adult age 20–120. Exact ratio retained without clinical classification. A numeric visual reference of 25 is for scale and expressly is not a target or health label. Independent fixtures: 70kg/200cm →17.5; 64kg/160cm →25; 81kg/180cm →25. The [CDC metric formula](https://www.cdc.gov/growth-chart-training/hcp/using-bmi/calculating-bmi.html) confirms the units. [CDC’s overview](https://www.cdc.gov/bmi/about/index.html) explains screening limitations. BMI does not measure body fat directly.

## Resting energy (BMR search topic)

Simplified Mifflin–St Jeor equations: `10×kg +6.25×cm −5×years +constant`; constant +5 for the published male equation and −161 for the published female equation. The UI names coefficients rather than inferring gender identity. Ages 20–78; nonpositive predictions fail. Result is predicted resting energy expenditure in kcal/day, not measured basal metabolism or food intake. Independent fixtures 70kg/180cm/30y →1680 male,1514 female; 80kg/180cm/40y →1730 male. [Original 1990 study abstract](https://pubmed.ncbi.nlm.nih.gov/2305711/) gives the simplified formulas and study age span (19–78). A model prediction is not an individual metabolic measurement.

## Daily energy expenditure (TDEE)

Entered resting energy 400–5000kcal/day multiplied by an explicit scenario factor 1–2.5. Adult-age gate 20–120. No exercise calories or dieting deficit are inferred. Fixtures 1600×1.5 →2400;1500×1 →1500;1800×2 →3600. [FAO/WHO/UNU definitions](https://www.fao.org/4/y5686e/y5686e04.htm) describe daily expenditure relative to basal metabolism. Multiplying an entered resting estimate here remains a scenario; resting and basal rates are not silently treated as identical measured quantities.

## Macro allocation

Entered calorie scenario 100–10000kcal/day; protein, carbohydrate and fat shares each 0–100%, sum exactly100. Shares are calorie percentages, not gram percentages. `grams = kcal×share/100 / factor`, factors4,4,9 respectively. The selected operation returns grams/day; no recommended intake or split is chosen. Adult-age gate20–120. Independent 1800kcal,20/50/30 scenario →90g protein,225g carbohydrate,60g fat. [USDA FNIC](https://www.nal.usda.gov/programs/fnic) documents general4/4/9 factors; specific foods, fibre, alcohol and polyols can differ.

## Body-fat regression

Adult Deurenberg regression `1.2×BMI +0.23×age −10.8×S −5.4`, S=1 published male coefficient,0 published female coefficient. Adult ages20–83 and calculated BMI13.9–40.9; outside-range input or predicted percentage outside0–100 fails explicitly. These gates do not guarantee individual validity. BMI20 age30 →14.7% male,25.5% female; BMI25 age40 →23% male. [Original 1991 abstract](https://pubmed.ncbi.nlm.nih.gov/2043597/) provides coefficients, study ranges and4.1 percentage-point standard error. Muscularity, individual body composition and population differences can produce substantially different measured values.

## Water-volume scenario

Weight kg ×user factor mL/kg/day /1000 gives L/day. Factor1–50 is an explicit user assumption; default30 is an arithmetic demonstration, never a prescribed target. Adult-age gate20–120. Independent fixtures70×30 →2.1L,80×25 →2L,60×40 →2.4L. The visual states the same volume in millilitres and counts it in 250mL glasses, a counting unit only. [CDC water guidance](https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/) explains individual variation and contribution from food; it does not endorse the input coefficient. Excludes use as advice for fluid restriction, kidney/heart disease, illness, pregnancy, breastfeeding or endurance activity.

## Weight at a chosen BMI (“ideal weight” search topic)

Algebraic inverse BMI: `chosen BMI ×(height cm/100)²` gives kilograms. Explicit chosen BMI scenario10–50; adult-age gate20–120. This range and default22 are not clinical targets. Fixtures200cm/BMI20 →80kg;160cm/BMI25 →64kg;180cm/BMI25 →81kg. Method is the rearranged CDC formula above. Height alone does not determine an ideal individual weight.

All examples are independently authored fixture values. Terminating examples are checked exactly; nonterminating independent references use relative/absolute tolerance1e-12. Malformed/grouped/exponent inputs, out-of-range measurements, noninteger ages and ages below20 fail. Result, working and visual exact values are produced by one calculation. All topics have video sources; rendering and visual review remain pending.
