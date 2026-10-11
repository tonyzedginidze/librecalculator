export const messages = {
  "fuel-economy.operation.litres-per-100km": "Litres per 100 km",
  "fuel-economy.operation.kilometres-per-litre": "Kilometres per litre",
  "fuel-economy.field.distance": "Distance driven",
  "fuel-economy.field.fuel": "Fuel used",
  "fuel-economy.unit.km": "Kilometres (km)",
  "fuel-economy.unit.litres": "Litres (L)",
  "fuel-economy.unit.litres-per-100km": "L/100 km",
  "fuel-economy.unit.kilometres-per-litre": "km/L",
  "fuel-economy.working.litres-per-100km":
    "{fuel} L ÷ {distance} km × 100 = {answer} L/100 km",
  "fuel-economy.working.kilometres-per-litre":
    "{distance} km ÷ {fuel} L = {answer} km/L",
  "fuel-economy.result": "Result",
  "fuel-economy.error.invalid-field": "Enter a number in every field.",
  "fuel-economy.error.invalid-domain":
    "Distance and fuel must both be greater than zero.",
  "fuel-economy.error.output-overflow":
    "The result is outside the supported range.",
  "fuel-economy.visual.caption": "The same trip in both measures",
  "fuel-economy.visual.consumption": "Fuel per 100 km",
  "fuel-economy.visual.efficiency": "Distance per litre",
  "fuel-economy.visual.same": "=",
  "fuel-economy.visual.summary":
    "This trip used {consumption} litres per 100 kilometres, which is the same as {efficiency} kilometres per litre.",
  "fuel-economy.visual.description":
    "The trip expressed as fuel per distance and as distance per fuel; one is 100 divided by the other.",
  "fuel-economy.visual.alternative":
    "Two figures describe the same trip: litres per 100 kilometres and kilometres per litre. The exact numbers are stated in the answer and the steps.",
  "lesson.fuel-economy.formula.litres-per-100km": "C = 100 × F ÷ D",
  "lesson.fuel-economy.formula.kilometres-per-litre": "E = D ÷ F",
  "lesson.fuel-economy.variable.consumption":
    "consumption in litres per 100 km",
  "lesson.fuel-economy.variable.efficiency": "economy in kilometres per litre",
  "lesson.fuel-economy.variable.fuel": "fuel used in litres",
  "lesson.fuel-economy.variable.distance": "distance driven in kilometres",
  "lesson.fuel-economy.intro.title": "Two ways to measure fuel economy",
  "lesson.fuel-economy.intro.body":
    "Fuel economy can express consumption for a fixed distance or distance travelled per unit of fuel. Litres per 100 kilometres decreases when efficiency improves; kilometres per litre increases.",
  "lesson.fuel-economy.meaning.title": "Measure a trip",
  "lesson.fuel-economy.meaning.body":
    "Fill the tank, drive, then fill it again: the litres added are the fuel used over the distance on the trip meter. Enter both and choose litres per 100 km (lower is better) or kilometres per litre (higher is better).",
  "lesson.fuel-economy.example.0": "500 km on 40 litres",
  "lesson.fuel-economy.example.1": "Distance travelled per litre",
  "lesson.fuel-economy.example.2": "A lower consumption trip",
  "lesson.fuel-economy.mistakes.title": "Common mistakes",
  "lesson.fuel-economy.mistakes.body":
    "Do not enter the tank capacity unless that entire volume was consumed. Compare the same route and conditions where possible. Higher L/100 km means more fuel used, while higher km/L means less fuel per distance. This calculator does not accept miles or gallons.",
  "lesson.fuel-economy.limits.title": "Assumptions and limits",
  "lesson.fuel-economy.limits.body":
    "This is the average for one measured trip, not a forecast or a manufacturer rating. Distance and fuel must both be above zero. Electric energy use, fuel price and emissions are not included, and the answer is only as precise as the measurements. Values use 50 internal digits and are rounded to two decimals only for display.",
  "lesson.fuel-economy.sources.title": "Sources",
  "lesson.fuel-economy.sources.body":
    "Natural Resources Canada, understanding fuel consumption ratings: https://natural-resources.canada.ca/energy-efficiency/transportation-alternative-fuels/personal-vehicles/buying-energy-efficient-vehicle/understanding-fuel-consumption-ratings",
  "lesson.fuel-economy.faq.q":
    "Why can the two outputs seem to move in opposite directions?",
  "lesson.fuel-economy.faq.a":
    "They are reciprocal representations: L/100 km = 100 ÷ (km/L). Improving economy lowers the first and raises the second.",
} as const;
