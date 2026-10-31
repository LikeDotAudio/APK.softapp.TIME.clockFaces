// test/faces.test.mjs — the FaceDef contract, checked against the compiled faces
// (`npm test` compiles src/ to .test-build/ first, in `pretest`).
//
//   · ALL_FACES is the whole face list: every src/*.ts with a default FaceDef is in it
//   · each FaceDef is well formed and ids are unique
//   · ALL_FACES is in UI order (FaceDef.order, default 100)
//   · every face draws a frame at every resolution into a stub 2D context without throwing
//   · FACE_API is exported and is the version this test was written for
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const built = join(root, '.test-build');
const lib = await import(pathToFileURL(join(built, 'index.js')).href);

/** A 2D context that accepts anything: every property is callable, chainable and numeric. */
function stub() {
  const f = function () {};
  return new Proxy(f, {
    get: (_t, k) => (k === Symbol.toPrimitive ? () => 10 : k === 'width' || k === 'actualBoundingBoxAscent' ? 10 : k === 'then' ? undefined : stub()),
    apply: () => stub(),
    set: () => true,
  });
}

test('FACE_API is 1', () => assert.equal(lib.FACE_API, 1));

test('ALL_FACES lists every face file', async () => {
  const files = readdirSync(built).filter((f) => f.endsWith('.js') && f !== 'index.js');
  const faceIds = [];
  for (const f of files) {
    const m = await import(pathToFileURL(join(built, f)).href);
    if (m.default && typeof m.default.draw === 'function') faceIds.push(m.default.id);
  }
  assert.deepEqual(lib.ALL_FACES.map((d) => d.id).sort(), faceIds.sort());
  assert.equal(lib.ALL_FACES.length, 13);
});

test('every FaceDef is well formed, with a unique id', () => {
  const ids = new Set();
  for (const d of lib.ALL_FACES) {
    assert.match(d.id, /^[a-z][a-z0-9]*$/, `id ${d.id}`);
    assert.ok(!ids.has(d.id), `duplicate id ${d.id}`); ids.add(d.id);
    assert.ok(d.label && d.short, `${d.id} labels`);
    assert.ok(Array.isArray(d.fit) && d.fit.length === 2 && d.fit.every((n) => n > 0), `${d.id} fit`);
    assert.equal(typeof d.draw, 'function');
  }
});

test('ALL_FACES is in UI order', () => {
  const o = lib.ALL_FACES.map((d) => d.order ?? 100);
  assert.deepEqual(o, [...o].sort((a, b) => a - b));
});

test('every face draws a frame at every resolution', () => {
  const z = lib.zoneOf(lib.ZONES[lib.zoneIdxForOffset(0)]);
  for (const d of lib.ALL_FACES) {
    const state = {};
    for (const { id: res } of lib.RESOLUTIONS) {
      for (const now of [0, 16.7, 1000]) {
        assert.doesNotThrow(() => d.draw(stub(), 200, { z, now, res, state }), `${d.id} @ ${res}`);
      }
    }
  }
});

test('zone helpers', () => {
  assert.equal(lib.offsetLabel(330), 'UTC+05:30');
  assert.equal(lib.offsetLabel(-300), 'UTC−05:00');
  assert.equal(lib.parseZone('UTC').offsetMin, 0);
  assert.equal(lib.parseZone('+5:30').offsetMin, 330);
  assert.equal(lib.formatTime({ h: 1, m: 2, s: 3, ms: 500 }, 'hmsf'), '01:02:03:15');
});
