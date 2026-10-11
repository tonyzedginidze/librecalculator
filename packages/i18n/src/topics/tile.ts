export const messages = {
  "tile.operation.tiles": "Tiles to buy",
  "tile.field.area": "Area to tile",
  "tile.field.tileWidth": "Tile width",
  "tile.field.tileHeight": "Tile height",
  "tile.field.waste": "Cutting allowance",
  "tile.unit.m2": "Square metres (m²)",
  "tile.unit.cm": "Centimetres (cm)",
  "tile.unit.percent": "Percent (%)",
  "tile.answer.one": "tile",
  "tile.answer.other": "tiles",
  "tile.working.summary":
    "One tile is {tileWidth} cm × {tileHeight} cm. {area} m² × 10,000 cm²/m² × (1 + {waste}/100) ÷ tile face, rounded up = {answer} tiles.",
  "tile.visual.caption": "Tiles needed, rounded up to whole tiles",
  "tile.visual.count": "{exact} tiles needed → buy {answer}",
  "tile.visual.label": "one square per tile",
  "tile.visual.needed": "Tiles needed",
  "tile.visual.buy": "Tiles to buy",
  "tile.visual.summary":
    "{area} m² with a {waste}% allowance covers {exact} tiles of {tileArea} cm², so buy {answer} whole tiles.",
  "tile.visual.description":
    "Filled squares are whole tiles; the part-filled square is the share of the last tile you need. Grout joints and layout cuts are not modelled.",
  "tile.visual.alternative":
    "The exact tile count before rounding and the whole tiles to buy are stated as numbers under the grid.",
  "tile.error.invalid-field":
    "Enter a positive number. Area and tile sizes must be greater than zero.",
  "tile.error.out-of-range":
    "Use sizes up to 1,000,000 and an allowance from 0 to 100%.",
  "tile.error.output-overflow": "The result is too large to show.",
  "lesson.tile.intro.title": "Tile count by dimensions",
  "lesson.tile.intro.body":
    "Tile dimensions in centimetres give an area in square centimetres. Converting the surface area consistently and rounding up gives a first estimate of the number of tiles to buy.",
  "lesson.tile.method.title": "Measure the surface and one tile",
  "lesson.tile.method.body":
    "Enter the net area in square metres and the face dimensions of one tile in centimetres. Set the allowance explicitly for cutting, breakage and spare tiles; 10% is a common starting point.",
  "lesson.tile.formula": "N = ⌈A × 10000 × (1 + a/100) ÷ (w × h)⌉",
  "lesson.tile.variable.tiles": "Whole tiles to buy",
  "lesson.tile.mistakes.title": "Common mistakes",
  "lesson.tile.mistakes.body":
    "Do not mix millimetres with centimetres. The count treats tiles as continuous coverage; grout spacing and layout can change the actual count.",
  "lesson.tile.limits.title": "Assumptions and limits",
  "lesson.tile.limits.body":
    "Uniform rectangular tiles, positive dimensions and area up to one million; allowance 0–100%. Counts round up after applying allowance. Layout, joint width, edge cuts and tiles per box are not inferred. Material estimates only; verify measurements, product guidance and site requirements before ordering.",
  "lesson.tile.faq.q": "Does this include grout joints?",
  "lesson.tile.faq.a":
    "No. It divides the surface by the tile face area. A detailed layout with the selected joint width is needed for a more exact count.",
  "lesson.tile.sources.title": "Method and references",
  "lesson.tile.sources.body":
    "Square metres converted to square centimetres (× 10,000), scaled by an explicit percentage allowance, divided by one tile’s face area and rounded up once at the end. Box quantities and allowances must come from the chosen product.",
  "lesson.tile.example.1": "50 cm square tiles on 10 m²",
  "lesson.tile.example.2": "25 cm square tiles on 1 m²",
  "lesson.tile.example.3": "A count requiring rounding",
} as const;
