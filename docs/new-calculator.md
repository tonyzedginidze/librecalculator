# What adding a calculator means

A calculator is not just an engine. Every calculator ships as one complete unit, and the existing ones (percentage, area, loan payments and the rest) are the reference for each part. Copy their quality, not their wording. The mechanical steps are in [adding-calculator.md](adding-calculator.md); run `bun run new <id> [category]` to scaffold, then replace the cloned percentage content.

## The unit: what every calculator needs

| Part | Where | Notes |
|---|---|---|
| Engine and tests | `packages/calculators/src/<id>/` | Pure, exact decimal arithmetic, independent fixtures, error codes, typed result with working and visual data from one calculation. Follow `docs/numerical-contracts-*.md`. |
| Lesson | `packages/content/src/<id>/index.ts` | Intro, how to choose the question, formulas with variables, 3 to 5 authored examples checked by fixtures, visual block, common mistakes, limits and assumptions, FAQ, sources. |
| Messages | `packages/i18n/src/topics/<id>.ts` and catalog title, description, search keys in `packages/i18n/src/en.ts` | Every user-visible string. No literal text or `aria-label`, `placeholder`, `alt`, `title` strings in UI code. |
| Search title and description | `seoTitles` and `metaDescriptions` in `packages/i18n/src/meta.ts` | `<title>` of at most 60 characters that leads with the search phrase (no brand suffix), and a 110 to 160 character description. `meta.test.ts` enforces both. |
| Page view | `packages/dom-ui/src/topics/<id>/{adapter,examples,view}` | Operation selector, fields, answer, working and visual from the same result. |
| Tile art | `scenes` map in `packages/dom-ui/src/components/art.tsx`, key = calculator id | The coloured illustration on the browse grid tile (320x180 SVG, uses `--oc-accent`, `--oc-accent-soft`, `--oc-ink`, `--oc-line`, `--oc-surface`). Without it the tile shows a grey placeholder square. Show the idea with a concrete picture and at most one label. Follow [tile-illustrations.md](tile-illustrations.md). |
| Operation icons | `operationPaths` in `art.tsx`, key = operation id | 24x24 stroke icon shown in the operation selector. Add one per operation unless the same id already has an icon; operations without an icon render no icon. |
| Category colour | `data-category` rules in `packages/design/src/ui.css`, `Category` list in `packages/dom-ui/src/catalog.ts` | Each category recolours the accent. A new category needs a hue pair, a category icon in `iconPaths` and a label in i18n. Math uses the default accent. |
| Explainer video | `videos/<id>/{video.json,scenes.js,script.en.md,strings.en.json}` | One narrated video, 16:9 and 9:16, about 1 minute: hook, one scene per operation, mistakes, recap. Details in [videos.md](videos.md). Videos are optional for pack scale but expected for launch calculators. |
| Pack membership | `packs/<pack-id>/pack.json` ([packs.md](packs.md)) | Exactly one pack; no imports from another pack. |

## Order of work

1. Decide the domain: units, limits, rounding, undefined inputs, operations. Write fixtures from independent arithmetic, not from the engine.
2. `bun run new <id> [category]`, add its ID to exactly one pack manifest, then replace engine, tests, lesson, messages, adapter and view. Fix the scaffold's leftovers: the `topicId` in `view.tsx`, `answerCopyText` in `packages/dom-ui/src/copy.ts` if an operation answer is a percent, and the TODO catalog description.
3. Add tile art and operation icons following [tile-illustrations.md](tile-illustrations.md). Export the PNGs and check them next to their neighbours; it must read at a glance and match the house style.
4. Write the video files (copy `videos/percentage/`), verify every number against the lesson examples, then `bun scripts/build-videos.ts <id> --lang en`. Output goes to `apps/web/public/videos/<id>/` (git-ignored).
5. Run `bun run generate`, `generate:web-topics`, then all checks from AGENTS.md. Open the page and the home grid in a browser, with the video.

## Definition of done

- All checks pass (generate, check:generated, check:web-topics, content-check, test, typecheck, lint, build:web).
- Tile shows custom art, not the placeholder; each operation has an icon.
- Lesson examples are fixtures; working, answer and visual agree.
- No hardcoded UI strings; catalog description is real text, not a TODO.
- Video built and verified, or the calculator is explicitly listed as video pending.
- Finance and health calculators carry the disclaimer wording agreed in [launch-scope.md](launch-scope.md).

## Gaps to close for scale

Art and icons are hand-written per pack (`<pack>-art.tsx`). `components/art.test.tsx` fails when a calculator has no tile, an operation has no icon, two icons are identical, or a tile breaks the mechanical house-style rules (raw colours, gradients, thin strokes, more than one label). Visual quality still needs a human look at the exported PNGs.

## Export tile PNGs

With the web app running and `agent-browser` plus its Chromium installed, run `bun run export:art`. It exports non-core tiles (excluding discount) in both themes at native 320x180 into a temporary directory, with paths, computed category/theme tokens and SVG bounds in `manifest.json`. Options: `--url http://localhost:4321`, `--out /absolute/directory`, `--ids length,circle`, `--theme light|dark|both`, or `--all` for the entire catalog. The exporter uses and closes its own isolated browser session; it does not modify illustration sources. SVG stroke bounds are recorded only when the browser supports them. Keep exports outside the repository; review the actual PNGs separately.
