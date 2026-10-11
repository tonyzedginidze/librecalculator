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
    "{weight} kg \u00d7 10000 \u00f7 ({height} cm \u00d7 {height} cm) = {answer} kg/m\u00b2. Age {age} confirms the adult context; this number is not a diagnosis.",
  "bmi.visual.caption": "Where this BMI sits on a 15 to 40 scale",
  "bmi.visual.summary":
    "A dial from 15 to 40 kg/m\u00b2 points at {answer}, with a dotted reference mark at {reference}.",
  "bmi.visual.description":
    "The dotted mark at 25 is a numeric reference for scale only, not a clinical classification or health target.",
  "bmi.visual.alternative":
    "The exact numbers and their units are stated in the visible text. Predictions and scenario inputs are not medical measurements or prescriptions.",
  "bmi.visual.reference": "Reference mark at {reference}",
  "bmi.error.invalid-field": "Enter a valid number in the stated metric units.",
  "bmi.error.out-of-range": "Use values inside the documented field limits.",
  "bmi.error.output-overflow":
    "The result exceeds the supported numeric or money range.",
  "lesson.bmi.intro.title": "Adult body mass index",
  "lesson.bmi.intro.body":
    "BMI is a weight-to-height screening measure for adults aged twenty and older. It is not a direct body-fat measurement or an individual diagnosis. This calculator shows the number without assigning a health label.",
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
    "No. It is a screening measurement. Medical interpretation also needs the individual\u2019s history, body composition and other observations.",
  "lesson.bmi.sources.title": "Method and references",
  "lesson.bmi.sources.body":
    "The metric BMI formula and adult context are documented by CDC: https://www.cdc.gov/growth-chart-training/hcp/using-bmi/calculating-bmi.html . Screening limitations: https://www.cdc.gov/bmi/about/index.html .",
  "lesson.bmi.example.1": "Seventy kilograms at two metres",
  "lesson.bmi.example.2":
    "Sixty-four kilograms at one hundred sixty centimetres",
  "lesson.bmi.example.3":
    "Eighty-one kilograms at one hundred eighty centimetres",
} as const;
