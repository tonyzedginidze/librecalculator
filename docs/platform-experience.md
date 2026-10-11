# Platform experience

Percentage is the only live calculator. The other nine are not stubbed. Web, mobile, and desktop each have their own shell. They share engines, lessons, tokens, and a small DOM renderer for web and desktop. Mobile does not render that DOM.

## Visual direction

Folio: warm paper, ink, and copper. Titles, answers, and lesson prose use a local serif stack. Controls use the system sans. Numbers are tabular. There are no remote fonts or assets. Light, dark, and system themes come from `packages/design/src/tokens.ts`. Web inlines those variables and a boot script before paint. Desktop links `apps/desktop/src/variables.css` and runs the same boot read of `open-calculators.local-state`. Focus indicators use a 2px copper outline (`var(--oc-focus)`) paired with a 2px canvas offset box-shadow (`var(--oc-canvas)`) for visual separation across dark and light surfaces. Mobile layout uses native flex spacing; web/desktop layout uses responsive CSS grid and card padding scaled down to 0.75rem at narrow viewports (<=384px) to ensure zero page-level horizontal overflow down to 320px. Ratio answers and copy text use the unified `answerCopyText` helper. Reduced motion removes transitions. This is not a dashboard.

## What each app does

- Web (`apps/web`): static Astro pages. `/` is the catalog. `/calculators/percentage/` server-renders the lesson and hydrates the calculator. Catalog JavaScript does not include the percentage engine or lesson prose. The percentage page does, because that page needs them.
- Mobile (`apps/mobile`): Expo/React Native. No WebView. Phone is one column; width at least 840 CSS pixels splits calculator and lesson. Decimal keyboard, sign button, and keyboard inset handling are native. Engines and lessons are bundled.
- Desktop (`apps/desktop`): Vite/React, not the hosted site. `/?panel=quick` is the compact panel. `/` is the full explanation. Quick Escape calls `hide_quick` only inside Tauri. Opening the full explanation calls `show_main`. Browser preview navigates locally instead of showing dead native controls.

## Calculation and input

Fields keep the typed text. Incomplete entries such as `-` or `1.` are not rewritten and do not call the engine. Locale parsing uses `parseLocaleDecimal`. Valid runs call the shared `calculate`. Working uses `renderWorkingStep`. Visual components use result visual models without recomputing answers. History is written only when Run succeeds. Restore puts canonical inputs back into the fields and the engine checks them again. It does not add another history entry. Choice fields (`input === "choice"`) render select controls or native pickers, preserve raw choice string IDs, ignore decimal formatting and sign toggling, and filter target choices to compatible source dimensions.

## Local state

Adapters use `decodeLocalState` / `encodeLocalState`. History is trimmed to 500 and favorites to 200 before encode. Preferences are not dropped to make a save fit. Unreadable saved data is not overwritten. Quota and other save failures leave the previous blob in place and show a notice. An explicit replace action is the only way to discard unreadable data. Desktop windows re-read before write and listen for `storage` events.

Number format choices are `en-US`, `de-DE`, `fr-FR`, and `en-IN`. Interface copy stays English.

## Web offline

Production registers `/sw.js` and asks for `{ type: "OFFLINE_STATUS" }` on a `MessageChannel`. Ready is shown only when the controlling worker reports `available: true` and an empty `missing` list. A waiting complete stage is an update, including the first install, until the user sends `{ type: "ACTIVATE_UPDATE" }`. Development does not register the placeholder worker. Native apps do not use this cache; their content is in the bundle.

Build from `apps/web`: `astro build && bun scripts/build-offline-manifest.ts`.

## Desktop native contract

Frontend calls, when Tauri is present:

- `invoke("show_main", { calculatorId: "percentage" })`
- `invoke("hide_quick")`
- `invoke("set_global_shortcut", { shortcut })`
- `invoke("get_integration_status")`

It listens for `calculator-selected` with `{ calculatorId }`. Shortcut text uses the native format. An empty save clears the shortcut. Status fields are camelCase. If Tauri is absent, shortcut and hide controls are not shown.

`apps/desktop/src-tauri/capabilities/default.json` currently lists only `core:default` and `core:event:default`. Custom command invokes may be denied until the native lane adds those command permissions. The UI reports that error. It does not pretend the call succeeded.

## Local preview

Use Node 24 for Astro and Expo: `PATH="$HOME/.local/share/node/v24.21.0/bin:$PATH"`.

- Web production: `cd apps/web && bun run preview` (127.0.0.1, Astro's preview port).
- Web dev: `cd apps/web && bun run dev`.
- Desktop UI: `cd apps/desktop && bun run dev` at `http://127.0.0.1:5173/`. Quick panel: `http://127.0.0.1:5173/?panel=quick`.
- Desktop production assets: `apps/desktop/dist`. Tauri hooks expect port 5173 and that dist directory. `bunx tauri dev` / `bunx tauri build` from `apps/desktop` were not run here.
- Mobile JS export: `apps/mobile/dist`. Start the dev client with `cd apps/mobile && bun run start`.

`docs/architecture.md` still says platform apps are not scaffolded. That sentence is stale. This document is the phase-2 interface note.
