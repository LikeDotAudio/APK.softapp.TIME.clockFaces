// scripts/check-twins.mjs — `npm run check:twins`: are all checkouts of THIS repo
// in the monorepo on the same commit?
//
// TIME.clockFaces is checked out twice in APK.audio, on purpose (each parent pins
// it as its own submodule; nested repos stay submodules):
//     the monorepo root's  PODS/POD.THIN/Softapps/TIME/TIME.clockFaces   (the OS bundle reads it)
//     WEB.SPOG's           src/ui/clock-faces                             (SPOG's build reads it)
// Nothing in git keeps two gitlinks in two parents equal, so a face fixed in one
// checkout silently differs from the other. This check finds every checkout BY
// ITS REMOTE URL (every .gitmodules in the monorepo, no path list) and fails when
// their HEADs — or what their parents pin — differ.
//
// The routine after committing here:
//     git -C <the other checkout> fetch <this checkout> && git -C <the other checkout> checkout --detach FETCH_HEAD
//     then bump the pointer in both parents (WEB.SPOG and the root) in the same sitting.
//
// Outside the monorepo (a standalone clone) it reports "standalone" and exits 0.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const git = (cwd, ...a) => { try { return execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return ''; } };
const norm = (u) => u.replace(/\.git$/, '').replace(/\/+$/, '').toLowerCase();

const url = norm(git(here, 'remote', 'get-url', 'origin'));
let root = here;
while (!existsSync(join(root, '.apk.scripts')) && dirname(root) !== root) root = dirname(root);
if (!url || !existsSync(join(root, '.apk.scripts'))) { console.log('check:twins: standalone checkout — nothing to compare'); process.exit(0); }

const SKIP = new Set(['node_modules', '.git', 'dist', '.test-build', 'target']);
function* gitmodules(dir, depth = 0) {
  if (depth > 8) return;
  let entries; try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.name === '.gitmodules' && e.isFile()) yield join(dir, e.name);
    else if (e.isDirectory() && !SKIP.has(e.name)) yield* gitmodules(join(dir, e.name), depth + 1);
  }
}

const twins = [];
for (const file of gitmodules(root)) {
  const parent = dirname(file);
  const text = readFileSync(file, 'utf8');
  for (const [, body] of text.matchAll(/\[submodule "[^"]*"\]([^[]*)/g)) {
    const path = (body.match(/^\s*path\s*=\s*(.+)$/m) || [])[1]?.trim();
    const u = (body.match(/^\s*url\s*=\s*(.+)$/m) || [])[1]?.trim();
    if (!path || !u || norm(u) !== url) continue;
    const dir = join(parent, path);
    const pinned = (git(parent, 'ls-tree', 'HEAD', path).split(/\s+/)[2]) || '';
    const head = existsSync(dir) && statSync(dir).isDirectory() ? git(dir, 'rev-parse', 'HEAD') : '';
    twins.push({ at: relative(root, dir) || '.', head, pinned });
  }
}

const heads = new Set(twins.map((t) => t.head).filter(Boolean));
const pins = new Set(twins.map((t) => t.pinned).filter(Boolean));
for (const t of twins) console.log(`  ${t.head.slice(0, 9) || '(not checked out)'}  pinned ${t.pinned.slice(0, 9) || '-'}  ${t.at}`);
if (twins.length < 2) { console.log(`check:twins: ${twins.length} checkout(s) of ${url} — nothing to compare`); process.exit(0); }
if (heads.size > 1) { console.error('check:twins: FAIL — the checkouts are on different commits (see the routine in this script\'s header)'); process.exit(1); }
if (pins.size > 1) { console.log('check:twins: checkouts agree; the parents still pin different commits — bump both pointers'); process.exit(0); }
console.log('check:twins: every checkout and every pin is on the same commit');
