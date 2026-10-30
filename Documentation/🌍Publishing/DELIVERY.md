# TIME.clockFaces delivery

TypeScript sources; this repository builds nothing itself.

- **Repository:** https://github.com/LikeDotAudio/APK.softapp.TIME.clockFaces, a submodule of
  APK.audio at `PODS/POD.THIN/Softapps/TIME/TIME.clockFaces`, with its own submodule
  `Smith Chart/` (https://github.com/LikeDotAudio/APK.softapp.TIME.SmithChart).
- **Check:** `tsc --noEmit … src/index.ts` (command in
  [ARCHITECTURE.md](../🧩Manual%20and%20Artifacts/ARCHITECTURE.md)), by hand. No CI.
- **Build into the OS:** `node build-faces.mjs` in `PODS/POD.THIN/OS/Footer/clock-faces/` writes
  `spog-clock-faces.js`, which is committed in the OS repo. That script's esbuild and face paths
  predate the POD.task rename and do not resolve today, so the committed bundle (2026-09-20) is
  what ships.
- **Images:** the OS tree, bundle included, is copied by `PODS/POD.THIN/WEB.OsApi/Docker/Dockerfile`
  (`/srv/portal/OS`) and `PODS/POD.THIN/WEB.Frontend-Assets/Docker/Dockerfile` (`/srv/www/OS`). The
  raw sources here are also copied with all of Softapps by the Frontend-Assets image, but nothing
  loads them from there.
- **After a face edit:** type-check, rebuild the bundle, commit it in the OS repo, then
  `up-stack.sh WEB.OsApi` and `up-stack.sh WEB.Frontend-Assets`
  (`PODS/POD.manager/MANAGER.Docktor/K8/up-stack.sh`), and bump the submodule pointers.
- **Not automated:** the type-check, the bundle rebuild, keeping `ALL_FACES` and `FACES` in step.
- **Smoke:** [SMOKE.md](../🧩Manual%20and%20Artifacts/SMOKE.md), written by `.apk.scripts/smoke.py`.
