export const messages = {
  "body-fat.operation.male-regression": "Male regression",
  "body-fat.operation.female-regression": "Female regression",
  "body-fat.field.weight": "Body weight",
  "body-fat.field.height": "Height",
  "body-fat.field.age": "Age",
  "body-fat.unit.kg": "Kilograms (kg)",
  "body-fat.unit.cm": "Centimetres (cm)",
  "body-fat.unit.years": "Years (years)",
  "body-fat.answer.unit": "%",
  "body-fat.working.summary":
    "{weight} kg \u00d7 10000 \u00f7 ({height} cm)\u00b2 = BMI {reference}. {question}: 1.2 \u00d7 {reference} + 0.23 \u00d7 {age} \u2212 5.4, minus a further 10.8 for the male regression, gives {answer}%.",
  "body-fat.visual.description":
    "The bar splits the entered body weight by the predicted percentage into estimated fat mass and fat-free mass. It is a regression estimate with an error of about four percentage points, not a body-composition measurement.",
  "body-fat.visual.alternative":
    "The exact numbers and their units are stated in the visible text. Predictions and scenario inputs are not medical measurements or prescriptions.",
  "body-fat.visual.caption": "Body weight split by the estimate",
  "body-fat.visual.summary":
    "Of {weight} kg, an estimated {fat} kg is fat mass and {fatFree} kg is fat-free mass, from a predicted {answer}% at BMI {bmi}.",
  "body-fat.visual.total": "Body weight",
  "body-fat.visual.fat": "Estimated fat mass",
  "body-fat.visual.fat-free": "Fat-free mass",
  "body-fat.visual.mass": "{value} kg",
  "body-fat.error.invalid-field":
    "Enter a valid number in the stated metric units.",
  "body-fat.error.out-of-range":
    "Use values inside the documented field limits.",
  "body-fat.error.output-overflow":
    "The result exceeds the supported numeric or money range.",
  "lesson.body-fat.intro.title": "Body-fat regression estimate",
  "lesson.body-fat.intro.body":
    "This calculator evaluates a published population regression based on BMI and age. It is a rough estimate, not a body-composition measurement, diagnosis or fitness goal.",
  "lesson.body-fat.method.title": "Choose the question and enter values",
  "lesson.body-fat.method.body":
    "Choose the published sex-specific regression and enter adult weight, height and age. The source uses male and female coefficients. The input BMI must remain inside the calculator\u2019s documented research-range gate.",
  "lesson.body-fat.formula":
    "Body fat % = 1.2 \u00d7 BMI + 0.23 \u00d7 A \u2212 10.8 \u00d7 S \u2212 5.4, with BMI = 10000 \u00d7 w \u00f7 h\u00b2 (w in kg, h in cm), A in years, S = 1 for the male and 0 for the female regression.",
  "lesson.body-fat.mistakes.title": "Common mistakes",
  "lesson.body-fat.mistakes.body":
    "Muscularity and individual body composition can make a BMI-based estimate misleading. Do not read small decimal differences as measured changes in body fat.",
  "lesson.body-fat.limits.title": "Assumptions and limits",
  "lesson.body-fat.limits.body":
    "Adult ages 20\u201383; BMI 13.9\u201340.9, weight 20\u2013350kg, height 100\u2013250cm. The input range is not an individual validity guarantee. Not for children, pregnancy, clinical care or performance targets. Published regression error is about four body-fat percentage points; errors can be greater for individuals. Educational information only, not medical advice, diagnosis or an individualized nutrition plan.",
  "lesson.body-fat.faq.q": "Why can this differ from a scan or other method?",
  "lesson.body-fat.faq.a":
    "It predicts body fat from indirect measurements. A scan, skinfold assessment or other method measures different information and has its own uncertainty.",
  "lesson.body-fat.sources.title": "Method and references",
  "lesson.body-fat.sources.body":
    "Deurenberg P, Weststrate JA, Seidell JC, 1991, Body mass index as a measure of body fatness: age- and sex-specific prediction formulas: https://pubmed.ncbi.nlm.nih.gov/2043597/ . The adult equation uses BMI, age and the published male/female coefficient; reported standard error of estimate is 4.1 body-fat percentage points.",
  "lesson.body-fat.example.1": "Male regression with BMI twenty",
  "lesson.body-fat.example.2": "Female regression for the same measurements",
  "lesson.body-fat.example.3": "Male regression with BMI twenty-five",
} as const;
