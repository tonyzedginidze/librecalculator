export const messages = {
  "bmi.operation.bmi": "Calculate adult BMI",
  "bmi.field.weight": "Body weight",
  "bmi.field.height": "Height",
  "bmi.field.age": "Age",
  "bmi.unit.kg": "Kilograms (kg)",
  "bmi.unit.cm": "Centimetres (cm)",
  "bmi.unit.years": "Years (years)",
  "bmi.answer.unit": "kg/m\u00b2",
  "bmi.working.summary":
    "{weight} kg \u00d7 10000 \u00f7 ({height} cm \u00d7 {height} cm) = {answer} kg/m\u00b2. Age {age} confirms the adult context.",
  "bmi.working.category":
    "{answer} kg/m\u00b2 falls in the WHO adult range {range}: {category}.",
  "bmi.range.below": "below {to}",
  "bmi.range.between": "{from} to under {to}",
  "bmi.range.from": "{from} or more",
  "bmi.category.underweight": "Underweight",
  "bmi.category.healthy": "Healthy weight",
  "bmi.category.overweight": "Overweight",
  "bmi.category.obesity-1": "Obesity class I",
  "bmi.category.obesity-2": "Obesity class II",
  "bmi.category.obesity-3": "Obesity class III",
  "bmi.answer.category": "WHO adult category: {category} ({range} kg/m\u00b2)",
  "bmi.answer.limit":
    "For adults only. BMI is a screening measure, not a diagnosis.",
  "bmi.visual.caption": "Where this BMI sits on a 15 to 40 scale",
  "bmi.visual.summary":
    "A dial from 15 to 40 kg/m\u00b2 points at {answer}, inside the WHO adult band for {category} ({range}).",
  "bmi.visual.description":
    "Ticks and alternating shades mark the WHO adult cut-offs at 18.5, 25, 30, 35 and 40 kg/m\u00b2; the needle sits in the band named above. The dial ends at 15 and 40 for scale.",
  "bmi.visual.alternative":
    "The exact numbers and their units are stated in the visible text. Predictions and scenario inputs are not medical measurements or prescriptions.",
  "bmi.error.invalid-field": "Enter a valid number in the stated metric units.",
  "bmi.error.out-of-range": "Use values inside the documented field limits.",
  "bmi.error.output-overflow":
    "The result exceeds the supported numeric or money range.",
  "lesson.bmi.intro.title": "Adult body mass index",
  "lesson.bmi.intro.body":
    "BMI is a weight-to-height screening measure for adults aged twenty and older. It is not a direct body-fat measurement or an individual diagnosis. Next to the number, this calculator names the WHO adult category it falls in: underweight below 18.5, healthy weight from 18.5 to under 25, overweight from 25 to under 30, and obesity from 30, split into class I (30 to under 35), class II (35 to under 40) and class III (40 or more). The category is compared on the exact BMI, before rounding for display.",
  "lesson.bmi.method.title": "Choose the question and enter values",
  "lesson.bmi.method.body":
    "Measure body weight in kilograms and height in centimetres. Enter adult age to confirm that the adult formula is the intended context. Height is squared, so measurement errors matter.",
  "lesson.bmi.formula":
    "BMI = 10000 \u00d7 w \u00f7 h\u00b2, with w in kilograms and h in centimetres.",
  "lesson.bmi.mistakes.title": "Common mistakes",
  "lesson.bmi.mistakes.body":
    "Do not enter metres in the centimetre field. BMI does not distinguish muscle from fat and should not replace a broader assessment.",
  "lesson.bmi.limits.title": "Assumptions and limits",
  "lesson.bmi.limits.body":
    "Adult ages 20\u2013120, weight 20\u2013350kg and height 100\u2013250cm. These bounds are input controls, not validation that the model is appropriate. Children, pregnancy and individual clinical assessments require other methods. Educational information only, not medical advice, diagnosis or an individualized nutrition plan.",
  "lesson.bmi.faq.q": "Does a BMI number diagnose health?",
  "lesson.bmi.faq.a":
    "No. The WHO category is a population screening band, not a diagnosis. Medical interpretation also needs the individual\u2019s history, body composition and other observations.",
  "lesson.bmi.sources.title": "Method and references",
  "lesson.bmi.sources.body":
    "The metric BMI formula and adult context are documented by CDC: https://www.cdc.gov/growth-chart-training/hcp/using-bmi/calculating-bmi.html . Screening limitations: https://www.cdc.gov/bmi/about/index.html . WHO adult BMI categories: https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index .",
  "lesson.bmi.example.1": "Example: 70 kg at 2.00 m",
  "lesson.bmi.example.2": "Example: 64 kg at 1.60 m",
  "lesson.bmi.example.3": "Example: 81 kg at 1.80 m",
} as const;
