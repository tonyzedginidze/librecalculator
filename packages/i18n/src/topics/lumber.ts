export const messages = {
  "lumber.operation.board-feet": "Board feet",
  "lumber.field.thickness": "Thickness",
  "lumber.field.width": "Width",
  "lumber.field.length": "Length",
  "lumber.field.quantity": "Boards",
  "lumber.unit.in": "Inches (in)",
  "lumber.unit.ft": "Feet (ft)",
  "lumber.answer.unit": "board ft",
  "lumber.working.summary":
    "{thickness} in × {width} in × {length} ft ÷ 12 = {perBoard} board ft per board. × {quantity} boards = {answer} board ft.",
  "lumber.visual.caption": "One board, then the whole stack",
  "lumber.visual.thickness": "T {value} in",
  "lumber.visual.width": "W {value} in",
  "lumber.visual.length": "L {value} ft",
  "lumber.visual.per-board": "per board",
  "lumber.visual.boards": "boards",
  "lumber.visual.total": "total",
  "lumber.visual.summary":
    "One board {thickness} in thick, {width} in wide and {length} ft long is {perBoard} board feet; {quantity} boards make {answer} board feet.",
  "lumber.visual.description":
    "The board is drawn with its thickness and width enlarged so the labels stay readable. One board foot is 144 cubic inches: 1 in × 12 in × 1 ft.",
  "lumber.visual.alternative":
    "Thickness, width, length, board feet per board, board count and total are stated as numbers in the diagram.",
  "lumber.error.invalid-field":
    "Enter a positive number. Dimensions must be greater than zero.",
  "lumber.error.out-of-range":
    "Use dimensions up to 1,000,000 and 1 to 100 boards.",
  "lumber.error.output-overflow": "The result is too large to show.",
  "lesson.lumber.intro.title": "Lumber board-foot volume",
  "lesson.lumber.intro.body":
    "A board foot measures lumber volume: one inch thick by twelve inches wide by one foot long. It is a volume convention, not a count of boards or a structural rating.",
  "lesson.lumber.method.title": "Measure the actual board",
  "lesson.lumber.method.body":
    "Enter actual measured thickness and width in inches, length in feet, and the whole-board quantity. A nominal 2×6 typically measures 1.5 in × 5.5 in. If purchasing by a supplier’s nominal tally, confirm their measurement convention.",
  "lesson.lumber.formula": "B = T × W × L × n ÷ 12",
  "lesson.lumber.variable.board-feet": "Board feet",
  "lesson.lumber.mistakes.title": "Common mistakes",
  "lesson.lumber.mistakes.body":
    "A nominal two-by-four usually does not measure two inches by four inches. Using nominal dimensions in an actual-volume estimate overstates the wood volume.",
  "lesson.lumber.limits.title": "Assumptions and limits",
  "lesson.lumber.limits.body":
    "Positive dimensions up to one million; integer quantity 1–100. Decimal board-foot volume is not rounded to a purchasing count. Species, grade, moisture, strength and waste allowances are outside scope. Material estimates only; verify measurements, product guidance and site requirements before ordering.",
  "lesson.lumber.faq.q": "Is one board foot one square foot?",
  "lesson.lumber.faq.a":
    "No. A board foot is a volume of 144 cubic inches. Square feet measure area and require a thickness to become volume.",
  "lesson.lumber.sources.title": "Method and references",
  "lesson.lumber.sources.body":
    "Thickness and width in inches times length in feet gives inch-inch-feet; dividing by 12 converts to board feet of 144 cubic inches each. Nominal-to-actual sizes vary by supplier and species.",
  "lesson.lumber.example.1": "One one-by-twelve, eight feet long",
  "lesson.lumber.example.2": "Four actual-size two-by-fours",
  "lesson.lumber.example.3": "Two thick wide boards",
} as const;
