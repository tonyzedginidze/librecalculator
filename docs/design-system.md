# Design system

One look across web and desktop. Everything below lives in `packages/design`
(tokens + CSS) and `packages/dom-ui` (components). Change it there, not per page.

## Principles

- **Flat and quiet.** No drop shadows, no hover lift or zoom, no left-edge accent
  bars, no nested cards. Separation comes from whitespace and 1px hairlines.
- **Calculator first.** The calculator is one compact column on a tinted band; the
  explanation is a white page below it. No split view, no decoration.
- **Colour means something.** Never decorate with colour; see the table below.
- **No native chrome.** Dropdowns, number inputs and search are our own controls.
- **No layout shift.** Sidebar, answer panel and controls keep their size across
  pages and states (no weight changes on selection, fixed answer height).

## Tokens

Defined once in `packages/design/src/tokens.ts` (light + dark) and emitted as CSS
variables by `css.ts`. Never write a raw hex in component CSS.

| Token | Meaning |
|---|---|
| `canvas` / `surface` | Sidebar tint / page background |
| `ink` / `muted` / `line` | Text / secondary text / hairlines |
| `accent` (+ `-soft`, `-ink`) | Selection, focus, brand; recoloured per category |
| `result` (+ `-soft`) | The answer, positive values, good bars |
| `danger` | Errors, negative values |
| `warn` (+ `-soft`) | Warnings and "beyond reference" |
| `info` | Secondary chart series |
| `--oc-control-line` | Border of every control (ink mixed into surface) |

Category hues: Math brown, Geometry blue, Units violet, Finance green. Put
`data-category="…"` on a container and `--oc-accent` becomes that hue inside it.
Calculator pages, cards, illustrations and the sidebar already do this.

## Type and shape

- Serif (`--oc-font-serif`) for titles and lesson prose. Sans for labels and controls.
- **Mono (`--oc-font-mono`) for figures only**: number inputs and unit symbols, the
  answer, numerals inside working text (`NumText` wraps them), summary values,
  formulas, diagram labels, counts. Never for prose.
- **The answer** is mono in the `result` colour so it stands apart from labels and
  working. Everything else stays ink/muted.
- Base size 15px. Hero 1.7rem, calculator title 1.6rem, card title 1.05rem.
- Radius is **4px** for controls and **6px** for tiles and panels. Circles only for avatars.
- Numbers use `tabular-nums`.

## Controls

- Height `--oc-control-h`: 36px, 44px on touch (`pointer: coarse`).
- Border `--oc-control-line`, hover darkens to `ink`, focus is a 2px accent outline.
- **Buttons**: neutral by default. Selected = accent border + soft tint + accent
  text, same weight (never bold on select).
- **Operation picker** (`CalculatorPanel`): shown only when there are 2+
  operations; each option has an icon (`OperationIcon`).
- **NumberField**: live thousands grouping with a stable caret, paste cleaning
  (`$1,234.50`, `1.234,5`, `50 %`), ↑/↓ step (Shift ×10, Alt ×0.1), unit
  prefix/suffix from the field's `unitKey`, select-on-tab. The stored draft stays
  ungrouped so engines parse it unchanged. Logic is in `number-input.ts` (tested).
- **Select**: custom listbox (arrows, Home/End, type-ahead, Esc). Use it instead
  of `<select>`.
- **Progress bars**: slim track, 4px radius, fill uses `result` / `danger` / `warn`.

## Layout

- **Sidebar** (`Sidebar`): logo mark (the favicon), search, categories with icons
  and counts. The selected category expands to list its calculators and is tinted
  in its own hue. Search is on every page (`/` focuses it) so nothing shifts.
  Width is resizable (drag, arrows, double-click resets), default 320px,
  remembered, restored before first paint. Collapses to category chips on phones.
- **Home**: the categories filter the grid; typing in search filters live.
- **Calculator page**: one column (44rem). Tinted band = the tool: title, optional
  operation tiles, inputs, answer, working, one compact diagram. White section
  below = the explanation. Nothing sits beside the calculator.
- **Answer**: a plain bordered box with the number in serif and a small Copy
  button. Empty state is the same box, transparent, with a one-line hint. No
  status dots, no dark panels.
- Diagram captions and repeated data tables are screen-reader-only; show each fact
  once.

## Icons and illustrations

- Logo = the favicon mark (white % on a rounded accent square), `BrandMark`.
- Category icons, operation icons, search: 24px stroke icons, `currentColor`,
  1.75 stroke (`components/art.tsx`).
- Each calculator has a 320×180 card illustration (`CalculatorArt`). House style below.

### Tile illustration house style

Full guide with process and past mistakes: [tile-illustrations.md](tile-illustrations.md).

The tiles sit side by side in a grid, so they must read as one set: precise, flat,
calm. A tile shows one concrete object and, when it helps, one number.

- **Palette**: `accent` for contours and the one key mark, `accent-soft` for the main
  fill, `surface` for paper and secondary fills, `line` for ground lines, grids and
  quiet detail. `ink` only for a numeral or a tiny detail (under 10% of strokes). No
  hex values, no gradients, no drop shadows. One `opacity="0.45"` is allowed for a
  "before" or ghost state.
- **Strokes**: 2.5 for outlines, 1.75 for interior detail, round caps and joins.
  Nothing thinner than 1.5. Dashes only for one dimension or motion line (`4 4`).
- **Shape**: integer or .5 coordinates, symmetric where the object is, corner radius 4
  (2–3 on small parts). Primitives and clean arcs only; no freehand wobble paths.
- **Composition**: everything inside x 40–280, y 28–152. The hero object spans about
  140–220 × 90–124 so every tile carries similar visual weight. Optional ground line
  at y 148 in `line`. Supporting objects are smaller than the hero; at most three
  objects in total.
- **Text**: at most one label or number, `var(--oc-font-mono)`, 18–22px, `ink` or
  `accent`, never touching a shape, never italic.
- Check both themes with `bun run export:art --ids <ids>` and compare the tile with
  its neighbours in the home grid.

### Operation icons

24×24 stroke icons, `currentColor`, 1.75 stroke, round caps, drawn inside 3–21. Each
operation answers a different question, so each gets a different drawing: a shared
base glyph is fine only with a clear modifier (an arrow, a target, a missing part).
`art.test.tsx` fails when two operations render identical markup.

### Result visuals

Diagrams come from `components/viz.tsx` (`SplitBar`, `CompareBars`, `NumberLine`,
`Gauge`, `Timeline`, `DualScale`, `CountGrid`, `Ring`, `StatGrid`, `Equation`) inside
a `VizFigure`, or a custom SVG that follows the same look when the subject is a
shape. The diagram answers "what does this number mean?": the parts of a total, the
position on a scale, before against after. It is built from the same engine result as
the answer. Every visible label is a message; the figure also carries a one-sentence
screen-reader summary. Answers use a display precision that fits the quantity
(`formatDecimal(value, locale, { fractionDigits })`); the working keeps full digits.

## Adding a calculator (UI checklist)

1. Pick a `category` in its `metadata.json` (`math`, `geometry`, `units`, `finance`).
2. Add a `CalculatorArt` scene and `OperationIcon` entries for each operation id.
3. Give fields a `unitKey` whose message ends in the symbol, e.g. `metres (m)`.
4. Use `CalculatorPanel`; no custom inputs, selects or colours.
5. The generator discovers the calculator; optional `displayOrder` entries only tune browse ordering. Pack membership belongs in its manifest, separate from category grouping.
6. Show each result once: answer, one-line working, one visual. No extra tables.

## Packs and Settings

Category groups and packs are independent. Core provides calculators in Math, Geometry, Units and Finance; enabling another pack adds its calculators to the relevant categories. Sidebar groups appear only with at least one enabled calculator and disappear when empty. The ordinary sidebar lists active calculators; home search can discover inactive pack results.

The sidebar Settings button opens a native modal dialog with category-coloured pack icons, descriptions, calculator counts and switches. Core is always available. The panel uses hairline separators, a two-column list on wider viewports and one column on narrow viewports; header/footer remain visible while the pack list scrolls. Escape, close and Done return focus to the Settings button. Desktop includes its appearance and shortcut settings in the same dialog.
