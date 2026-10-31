# TIME.clockFaces delivery

TypeScript sources; this repository builds nothing itself. `npm test` checks it.

- **Repository:** https://github.com/LikeDotAudio/APK.softapp.TIME.clockFaces, a submodule of
  APK.audio at `PODS/POD.THIN/Softapps/TIME/TIME.clockFaces`, with its own submodule
  `Smith Chart/` (https://github.com/LikeDotAudio/APK.softapp.TIME.SmithChart).
- **Check:** `npm ci && npm test` — strict `tsc`, then `test/faces.test.mjs` (`node --test`). Run by
  hand before a push; no CI. `npm run check:twins` checks the two monorepo checkouts agree.
- **Build into the OS:** `node build-faces.mjs` in `PODS/POD.THIN/OS/Footer/clock-faces/` writes
  `spog-clock-faces.js`, which is committed in the OS repo.
- **Images:** the OS tree, bundle included, is copied by `PODS/POD.THIN/WEB.OsApi/Docker/Dockerfile`
  (`/srv/portal/OS`) and `PODS/POD.THIN/WEB.Frontend-Assets/Docker/Dockerfile` (`/srv/www/OS`). The
  raw sources here are also copied with all of Softapps by the Frontend-Assets image, but nothing
  loads them from there.
- **After a face edit:** type-check, rebuild the bundle, commit it in the OS repo, then
  `up-stack.sh WEB.OsApi` and `up-stack.sh WEB.Frontend-Assets`
  (`PODS/POD.manager/MANAGER.Docktor/K8/up-stack.sh`), and bump the submodule pointers.
- **Not automated:** the bundle rebuild; the OS `FACES` list until `build-faces.mjs` reads `ALL_FACES`.
- **Smoke:** [SMOKE.md](../🧩Manual%20and%20Artifacts/SMOKE.md), written by `.apk.scripts/smoke.py`.

## Delivered from the 2026-10-30 audit

- **Build and test harness** — `package.json` (typescript devDependency, npm 10 lock), `tsconfig.json`
  (strict, NodeNext) and `test/faces.test.mjs`: every `src/*.ts` with a default `FaceDef` is in
  `ALL_FACES`, defs are well formed with unique ids, the list is in UI order, every face draws a
  frame at every resolution into a stub 2D context, and `FACE_API` is 1. Verified: `npm test`
  (6/6 pass) in both checkouts.
- **One face list** — `ALL_FACES` (`src/index.ts`) is sorted by `FaceDef.order` and is the list both
  consumers read: WEB.SPOG's clock bench and timer wall clock now import it instead of globbing
  `src/*.ts` (same faces, same order). The OS `build-faces.mjs` still names its files; adopting
  `ALL_FACES` there is a handoff to the root repo, which owns the OS. Part of the OS shell (taskbar
  and Clock window) and of WEB.SPOG.
- **Versioned face contract** — `export const FACE_API = 1` in `src/shared.ts`, with the bump rule
  in its comment; SPOG warns when it sees another version. Verified by the test above and SPOG's
  `tsc`.
- **Canonical zone catalogue** — `ZONES` / `zoneIdxForOffset` / `offsetLabel` are the exported, tested
  helpers (the "zone helpers" test); other TIME.* code should import them rather than restate them.
- **Two checkouts on one commit** — this repo is checked out at the root
  (`PODS/POD.THIN/Softapps/TIME/TIME.clockFaces`) and in WEB.SPOG (`src/ui/clock-faces`).
  `scripts/check-twins.mjs` (`npm run check:twins`) finds every checkout by its remote URL and
  fails when their HEADs differ; the routine (commit in one, `git fetch <path> && git checkout
  --detach FETCH_HEAD` in the other, bump both parents) is in
  [ARCHITECTURE.md](../%F0%9F%A7%A9Manual%20and%20Artifacts/ARCHITECTURE.md#two-checkouts-of-one-repo).
  WEB.SPOG exposes the same check as `npm run check:clock-faces`.
- **check:twins also checks the parents' pins** (1563396) — when the checkouts agree but a parent pins another commit, `scripts/check-twins.mjs` says so ("bump both pointers together") instead of passing silently. Verified 2026-10-31: both checkouts and both pins on 412a3ed.
- **Smith Chart is page-only** (4c36764, 412a3ed) — `Smith Chart/` → `88bd24c`: the page `smith_chart_clock.html` is canonical and the unused `SmithChartClock/` port is retired there; nothing here imported it. `npm test` 6/6 (2026-10-31).
- **One palette** (ROAD-3449, 2026-10-31) — the 161 hex literals the faces spelled live in `src/palette.ts` (120 colours, `PAL.<family><lightness>`, the naming of WEB.SPOG's `src/domain/palette.ts`); `test/palette.test.mjs` holds the rest of `src/` at zero. `npm test` 8/8, `tsc` clean. The OS bundle (`OS/Footer/clock-faces/spog-clock-faces.js`) picks it up on its next `node build-faces.mjs`; the colours are unchanged.
