# Releasing the desktop app

## Versioning

The desktop app follows semantic versioning. `apps/desktop/package.json` holds the version. Tauri reads it from there (`"version": "../package.json"`), and `scripts/release.ts` keeps `Cargo.toml` and `Cargo.lock` in step. Never edit those three by hand.

- `patch` for fixes, `minor` for new calculators or features, `major` for breaking changes to saved settings or behaviour.
- A version with a suffix such as `0.3.0-beta.1` is published as a GitHub pre-release.
- The website deploys continuously and is not versioned.

## Cutting a release

From a clean `main`:

```sh
bun run release patch        # or minor, major, or an exact 1.2.3
git push --follow-tags
```

The script bumps the version, commits `Release desktop vX.Y.Z` and creates the tag. Pushing the tag starts the release workflow.

## Workflows

- `.github/workflows/ci.yml` runs on every push to `main` and every pull request. It runs the repo checks (the same as the list in `AGENTS.md`, plus `release check`), then builds the desktop frontend and runs `cargo test` on macOS, Windows and Linux.
- `.github/workflows/release.yml` runs on a `v*` tag. It checks that the tag matches the version, opens a draft release with the notes from `.github/release-notes.md` and the generated changelog, builds every target, adds `SHA256SUMS.txt` and publishes the release. If any build fails, the release stays a draft. Delete the draft and the tag, fix the problem, then release again.
- Run the release workflow by hand (Actions › Desktop release › Run workflow) to build every installer as workflow artifacts without publishing anything.

## Targets

| Runner | Target | Files |
| --- | --- | --- |
| macos-latest | universal (Apple Silicon and Intel) | `.dmg`, `.app.tar.gz` |
| windows-latest | x86_64 | NSIS `-setup.exe`, `.msi` |
| windows-latest | aarch64 (cross-compiled) | NSIS `-setup.exe` (Tauri has no ARM MSI) |
| ubuntu-22.04 | x86_64 | `.deb`, `.rpm`, `.AppImage` |
| ubuntu-22.04-arm | aarch64 | `.deb`, `.rpm`, `.AppImage` |

Linux builds run on Ubuntu 22.04 so the binaries link against an older glibc and run on more distributions.

## Signing

The builds are not signed yet. macOS apps get an ad-hoc signature (`signingIdentity: "-"`), so Gatekeeper asks the user to approve the app once instead of reporting it as damaged. The release notes explain how to open an unsigned build on each system.

Next steps, in order of value:

1. Apple Developer ID signing and notarisation: add the `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD` and `APPLE_TEAM_ID` secrets and pass them to `tauri-action`.
2. Windows signing (for example Azure Trusted Signing) to remove the SmartScreen warning.
3. The Tauri updater plugin with a signing key, so installed apps update themselves from `latest.json`.
4. Store and package-manager channels: Homebrew cask, winget, Flathub, Snap.

## Microsoft Store

- The Store product is `9NN27D9NNFF1`: https://apps.microsoft.com/detail/9NN27D9NNFF1.
- Alvin approved the existing `AlvinUnreal` publisher for this distribution channel.
- The MSIX manifest lives in `apps/desktop/store/AppxManifest.xml`; its identity is `AlvinUnreal.LibreCalculator`.
- `.github/workflows/windows-store.yml` builds a Windows x64 binary with the static C runtime, packages it with the Windows SDK, and checks that the executable opens the calculator UI.
- The Store package currently targets Windows 11 or later and requires the Windows WebView2 runtime.
- Run the `Windows Store MSIX` workflow to obtain the `librecalculator-windows-store` artifact, containing an unsigned MSIX, SHA-256 checksum, source metadata, and Windows launch evidence.
- Upload the MSIX directly through the existing product's MSIX submission flow. Microsoft signs the Store-distributed package; this file is not a signed sideloading installer.
- `scripts/package-windows-store.ps1` derives the four-part Store version from the stable desktop version and generates Store tiles from the existing application icon.
- `scripts/smoke-windows-store.ps1` checks the built executable and records a native Windows screenshot; it does not test MSIX installation or certify the app.
- The `runFullTrust` capability supports the native Tauri desktop process, tray, local preferences, and global shortcut. It does not request administrator privileges.
- The desktop privacy policy is https://librecalculator.com/privacy/.
- Review package validation, listing screenshots, privacy information, age ratings, and certification notes before submitting each update.
