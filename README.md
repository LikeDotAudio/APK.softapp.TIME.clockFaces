# TIME.clockFaces

> ⏱️ **Clock Faces** — the canvas clock faces of the APK.audio OS: thirteen pure TypeScript draw functions (analog, Big Ben, Casio, cat, digital, flip, fluorescent, horizontal, LED ring, nixie, Smith chart, Time-Extreme, chronograph watch) plus the shared zone/time helpers they draw from. The full Smith Chart Clock app sits beside them as the `Smith Chart/` submodule.

---

## 🧩 Architectural Role
* **Family**: TIME (time, scheduling and sync)
* **Category**: Clock faces — a source library, not a page
* **Pipeline Stage**: display — bundled into the OS shell's taskbar clock and Clock window

---

## ⚙️ Repository Overview
A standalone Git repository, mounted as a submodule at `PODS/POD.THIN/Softapps/TIME/TIME.clockFaces` in the APK.audio monorepo.

| Path | What it is |
|---|---|
| `src/shared.ts` | The face contract (`FaceDef`, `FaceCtx`, `FaceDraw`) and shared helpers: the `ZONES` world-clock catalogue (UTC offsets in minutes), `parseZone` / `deriveZones`, `zoneTime` / `zoneCal`, resolutions `hm` / `hms` / `hmsf` at 30 fps frames, `formatTime`, `roundRect` |
| `src/<face>.ts` | One face per file, each default-exporting a `FaceDef { id, label, short, order?, fit, lightBg?, draw }`: `analog`, `bigben`, `casio`, `cat`, `digital`, `flip`, `flu`, `horizontal`, `ledring`, `nixie`, `smith`, `timeextreme`, `watch` |
| `src/lcd.ts` | Seven-segment LCD renderer used by `casio` and `timeextreme`; not a face (no default export) |
| `src/index.ts` | Barrel: re-exports `shared` and every face, and `ALL_FACES` |
| `Smith Chart/` | Submodule `APK.softapp.TIME.SmithChart` — the full Smith Chart Clock (`smith_chart_clock.html`, `SmithChartClock/`); documented in its own README |
| `display.json` | The OS shell's display entry |

A face is pure: `draw(g, S, { z, now, res, state })` paints into an S×S canvas box — no DOM, no globals.

### How the OS uses it
`PODS/POD.THIN/OS/Footer/clock-faces/build-faces.mjs` bundles the face files (named one by one: digital, ledring, analog, flip, cat, casio, timeextreme, bigben, nixie, flu, horizontal, watch, smith) with esbuild into `OS/Footer/clock-faces/spog-clock-faces.js`, which assigns `window.OS.clockFaces`. The taskbar clock (`render-tray-clock.js`) and the NRC clock (`OS/Clock/nrc-time-signal/mount-nrc-clock.js`) read faces from that array. `src/index.ts` is not used by that bundle.

> ⚠️ `build-faces.mjs` still resolves the faces at `<POD.THIN>/APK:Softapps/TIME.clockFaces/src` and esbuild under `APK:Softapps/DXF/Code/node_modules`; neither path exists since the POD.task rename, so the committed `spog-clock-faces.js` cannot be rebuilt until that script is updated.

---

## 🚀 Usage & Integration
* **Web Portal Entry**: none of its own — the faces appear in the OS taskbar clock and Clock window; the Smith Chart Clock page is `Smith Chart/smith_chart_clock.html`
* **Remote Repository**: https://github.com/LikeDotAudio/APK.softapp.TIME.clockFaces.git

There is no `package.json`, build or test here. To type-check (with a TypeScript compiler already in the monorepo):
```bash
../../EDITORS/EDITORS.CAD.Like.audio/node_modules/.bin/tsc --noEmit --target ES2022 \
  --module NodeNext --moduleResolution NodeNext --lib ES2022,DOM --strict src/index.ts
```
> ⚠️ This currently reports three errors: `src/index.ts` imports a default export from `lcd.ts`, which has none (so `ALL_FACES` would hold `undefined`), and `src/watch.ts` uses the type `FaceDraw` without importing it. The OS bundle is unaffected — esbuild strips types and does not go through `index.ts`.

After changing a face, the OS bundle has to be rebuilt (`node build-faces.mjs` in `OS/Footer/clock-faces/`, once its paths are fixed) and the OS images re-baked.

---

## 🏛 Philosophy

* **A face is a pure function.** It draws the current time in a zone into a square box from what it is handed — no DOM, no globals, no state of its own beyond the per-window `state` bag (`src/shared.ts`, `FaceCtx` / `FaceDraw`). That is what lets the OS bundle the files unedited.
* **One face, one file, one default export.** Adding a face is adding a file that exports a `FaceDef` (`src/<face>.ts`); shared drawing that is not a face, like the LCD segments, has no default export (`src/lcd.ts`).
* **A clock reads a real wall time.** Zones are absolute UTC offsets from one catalogue, and the local zone is matched to it from the browser's DST-aware offset, so every face reads a true time (`src/shared.ts`, `ZONES`, `detectZoneIdx`).
* **A face shows the time, not a controller's value.** Stopwatches and timers are a different contract and are kept out of the face list (`OS/Footer/clock-faces/build-faces.mjs`, the CLOCK FACE vs CHRONOS DISPLAY note).
* **One source, no hand-ported copy.** The OS bundles these files instead of keeping its own copy (`build-faces.mjs` header).

---

## 🛣 Plans
Plans live only in the monorepo roadmap: `Documentation/🛣Roadmap/roadmap.htm`.
