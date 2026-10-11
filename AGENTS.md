# Agent guide

Libre Calculator: web (Astro) and desktop (Tauri) calculators with a worked explanation under each. Mobile is parked; do not build for it. Target scale is thousands of calculators delivered as activatable packs.

## Read first
- [docs/README.md](docs/README.md): docs index
- [docs/packs.md](docs/packs.md): core plus packs plan, scale to thousands, phasing
- [docs/launch-scope.md](docs/launch-scope.md): proposed launch packs and calculators (about 12 packs, 5 to 8 each)
- [docs/pack-reference/](docs/pack-reference/README.md): ~3,900 competitor-derived calculator ideas, **inspiration only**. Review and decide (`pick`, `merge`, `later`, `skip`); build original, better versions. Never copy their names, slugs, wording or structure one to one. Prefer data-driven presets over new code when many ideas share an engine.
- [docs/new-calculator.md](docs/new-calculator.md): what a new calculator must include (engine, lesson, i18n, view, tile art, operation icons, video) and the definition of done
- [docs/tile-illustrations.md](docs/tile-illustrations.md): how to draw a calculator's card illustration and operation icons, house style, and the mistakes not to repeat. Read it before drawing any tile.
- [docs/architecture.md](docs/architecture.md), [docs/adding-calculator.md](docs/adding-calculator.md), [docs/design-system.md](docs/design-system.md)

## Rules
- New calculator: `bun run new <id> [category]`, then replace the cloned engine, lesson, i18n messages and view, and add tile art, operation icons and a video. See [docs/new-calculator.md](docs/new-calculator.md) for the full checklist. Never register it in a central switch; the generator is the registry.
- Every user-visible string lives in i18n (`packages/i18n`); no literal text or `aria-label`/`placeholder`/`alt`/`title` strings in UI code. We are not translating yet, but keep locale structure intact.
- Engines are pure and follow the numeric contracts in `docs/numerical-contracts-*.md`. Results, working and visuals come from one calculation.
- Tile art follows [docs/tile-illustrations.md](docs/tile-illustrations.md): theme tokens only, flat fills, one label at most, clean joins. `components/art.test.tsx` enforces the mechanical rules; review the exported PNGs for the rest.
- Packs are independent: shared code in core only, no pack imports another pack.
- No saved history or favorites for now.

## Commands
Bun 1.4.2, Node 24.21.0. Before finishing, all must pass:
`bun run generate`, `check:generated`, `check:web-topics`, `content-check`, `test`, `typecheck`, `lint`, and `build:web` for web changes.
