The refreshed macOS `.app` embeds the refined desktop UI and local-state bridge; GUI/native runtime behavior remains unverified.

# Desktop native scaffold

The desktop shell lives in `apps/desktop/src-tauri`. Tauri 2 hosts the separate Vite/React frontend locally; it does not load the hosted website. The Tauri configuration expects Vite output at `apps/desktop/dist` and uses `bun run dev` / `bun run build` as its dev/build hooks.

## Native structure

- `src/lib.rs`: Tauri setup, plugin registration, graceful tray/shortcut initialization, and shortcut cleanup at exit.
- `src/commands.rs`: the native invoke API.
- `src/windows.rs`: main/quick window focus, reveal, hide, and selection event delivery.
- `src/tray.rs`: tray icon and Open, Quick Calculator, and Quit actions.
- `src/shortcuts.rs`: accelerator parsing, runtime registration/replacement, rollback, startup restoration, and Wayland/X11 availability handling.
- `src/settings.rs`: local shortcut preference in the OS-specific Tauri app config directory (`settings.json`).
- `src/integrations.rs`: camelCase integration status shared with the frontend.
- `src/local_state.rs`: revisioned raw session-state store, protected by one app-wide mutex and persisted through same-directory temporary-file rename.

## Frontend handoff

- `invoke('show_main', { calculatorId: 'percentage' })` shows/focuses the `main` window and emits `calculator-selected` with `{ calculatorId: 'percentage' }`. The frontend should listen for that event and navigate its existing local state; native code does not recompute or reset a calculator.
- `invoke('hide_quick')` hides the `quick` window. Use it for Escape/dismissal; a native close request on `quick` also hides it.
- `invoke('set_global_shortcut', { shortcut })` changes the system shortcut. The default is `CommandOrControl+Shift+C`; `CmdOrCtrl` is accepted as an alias and normalized. Passing `''` disables the shortcut. The command returns integration status on success and rejects with an explanatory error on failure.
- `invoke('get_integration_status')` returns `{ tray, shortcut, shortcutValue, shortcutError }` (camelCase JSON; `shortcutValue` and `shortcutError` may be `null`). Use it to surface unsupported OS integration without blocking normal calculator access.
- Shortcut preferences persist natively across launches. A failed replacement keeps the previous shortcut registered and saved when possible; a successful disable clears it.

## Native session store

- `read_local_state` returns `{ raw, revision }`; `compare_and_set_local_state({ expectedRevision, raw })` returns `{ status, raw, revision }`, where status is `committed` or `conflict`. A conflict includes the fresh stored raw value and revision. The command writes a temporary file in the app data directory, flushes it, then renames it over the canonical raw-state file before publishing `local-state-changed` to all windows.
- Native storage is the only desktop write owner. JavaScript still decodes, validates, mutates, and encodes the shared local-state format. On first use, a valid existing `localStorage` value is copied byte-for-byte only if the native file is empty. Invalid or unsupported browser state is surfaced write-blocked and is not replaced; explicit reset is the recovery action. If another window initializes first, the native value wins and browser history is not merged or duplicated.
- The headless TypeScript adapter is `apps/desktop/src/session-adapter.ts`. Pass `desktopSessionAdapter` to `useBrowserSession(adapter)` or construct an injected adapter with `createDesktopSessionAdapter`; it handles bounded conflict retries and event subscription cleanup. Window-to-window event delivery and direct GUI behavior still require coordinator interaction verification.

The shortcut plugin is omitted on Linux Wayland and when an X11 display is not available. Tray creation and shortcut registration errors do not block the main window. Closing the main window hides it when a tray is available; otherwise it exits normally. Shortcut registrations are explicitly cleared on app shutdown.

## Build and validation

Exact Rust dependencies are pinned in `Cargo.toml` and `Cargo.lock`: Tauri `2.12.2`, `tauri-build` `2.7.1`, `tauri-plugin-global-shortcut` `2.4.0`, Serde `1.0.229`, and `serde_json` `1.0.151`. The Tauri crate reports Rust `1.90` minimum; this lane used Rust `1.99.0`.

When the Vite frontend exists, run Tauri from the desktop app directory with its installed JS CLI, for example `bunx tauri dev` or `bunx tauri build`. A complete dev/bundle build requires `apps/desktop/dist` (or the dev server) and the frontend owner’s app scripts. Do not substitute a placeholder page when that output is missing.

For native Rust-only checks while `dist` is absent, Tauri supports a `TAURI_CONFIG` JSON overlay. From `apps/desktop/src-tauri`:

```sh
TAURI_CONFIG='{"build":{"frontendDist":null}}' ~/.cargo/bin/cargo check
TAURI_CONFIG='{"build":{"frontendDist":null}}' ~/.cargo/bin/cargo test --lib
TAURI_CONFIG='{"build":{"frontendDist":null}}' ~/.cargo/bin/cargo build
```

The overlay is validation-only; `tauri.conf.json` remains configured for `../dist`. A successful native binary build with the overlay does not provide frontend assets or establish app runtime behavior.

## Final macOS production-like bundle

- On macOS `26.5.2` arm64 with Node `v24.21.0`, Bun `1.4.2`, Rust `1.99.0`, and Tauri CLI `2.12.1`, ran from `apps/desktop`: `./node_modules/.bin/tauri build --bundles app --no-sign`. This used the normal configured `frontendDist: ../dist`; no `TAURI_CONFIG` overlay was used. The CLI ran `bun run build` first and built one `Libre Calculator.app` bundle (no DMG). Vite `8.3.4` transformed 58 modules without warnings.
- Final Vite output checksums: `index-6_l0q6F0.css` `b55f707467802a73d943a2bf67e5ea5f049c74a40b07cd8a05f2e9727cff0714`; `index-D4jUL3et.js` `16908fb830b1da8e85d162492a82a55595a1132aad0136324dc27f58d151abb6`; `adapter-DWlVSX7T.js` `dd07b7fa944594c87447ea184c6eb57e9da887f6c6cb456a8054dddec881312b`; `view-CbOoZo0P.js` `dabca8b9c97e895b90b551099aa30891492ba94c0d2e6fbd3253e70815b019cf`; `percentage-DV4Q9Pnh.js` `c085f3f30da74588c6ee73936ae468f275077fa34958d9a8c6883dbf3fa167e4`; `percentage-_-1lswr2.js` `11bebf66f2d0a4e1f159c77d90334060e3c0e4767fafbb3523b0c3b686bf9398`; `index.html` `ca071c7d904b3bbde9542c1001aa6cdbb50285f5c223142f0680564c2fad8bf1`. All seven paths were found embedded in the app executable.
- Bundle: `apps/desktop/src-tauri/target/release/bundle/macos/Libre Calculator.app`, `10.33 MiB`; its executable is Mach-O arm64. `--no-sign` skipped bundle signing; the executable reports an ad-hoc linker signature and no Team ID. This is a local app bundle, not Developer ID signed/notarized.
- This refresh followed the source foundation at commit `7cf86e54dcb00970bbb09ce5e6a5eef44a80a278` with uncommitted source revisions. Tested-source SHA-256: `src-tauri/src/local_state.rs` `5c543637e8ee72ed77ad8c974cd450923d0280673b906e535d168eeccaf44d69`; `src/session-adapter.ts` `7947e62ed8cf8aa14ce25c2c508c205567e6e279765df83a8a262d9c01d10043`; `src/full/FullApp.tsx` `84ac70f80f10e894ca0be3deef02ad66d2c945738d3dd7a7cd803846d7589a42`; `src/quick/QuickPanel.tsx` `5f4c7c7139cb684ff378c42f74acf1170a7ba517536360b1da5df0594b40bb45`. The built executable contains `read_local_state`, `compare_and_set_local_state`, and the existing status/window/shortcut command names; this confirms inclusion in the binary, not successful runtime invocation.
- The previous task-owned app process (PID `82661`) was checked against its exact bundle executable path and stopped before rebuilding. The refreshed bundle was not launched again because this host has no usable display and GUI/IPC/store interaction verification is explicitly coordinator-owned; no runtime success is claimed.

## Tauri command ACL evidence and runtime status

- Verified against Tauri `2.12.2` source (`src/webview/mod.rs`, IPC ACL check around lines 2076–2080): custom app commands are ACL-rejected only when a plugin command is called, an app ACL manifest exists, or the request is remote. This app’s generated `gen/schemas/acl-manifests.json` has no `app` manifest, and its calls are from local bundled content. Therefore the existing `core:default`/`core:event:default` capability does not deny `show_main`, `hide_quick`, `set_global_shortcut`, or `get_integration_status`; no speculative app-command permissions were added. Adding an app ACL manifest would change the check and require explicit command allowances.
- The frontend source calls `get_integration_status` on full-window startup and uses the other native invokes/events. The store bridge is included in this build, but runtime results for the status/window/shortcut/store commands, event delivery, tray interaction, shortcut registration, and persistence/CAS behavior remain **unverified**, not passed. Coordinator owns GUI/IPC interaction verification.

The earlier Rust-only checks used the `frontendDist:null` overlay while the dist directory was absent. The refreshed bundle uses the real Vite dist. `cargo fmt --all -- --check` passed after rustfmt `1.10.0-stable` was installed; the native unit test suite (8 tests) and actual-config `cargo check` passed before this no-source-change rebuild. The release Tauri build compiled the current native state bridge. Windows/Linux compilation and interaction, iOS, Developer ID signing, and notarization remain unverified or separate release work. Linux Wayland shortcuts are explicitly unavailable. Disk reserve after the build was 18 GiB (minimum required: 12 GiB).
