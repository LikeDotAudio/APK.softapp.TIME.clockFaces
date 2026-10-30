// src/index.ts — Barrel export for TIME.clockFaces: shared helpers, every face,
// the lcd renderer (a namespace, not a face) and ALL_FACES (the 13 faces).
import analog from './analog.js';
import bigben from './bigben.js';
import casio from './casio.js';
import cat from './cat.js';
import digital from './digital.js';
import flip from './flip.js';
import flu from './flu.js';
import horizontal from './horizontal.js';
import ledring from './ledring.js';
import nixie from './nixie.js';
import smith from './smith.js';
import timeextreme from './timeextreme.js';
import watch from './watch.js';

import type { FaceDef } from './shared.js';

export * from './shared.js';
export { default as analog } from './analog.js';
export { default as bigben } from './bigben.js';
export { default as casio } from './casio.js';
export { default as cat } from './cat.js';
export { default as digital } from './digital.js';
export { default as flip } from './flip.js';
export { default as flu } from './flu.js';
export { default as horizontal } from './horizontal.js';
export * as lcd from './lcd.js'; // the seven-segment renderer, not a face
export { default as ledring } from './ledring.js';
export { default as nixie } from './nixie.js';
export { default as smith } from './smith.js';
export { default as timeextreme } from './timeextreme.js';
export { default as watch } from './watch.js';

export const ALL_FACES: FaceDef[] = [
  analog,
  bigben,
  casio,
  cat,
  digital,
  flip,
  flu,
  horizontal,
  ledring,
  nixie,
  smith,
  timeextreme,
  watch,
];
