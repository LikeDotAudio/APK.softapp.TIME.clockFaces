# TIME.clockFaces architecture

## Files

| Path | Role |
|---|---|
| `src/shared.ts` | Contract (`FaceDef`, `FaceCtx`, `FaceDraw`, `FaceState`), `ZONES` catalogue, `parseZone`, `deriveZones`, `zoneTime`, `zoneCal`, `detectZoneIdx`, `RESOLUTIONS` (`hm`/`hms`/`hmsf`, 30 fps frames), `formatTime`, `roundRect`, `offsetLabel`, `offsetRowLabel` |
| `src/analog.ts` … `src/watch.ts` | The 13 faces: analog, bigben, casio, cat, digital, flip, flu, horizontal, ledring, nixie, smith, timeextreme, watch |
| `src/lcd.ts` | Seven-segment renderer (`drawDigit`, `drawLcd`, `lcdWidth`) used by casio and timeextreme |
| `src/index.ts` | Barrel: `shared`, each face by name, `lcd` namespace, `ALL_FACES` |
| `Smith Chart/` | Submodule `APK.softapp.TIME.SmithChart`, the standalone Smith Chart Clock page; its own README |
| `display.json` | OS catalogue entry (no page; listed as a folder) |

## The contract

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

1. `src/<id>.ts` default-exporting a `FaceDef`.
2. Add it to `ALL_FACES` in `src/index.ts` and to `FACES` in `build-faces.mjs`.
3. Type-check (below), rebuild the OS bundle, rebake the OS images.

## Checking

```sh
../../EDITORS/EDITORS.CAD.Like.audio/node_modules/.bin/tsc --noEmit --target ES2022 \
  --module NodeNext --moduleResolution NodeNext --lib ES2022,DOM --strict src/index.ts
```
