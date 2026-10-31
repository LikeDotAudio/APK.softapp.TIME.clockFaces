# 🔍 Architecture audit — TIME.clockFaces (2026-10-30)

Audited against the APK.audio multi-repo architecture standard: coupling, boundaries, duplication, contracts.
← [Audits](INDEX.md) · Improvements: [🛣Roadmap/IMPROVEMENTS.md](../%F0%9F%9B%A3Roadmap/IMPROVEMENTS.md)

## Bounded context
A source library of 13 pure canvas clock faces (`FaceDef { id, label, short, order?, fit, lightBg?, draw }`) plus the shared zone/time helpers, consumed by the OS taskbar clock and WEB.SPOG. TypeScript, ~1.6 k lines, no page; `npm test` type-checks and tests it. Holds the nested submodule `Smith Chart/` (APK.softapp.TIME.SmithChart), which is audited separately. Sampled: every file in `src/` (sizes), `src/shared.ts`, `src/index.ts`, `src/smith.ts`, `.gitmodules`, `display.json`, README, and the consumer `OS/Footer/clock-faces/build-faces.mjs`.

## Context map
| Talks to | How (topic / endpoint / file / import) | Relationship |
|---|---|---|
| OS shell (`OS/Footer/clock-faces/build-faces.mjs`) | the OS bundles `TIME.clockFaces/src/<face>.ts` by monorepo path with esbuild into `window.OS.clockFaces` | Supplier; OS is a Conformist to the `FaceDef` contract |
| WEB.SPOG | mounts this repo at `src/ui/clock-faces` (a second checkout) and imports `ALL_FACES` | Supplier (Published Language: `FaceDef`, `FACE_API` 1) |
| `Smith Chart/` (APK.softapp.TIME.SmithChart) | nested submodule, no code import | Sibling app (separate audit) |

No bus, no HTTP, no third-party libraries.

## Scorecard
| Category | Score (0–3) | Finding |
|---|---|---|
| Coupling & Cohesion | 3 | Pure functions, no DOM/globals, no imports outside `src/`. (Consumers reach in by path, but that is their coupling, not this repo's.) |
| Boundary Integrity | 3 | The only external surface is the Canvas 2D API, which is the domain itself; the contract is a typed interface in `src/shared.ts`. |
| Duplication Control | 3 | `ALL_FACES` is the one face list and SPOG reads it; the OS bundle's own `FACES` list is the OS's to retire (handoff filed). |
| Testing & Contracts | 3 | `npm test`: strict tsc plus a contract test that renders every face at every resolution and checks `ALL_FACES` against the files. Run by hand, per the house rule. |
| Change management | 2 | `FACE_API = 1` versions the contract. Two checkouts of this repo (root and SPOG) are kept on one commit only by routine + `npm run check:twins`. |
Score key: 3 meets the standard · 2 minor gaps · 1 significant gaps · 0 absent / violated.

## Findings
1. **Good — a clean, pure contract.** [`src/shared.ts`](../../src/shared.ts) defines `FaceDef`/`FaceCtx`/`FaceDraw`, versioned by `FACE_API`; every face draws `draw(g, S, ctx)` into an S×S box with no DOM or global state.
2. **Good — `display.json` is minimal** (`tech: folder`, no `app`) — correct for a library.
3. **Good — smoke page present** — [SMOKE.md](../%F0%9F%A7%A9Manual%20and%20Artifacts/SMOKE.md).
4. **Two checkouts of one repo.** The root and WEB.SPOG each pin this repo; nothing in git keeps the two gitlinks equal. `npm run check:twins` detects a split; keeping them together is a routine, not a mechanism.

Delivered items from this audit are recorded in [🌍Publishing/DELIVERY.md](../%F0%9F%8C%8DPublishing/DELIVERY.md).
