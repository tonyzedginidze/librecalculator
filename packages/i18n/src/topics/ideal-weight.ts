export const messages = {
  "ideal-weight.operation.bmi-weight": "Weight at a BMI",
  "ideal-weight.field.height": "Height",
  "ideal-weight.field.targetBmi": "Chosen BMI",
  "ideal-weight.field.age": "Age",
  "ideal-weight.unit.cm": "Centimetres (cm)",
  "ideal-weight.unit.bmi": "Body mass index (kg/m\u00b2)",
  "ideal-weight.unit.years": "Years (years)",
  "ideal-weight.answer.unit": "kg",
  "ideal-weight.working.summary":
    "Chosen BMI {targetBmi} \u00d7 ({height} \u00f7 100)\u00b2 = {answer} kg. Adult age context: {age}. This scenario does not determine an ideal personal weight.",
  "ideal-weight.visual.description":
    "Two aligned scales convert BMI to kilograms at the entered height; the marker is the chosen BMI. The scale is for orientation only and does not identify an ideal or healthy weight.",
  "ideal-weight.visual.alternative":
    "The exact numbers and their units are stated in the visible text. Predictions and scenario inputs are not medical measurements or prescriptions.",
  "ideal-weight.visual.caption": "BMI and weight at {height} cm",
  "ideal-weight.visual.summary":
    "At {height} cm, a BMI of {bmi} corresponds to {answer} kg. The scale runs from BMI {low} ({lowKg} kg) to BMI {high} ({highKg} kg).",
  "ideal-weight.visual.bmi": "kg/m\u00b2",
  "ideal-weight.visual.kg": "kg",
  "ideal-weight.error.invalid-field":
    "Enter a valid number in the stated metric units.",
  "ideal-weight.error.out-of-range":
    "Use values inside the documented field limits.",
  "ideal-weight.error.output-overflow":
    "The result exceeds the supported numeric or money range.",
  "lesson.ideal-weight.intro.title": "Weight at a chosen adult BMI",
  "lesson.ideal-weight.intro.body":
    "There is no single ideal body weight determined by height alone. This calculator reverses the adult BMI formula for a BMI value you choose, without recommending a target or labelling it ideal.",
  "lesson.ideal-weight.method.title": "Choose the question and enter values",
  "lesson.ideal-weight.method.body":
    "Enter height in centimetres, an explicit BMI scenario and adult age. The result answers a mathematical question about that scenario; it does not decide whether you should change your weight.",
  "lesson.ideal-weight.formula":
    "w = B \u00d7 (h \u00f7 100)\u00b2, with w in kilograms, B the chosen BMI and h the height in centimetres.",
  "lesson.ideal-weight.mistakes.title": "Common mistakes",
  "lesson.ideal-weight.mistakes.body":
    "Do not confuse a reference BMI with a personal health goal. Muscle, body composition, medical history and other circumstances matter beyond this arithmetic.",
  "lesson.ideal-weight.limits.title": "Assumptions and limits",
  "lesson.ideal-weight.limits.body":
    "Adult ages 20\u2013120, height 100\u2013250cm, chosen BMI 10\u201350. Bounds are scenario controls, not a recommended range. Not for children, pregnancy or a treatment plan. No weight-change advice is generated. Educational information only, not medical advice, diagnosis or an individualized nutrition plan.",
  "lesson.ideal-weight.faq.q": "Why does this not give one ideal weight?",
  "lesson.ideal-weight.faq.a":
    "An individual health goal cannot be derived from height alone. The chosen BMI is an explicit assumption, and the output only expresses it as kilograms.",
  "lesson.ideal-weight.sources.title": "Method and references",
  "lesson.ideal-weight.sources.body":
    "This is an algebraic rearrangement of CDC\u2019s metric BMI formula: https://www.cdc.gov/growth-chart-training/hcp/using-bmi/calculating-bmi.html . CDC\u2019s overview explains why BMI needs context: https://www.cdc.gov/bmi/about/index.html . Neither source endorses the calculator\u2019s example BMI as an individual goal.",
  "lesson.ideal-weight.example.1": "Two metres and a BMI scenario of twenty",
  "lesson.ideal-weight.example.2":
    "One hundred sixty centimetres and twenty-five",
  "lesson.ideal-weight.example.3":
    "One hundred eighty centimetres and twenty-five",
} as const;
