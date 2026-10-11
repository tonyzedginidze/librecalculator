// Generated pack metadata. No engines or lessons are imported.
export const packCatalog = [
  {
    "id": "construction",
    "version": 1,
    "category": "construction",
    "titleKey": "ui.pack.construction.title",
    "descriptionKey": "ui.pack.construction.description",
    "calculatorIds": [
      "concrete",
      "paint",
      "flooring",
      "roofing",
      "tile",
      "lumber"
    ],
    "default": false
  },
  {
    "id": "cooking",
    "version": 1,
    "category": "cooking",
    "titleKey": "ui.pack.cooking.title",
    "descriptionKey": "ui.pack.cooking.description",
    "calculatorIds": [
      "recipe-scaling",
      "cup-gram-conversion",
      "oven-temperature",
      "baking-ratios",
      "calories-per-serving"
    ],
    "default": false
  },
  {
    "id": "core",
    "version": 1,
    "category": "math",
    "titleKey": "ui.pack.core.title",
    "descriptionKey": "ui.pack.core.description",
    "calculatorIds": [
      "percentage",
      "percentage-change",
      "fractions",
      "unit-conversion",
      "area",
      "volume",
      "pythagorean",
      "compound-interest",
      "loan-payments",
      "tip-splitting"
    ],
    "default": true
  },
  {
    "id": "date-time",
    "version": 1,
    "category": "date-time",
    "titleKey": "ui.pack.date-time.title",
    "descriptionKey": "ui.pack.date-time.description",
    "calculatorIds": [
      "age",
      "date-difference",
      "countdown",
      "work-hours",
      "time-zone"
    ],
    "default": false
  },
  {
    "id": "education",
    "version": 1,
    "category": "education",
    "titleKey": "ui.pack.education.title",
    "descriptionKey": "ui.pack.education.description",
    "calculatorIds": [
      "gpa",
      "grade",
      "final-grade",
      "test-score"
    ],
    "default": false
  },
  {
    "id": "finance",
    "version": 1,
    "category": "finance",
    "titleKey": "ui.pack.finance.title",
    "descriptionKey": "ui.pack.finance.description",
    "calculatorIds": [
      "mortgage",
      "savings",
      "roi",
      "salary",
      "margin-markup",
      "inflation",
      "retirement"
    ],
    "default": false
  },
  {
    "id": "geometry",
    "version": 1,
    "category": "geometry",
    "titleKey": "ui.pack.geometry.title",
    "descriptionKey": "ui.pack.geometry.description",
    "calculatorIds": [
      "rectangle",
      "triangle",
      "circle",
      "sphere",
      "cylinder"
    ],
    "default": false
  },
  {
    "id": "health",
    "version": 1,
    "category": "health",
    "titleKey": "ui.pack.health.title",
    "descriptionKey": "ui.pack.health.description",
    "calculatorIds": [
      "bmi",
      "bmr",
      "tdee",
      "macros",
      "body-fat",
      "water-intake",
      "ideal-weight"
    ],
    "default": false
  },
  {
    "id": "math-everyday",
    "version": 1,
    "category": "math",
    "titleKey": "pack.math-everyday.title",
    "descriptionKey": "pack.math-everyday.description",
    "calculatorIds": [
      "discount",
      "average",
      "standard-deviation",
      "ratio",
      "scientific",
      "random-number",
      "fuel-economy"
    ],
    "default": false
  },
  {
    "id": "physics",
    "version": 1,
    "category": "physics",
    "titleKey": "ui.pack.physics.title",
    "descriptionKey": "ui.pack.physics.description",
    "calculatorIds": [
      "speed",
      "force",
      "energy",
      "power",
      "density",
      "pressure"
    ],
    "default": false
  },
  {
    "id": "statistics",
    "version": 1,
    "category": "statistics",
    "titleKey": "ui.pack.statistics.title",
    "descriptionKey": "ui.pack.statistics.description",
    "calculatorIds": [
      "z-score",
      "confidence-interval",
      "probability",
      "weighted-average"
    ],
    "default": false
  },
  {
    "id": "units",
    "version": 1,
    "category": "units",
    "titleKey": "ui.pack.units.title",
    "descriptionKey": "ui.pack.units.description",
    "calculatorIds": [
      "length",
      "mass",
      "temperature",
      "speed-conversion",
      "duration",
      "cooking-measures"
    ],
    "default": false
  }
] as const;
export type PackId = (typeof packCatalog)[number]["id"];
export const calculatorPacks = {
  "concrete": "construction",
  "paint": "construction",
  "flooring": "construction",
  "roofing": "construction",
  "tile": "construction",
  "lumber": "construction",
  "recipe-scaling": "cooking",
  "cup-gram-conversion": "cooking",
  "oven-temperature": "cooking",
  "baking-ratios": "cooking",
  "calories-per-serving": "cooking",
  "percentage": "core",
  "percentage-change": "core",
  "fractions": "core",
  "unit-conversion": "core",
  "area": "core",
  "volume": "core",
  "pythagorean": "core",
  "compound-interest": "core",
  "loan-payments": "core",
  "tip-splitting": "core",
  "age": "date-time",
  "date-difference": "date-time",
  "countdown": "date-time",
  "work-hours": "date-time",
  "time-zone": "date-time",
  "gpa": "education",
  "grade": "education",
  "final-grade": "education",
  "test-score": "education",
  "mortgage": "finance",
  "savings": "finance",
  "roi": "finance",
  "salary": "finance",
  "margin-markup": "finance",
  "inflation": "finance",
  "retirement": "finance",
  "rectangle": "geometry",
  "triangle": "geometry",
  "circle": "geometry",
  "sphere": "geometry",
  "cylinder": "geometry",
  "bmi": "health",
  "bmr": "health",
  "tdee": "health",
  "macros": "health",
  "body-fat": "health",
  "water-intake": "health",
  "ideal-weight": "health",
  "discount": "math-everyday",
  "average": "math-everyday",
  "standard-deviation": "math-everyday",
  "ratio": "math-everyday",
  "scientific": "math-everyday",
  "random-number": "math-everyday",
  "fuel-economy": "math-everyday",
  "speed": "physics",
  "force": "physics",
  "energy": "physics",
  "power": "physics",
  "density": "physics",
  "pressure": "physics",
  "z-score": "statistics",
  "confidence-interval": "statistics",
  "probability": "statistics",
  "weighted-average": "statistics",
  "length": "units",
  "mass": "units",
  "temperature": "units",
  "speed-conversion": "units",
  "duration": "units",
  "cooking-measures": "units"
} as const;
