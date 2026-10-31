// src/analog.ts — the Evertz analog reference: white face, 12h + inner
// red 24h numerals, and a smoothly-sweeping high-vis red second hand.
import { type FaceDef, type FaceCtx, zoneTime, TAU } from './shared.js';
import { PAL } from './palette.js';

function draw(g: CanvasRenderingContext2D, S: number, c: FaceCtx): void {
  const t = zoneTime(c.z);
  const cx = S / 2, cy = S / 2, R = S * 0.46;
  g.clearRect(0, 0, S, S);
  g.fillStyle = PAL.grey07; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill();
  g.fillStyle = PAL.grey95; g.beginPath(); g.arc(cx, cy, R * 0.94, 0, TAU); g.fill();

  for (let i = 0; i < 60; i++) {
    const a = -Math.PI / 2 + (i / 60) * TAU, cos = Math.cos(a), sin = Math.sin(a);
    const hour = i % 5 === 0;
    g.strokeStyle = PAL.grey10; g.lineWidth = hour ? S * 0.016 : S * 0.006;
    const rI = R * (hour ? 0.8 : 0.85);
    g.beginPath(); g.moveTo(cx + cos * rI, cy + sin * rI); g.lineTo(cx + cos * R * 0.9, cy + sin * R * 0.9); g.stroke();
  }
  g.textAlign = 'center'; g.textBaseline = 'middle';
  for (let h = 1; h <= 12; h++) {
    const a = -Math.PI / 2 + (h / 12) * TAU, cos = Math.cos(a), sin = Math.sin(a);
    g.fillStyle = PAL.grey07; g.font = `800 ${Math.round(S * 0.11)}px Arial,Helvetica,sans-serif`;
    g.fillText(String(h), cx + cos * R * 0.68, cy + sin * R * 0.68);
    g.fillStyle = PAL.red44; g.font = `700 ${Math.round(S * 0.058)}px Arial,Helvetica,sans-serif`;
    g.fillText(String(h === 12 ? 24 : h + 12), cx + cos * R * 0.5, cy + sin * R * 0.5);
  }
  g.fillStyle = PAL.red33; g.font = `800 ${Math.round(S * 0.05)}px Arial,sans-serif`;
  g.fillText(c.z.label.toUpperCase(), cx, cy + R * 0.34);

  const secF = t.s + t.ms / 1000, minF = t.m + secF / 60, hourF = (t.h % 12) + minF / 60;
  const hand = (frac: number, len: number, w: number, color: string, tail = 0): void => {
    const a = -Math.PI / 2 + frac * TAU;
    g.strokeStyle = color; g.lineWidth = w; g.lineCap = 'round';
    g.beginPath();
    g.moveTo(cx - Math.cos(a) * tail, cy - Math.sin(a) * tail);
    g.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len);
    g.stroke();
  };
  hand(hourF / 12, R * 0.5, S * 0.028, PAL.grey08);
  hand(minF / 60, R * 0.74, S * 0.02, PAL.grey08);
  hand(secF / 60, R * 0.82, S * 0.012, PAL.red47, R * 0.22);
  g.fillStyle = PAL.grey08; g.beginPath(); g.arc(cx, cy, S * 0.03, 0, TAU); g.fill();
  g.fillStyle = PAL.red47; g.beginPath(); g.arc(cx, cy, S * 0.014, 0, TAU); g.fill();
}

const def: FaceDef = { id: 'analog', label: '◴ Analog', short: 'ANLG', order: 30, fit: [1, 1], draw };
export default def;
