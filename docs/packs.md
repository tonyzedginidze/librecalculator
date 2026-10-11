# Packs

Status: **launch implementation in progress.** Pack manifests live in `packs/<id>/pack.json`; calculator-owned layers stay in the existing package folders. The generator validates exactly one membership and emits `packs.generated.ts`. Core remains always active; launcher activation, public pack hubs and production offline asset manifests are implemented. The phasing below remains the roadmap for scale.

## Goals and non-goals

- Grow to hundreds or thousands of calculators while keeping app startup, web offline cache and desktop footprint small.
- Users activate the packs they want on web and desktop. Everything else stays out of their way.
- Non-goals for now: saved history, favorites, accounts, paid or gated packs, downloadable desktop packs, mobile. The existing local-state codec is not extended for packs; the only persisted pack state is the set of active pack ids.

## Concepts

- **Pack**: a named folder of calculators with a manifest (`pack.json`): `id`, integer `version`, `category`, `titleKey`, `descriptionKey`, `calculatorIds`, `default` (active on first run).
- **Core**: always active, small and obvious. Holds the shared engine and numeric contracts, i18n and design basics, search, the catalog, and the initial ten calculators.
- **Active pack**: a pack whose engines and lessons may load and whose assets are cached offline. Inactive packs are still listed in search metadata.
- Each calculator keeps the layout in [adding-calculator.md](adding-calculator.md); a pack only groups them.

## Reference lists

[pack-reference/](pack-reference/README.md) holds per-category idea lists (about 3,900) taken from a competitor sitemap. They are inspiration for review, not a build list: each entry gets a decision (`pick`, `merge`, `later`, `skip`), and we build our own better, original versions. Variants of one engine become data-driven presets.

## Rules

1. The generator is the only registry. It reads pack manifests and emits the catalog and lazy-import maps. Adding a calculator or pack never edits a platform switch.
2. The catalog stays in core and lists every calculator (ids, slugs, labels, search terms, pack id). It never imports engines, lessons or prose. Search shows inactive-pack results with an "Activate pack" action.
3. Packs are independent. Shared code lives in core; no pack imports another pack. Package direction rules in [architecture.md](architecture.md) still apply.
4. Activation state is one preference: the list of active pack ids. Unknown or removed ids are dropped on load.
5. **Web**: every calculator keeps a public, crawlable static page regardless of activation. Activation only controls the user's launcher and which pack's versioned assets the service worker precaches for offline. Never precache the whole catalog. Never mix new HTML with missing or old chunks (existing offline rules apply per pack).
6. **Desktop**: bundle all packs; activation shows or hides them. Downloadable packs are deferred until size or release cadence demands them. Keep the manifest shape compatible so that is an upgrade, not a rewrite.
7. Each calculator passes the existing gates: documented numerical contract, pure engine, fixtures, lesson, translations, `content-check`.

## Scale target: thousands of calculators

The target is thousands, so per-calculator cost and linear growth matter more than the first ten suggest.

- **Scaffold:** `bun run new <id> [category]` clones the percentage topic across all layers. Real calculators replace the clone.
- **Per-calculator footprint:** today about a dozen files across five packages. Reduce it: a declarative form-and-result view for simple calculators (hand-written `view.tsx` only for special ones), and make the explainer video optional.
- **Catalog and search:** the base catalog and `en.ts` labels must not grow into one huge eager module. Shard the search index by pack, load it lazily, and consider moving catalog labels into each calculator's own metadata.
- **Generated outputs:** keep committed for now. Per pack sharding keeps merge conflicts and diff size down; revisit if conflicts appear.
- **Web build:** one static page per calculator means thousands of routes, a large sitemap and long builds. Split the sitemap per pack and measure build time at 100, 500 and 1000 calculators before Phase 2.
- **Quality at scale:** per-calculator gates (numerical contract, fixtures, lesson, i18n coverage) must stay automatic and fast; batch authoring needs templates and checks, not manual review.
- **Translations:** not translating now, but every string lives in i18n with a locale structure and per-locale coverage check, so adding locales later is data work.
- **Layout:** layer-based folders do not group a pack. Decide the pack layout in Phase 0 (group by pack inside each package, or pack-owned folders containing all layers).

## Phases

**Phase 0: pack foundation (no new calculators).**
Decide pack folder layout and add `pack.json`, group the ten as `core`, extend the generator and its checks (duplicate ids, missing modules, calculator in two packs, unknown pack). Build activation state, activation UI on web and desktop, the inactive-result state in search, and per-pack offline caching. Exit: deactivating a pack stops its engines from loading; bundle and cache size are measured.

**Phase 1: prove a second pack.**
Build one pack end to end. Proposed: **Finance** (mortgage, savings, ROI, tax, inflation), since finance engine work and conventions already exist. Exit: a new calculator needs only its folder plus a generator run.

**Phase 2: high-demand packs.**
Ordered by search demand and engine reuse: Finance, Health and body (BMI, calories, macros), Math and everyday (averages, ratios, scientific), Date and time (age, date difference, time zones).

**Phase 3: niche packs.**
Cooking, construction, engineering, science, education. Lower volume, often need new shared engine types.

**Phase 4: scale and polish.**
Pack discovery and recommendations, pack size indicator, scaffolding and bulk lesson/translation tooling. Only then consider downloadable desktop packs (signed, versioned, stored in the app data dir).

## Prioritizing a pack or calculator

Score on: search demand, reuse of existing engines, numerical and disclaimer risk (finance and health need more care), and content effort. Lessons and translations are the dominant cost, not engines.

## Open decisions

- First proof pack: Finance (implemented alongside Math and Geometry).
- English only for launch, retaining locale structure and coverage gates.
- Packs are free and activation is a local preference; paid/gated packs remain out of scope.
- Which calculators beyond the initial ten, if any, belong in `core`.

## Implemented storage and offline boundary

Pack preferences use `oc.active-packs.v1`, separate from the legacy session codec. Unknown IDs and duplicates are dropped; malformed preferences reset to defaults; core cannot be removed. Web and desktop share the preference codec and Settings modal. Packs and categories are independent: activation adds calculators to category groups, and empty groups are hidden. The home-grid search spans inactive packs and offers activation; the sidebar lists enabled calculators only. Direct public web calculator URLs remain usable without activation.

`build:web` emits `offline-packs.json` and `sw.js` from the built static pages and their static JavaScript/CSS dependency closure. Each pack cache is keyed by a hash of the complete build; inactive packs are not precached. Dynamic import maps are deliberately excluded from dependency traversal. Cache installation completes before a pack is selected, and failed installs discard the partial cache. Worker updates use the normal waiting lifecycle so open tabs retain their build until the old worker has no clients. Videos are not precached. Production browser offline verification is recorded separately.

Catalog/search metadata and art are still eager at launch size; per-pack search shards and declarative preset scaffolding remain scale work. Native pack preferences currently use the desktop webview preference store, not a new Rust file.
