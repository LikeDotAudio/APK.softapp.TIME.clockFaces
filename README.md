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
| `src/index.ts` | Barrel: re-exports `shared`, every face, `lcd` as a namespace, and `ALL_FACES` — the one face list (13 faces, in `FaceDef.order`) |
| `package.json`, `test/` | `npm test` — type-check and the face-contract test |
| `scripts/check-twins.mjs` | `npm run check:twins` — the two monorepo checkouts of this repo are on one commit |
| `Smith Chart/` | Submodule `APK.softapp.TIME.SmithChart` — the full Smith Chart Clock (`smith_chart_clock.html`, `SmithChartClock/`); documented in its own README |
| `display.json` | The OS shell's display entry |

A face is pure: `draw(g, S, { z, now, res, state })` paints into an S×S canvas box — no DOM, no globals.

### How the OS uses it
`PODS/POD.THIN/OS/Footer/clock-faces/build-faces.mjs` bundles the face files (named one by one: digital, ledring, analog, flip, cat, casio, timeextreme, bigben, nixie, flu, horizontal, watch, smith) with esbuild into `OS/Footer/clock-faces/spog-clock-faces.js`, which assigns `window.OS.clockFaces`. The taskbar clock (`render-tray-clock.js`) and the NRC clock (`OS/Clock/nrc-time-signal/mount-nrc-clock.js`) read faces from that array. `src/index.ts` is not used by that bundle.

### How SPOG uses it
WEB.SPOG mounts this repo as a submodule at `src/ui/clock-faces` (a second checkout of the same repo, not a copy) and its CLOCK bench and TIMER wall clock import `ALL_FACES` from `src/index.ts`. The two checkouts are kept on one commit by hand; `npm run check:twins` checks it (see the wiki's ARCHITECTURE page).

---

## 🚀 Usage & Integration
* **Web Portal Entry**: none of its own — the faces appear in the OS taskbar clock and Clock window; the Smith Chart Clock page is `Smith Chart/smith_chart_clock.html`
* **Remote Repository**: https://github.com/LikeDotAudio/APK.softapp.TIME.clockFaces.git

```bash
npm ci && npm test     # strict tsc, then the face-contract test (node --test)
```
`src/index.ts`'s `ALL_FACES` holds the 13 faces; `lcd` is re-exported as a namespace, not a face. `FACE_API` (`src/shared.ts`) versions the contract.

After changing a face, the OS bundle has to be rebuilt (`node build-faces.mjs` in `OS/Footer/clock-faces/`) and the OS images re-baked.

---

## 🏛 Philosophy

* **A face is a pure function.** It draws the current time in a zone into a square box from what it is handed — no DOM, no globals, no state of its own beyond the per-window `state` bag (`src/shared.ts`, `FaceCtx` / `FaceDraw`). That is what lets the OS bundle the files unedited.
* **One face, one file, one default export.** Adding a face is adding a file that exports a `FaceDef` (`src/<face>.ts`); shared drawing that is not a face, like the LCD segments, has no default export (`src/lcd.ts`).
* **A clock reads a real wall time.** Zones are absolute UTC offsets from one catalogue, and the local zone is matched to it from the browser's DST-aware offset, so every face reads a true time (`src/shared.ts`, `ZONES`, `detectZoneIdx`).
* **A face shows the time, not a controller's value.** Stopwatches and timers are a different contract and are kept out of the face list (`OS/Footer/clock-faces/build-faces.mjs`, the CLOCK FACE vs CHRONOS DISPLAY note).
* **One source, no hand-ported copy.** The OS bundles these files instead of keeping its own copy (`build-faces.mjs` header).
* **One face list.** `ALL_FACES` is the list; consumers read it instead of naming or globbing files (`src/index.ts`, `test/faces.test.mjs`).

---

## 📚 Wiki
The depth lives in the wiki: [Documentation/README.md](Documentation/README.md) — principles, architecture, delivery.

## 🛣 Plans
Plans live only in the monorepo roadmap: `Documentation/🛣Roadmap/roadmap.htm`.

<!-- wiki:smoke -->
**Smoke test** — ✅ PASS 1/1 since 2026-10-30 12:51 EDT — [results](Documentation/%F0%9F%A7%A9Manual%20and%20Artifacts/SMOKE.md)
<!-- /wiki:smoke -->
