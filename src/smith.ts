// src/editors/clock/faces/smith — the Smith chart read as a clock. Resistance
// circles and reactance arcs for a dial, the real axis as one day with a dot
// riding it, and each hand on its own constant-VSWR ring: minute outermost, hour
// inside it. The purple arm is the hour and minute added as vectors, the
// interference sum the full Smith Chart Clock traces over a day. That clock, with
// its controls, is the Clock's Smith Chart tab; this is its small sibling.
import { type FaceDef, type FaceCtx, zoneTime, TAU } from './shared.js';

const GRID = [0.2, 0.5, 1, 2, 5];
const MAG = { hour: 0.6, minute: 0.95, second: 0.85 };

function draw(g: CanvasRenderingContext2D, S: number, c: FaceCtx): void {
  const t = zoneTime(c.z);
  // Room outside the rim for the hour numbers, so none are clipped at the edge
  const cx = S / 2, cy = S / 2, R = S * 0.39;
  const thin = Math.max(0.5, S * 0.002);

  g.clearRect(0, 0, S, S);
  g.fillStyle = '#0a0d14';
  g.beginPath(); g.arc(cx, cy, R * 1.06, 0, TAU); g.fill();

  // Constant-resistance circles, all tangent at the open circuit
  g.lineWidth = thin;
  g.strokeStyle = '#2a3a55';
  for (const r of GRID) {
    g.beginPath(); g.arc(cx + (r / (1 + r)) * R, cy, R / (1 + r), 0, TAU); g.stroke();
  }

  // Constant-reactance arcs, kept inside the rim
  g.save();
  g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.clip();
  g.strokeStyle = '#243250';
  for (const x of GRID) {
    for (const sign of [1, -1]) {
      g.beginPath(); g.arc(cx + R, cy - (sign / x) * R, R / x, 0, TAU); g.stroke();
    }
  }
  g.restore();

  // Each hand's constant-VSWR ring, faint and dashed
  g.setLineDash([S * 0.008, S * 0.012]);
  g.strokeStyle = 'rgba(148, 163, 184, 0.25)';
  for (const m of [MAG.hour, MAG.minute]) {
    g.beginPath(); g.arc(cx, cy, m * R, 0, TAU); g.stroke();
  }
  g.setLineDash([]);

  // The real axis, and the part of the day already gone along it
  const secF = t.s + t.ms / 1000, minF = t.m + secF / 60, hourF = (t.h % 12) + minF / 60;
  const dayF = (t.h + minF / 60) / 24;
  g.strokeStyle = '#0284c7'; g.lineWidth = S * 0.004;
  g.beginPath(); g.moveTo(cx - R, cy); g.lineTo(cx + R, cy); g.stroke();
  const dayX = cx + (2 * dayF - 1) * R;
  g.strokeStyle = '#fde047'; g.lineWidth = S * 0.008; g.lineCap = 'round';
  g.beginPath(); g.moveTo(cx - R, cy); g.lineTo(dayX, cy); g.stroke();

  // The rim, |Gamma| = 1, with the twelve hours marked on it
  g.strokeStyle = '#38bdf8'; g.lineWidth = S * 0.01;
  g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.stroke();
  g.fillStyle = '#94a3b8';
  g.font = `600 ${Math.round(S * 0.045)}px ui-monospace, monospace`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  for (let h = 1; h <= 12; h++) {
    const a = -Math.PI / 2 + (h / 12) * TAU;
    g.fillText(String(h), cx + Math.cos(a) * R * 1.12, cy + Math.sin(a) * R * 1.12);
  }

  const angle = (frac: number): number => -Math.PI / 2 + frac * TAU;
  const hand = (a: number, mag: number, w: number, color: string): void => {
    const x = cx + Math.cos(a) * mag * R, y = cy + Math.sin(a) * mag * R;
    g.strokeStyle = color; g.lineWidth = w; g.lineCap = 'round';
    g.shadowColor = color; g.shadowBlur = S * 0.02;
    g.beginPath(); g.moveTo(cx, cy); g.lineTo(x, y); g.stroke();
    g.shadowBlur = 0;
    g.fillStyle = color;
    g.beginPath(); g.arc(x, y, w * 0.9, 0, TAU); g.fill();
  };

  const aHour = angle(hourF / 12), aMin = angle(minF / 60), aSec = angle(secF / 60);

  // The hour and minute as vectors, summed and scaled to stay inside the rim
  const re = MAG.hour * Math.cos(aHour) + MAG.minute * Math.cos(aMin);
  const im = MAG.hour * Math.sin(aHour) + MAG.minute * Math.sin(aMin);
  const sumMag = Math.hypot(re, im) / (MAG.hour + MAG.minute);
  hand(Math.atan2(im, re), sumMag, S * 0.012, '#a855f7');

  hand(aHour, MAG.hour, S * 0.026, '#f43f5e');
  hand(aMin, MAG.minute, S * 0.017, '#38bdf8');
  hand(aSec, MAG.second, S * 0.007, '#facc15');

  // The matched centre, and the day dot on top of everything
  g.fillStyle = '#38bdf8';
  g.beginPath(); g.arc(cx, cy, S * 0.014, 0, TAU); g.fill();
  g.fillStyle = '#ffffff'; g.shadowColor = '#fde047'; g.shadowBlur = S * 0.03;
  g.beginPath(); g.arc(dayX, cy, S * 0.016, 0, TAU); g.fill();
  g.shadowBlur = 0;
}

const def: FaceDef = { id: 'smith', label: '◎ Smith Chart', short: 'SMTH', order: 90, fit: [1, 1], draw };
export default def;
