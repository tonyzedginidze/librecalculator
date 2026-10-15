/**
 * Search-result titles (<title>), one per calculator. The page heading keeps
 * the short catalog title; these lead with the search phrase and add what the
 * page answers. At most 60 characters, enforced by meta.test.ts.
 */
export const seoTitles = {
  age: "Age calculator: how old am I on any date?",
  area: "Area calculator: rectangle, triangle and circle area",
  average: "Mean, median and mode calculator for any list of numbers",
  "baking-ratios": "Baker's percentage calculator for bread dough hydration",
  bmi: "BMI calculator: check your BMI and WHO weight range",
  bmr: "BMR calculator: resting calories per day (Mifflin–St Jeor)",
  "body-fat": "Body fat percentage calculator from BMI and age",
  "calories-per-serving": "Calories per serving calculator for recipes",
  circle: "Circle calculator: area, circumference and diameter",
  "compound-interest": "Compound interest calculator with yearly growth chart",
  concrete: "Concrete calculator: how much concrete for a slab",
  "confidence-interval": "Confidence interval calculator for a mean",
  "cooking-measures": "Cooking measurement converter: cups, tbsp, tsp and ml",
  countdown: "Days until calculator: countdown to any date",
  "cup-gram-conversion": "Cups to grams converter for flour, sugar and butter",
  cylinder: "Cylinder calculator: volume and surface area",
  "date-difference": "Date difference calculator: days between two dates",
  density: "Density calculator: density, mass or volume",
  discount: "Discount calculator: sale price and amount saved",
  duration: "Time converter: seconds, minutes, hours, days and weeks",
  energy: "Kinetic energy calculator (KE = ½mv²)",
  "final-grade": "Final grade calculator: what do I need on the final?",
  flooring: "Flooring calculator: how many boxes of flooring to buy",
  force: "Force calculator: F = ma in newtons",
  fractions: "Fraction calculator: add, subtract, multiply and divide",
  "fuel-economy": "Fuel economy calculator: L/100 km and km per litre",
  gpa: "GPA calculator: semester and cumulative GPA",
  grade: "Grade calculator: percentage and weighted course grade",
  "ideal-weight": "Healthy weight calculator: target weight for your height",
  inflation: "Inflation calculator: future cost and value of money",
  length: "Length converter: cm, inches, feet, metres and miles",
  "loan-payments": "Loan payment calculator: monthly payment and interest",
  lumber: "Board foot calculator for lumber",
  macros: "Macro calculator: protein, carbs and fat in grams",
  "margin-markup": "Margin and markup calculator: profit margin vs markup",
  mass: "Weight converter: kg, pounds, ounces and grams",
  mortgage: "Mortgage calculator with taxes, insurance and HOA",
  "oven-temperature": "Oven temperature converter: °C, °F and fan oven",
  paint: "Paint calculator: how much paint do I need?",
  percentage: "Percentage calculator: what is X% of Y?",
  "percentage-change":
    "Percentage change calculator: percent increase or decrease",
  power: "Power calculator: watts from energy and time",
  pressure: "Pressure calculator: P = F/A in pascals",
  probability: "Probability calculator: A and B, A or B, not A",
  pythagorean: "Pythagorean theorem calculator: find the missing side",
  "random-number": "Random number generator: pick a number in any range",
  ratio: "Ratio calculator: simplify and scale ratios",
  "recipe-scaling": "Recipe scaling calculator: adjust servings",
  rectangle: "Rectangle calculator: area, perimeter and diagonal",
  retirement: "Retirement savings calculator: how much will I have?",
  roi: "ROI calculator: return on investment after fees",
  roofing: "Roof area calculator from footprint and pitch",
  salary: "Salary to hourly calculator: annual, monthly and hourly pay",
  savings: "Savings calculator with monthly deposits and interest",
  scientific: "Scientific calculator: roots, powers, logs and sine",
  speed: "Speed calculator: speed from distance and time",
  "speed-conversion": "Speed converter: km/h, mph, m/s and knots",
  sphere: "Sphere calculator: volume, surface area and diameter",
  "standard-deviation": "Standard deviation calculator: sample and population",
  tdee: "TDEE calculator: how many calories do I burn a day?",
  temperature: "Temperature converter: Celsius, Fahrenheit and Kelvin",
  "test-score": "Test score calculator: percentage from correct answers",
  tile: "Tile calculator: how many tiles do I need?",
  "time-zone": "Time zone converter between UTC offsets",
  "tip-splitting": "Tip calculator: add a tip and split the bill",
  triangle: "Triangle calculator: area, perimeter and height",
  "unit-conversion": "Unit converter: length, weight, temperature and more",
  volume: "Volume calculator: box, cylinder and sphere",
  "water-intake": "Water intake calculator: how much water per day?",
  "weighted-average": "Weighted average calculator with steps",
  "work-hours": "Work hours calculator: hours worked with breaks",
  "z-score": "Z-score calculator with bell curve",
} as const;

/**
 * Search-result descriptions (<meta name="description">), one per calculator.
 * Longer than the catalog descriptions shown on tiles: 110–160 characters,
 * enforced by meta.test.ts.
 */
export const metaDescriptions = {
  age: "Find anyone's age in completed years on any date, plus the total days lived. Enter a birth date and see every step. Free, private, no sign-up.",
  area: "Work out the area of a rectangle, triangle or circle in seconds. Get the answer, the formula and a labelled diagram. Free, with every step explained.",
  average:
    "Paste a list of numbers to get the mean, median and mode at once, see where each one falls in your data, and learn which average to use. Free.",
  "baking-ratios":
    "Work out dough hydration, salt and yeast as a percentage of flour, or turn baker's percentages into grams for any batch. Free, with worked steps.",
  bmi: "Enter your weight and height to get your BMI, the WHO adult range it falls in and the formula behind it, plus what BMI can't tell you. Free.",
  bmr: "Estimate how many calories your body burns at rest each day with the Mifflin–St Jeor equation. Enter weight, height, age and sex. Free, steps shown.",
  "body-fat":
    "Get a quick body fat percentage estimate from BMI, age and sex using the Deurenberg formula, with the steps and an honest note on its accuracy.",
  "calories-per-serving":
    "Find calories per serving for any recipe: divide the total by servings or work out a weighed portion from the cooked batch. Free, with clear steps.",
  circle:
    "Find a circle's area, circumference or diameter from the radius. See the formula with π, each step and a labelled diagram. Free and instant.",
  "compound-interest":
    "See how a deposit grows with monthly, quarterly or yearly compounding. Get the final balance, interest earned, a year-by-year chart and the formula.",
  concrete:
    "Work out how much concrete to order for a slab from length, width and depth, with a waste allowance you control. Free, with every step shown.",
  "confidence-interval":
    "Calculate a confidence interval and margin of error for a sample mean with known σ, such as z = 1.96 for 95%, with every step and the assumptions.",
  "cooking-measures":
    "Convert cups, tablespoons, teaspoons, fluid ounces, pints and millilitres for any recipe using exact US and metric definitions. Free and instant.",
  countdown:
    "Count the days left until a birthday, holiday or deadline, or the days since a past date. Enter a date and get the answer instantly. Free, no sign-up.",
  "cup-gram-conversion":
    "Convert cups to grams and grams to cups for flour, sugar, butter and other ingredients, using the weight of one cup. Free, with clear steps.",
  cylinder:
    "Find the volume, total surface area or curved surface area of a cylinder from radius and height, with the formula, steps and a labelled diagram.",
  "date-difference":
    "Count the days between two dates, with or without the end date included. Leap years are handled and every step is shown. Free, fast and private.",
  density:
    "Find density from mass and volume in kg/m³, compare it with water, and follow the formula ρ = m/V step by step. Free, with a short physics lesson.",
  discount:
    "Find the sale price and how much you save from a percentage off, or work out the discount percentage from the original and sale price. Free.",
  duration:
    "Convert between milliseconds, seconds, minutes, hours, days and weeks with exact factors, and see how each conversion is done. Free and instant.",
  energy:
    "Find the kinetic energy of a moving object in joules from its mass and speed with KE = ½mv². See every step and a short lesson. Free.",
  "final-grade":
    "Find the score you need on your final exam to reach a target grade, or see your course grade after the final. Enter your weights and get the answer.",
  flooring:
    "Work out how many boxes of laminate, vinyl or wood flooring a room needs, with a waste allowance and the total rounded up to whole packs. Free.",
  force:
    "Find net force in newtons from mass and acceleration with Newton's second law, F = ma. Enter two values and see each step. Free, with a short lesson.",
  fractions:
    "Add, subtract, multiply, divide and simplify fractions with exact arithmetic. See every step down to lowest terms. Free, no ads, no sign-up.",
  "fuel-economy":
    "Work out your car's fuel economy in litres per 100 km or km per litre from the distance driven and fuel used. Free, with every step shown.",
  gpa: "Calculate your GPA from grades and credits, combine terms into a cumulative GPA, or see what grades you need to reach a target GPA. Free.",
  grade:
    "Turn points into a percentage, see how a weighted assignment changes your course grade, or find the points you need for a target grade. Free.",
  "ideal-weight":
    "Find the weight that matches any BMI you choose at your height, such as the 18.5 to 24.9 healthy range. Free, with the formula and steps shown.",
  inflation:
    "See what something will cost in future years, or what future money is worth today, at an inflation rate you choose. Free, with every step shown.",
  length:
    "Convert millimetres, centimetres, metres, kilometres, inches, feet, yards and miles using exact international definitions. Free and instant.",
  "loan-payments":
    "Find the monthly payment on a fixed-rate loan, the total interest you'll pay and how each payment splits between interest and principal. Free.",
  lumber:
    "Work out board feet of lumber from thickness, width, length and number of boards, with the formula and each step shown. Free and instant.",
  macros:
    "Turn daily calories and your protein, carb and fat percentages into grams per day, using 4, 4 and 9 kcal per gram. Free, with every step shown.",
  "margin-markup":
    "Find the profit margin on a selling price or the markup on cost, and see why the two percentages differ. Free, with every step explained.",
  mass: "Convert kilograms, pounds, ounces, grams and milligrams using the exact international pound, with the conversion shown. Free and instant.",
  mortgage:
    "Estimate your monthly mortgage payment from home price, down payment, rate and term, including taxes, insurance and HOA, with a yearly schedule.",
  "oven-temperature":
    "Convert oven temperatures between Celsius and Fahrenheit and adjust a recipe for a fan or convection oven. Free, with each step shown.",
  paint:
    "Work out how much paint to buy from wall area, number of coats and the coverage on the label, with an allowance you set. Free, with every step shown.",
  percentage:
    "Find X% of a number, or what percent one number is of another. See the formula, every step and a diagram. Free, fast and no sign-up.",
  "percentage-change":
    "Find the percent increase or decrease from an old value to a new one, with the starting value made clear and every step shown. Free and instant.",
  power:
    "Find average power in watts from energy in joules and the time taken, using P = E/t, with the formula and each step. Free, with a short lesson.",
  pressure:
    "Find the pressure in pascals when a force is spread over an area, using P = F/A, with every step and a short lesson. Free and instant.",
  probability:
    "Find the probability of not A, A and B, or A or B from event probabilities, with each rule explained step by step. Free, with worked examples.",
  pythagorean:
    "Find the missing side of a right triangle from the other two with a² + b² = c². See the steps and a diagram. Free and instant.",
  "random-number":
    "Pick a random whole number between two limits. Add a seed to repeat and check a draw, with the method fully explained. Free, private, no sign-up.",
  ratio:
    "Simplify a ratio such as 16:9, find the value per one, or scale a ratio to a new size while keeping the same proportion. Free, with steps.",
  "recipe-scaling":
    "Scale any recipe up or down to a new number of servings, find the scale factor, or work back to the original amount. Free, with clear steps.",
  rectangle:
    "Find a rectangle's area, perimeter or diagonal from width and height, with the formula, each step and a labelled diagram. Free and instant.",
  retirement:
    "Project how your current savings and yearly contributions could grow by retirement at a return you choose. Free, with every step shown.",
  roi: "Work out the return on an investment after fees, as a profit amount and a percentage, with the ROI formula and every step shown. Free.",
  roofing:
    "Turn a roof's footprint and pitch into sloped roof area for ordering shingles, tiles or metal sheets, with a waste allowance. Free, steps shown.",
  salary:
    "Convert an annual salary to hourly pay and back, with weekly and monthly equivalents based on your own hours per week. Free and instant.",
  savings:
    "Project your savings balance from a starting amount, monthly deposits and an interest rate, with total interest earned and every step. Free.",
  scientific:
    "Calculate square roots, powers, natural logarithms and sine in degrees to ten decimal places, with each calculation explained. Free, no sign-up.",
  speed:
    "Find average speed from the distance travelled and time taken, with the formula and every step shown. Free, with a short physics lesson.",
  "speed-conversion":
    "Convert between km/h, mph, metres per second, feet per second and knots using exact definitions, with the conversion shown. Free and instant.",
  sphere:
    "Find the volume, surface area or diameter of a sphere from its radius, with the formula, each step and a labelled diagram. Free and instant.",
  "standard-deviation":
    "Find the standard deviation of a list of numbers as a sample or population, with the mean, variance and every step shown. Free and instant.",
  tdee: "Estimate your total daily energy expenditure in calories from resting energy and your activity level, with every step shown. Free, no sign-up.",
  temperature:
    "Convert between Celsius, Fahrenheit and Kelvin with the exact formulas, freezing and boiling points for reference, and every step. Free.",
  "test-score":
    "Turn correct answers into a percentage score, count the questions missed, or find how many you need right to pass. Free and instant.",
  tile: "Work out how many tiles to buy for a floor or wall from the area and tile size, with a waste allowance and each step shown. Free.",
  "time-zone":
    "Convert a local time between two UTC offsets, including when the date changes, with the calculation shown step by step. Free and instant.",
  "tip-splitting":
    "Add a tip to the bill and split it between any number of people, to the cent. See each person's share and the math behind it. Free.",
  triangle:
    "Find the area, perimeter or height of any triangle from its sides or base, with the formula, steps and a labelled diagram. Free and instant.",
  "unit-conversion":
    "Convert length, weight, temperature, area, volume and time with exact definitions and the conversion shown. Free, no ads, no sign-up.",
  volume:
    "Find the volume of a box, cylinder or sphere. Enter the sizes to get the volume, the formula, each step and a diagram. Free and instant.",
  "water-intake":
    "Estimate how much water to drink per day in litres from your body weight. An estimate to explore, not a prescription. Free, with steps shown.",
  "weighted-average":
    "Average values that count unequally, such as weighted grades or survey scores. Enter values and weights to get the weighted mean and every step.",
  "work-hours":
    "Turn a shift's start time, end time and unpaid break into hours worked in decimal form, including overnight shifts. Free and instant.",
  "z-score":
    "Find how many standard deviations a value lies above or below the mean, with the z-score formula, each step and a bell-curve diagram. Free.",
} as const;
