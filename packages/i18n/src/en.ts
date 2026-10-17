import type {
  WorkingArgument,
  WorkingStep,
} from "../../calculators/src/contracts";

export const en = {
  "calculator.percentage.title": "Percentage calculator",
  "calculator.percentage.description":
    "Find a percentage of a value or compare one value with another.",
  "calculator.percentage.search": "percent, proportion, part, whole",
  "calculator.percentage-change.title": "Percentage change calculator",
  "calculator.percentage-change.description":
    "Calculate the percentage change from an old value to a new value, with the baseline made explicit.",
  "calculator.percentage-change.search":
    "percentage change, increase, decrease, old value, new value, baseline",
  "calculator.fractions.title": "Fraction calculator",
  "calculator.fractions.description":
    "Add, subtract, multiply, divide, or reduce fractions using exact rational arithmetic.",
  "calculator.fractions.search":
    "fractions, fraction arithmetic, add fractions, reduce, simplify, mixed number",
  "calculator.unit-conversion.title": "Unit conversion calculator",
  "calculator.unit-conversion.description":
    "Convert supported length, mass, temperature, area, volume, and time units; currency conversion is not included.",
  "calculator.unit-conversion.search":
    "unit conversion, length, mass, temperature, area, volume, time, metric, imperial",
  "calculator.area.title": "Area calculator",
  "calculator.area.description":
    "Area of a rectangle, triangle or circle in square metres.",
  "calculator.area.search":
    "area, rectangle, triangle, circle, square metres, geometry",
  "calculator.volume.title": "Volume calculator",
  "calculator.volume.description":
    "Volume of a box, cylinder or sphere in cubic metres.",
  "calculator.volume.search":
    "volume, rectangular prism, cylinder, sphere, cubic metres, geometry",
  "calculator.pythagorean.title": "Pythagorean theorem calculator",
  "calculator.pythagorean.description":
    "Find the missing side of a right triangle from the other two.",
  "calculator.pythagorean.search":
    "Pythagorean theorem, right triangle, hypotenuse, missing leg, geometry",
  "calculator.compound-interest.title": "Compound interest calculator",
  "calculator.compound-interest.description":
    "See how a one-time deposit grows with compound interest over the years.",
  "calculator.compound-interest.search":
    "compound interest, compound growth, principal, annual rate, compounding frequency, balance",
  "calculator.loan-payments.title": "Loan payment calculator",
  "calculator.loan-payments.description":
    "Find the monthly payment on a fixed-rate loan and how much of it goes to interest.",
  "calculator.loan-payments.search":
    "loan payment, amortization, monthly payment, principal, interest rate, payoff schedule",
  "calculator.tip-splitting.title": "Tip splitting calculator",
  "calculator.tip-splitting.description":
    "Add a tip to the bill and see what each person pays, to the cent.",
  "calculator.tip-splitting.search":
    "tip, tip splitting, gratuity, split bill, per person, remainder",
  "error.invalid-field": "Enter a valid number.",
  "error.output-overflow": "The answer is outside the supported range.",
  "calculator.discount.title": "Discount calculator",
  "calculator.discount.description":
    "Find the sale price after a percentage discount and how much you save, or work out the discount percentage from two prices.",
  "calculator.discount.search":
    "discount, sale price, percent off, markdown, savings, how much off, coupon",
  "calculator.triangle.title": "Triangle calculator",
  "calculator.triangle.description":
    "Area, perimeter or height of any triangle.",
  "calculator.triangle.search": "triangle area perimeter height altitude base",
  "calculator.circle.title": "Circle calculator",
  "calculator.circle.description":
    "Area, circumference or diameter of a circle from its radius.",
  "calculator.circle.search": "circle area circumference diameter radius pi",
  "calculator.rectangle.title": "Rectangle calculator",
  "calculator.rectangle.description":
    "Area, perimeter or diagonal of a rectangle from its width and height.",
  "calculator.rectangle.search": "rectangle area perimeter diagonal square",
  "calculator.sphere.title": "Sphere calculator",
  "calculator.sphere.description":
    "Volume, surface area or diameter of a sphere from its radius.",
  "calculator.sphere.search": "sphere ball volume surface area diameter",
  "calculator.cylinder.title": "Cylinder calculator",
  "calculator.cylinder.description":
    "Volume, total surface or curved surface of a cylinder.",
  "calculator.cylinder.search": "cylinder tank pipe volume surface area",
  "calculator.mortgage.title": "Mortgage calculator",
  "calculator.mortgage.description":
    "Estimate a monthly mortgage payment from home price, down payment and rate, with optional tax, insurance and HOA.",
  "calculator.mortgage.search":
    "mortgage home loan house payment down payment property tax insurance hoa piti 30 year 15 year monthly payment amortization",
  "calculator.savings.title": "Savings calculator",
  "calculator.savings.description":
    "Project a savings balance from a starting amount, monthly deposits and an interest rate.",
  "calculator.savings.search": "savings deposit interest goal",
  "calculator.roi.title": "ROI calculator",
  "calculator.roi.description":
    "Work out the return on an investment after fees, as a profit and a percentage.",
  "calculator.roi.search": "roi return on investment profit",
  "calculator.salary.title": "Salary to hourly calculator",
  "calculator.salary.description":
    "Convert an annual salary to hourly pay and back, with weekly and monthly equivalents.",
  "calculator.salary.search": "salary hourly wage pay annual",
  "calculator.margin-markup.title": "Margin and markup calculator",
  "calculator.margin-markup.description":
    "Find the profit margin on a selling price or the markup on cost.",
  "calculator.margin-markup.search": "margin markup profit price cost",
  "calculator.inflation.title": "Inflation calculator",
  "calculator.inflation.description":
    "See what a price will cost in the future, or what future cash is worth today, at a steady inflation rate.",
  "calculator.inflation.search":
    "inflation purchasing power future value prices",
  "calculator.retirement.title": "Retirement savings calculator",
  "calculator.retirement.description":
    "Project how current savings and yearly contributions could grow by retirement.",
  "calculator.retirement.search": "retirement 401k pension nest egg",
  "calculator.average.title": "Mean, median and mode calculator",
  "calculator.average.description":
    "Find the mean, median or mode of a list of numbers and see where each centre falls among your values.",
  "calculator.average.search":
    "average, mean, median, mode, central tendency, arithmetic mean",
  "calculator.standard-deviation.title": "Standard deviation calculator",
  "calculator.standard-deviation.description":
    "Measure how spread out a list of numbers is, as a population or a sample, with the mean and variance shown.",
  "calculator.standard-deviation.search":
    "standard deviation, variance, spread, sigma, population, sample, SD",
  "calculator.ratio.title": "Ratio calculator",
  "calculator.ratio.description":
    "Reduce a ratio such as 16 : 9 to a value per one, or scale it to a new size while keeping the same proportion.",
  "calculator.ratio.search":
    "ratio, proportion, aspect ratio, scale, equivalent ratio, A to B",
  "calculator.scientific.title": "Scientific functions calculator",
  "calculator.scientific.description":
    "Calculate square roots, whole-number powers, natural logarithms and the sine of an angle in degrees, to ten decimal places.",
  "calculator.scientific.search":
    "scientific calculator, square root, power, exponent, logarithm, ln, sine, sin",
  "calculator.random-number.title": "Random number picker",
  "calculator.random-number.description":
    "Pick a whole number between two limits. The same seed always gives the same pick, so a draw can be repeated and checked.",
  "calculator.random-number.search":
    "random number, random number generator, pick a number, dice, seed, RNG",
  "calculator.fuel-economy.title": "Fuel economy calculator",
  "calculator.fuel-economy.description":
    "Work out litres per 100 km or kilometres per litre from the distance driven and the fuel used on a trip.",
  "calculator.fuel-economy.search":
    "fuel economy, fuel consumption, litres per 100 km, L/100km, km per litre, km/L, mileage",
  "calculator.recipe-scaling.title": "Recipe scaling calculator",
  "calculator.recipe-scaling.description":
    "Scale any ingredient up or down for a new number of servings, find the scale factor, or work back to the original amount.",
  "calculator.recipe-scaling.search":
    "recipe scaling resize recipe servings double halve batch multiply ingredients",
  "calculator.cup-gram-conversion.title": "Cups to grams calculator",
  "calculator.cup-gram-conversion.description":
    "Convert cups to grams and back using the weight of one cup of your ingredient, such as 120 g for flour.",
  "calculator.cup-gram-conversion.search":
    "cups to grams grams to cups flour sugar baking conversion weight volume",
  "calculator.oven-temperature.title": "Oven temperature calculator",
  "calculator.oven-temperature.description":
    "Convert oven settings between Celsius and Fahrenheit, and lower a conventional setting for a fan oven.",
  "calculator.oven-temperature.search":
    "oven temperature celsius fahrenheit fan oven convection gas conversion",
  "calculator.baking-ratios.title": "Baker's percentage calculator",
  "calculator.baking-ratios.description":
    "Express each dough ingredient as a percentage of flour weight, or find the grams of water, salt or flour from a percentage.",
  "calculator.baking-ratios.search":
    "baker's percentage hydration bread dough flour water ratio baking ratios",
  "calculator.calories-per-serving.title": "Calories per serving calculator",
  "calculator.calories-per-serving.description":
    "Divide a recipe's calories into servings, total them back up, or estimate a weighed portion from the cooked batch.",
  "calculator.calories-per-serving.search":
    "calories per serving recipe kcal portion nutrition batch weight",
  "pack.math-everyday.title": "Math and everyday",
  "pack.math-everyday.description":
    "Everyday comparisons, descriptive statistics and scientific arithmetic.",
  "calculator.age.title": "Age calculator",
  "calculator.age.description":
    "Find someone’s age in completed years on any date, with the days lived.",
  "calculator.age.search":
    "age, how old, birthday, date of birth, years old, age on date",
  "calculator.date-difference.title": "Date difference calculator",
  "calculator.date-difference.description":
    "Count the days between two dates, with or without both ends included.",
  "calculator.date-difference.search":
    "days between dates, date difference, how many days, date duration, inclusive days",
  "calculator.countdown.title": "Days until calculator",
  "calculator.countdown.description":
    "Count the days left until an event, or the days since it passed.",
  "calculator.countdown.search":
    "countdown, days until, days left, days to go, days since, event date",
  "calculator.work-hours.title": "Work hours calculator",
  "calculator.work-hours.description":
    "Turn a shift’s start, end and unpaid break into paid decimal hours.",
  "calculator.work-hours.search":
    "work hours, shift hours, timesheet, hours worked, paid hours, decimal hours, overnight shift",
  "calculator.time-zone.title": "Time zone converter",
  "calculator.time-zone.description":
    "Convert a local time between two UTC offsets, including the day change.",
  "calculator.time-zone.search":
    "time zone, timezone converter, utc offset, world clock, meeting time, gmt",
  "calculator.gpa.title": "GPA calculator",
  "calculator.gpa.description":
    "Find a GPA from quality points and credits, combine terms, or see the points a target GPA needs.",
  "calculator.gpa.search":
    "gpa grade point average quality points credits cumulative semester term",
  "calculator.grade.title": "Grade calculator",
  "calculator.grade.description":
    "Turn points into a percent, see what a weighted assessment adds to your course grade, or find the points a target needs.",
  "calculator.grade.search":
    "grade percent points earned weighted assignment course grade",
  "calculator.final-grade.title": "Final grade calculator",
  "calculator.final-grade.description":
    "Find the final exam score you need for a target course grade, or project your grade from an exam score.",
  "calculator.final-grade.search":
    "final grade exam score needed what do i need on my final",
  "calculator.test-score.title": "Test score calculator",
  "calculator.test-score.description":
    "Turn correct answers into a percent, count questions missed, or find how many you need to pass.",
  "calculator.test-score.search":
    "test score quiz exam percent correct answers questions missed pass mark",
  "calculator.concrete.title": "Concrete slab calculator",
  "calculator.concrete.description":
    "Work out how many cubic metres of concrete to order for a rectangular slab, with an allowance.",
  "calculator.concrete.search": "concrete slab volume cubic metres ready mix",
  "calculator.paint.title": "Paint calculator",
  "calculator.paint.description":
    "Work out how many litres of paint to buy from wall area, coats and the coverage on the label.",
  "calculator.paint.search": "paint litres walls coats coverage",
  "calculator.flooring.title": "Flooring calculator",
  "calculator.flooring.description":
    "Work out how many packs of laminate or wood flooring to buy for a room, rounded up to whole packs.",
  "calculator.flooring.search": "flooring laminate packs boxes floor area",
  "calculator.roofing.title": "Roof area calculator",
  "calculator.roofing.description":
    "Turn a roof footprint and pitch into sloped roof area for ordering shingles, tiles or sheets.",
  "calculator.roofing.search": "roofing roof area pitch slope shingles",
  "calculator.tile.title": "Tile calculator",
  "calculator.tile.description":
    "Work out how many tiles to buy for a floor or wall from the area and tile size.",
  "calculator.tile.search": "tile tiles floor wall bathroom count",
  "calculator.lumber.title": "Board foot calculator",
  "calculator.lumber.description":
    "Work out board feet of lumber from actual thickness, width, length and the number of boards.",
  "calculator.lumber.search": "lumber board feet timber wood volume",
  "calculator.z-score.title": "Z-score calculator",
  "calculator.z-score.description":
    "See how many standard deviations a value lies above or below the mean.",
  "calculator.z-score.search": "z-score standard score standard deviations",
  "calculator.confidence-interval.title": "Confidence interval calculator",
  "calculator.confidence-interval.description":
    "Find the margin of error and the interval around a sample mean when σ is known.",
  "calculator.confidence-interval.search":
    "confidence interval margin of error mean",
  "calculator.probability.title": "Probability calculator",
  "calculator.probability.description":
    "Find the chance of not A, of A and B, or of A or B from event probabilities.",
  "calculator.probability.search": "probability complement and or union",
  "calculator.weighted-average.title": "Weighted average calculator",
  "calculator.weighted-average.description":
    "Average values that count unequally, such as graded coursework.",
  "calculator.weighted-average.search": "weighted average weighted mean grade",
  "calculator.speed.title": "Speed calculator",
  "calculator.speed.description":
    "Find average speed from the distance travelled and the time it took.",
  "calculator.speed.search": "average speed velocity distance time pace",
  "calculator.force.title": "Force calculator",
  "calculator.force.description":
    "Find the net force from mass and acceleration with Newton’s second law.",
  "calculator.force.search": "net force newton second law mass acceleration",
  "calculator.energy.title": "Kinetic energy calculator",
  "calculator.energy.description":
    "Find the energy of a moving object from its mass and speed.",
  "calculator.energy.search": "kinetic energy joules mass speed motion",
  "calculator.power.title": "Power calculator",
  "calculator.power.description":
    "Find average power in watts from the energy used and the time taken.",
  "calculator.power.search":
    "average power watts energy time joules per second",
  "calculator.density.title": "Density calculator",
  "calculator.density.description":
    "Find density from mass and volume, and see how it compares with water.",
  "calculator.density.search": "density mass volume kg/m3 float sink",
  "calculator.pressure.title": "Pressure calculator",
  "calculator.pressure.description":
    "Find the pressure a force applies when it is spread over an area.",
  "calculator.pressure.search":
    "pressure pascal force area newtons per square metre",
  "calculator.length.title": "Length converter",
  "calculator.length.description":
    "Convert between millimetres, centimetres, metres, kilometres, inches, feet, yards and miles.",
  "calculator.length.search":
    "length converter inches centimetres feet metres miles kilometres",
  "calculator.mass.title": "Mass and weight converter",
  "calculator.mass.description":
    "Convert between pounds, ounces, kilograms, grams and milligrams.",
  "calculator.mass.search":
    "mass weight converter pounds kilograms ounces grams lb kg",
  "calculator.temperature.title": "Temperature converter",
  "calculator.temperature.description":
    "Convert readings between Celsius, Fahrenheit and Kelvin.",
  "calculator.temperature.search":
    "temperature converter celsius fahrenheit kelvin degrees",
  "calculator.speed-conversion.title": "Speed converter",
  "calculator.speed-conversion.description":
    "Convert between km/h, mph, metres per second, feet per second and knots.",
  "calculator.speed-conversion.search":
    "speed converter kmh mph knots metres per second",
  "calculator.duration.title": "Time duration converter",
  "calculator.duration.description":
    "Convert between milliseconds, seconds, minutes, hours, days and weeks.",
  "calculator.duration.search":
    "duration time converter seconds minutes hours days weeks",
  "calculator.cooking-measures.title": "Cooking measures converter",
  "calculator.cooking-measures.description":
    "Convert cups, spoons, fluid ounces, pints and millilitres for recipes.",
  "calculator.cooking-measures.search":
    "cooking measures converter cups tablespoons teaspoons millilitres fluid ounces",
  "calculator.bmi.title": "BMI calculator",
  "calculator.bmi.description":
    "Calculate adult body mass index from weight and height, with its WHO adult range and the formula.",
  "calculator.bmi.search": "bmi",
  "calculator.bmr.title": "Resting energy (BMR) calculator",
  "calculator.bmr.description":
    "Estimate adult resting energy in kcal/day with the Mifflin\u2013St Jeor equations. A prediction, not a measurement or intake target.",
  "calculator.bmr.search": "bmr",
  "calculator.tdee.title": "Daily energy (TDEE) calculator",
  "calculator.tdee.description":
    "Multiply resting energy by a whole-day factor you choose to explore daily expenditure. No diet target is inferred.",
  "calculator.tdee.search": "tdee",
  "calculator.macros.title": "Macro calculator",
  "calculator.macros.description":
    "Turn your own protein, carbohydrate and fat calorie shares into grams per day with 4/4/9 factors. No split is recommended.",
  "calculator.macros.search": "macros",
  "calculator.body-fat.title": "Body fat estimate calculator",
  "calculator.body-fat.description":
    "Estimate adult body fat percentage from BMI and age with the Deurenberg regression. A rough population estimate, not a measurement.",
  "calculator.body-fat.search": "body fat",
  "calculator.water-intake.title": "Water intake calculator",
  "calculator.water-intake.description":
    "Turn body weight and a millilitres-per-kilogram factor you choose into litres per day. Not a prescribed drinking target.",
  "calculator.water-intake.search": "water intake",
  "calculator.ideal-weight.title": "Weight at a chosen BMI",
  "calculator.ideal-weight.description":
    "Find the weight that matches a BMI you choose at your height. It does not claim an ideal personal weight.",
  "calculator.ideal-weight.search": "ideal weight",
  "calculator.meeting-cost.title": "Meeting cost calculator",
  "calculator.meeting-cost.description":
    "See what a meeting costs from who attends and what they earn, per meeting and per year, with a live cost ticker.",
  "calculator.meeting-cost.search":
    "meeting cost salary hourly time team standup recurring calendar",
} as const;

export type MessageKey = keyof typeof en;
export type LocaleNumberState =
  | { state: "incomplete"; raw: string }
  | {
      state: "invalid";
      raw: string;
      reason:
        | "grouping"
        | "ambiguous-separator"
        | "invalid-character"
        | "too-precise"
        | "too-long"
        | "out-of-range";
    }
  | { state: "valid"; raw: string; canonical: string };

/** Normalize a complete locale decimal without rewriting the caller's raw draft text. */
export function parseLocaleDecimal(
  raw: string,
  locale: string,
): LocaleNumberState {
  if (raw.length > 256) return { state: "invalid", raw, reason: "too-long" };
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  const decimal = parts.find((part) => part.type === "decimal")?.value ?? ".";
  const group = parts.find((part) => part.type === "group")?.value;
  const incomplete =
    raw === "" ||
    raw === "+" ||
    raw === "-" ||
    raw === decimal ||
    raw === `+${decimal}` ||
    raw === `-${decimal}` ||
    (raw.endsWith(decimal) &&
      /^[+-]?\d+\.$/.test(decimal === "." ? raw : raw.replace(decimal, ".")));
  if (incomplete) return { state: "incomplete", raw };
  if (/\s/u.test(raw) || (group && raw.includes(group)))
    return { state: "invalid", raw, reason: "grouping" };
  const foreignSeparators = [".", ","].filter(
    (separator) => separator !== decimal,
  );
  if (foreignSeparators.some((separator) => raw.includes(separator)))
    return { state: "invalid", raw, reason: "ambiguous-separator" };
  const escaped = decimal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (
    !new RegExp(`^[+-]?(?:\\d+(?:${escaped}\\d*)?|${escaped}\\d+)$`).test(raw)
  )
    return { state: "invalid", raw, reason: "invalid-character" };
  const canonicalRaw = decimal === "." ? raw : raw.replace(decimal, ".");
  const unsigned = canonicalRaw.replace(/^[+-]/, "");
  const [integerPart = "0", fraction = ""] = unsigned.split(".");
  const significant = `${integerPart}${fraction}`.replace(/^0+/, "");
  if (significant.length > 30)
    return { state: "invalid", raw, reason: "too-precise" };
  const first = integerPart.replace(/^0+/, "").length;
  const exponent = first ? first - 1 : -(fraction.search(/[1-9]/) + 1);
  if (significant && Math.abs(exponent) > 100)
    return { state: "invalid", raw, reason: "out-of-range" };
  const sign = canonicalRaw.startsWith("-") ? "-" : "";
  const integer = integerPart.replace(/^0+(?=\d)/, "") || "0";
  return {
    state: "valid",
    raw,
    canonical: `${sign}${integer}${fraction ? `.${fraction}` : ""}`,
  };
}

/**
 * Groups arbitrary-length exact decimal strings without converting through Number.
 * `fractionDigits` rounds half-up for presentation only (answers, chart labels);
 * working steps keep the default 10-digit display precision.
 */
export function formatDecimal(
  canonical: string,
  locale: string,
  options: { fractionDigits?: number | undefined } = {},
): string {
  if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(canonical))
    throw new TypeError("Expected canonical decimal");
  const formatter = new Intl.NumberFormat(locale);
  const parts = formatter.formatToParts(12345.6);
  const group = parts.find((part) => part.type === "group")?.value;
  const decimal = parts.find((part) => part.type === "decimal")?.value ?? ".";
  const minus =
    formatter.formatToParts(-1).find((part) => part.type === "minusSign")
      ?.value ?? "-";
  const negative = canonical.startsWith("-");
  const unsigned = canonical.replace(/^[+-]/, "");
  const [integerRaw = "0", longFraction = ""] = unsigned.split(".");
  const { integer: integerDigits, fraction: fractionRaw } = roundForDisplay(
    integerRaw.replace(/^0+(?=\d)/, ""),
    longFraction,
    options.fractionDigits,
  );
  const groupingParts = formatter
    .formatToParts(1234567890123)
    .filter((part) => part.type === "integer")
    .map((part) => part.value.length);
  const primaryGroupSize = groupingParts.at(-1) ?? 3;
  const secondaryGroupSize = groupingParts.at(-2) ?? primaryGroupSize;
  const groups: string[] = [];
  let remaining = integerDigits;
  let nextSize = primaryGroupSize;
  while (remaining.length > nextSize) {
    groups.unshift(remaining.slice(-nextSize));
    remaining = remaining.slice(0, -nextSize);
    nextSize = secondaryGroupSize;
  }
  groups.unshift(remaining);
  const grouped = group ? groups.join(group) : groups.join("");
  const digitFormatter = new Intl.NumberFormat(locale, { useGrouping: false });
  const digits = Array.from({ length: 10 }, (_, digit) =>
    digitFormatter.format(digit),
  );
  const localizeDigits = (value: string) =>
    value.replace(/\d/g, (digit) => digits[Number(digit)] ?? digit);
  const integer = localizeDigits(grouped);
  const fraction = fractionRaw.replace(/0+$/, "");
  const isZero = /^0*$/.test(integerDigits + fraction);
  return `${negative && !isZero ? minus : ""}${integer}${fraction ? decimal + localizeDigits(fraction) : ""}`;
}

/** Whether presenting `canonical` at `fractionDigits` drops nonzero digits. */
export function isRoundedForDisplay(
  canonical: string,
  fractionDigits: number,
): boolean {
  const fraction = canonical.split(".")[1] ?? "";
  return /[1-9]/.test(fraction.slice(Math.max(0, fractionDigits)));
}

/** Display precision: 10 decimals, or 10 significant digits below 1. */
const DISPLAY_DIGITS = 10;

function roundForDisplay(
  integer: string,
  fraction: string,
  fractionDigits?: number,
): { integer: string; fraction: string } {
  const leadingZeros = /^0*/.exec(fraction)?.[0].length ?? 0;
  const keep =
    fractionDigits !== undefined
      ? Math.max(0, Math.floor(fractionDigits))
      : integer === "0"
        ? leadingZeros + DISPLAY_DIGITS
        : DISPLAY_DIGITS;
  if (keep === 0) {
    const up = (fraction[0] ?? "0") >= "5";
    return {
      integer: (BigInt(integer) + (up ? 1n : 0n)).toString(),
      fraction: "",
    };
  }
  if (fraction.length <= keep) return { integer, fraction };
  const roundUp = (fraction[keep] ?? "0") >= "5";
  const rounded = (
    BigInt(integer + fraction.slice(0, keep)) + (roundUp ? 1n : 0n)
  )
    .toString()
    .padStart(keep + 1, "0");
  return { integer: rounded.slice(0, -keep), fraction: rounded.slice(-keep) };
}

export function plural(
  locale: string,
  count: number,
  forms: Readonly<
    Partial<Record<Intl.LDMLPluralRule, string>> & { other: string }
  >,
): string {
  const rule = new Intl.PluralRules(locale).select(count);
  return forms[rule] ?? forms.other;
}

export type WorkingRenderContext = {
  locale: string;
  messages: Readonly<Record<string, string>>;
  references?: Readonly<Record<string, string>>;
};

export function renderWorkingStep(
  step: WorkingStep,
  context: WorkingRenderContext,
): string {
  const template =
    readOwnString(context.messages, step.messageKey) ?? `[${step.messageKey}]`;
  return interpolateMessage(template, step.args, context);
}

export function interpolateMessage(
  template: string,
  args: Readonly<Record<string, WorkingArgument>>,
  context: WorkingRenderContext,
): string {
  return template.replace(
    /\{([A-Za-z][A-Za-z0-9_.-]*)\}/g,
    (placeholder, name: string) => {
      if (!Object.hasOwn(args, name)) return placeholder;
      const argument = args[name];
      return argument === undefined
        ? placeholder
        : renderWorkingArgument(argument, context, 0);
    },
  );
}

function renderWorkingArgument(
  argument: WorkingArgument,
  context: WorkingRenderContext,
  depth: number,
): string {
  if (depth > 12) return "[…]";
  switch (argument.kind) {
    case "decimal":
      return formatDecimal(argument.value, context.locale);
    case "text":
      return argument.value;
    case "reference":
      return (
        (context.references &&
          readOwnString(context.references, argument.id)) ??
        `[${argument.id}]`
      );
    case "message": {
      const nestedTemplate =
        readOwnString(context.messages, argument.key) ?? `[${argument.key}]`;
      return interpolateNested(
        nestedTemplate,
        argument.args ?? {},
        context,
        depth + 1,
      );
    }
  }
}

function readOwnString(
  values: Readonly<Record<string, string>>,
  key: string,
): string | undefined {
  if (!Object.hasOwn(values, key)) return undefined;
  const value = values[key];
  return typeof value === "string" ? value : undefined;
}

function interpolateNested(
  template: string,
  args: Readonly<Record<string, WorkingArgument>>,
  context: WorkingRenderContext,
  depth: number,
): string {
  return template.replace(
    /\{([A-Za-z][A-Za-z0-9_.-]*)\}/g,
    (placeholder, name: string) => {
      if (!Object.hasOwn(args, name)) return placeholder;
      const argument = args[name];
      return argument === undefined
        ? placeholder
        : renderWorkingArgument(argument, context, depth);
    },
  );
}
