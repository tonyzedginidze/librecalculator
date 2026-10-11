# Launch scope

Status: **implemented launch catalog: 12 packs, 72 calculators.** Topic selection is based on judgment, not validated keyword volumes. This is implementation scope, not a claim of release readiness: new explainer videos still require rendering and visual review.

## Principle

Launch with 12 packs and a few important calculators in each (4 to 10 calculators each, 72 total). Breadth shows the pack model and gives each topic a hub page; the small, polished set per pack keeps quality high. A pack that cannot reach at least 4 good calculators does not launch. Quality gates (numerical contract, fixtures, lesson, i18n coverage) apply to every launch calculator; thin or templated pages are not acceptable.

## Packs and launch calculators

| Pack | Launch calculators |
|---|---|
| Core (built) | percentage, percentage change, fractions, unit conversion, area, volume, Pythagorean, compound interest, loan payments, tip splitting |
| Math and everyday | discount, average (mean / median / mode), standard deviation, ratio, scientific, reproducible random number, fuel economy |
| Finance | mortgage, savings, ROI, salary and hourly wage, margin and markup, inflation, retirement |
| Health and body | BMI, resting energy (BMR search topic), TDEE scenario, macro allocation, body-fat regression, water-volume scenario, weight at a chosen BMI |
| Date and time | age, date difference (elapsed and inclusive days), fixed-offset time zone, countdown, work hours |
| Units and conversion | length, mass, temperature, speed conversion, duration, cooking measures (data-driven presets) |
| Geometry | triangle, circle, rectangle, sphere, cylinder |
| Statistics | z-score, confidence interval, probability, weighted average |
| Cooking and food | recipe scaling, cup and gram conversions, oven temperature, baking ratios, calories per serving |
| Construction | concrete, paint, flooring, roofing, tile, lumber |
| Physics | speed, force, energy, power, density, pressure |
| Education | GPA, grade, final grade, test score |

Minimum viable launch: at least 8 packs with a solid first set. If fewer, use Core, Math and everyday, Finance, Health and body, Date and time, Units, Geometry, Cooking and food.

## Selection criteria

Search demand, reuse of existing engines (cheap to build), universality across countries, and numerical or disclaimer risk. Finance and health need clear disclaimers and a documented numerical contract. Pregnancy and ovulation calculators remain deferred. Physics is included with six explicit SI arithmetic topics; chemistry, biology and sports remain deferred. Health tools are adult educational estimates with documented exclusions; user-selected scenario factors are not clinical recommendations.

## Reference lists

Entries in [pack-reference/](pack-reference/README.md) whose slug matches a launch calculator are tagged `pick (launch: <pack>)`. Tagging is partial and exact-slug only (44 tagged); launch items with no match there are new ideas to design from scratch, not copies. Find tagged entries with `grep -r "pick (launch" docs/pack-reference`.

## Before launch, beyond calculators

1. Pack foundation and the data-driven calculator format ([packs.md](packs.md) Phase 0), so about 70 calculators are not 70 hand-written views.
2. SEO basics: sitemap, structured data, fast static pages, a hub page per pack.
3. Pack discovery: search across inactive packs, activation, an empty-state for packs with few calculators ("more coming").

## Consolidation decisions

- Percent increase uses core percentage change; it is not a second engine.
- Mean, median and mode share the Math average calculator. Standard deviation lives in Math only. Statistics adds four distinct tools and links to the shared public pages.
- Days between dates uses Date difference, with elapsed and inclusive modes.
- Units use one core conversion catalog and preset engine, including explicit US, metric and Australian cooking measures; speed conversion has a different ID from Physics speed.
- Geometry adds perimeter, surface and inverse operations around the core area/volume foundations rather than identical pages.

## Launch completion and video tracking

Every new calculator is explicitly **video pending** until its wide and tall videos are rendered and visually verified. Savings has a rendered and visually verified wide video; its tall video is still pending. Finance, Construction and Health include authored video source directories; the remaining packs track pending videos in their numerical-contract or video-pending documents. Source files are not proof of a rendered video. The existing Core videos retain their prior status.

Pack manifests are the membership source of truth. The required gates validate all calculator lessons, messages, fixtures, custom tile art and operation icons. The sidebar Settings button opens a dedicated modal with pack icons, descriptions and switches. Category groups stay independent of packs; enabled calculators join their categories, and groups with zero available calculators are hidden. Search can discover inactive calculators and activate their pack. Desktop exposes the same switches under Settings. Each pack has a public hub and an entry in the sitemap.

Finance disclaimer policy: educational estimates, not financial advice; state currency, rounding, fees/taxes exclusions and model assumptions per calculator. Health disclaimer policy: educational adult estimates, not medical advice, diagnosis or individual intake/weight targets; explicitly identify population formulas, age/measurement bounds, uncertainty and exclusions. These messages live in each topic's i18n lesson limitations and visible tool descriptions.
