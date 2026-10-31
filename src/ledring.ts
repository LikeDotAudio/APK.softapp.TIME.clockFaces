// src/ledring.ts — the Evertz digital reference: HH:MM:SS ringed by
// 60 second ticks that light up to the current second and pulse on the beat.
import { type FaceDef, type FaceCtx, zoneTime, formatTime, roundRect, TAU } from './shared.js';
import { PAL } from './palette.js';

function draw(g: CanvasRenderingContext2D, S: number, c: FaceCtx): void {
  const t = zoneTime(c.z);
  const cx = S / 2, cy = S / 2, R = S * 0.46;
  g.clearRect(0, 0, S, S);
  g.fillStyle = PAL.grey05s8;
  g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill();

  const beat = t.ms < 140 ? 1 - t.ms / 140 : 0;
  for (let i = 0; i < 60; i++) {
    const a = -Math.PI / 2 + (i / 60) * TAU;
    const cos = Math.cos(a), sin = Math.sin(a);
    const passed = i <= t.s, now = i === t.s, major = i % 5 === 0;
    const rO = R * 0.98, rI = R * (major ? 0.80 : 0.90);
    g.save();
    g.globalAlpha = now ? 1 : passed ? 0.92 : 0.28;
    g.strokeStyle = now ? PAL.red71 : PAL.red50;
    g.shadowColor = PAL.red58;
    g.shadowBlur = now ? 10 + beat * 14 : passed ? 4 : 0;
    g.lineWidth = S * ((major ? 0.026 : 0.02) + (now ? beat * 0.008 : 0));
    g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx + cos * rI, cy + sin * rI); g.lineTo(cx + cos * rO, cy + sin * rO); g.stroke();
    g.restore();
  }

  const pw = R * 1.34, ph = R * 0.42, x = cx - pw / 2, y = cy - ph / 2;
  g.fillStyle = PAL.grey02; roundRect(g, x, y, pw, ph, ph * 0.16); g.fill();
  g.fillStyle = PAL.red59; g.shadowColor = PAL.red59; g.shadowBlur = 12;
  g.font = `800 ${Math.round(ph * (c.res === 'hmsf' ? 0.5 : 0.62))}px 'Courier New',Consolas,monospace`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(formatTime(t, c.res), cx, cy + ph * 0.04);
  g.shadowBlur = 0;
  g.fillStyle = PAL.blue56;
  g.font = `700 ${Math.round(S * 0.052)}px 'Courier New',monospace`;
  g.fillText(c.z.label.toUpperCase(), cx, cy - ph * 0.9);
}

const def: FaceDef = { id: 'ledring', label: '◷ LED Ring', short: 'RING', order: 20, fit: [1, 1], draw };
export default def;
