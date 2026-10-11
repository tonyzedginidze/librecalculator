# Verification matrix (foundation baseline)

Status values: **unverified** until the owning environment and scenario have actually been checked. This matrix records the starting point, not a release claim.

| Claim / owner | Platform or check | Status | Evidence / limitation |
|---|---|---|---|
| Calculation / fixer | Percentage operation fixtures and boundaries | unverified | Phase 1 local unit tests; run results recorded in foundation handoff. |
| Content / fixer | Stable IDs, message coverage, example and link validation | unverified | `bun run content-check`; percentage content only. |
| Foundation / fixer | Types, lint, generated catalog, dependency boundaries | unverified | Commands run locally; no app projects yet. |
| Web / web owner | Build, crawlable HTML, installed interaction, PWA first cache/offline/update/eviction | unverified | Astro app is not implemented. |
| Mobile / mobile owner | Android/iOS build and installed interactions; phone/tablet; bundled offline; physical and simulator separate | unverified | Expo app is not implemented. Android SDK/JDK and full Xcode/simulator are unavailable in inventoried environment. |
| Desktop / desktop owner | Windows/macOS/Linux builds and installed interaction, quick/full flow, offline and OS integration | unverified | Tauri app is not implemented. |
| Visual/interaction / Grok + independent designer | Resize, input/caret, appearance, interaction feel | unverified | No UI implemented in foundation. |
| Release / release owner | Reproducible platform build, signing and distribution | unverified | No platform apps/release config; signing is separate. |

For each subsequent result retain claim, owner, revision, environment/device/OS/browser, scenario, outcome and limitation. A local build does not establish installed runtime behavior or signing readiness.

## Launch-pack integration — 2026-10-11

This section supersedes the foundation-baseline implementation statements above; installed native distribution and signing remain separate claims. Environment: local macOS workspace, Bun 1.4.3, Node v26.8.2, production Astro preview at `http://127.0.0.1:4322`, Chromium through agent-browser. The documented target-runtime versions were not the installed versions for this run.

| Claim | Outcome | Evidence and limits |
|---|---|---|
| Catalog, membership and public routes | Pass | 12 manifests, 72 calculators, 86 static pages. Duplicate, unknown and unassigned membership reject generation. |
| Required repository gates | Pass | `generate`, `check:generated`, `check:web-topics`, `content-check`, `test`, `typecheck`, `lint`, `build:web`; 535 tests, 0 failures. Lint retains four existing unused-suppression warnings. |
| Web and desktop UI types/builds | Pass | Astro check: zero errors; desktop TypeScript and Vite production build pass. Native Rust installers/signing not exercised. |
| New topic browser interfaces | Pass | Agent-browser smoke on 61 new pages across three agent lanes; nonempty hydrated answers, input controls, working and no JavaScript errors. Multi-operation, unit changes and representative domain failures exercised. Existing discount retained its implementation. |
| Settings modal and category independence | Pass | Icons, descriptions, switches, scrollable two-column panel, Done and Escape. Enabling Health changes count10→17 and adds Health7; disabling removes Health and returns10. Focus returns to Settings. Core does not become a sidebar group. |
| Production offline calculator | Pass for exercised scenario | Caches contain core and explicitly enabled Health only. With browser networking disabled, `/calculators/bmi/` hydrates and editing81kg/180cm gives25kg/m². Inactive packs are absent from the cache. Worker restart resolves available pack caches from storage rather than transient memory. Update/eviction stress and installed-PWA scenarios remain unverified. |
| Pack footprint | Measured | Built uncompressed resource closures: Core about1.5MiB; optional packs about0.8–1.1MiB each, including shared resources repeated in their independent cache. Videos excluded. Desktop initial JS chunk about510kB (155kB gzip); metadata/art remain eager and search sharding remains scale work. |
| Explainer video | Partial | Savings wide rendered and frame inspected, 52.27seconds,1920×1080. Savings tall and other new-topic renders explicitly pending in launch scope and per-pack contracts/tracking docs. |

Screenshots inspected during this run: `/tmp/oc-modal.png` (Settings modal), `/tmp/geometry-final-cylinder.png`, `/tmp/finance-final-ideal-weight.png`. Agent smoke reports: `/tmp/math-browser-smoke.json`, `/tmp/finance-final-smoke.json`. Temporary artifacts are local evidence, not committed release assets.
