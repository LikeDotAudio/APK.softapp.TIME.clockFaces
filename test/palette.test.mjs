// test/palette.test.mjs — the hex-literal ratchet, twin of WEB.SPOG's src/domain/palette.test.ts
// (ROAD-3449): every colour a face paints lives in src/palette.ts, read as PAL.<name>.
//
//   · no src/*.ts but the palette spells a hex
//   · every palette colour is used, and spelled once
//   · no face spells rgba()/hsl(): a colour at an opacity is alpha(PAL.<name>, a) (ROAD-3463)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const src = join(dirname(dirname(fileURLToPath(import.meta.url))), 'src');
const HEX = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g;
const others = readdirSync(src).filter((f) => f.endsWith('.ts') && f !== 'palette.ts');
const palette = readFileSync(join(src, 'palette.ts'), 'utf8');
const entries = [...palette.matchAll(/(\w+): '(#[0-9a-f]{6})'/g)].map(([, k, v]) => [k, v]);

test('no face spells a hex outside src/palette.ts', () => {
  const per = others.map((f) => [f, (readFileSync(join(src, f), 'utf8').match(HEX) ?? []).length]).filter(([, n]) => n > 0);
  assert.deepEqual(per, [], 'move these into PAL (src/palette.ts)');
});

test('every palette colour is used, and spelled once', () => {
  assert.ok(entries.length > 0);
  const text = others.map((f) => readFileSync(join(src, f), 'utf8')).join('\n');
  assert.deepEqual(entries.filter(([k]) => !new RegExp(`PAL\\.${k}\\b`).test(text)).map(([k]) => k), []);
  assert.equal(new Set(entries.map(([, v]) => v)).size, entries.length);
});

test('no face spells rgba()/hsl(): alpha(PAL.<name>, a) instead (ROAD-3463)', () => {
  const per = others.map((f) => [f, (readFileSync(join(src, f), 'utf8').match(/\brgba?\(|\bhsla?\(/g) ?? []).length]).filter(([, n]) => n > 0);
  assert.deepEqual(per, [], 'spell them alpha(PAL.<name>, a) (src/palette.ts)');
});
