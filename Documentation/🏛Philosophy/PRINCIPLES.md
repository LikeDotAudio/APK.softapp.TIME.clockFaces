# TIME.clockFaces principles

A source library of canvas clock faces: thirteen TypeScript draw functions and the zone/time
helpers they share. It has no page of its own; the OS shell bundles the files. Ecosystem rules are
in the monorepo's `Documentation/🏛Philosophy/`; this page names what this library keeps.

## The rules it keeps

1. **A face is a pure function.** `FaceDraw = (g, S, c: FaceCtx) => void` (`src/shared.ts:159`)
   paints the time into an S×S box from what it is handed — zone, frame time, resolution, and a
   per-window `state` bag (`FaceCtx`, `src/shared.ts:152`). No DOM, no globals. That is why the OS
   can bundle the files unedited.
2. **One face, one file, one default export.** Each `src/<face>.ts` default-exports a `FaceDef`
   (`src/shared.ts:162`). Shared drawing that is not a face has no default export: `src/lcd.ts` is
   re-exported as the `lcd` namespace and kept out of `ALL_FACES` (`src/index.ts`).
3. **A clock reads a real wall time.** Zones are absolute UTC offsets from one catalogue (`ZONES`,
   `src/shared.ts:19`); the local zone is matched to it from the DST-aware browser offset
   (`detectZoneIdx`, `src/shared.ts:82`), and every face reads `zoneTime(z)` (`:105`).
4. **One source, no hand-ported copy.** The OS bundles these files with esbuild rather than keeping
   its own (`PODS/POD.THIN/OS/Footer/clock-faces/build-faces.mjs`, header). Anything both the OS and
   a face read (e.g. `offsetRowLabel`, `src/shared.ts:70`) lives in `shared.ts` and goes through
   the bundle.
5. **A face shows the time, not a controller's value.** Stopwatches and timers are a different
   contract and are not faces (`build-faces.mjs`, "WHAT MUST NOT BE ADDED TO THAT LIST").

## Where it breaks them

- **The one source cannot currently be rebuilt into the OS.** `build-faces.mjs` imports esbuild
  from `APK:Softapps/DXF/Code/node_modules` and reads faces from `APK:Softapps/TIME.clockFaces/src`,
  neither of which exists since the POD.task rename. The committed
  `OS/Footer/clock-faces/spog-clock-faces.js` (2026-09-20) is what ships; face edits here do not
  reach the shell until that script is repointed.
- **Faces are listed twice.** `src/index.ts` (`ALL_FACES`) and `build-faces.mjs` (`FACES`) each name
  the faces; a new face needs a line in both.
