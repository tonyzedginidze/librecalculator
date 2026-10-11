# Tile illustrations

Every calculator has a 320×180 card illustration on the browse grid (`CalculatorArt`).
Hundreds of them will sit side by side, so they must read as one set drawn by one
hand: flat, precise, calm, premium. Not clip art and not a child's drawing.

Read this before you draw a tile. [design-system.md](design-system.md) has the short
version; this page is the full brief, with the mistakes we already made and fixed.

## Where tiles live

| What | Where |
|---|---|
| Core tiles | `scenes` in `packages/dom-ui/src/components/art.tsx`, or one file per tile in `components/illustrations/<id>.tsx` imported there |
| Pack tiles | One `<pack>-art.tsx` exporting `<pack>Scenes` (and `<pack>OperationPaths`), spread into `scenes` in `art.tsx`. Existing: `math-art`, `science-art`, `date-art`, `physics-art`, `cooking-art`, `education-art`, `geometry-art`, `topics/finance-art`, `topics/health-art`, `topics/construction-art` |
| Key | The calculator id, exactly as in the catalog |
| Wrapper | `CalculatorArt` already renders `<svg viewBox="0 0 320 180" aria-hidden>`; a scene is a `<g>` or fragment |

Delete any draft file that nothing imports. Unused old drawings get copied by the next
author.

## The look in one paragraph

One concrete object that a person recognises in half a second (a jar, a ruler, a
plate, a bell curve), drawn with accent outlines on soft and surface fills, with at
most one short mono label. Everything is geometric: rectangles, circles, clean arcs,
straight lines. Nothing is shaded, glossy, outlined in black or wobbly.

## Rules

### Palette: theme tokens only

| Token | Use |
|---|---|
| `var(--oc-accent)` | Outlines and the one key mark (the served slice, the answer bar) |
| `var(--oc-accent-soft)` | Main fill of the hero object |
| `var(--oc-surface)` | Paper, secondary fills, empty parts |
| `var(--oc-line)` | Ground line, grids, quiet detail, placeholder text bars |
| `var(--oc-ink)` | Only a numeral, or a tiny detail. Under 10% of strokes. Never outlines |

- No hex, `rgb()` or `hsl()`. The category sets `--oc-accent`, and dark mode swaps the
  tokens, so a raw colour breaks one of them.
- No gradients, filters, drop shadows, glows or embedded images.
- One `opacity="0.45"` is allowed for a "before" or ghost state.
- At most one solid accent area. If everything is accent, nothing is the key mark.

### Strokes

- 2.5 for outlines, 1.75 for interior detail. Nothing under 1.5.
- Round caps and round joins everywhere.
- Dashes (`4 4`) only for one dimension line or one motion path, and see the
  connector rules below.

### Shapes and joins

- Integer or .5 coordinates. Symmetric objects are symmetric to the pixel.
- Corner radius 4 on large parts, 2–3 on small parts. Pills use radius = height/2.
- Use primitives and clean arcs (`a r r 0 0 1`). No freehand cubic paths that
  wobble, and no hand-drawn look.
- **Where two shapes meet, their corners agree.** A filled part inside a rounded
  outline follows that outline's radius on its outer corners and stays square where
  it meets the other part. Draw the parts as fills, then draw one outline on top.
- Geometry figures (rectangle, triangle) have sharp corners, because a right-angle
  mark or a vertex dot must sit exactly on the corner.
- Proportions in the drawing match the label: a "×1.5" stack is 1.5 times the base
  height, a "3/8" pie has 3 of 8 slices filled, and an average line sits at the
  real mean of the bars drawn.

### Connectors, arrows and dashed paths

- A connector starts and ends with a clear gap (4–8px) from the shapes it links. It
  never disappears behind a shape and never stops on top of an outline.
- An arrow is either a clean chevron head on a straight or single-arc shaft in accent,
  or it is left out. No hand-drawn curly arrows, no ink arrows.
- Drop a connector if the picture reads without it. Short dashed stubs between two
  objects are noise.

### Composition

- Keep everything inside x 40–280, y 28–152.
- The hero object spans about 140–220 × 90–124, so every tile carries similar weight.
- Optional ground line at y 148 (`line`, 2px, round caps).
- At most three objects. Supporting objects are smaller than the hero.

### Text

- At most one `<text>` element: one short label or number, e.g. `m²`, `6:12`, `$134`,
  `95%`. Use `<tspan>` for a stacked fraction.
- `var(--oc-font-mono)`, 18–22px, `accent` or `ink`, never italic, never touching a
  shape. Place it next to the thing it labels, not floating in a corner.
- The label is decoration, so it is not translated. Keep it to digits, units and
  symbols, never words.

### Distinct and recognisable

- Each tile must differ clearly from its neighbours. Two calculators about food must
  not both be a plate with cutlery. Two growth calculators must not both be "short
  bar, tall bar".
- Draw the real-world object or the result's shape: a nutrition card for macros, a
  jar for savings, two aligned rulers for conversion, a bell curve with a shaded band
  for a confidence interval.

## Mistakes we made (do not repeat)

Every item below shipped once and was flagged in review.

| Mistake | Fix |
|---|---|
| Gradients, glossy fills and heavy black (`ink`) outlines, which look like clip art | Flat token fills, accent outlines |
| A filled block stacked on another, both rounded, leaving notches where they meet | Fill the parts as paths with square inner corners, then one outline on top |
| An accent cell with square corners inside a rounded frame, so the corner pokes out | The cell's outer corner uses the frame's radius |
| A dashed coin path that ran behind a lid and vanished | The path ends with a gap before the target |
| A curly hand-drawn arrow next to a measuring cup, hard to see | A straight accent chevron arrow, or none |
| A spoon, knife or fork that does not look like one | Fork: tines on a rounded head plus a pill handle. Knife: one clean blade shape plus a pill handle. Same proportions on both |
| A macro donut with overlapping rings and a black-outlined slice | A single clear object: a nutrition card with three rows |
| Coin stacks with a dashed arrow and `$` coins for inflation, busy and childish | One bag with a price tag |
| A mean line in dashed ink that disappeared across a dark bar | A solid accent line on top of evenly toned bars |
| A soft band under a bell curve that did not follow the curve | Split the Bézier at the bounds so the fill matches the curve exactly |
| A right-angle mark and a vertex dot on the same rounded corner | Sharp geometry corners, and the mark on its own corner |
| A pitch label in ink, far from its mark | Accent label next to the mark |
| Two labels on one tile (`1 m` and `3.28 ft`) | One label, and let the drawing carry the rest |
| A "×1.5" stack that was really ×1.8 tall | Compute the heights from the number |
| Old drafts left in `illustrations/` with nothing importing them | Delete them |

## Process

1. Sketch the idea in one sentence: "a jar with a coin dropping in".
2. Draw it in a `<pack>-art.tsx` scene, reusing that file's `outline`, `detail`,
   `label` and `ground` helpers.
3. Run `bun test packages/dom-ui/src/components/art.test.tsx`. It fails on missing
   tiles, raw colours, gradients and filters, strokes under 1.5, more than one text
   label, missing operation icons and duplicate icons.
4. Restart the dev server (`cd apps/web && bunx astro dev stop`, then start it), so
   you are not reviewing stale modules. Then export real PNGs:
   `bun run export:art --ids <id>,<neighbour>,<neighbour> --out <scratch dir>`.
   Stop any other preview server first, so you are not looking at an old build.
5. Look at the PNGs at 2× zoom in light and dark, next to the tiles around it in the
   home grid. Check every join, every connector end, every label position and the
   proportions against the numbers. Fix, export again.

## Operation icons

Each operation in the selector has a 24×24 icon (`<pack>OperationPaths`, keyed by
operation id). Use `currentColor` strokes at 1.75 with round caps, drawn inside 3–21.
Each operation asks a different question, so each gets a different drawing. A shared
base glyph is fine only with a clear modifier (an arrow, a target, a missing part).
The test fails when two operations render identical markup.
