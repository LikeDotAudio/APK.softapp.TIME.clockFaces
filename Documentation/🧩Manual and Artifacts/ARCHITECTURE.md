# TIME.clockFaces architecture

## Files

| Path | Role |
|---|---|
| `src/shared.ts` | Contract (`FaceDef`, `FaceCtx`, `FaceDraw`, `FaceState`), `ZONES` catalogue, `parseZone`, `deriveZones`, `zoneTime`, `zoneCal`, `detectZoneIdx`, `RESOLUTIONS` (`hm`/`hms`/`hmsf`, 30 fps frames), `formatTime`, `roundRect`, `offsetLabel`, `offsetRowLabel` |
| `src/analog.ts` … `src/watch.ts` | The 13 faces: analog, bigben, casio, cat, digital, flip, flu, horizontal, ledring, nixie, smith, timeextreme, watch |
| `src/lcd.ts` | Seven-segment renderer (`drawDigit`, `drawLcd`, `lcdWidth`) used by casio and timeextreme |
| `src/index.ts` | Barrel: `shared`, each face by name, `lcd` namespace, `ALL_FACES` — THE face list, sorted by `FaceDef.order` |
| `package.json`, `tsconfig.json`, `test/faces.test.mjs` | `npm test`: type-check + compile to `.test-build/`, then the contract test (every face file is in `ALL_FACES`, well-formed defs, UI order, every face draws at every resolution into a stub 2D context, `FACE_API`) |
| `scripts/check-twins.mjs` | `npm run check:twins`: every checkout of this repo in the monorepo is on the same commit |
| `Smith Chart/` | Submodule `APK.softapp.TIME.SmithChart`, the standalone Smith Chart Clock page; its own README |
| `display.json` | OS catalogue entry (no page; listed as a folder) |

## The contract

`FACE_API = 1` (`src/shared.ts`) versions it: bumped on any change a consumer must adapt to,
not on an added face or optional field.

```ts
interface FaceDef { id; label; short; order?; fit: [w, h]; lightBg?; draw: FaceDraw }
type FaceDraw = (g: CanvasRenderingContext2D, S: number, c: FaceCtx) => void
interface FaceCtx { z: Zone; now: number; res: Resolution; state: FaceState }
```

`fit` is the content aspect `[w, h]` within the S×S box (how a window sizes it); `now` is a
`performance.now()` timestamp; `state` is a per-window bag a face may use for
animation (e.g. `c.state.flip`).

## How the OS uses it

```
src/<face>.ts, src/shared.ts
   └─ PODS/POD.THIN/OS/Footer/clock-faces/build-faces.mjs   (esbuild, FACES list, IIFE)
        └─ OS/Footer/clock-faces/spog-clock-faces.js        window.OS.clockFaces, clockZones,
                                                            clockResolutions, clockLocalZoneIndex,
                                                            clockOffsetLabel, clockOffsetRowLabel
             ├─ OS/Footer/clock-faces/render-tray-clock.js   taskbar clock
             ├─ OS/Clock/mount-clock/mount-clock.js          Clock window
             └─ OS/Clock/nrc-time-signal/mount-nrc-clock.js  NRC clock
```

`src/index.ts` is not used by that bundle; it is the entry for a TypeScript consumer.

## Adding a face

1. `src/<id>.ts` default-exporting a `FaceDef` (give it an `order` for its place in the picker).
2. Add it to `ALL_FACES` in `src/index.ts` — `npm test` fails until you do.
3. `npm test`, then rebuild the OS bundle (`node PODS/POD.THIN/OS/Footer/clock-faces/build-faces.mjs`)
   and rebake the OS images. WEB.SPOG reads `ALL_FACES` directly.

## Checking

```sh
npm ci && npm test        # tsc (strict) + node --test test/
npm run check:twins       # inside the monorepo: both checkouts on one commit
```

## Two checkouts of one repo

This repo is checked out twice in APK.audio, each pinned by its own parent (nested repos stay
submodules): `PODS/POD.THIN/Softapps/TIME/TIME.clockFaces` (the root's; the OS bundle reads it)
and `PODS/POD.THIN/WEB.SPOG/src/ui/clock-faces` (SPOG's; SPOG's build reads it). Git keeps
neither equal to the other. The routine: commit in one, then in the other
`git fetch <the first checkout's path> && git checkout --detach FETCH_HEAD`, bump both parents'
pointers together, and run `npm run check:twins`, which finds every checkout by its remote URL
(no path list) and fails when their HEADs differ.
