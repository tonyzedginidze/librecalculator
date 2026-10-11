# Percentage web evidence

Date: 2026-10-09. Owner: coordinating agent. Production build: offline version `24d31a9b1b7b1d3e59807055584cf82c7ec4e257aea6d70008f4253eccd76272`; foundation revision `7cf86e5` plus uncommitted platform implementation.
Environment: macOS arm64, BrowserOS neo persistent profile; production Astro preview at local port 4321. Origin began with empty local storage. This is not a claim of a fresh browser profile or physical mobile testing.

| Scenario | Outcome | Evidence |
| --- | --- | --- |
| Initial production caching | Passed for this origin | Active controlling worker reported available=true, missing=[], expected build version |
| Ratio operation | Passed | Entered part18/whole24; answer75%, working18÷24×100=75%, visual table fill0.75/reference100 |
| Locale working | Passed | Selected de-DE, part1,5/whole3; answer50%, working uses1,5, visual fill0,5; history canonical inputs1.5/3 |
| Invalid whole zero | Passed | Explicit error, no stale answer/working presented |
| Incomplete sign | Passed | Raw '-' retained, selectionStart1 and focused whole field; finish-number notice, no stale answer |
| History restoration | Passed | Saved via Run, page reloaded, restored latest entry; engine revalidated and yielded50% |
| Local favorites/preferences | Passed | Saved percentage favorite and dark/de-DE; local state persisted, dark retained after reload |
| Layout/polish | Pending independent review | No platform-wide or WCAG certification claim |
| Offline relaunch | Passed on initial build | Isolated origin4322 first fully cached with empty local storage; verification server then stopped. Reload and close/reopen retained app/lesson/history/favorite; restored18/24 yielded75% with matching0.75 visual |
| Missing/evicted document | Passed on initial build | Removed cached percentage document; worker status available=false/missing=['/calculators/percentage/']; offline reload displayed explicit unavailable page rather than a misleading calculator |
| Uncached offline resource | Passed | With server stopped, worker returned503 and reconnect message for an unmanifested request |
| Failed update preserves prior cache | Passed before subsequent cleanup failure | New0432a23d build served with one chunk404; install became redundant, no waiting worker, old cached root retained |
| Successful stage before activation | Initially passed, then failed | New0432a23d waiting worker initially reported all13assets available in staged cache; no activation request was sent |
| Concurrent-version cache lifetime | Failed | After old controlled client navigated to cached root, old buildcache and new stagecache both disappeared; only version lease caches remained. Old active/controller and new waiting worker each reported all13assets missing. Only manual eviction had been one old document before this scenario. Root-cause advisory delegated; gate remains blocked |
| Update action in old catalog UI | Failed/unresolved | Waiting worker installed but catalog UI exposed no activation action; unavailable notice reported13missing. Requires source/lifecycle diagnosis |

Narrow-layout build version after remediation: `0432a23dd822dd01688d9fceb3d8188b2b3f8dcbde90269e06cd96abb492a703` (13 assets). CSS/DOM changes do not invalidate numerical fixtures; updated offline lifecycle and layout claims require the recorded targeted checks.

Native app interaction, mobile Safari, physical devices, Windows/Linux, signing and distribution are not established by these browser checks.

## Fixed-worker lifecycle recheck

Production source snapshot: `087ab04cf6754536ccdb2e070478795e8abd015022ca34386a09842b215526d6`. Owner: coordinator; date2026-10-09; BrowserOS neo at isolated origin4323.
Two temporary copies used only harmless built-HTML A/B meta markers to produce distinct manifests; original release files were not modified. A=`95804178d2d85e317d18a70803470e934a1a26c812c09ccdda17e0f2e9fdbba3`; B=`5c5d61e5597bcff7f87110c7249c5706ccb2a48227ee6980d3bab891c3b92463`; each13assets.

| Scenario | Outcome | Direct evidence |
| --- | --- | --- |
| Initial A caching | Passed | Empty origin storage; A marker, active controller, complete buildcache |
| Failed B candidate | Passed | Deliberate manifest chunk404; worker redundant, no waiting worker, A rootcache retained |
| Complete B staged, both workers queried | Passed | Both statuses available=true/missing=[]; A buildcache+B stagecache retained |
| Old-worker navigation before activation | Passed | Primary navigated to root, still markerA; both A build/B stage present, B waiting |
| Explicit update UI | Passed | 'Use updated copy' action visible; clicking changed primary markerB, waiting cleared; both builds retained |
| Old HTML retention and cleanup | Passed | Second page retained markerA and A build; after closing that page, A build removed while B remained available |
| B offline restart/history | Passed | Fixture server stopped; reload and close/reopen worked; saved18/24 restored75% with0.75 visual and favorite retained; uncached request503 |
| B document eviction | Passed for detection | Deleting only cached percentage document returned available=false with that missingpath; offline reload displayed explicit unavailable page |
| Same-version recovery | Incomplete | Reconnecting does not re-stage current manifest; explicit user-driven repair is being implemented rather than silently retrying every request |

Fixture server PID83304 was stopped after checks. Fixture files remain as temporary local evidence; they are not release assets. These checks resolve the prior competing-pruner defect for this source snapshot; renderer/refactor changes still require affected interaction checks.

## Final generated-boundary browser checks

Source build: `98eb9b183719f881ba2902bcb0d8f4a26eb995146d116249e9fd9b96577b8b72`; isolated origin4324, production static files, BrowserOS neo. Coordinator-owned2026-10-09 evidence; not an installed native app claim.

| Scenario | Result |
| --- | --- |
| Generated SSR/hydrated controls | Actual inputs/operation controls present and usable; 18/24 produced75%, matching working and0.75 visual |
| Clipboard | After pressing Copy, browser clipboard read back exactly `75%`; dedicated agent-origin clipboard permission granted for verification |
| Explicit eviction recovery failure | Removed only favicon from authoritative build cache. Online reload exposed Save offline copy. Deliberately served JavaScript404 during repair: UI reported Could not save offline copy, retained remaining build/root and saved history; no false ready claim |
| Explicit recovery success | Removed failure flag, clicked Save offline copy. Full verified repair slot created; worker available=true/missing=[] at unchanged version |
| Cross-tab writes | Two hydrated tabs concurrently ran a new history entry and removed favorite; final durable state contained the new entry and removed favorite, preserving previous history. Web Locks present. Initial pre-hydration interaction was inconclusive and excluded from this claim |
| Repaired offline relaunch | Stopped verification serverPID87386, reloaded/restored18/24:75% and matching working/visual. Closed and reopened product tab offline: complete worker status still available=true/missing=[] |

History Restore was exercised by focus+Enter; a pointer attempt in the current scrolled/sticky layout was intercepted by a paragraph. Pointer reachability needs independent visual follow-up rather than inferring a full interaction pass from keyboard restore. Final native/store IPC, iOS, physical devices, distribution remain unverified.

## Explicit commit-outcome browser check

Build `83bd9a72ed426d2e75b541b487f6937a25adc3887738932dc833c193d3338be3`, isolated origin4325, coordinator BrowserOS neo. Waited for hydrated percentage island before acting.

Temporary page-only affordance: intercepted Storage.prototype.setItem for the product state key to throw QuotaExceededError; no repository code or other origin was changed. Restored the original function and removed its temporary saved handle after failure checks.

- Actual Run with18/24: answer75% and matching working/visual remained, explicit storage-full notice displayed, no saved history/state created. Calculation was not misreported as durable history.
- Actual reset confirmation under quota failure stayed open; state remained unchanged.
- After removing controlled failure, reset committed and confirmation closed. Subsequent Run persisted18/24 history successfully.

These checks establish the web commit/failure/reset boundary for this snapshot. Native callers use the shared contract but still require their affected installed checks. No genuine browser disk-full condition or Tauri IPC behavior is inferred from the controlled quota affordance.
