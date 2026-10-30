// src/watch.ts — Luxury Chronograph Wristwatch Face.
// Polished metallic bezel, sunburst dial, 3 sub-dials, date window, and luminescent hands.
import { type FaceDef, type FaceCtx, type FaceDraw, zoneTime, zoneCal, TAU, WEEKDAY3 } from './shared.js';

function drawSubDial(
  g: CanvasRenderingContext2D,
  cx: number, cy: number, R: number,
  title: string, val: number, maxVal: number,
  labels?: string[]
): void {
  g.save();

  // Sub-dial inset shadow background
  g.fillStyle = '#14181f';
  g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(212, 175, 55, 0.4)'; g.lineWidth = Math.max(1, R * 0.08); g.stroke();

  // Sub-dial ticks
  for (let i = 0; i < 12; i++) {
    const a = -Math.PI / 2 + (i / 12) * TAU;
    const rIn = R * 0.78, rOut = R * 0.92;
    g.strokeStyle = 'rgba(200, 210, 220, 0.6)';
    g.lineWidth = i % 3 === 0 ? 1.5 : 1;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * rIn, cy + Math.sin(a) * rIn);
    g.lineTo(cx + Math.cos(a) * rOut, cy + Math.sin(a) * rOut);
    g.stroke();
  }

  // Label text if provided
  if (labels && labels.length > 0) {
    g.fillStyle = '#8a9ba8';
    g.font = `600 ${Math.round(R * 0.35)}px sans-serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    labels.forEach((lbl, idx) => {
      const a = -Math.PI / 2 + (idx / labels.length) * TAU;
      g.fillText(lbl, cx + Math.cos(a) * R * 0.52, cy + Math.sin(a) * R * 0.52);
    });
  }

  // Sub-dial title
  g.fillStyle = '#d4af37';
  g.font = `600 ${Math.round(R * 0.28)}px sans-serif`;
  g.textAlign = 'center';
  g.fillText(title, cx, cy + R * 0.45);

  // Sub-dial Hand
  const frac = val / maxVal;
  const a = -Math.PI / 2 + frac * TAU;
  g.strokeStyle = '#e63946';
  g.lineWidth = Math.max(1.5, R * 0.08);
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(cx - Math.cos(a) * R * 0.15, cy - Math.sin(a) * R * 0.15);
  g.lineTo(cx + Math.cos(a) * R * 0.72, cy + Math.sin(a) * R * 0.72);
  g.stroke();

  g.fillStyle = '#e63946';
  g.beginPath(); g.arc(cx, cy, R * 0.12, 0, TAU); g.fill();

  g.restore();
}

const draw: FaceDraw = (g: CanvasRenderingContext2D, S: number, c: FaceCtx): void => {
  const t = zoneTime(c.z);
  const cal = zoneCal(c.z);

  const cx = S / 2, cy = S / 2;
  const outerR = S * 0.48;
  const dialR = S * 0.41;

  g.clearRect(0, 0, S, S);

  // Metallic Bezel Gradient (Stainless Steel / Polished Gold)
  const bezelGrad = g.createRadialGradient(cx, cy, dialR, cx, cy, outerR);
  bezelGrad.addColorStop(0, '#505660');
  bezelGrad.addColorStop(0.3, '#d0d7e0');
  bezelGrad.addColorStop(0.7, '#88929e');
  bezelGrad.addColorStop(1, '#2c323b');

  g.fillStyle = bezelGrad;
  g.beginPath(); g.arc(cx, cy, outerR, 0, TAU); g.fill();

  // Tachymeter markings on bezel outer ring
  g.strokeStyle = '#1a202c'; g.lineWidth = Math.max(1, S * 0.003);
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * TAU;
    const rIn = dialR + (outerR - dialR) * 0.25;
    const rOut = dialR + (outerR - dialR) * 0.85;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * rIn, cy + Math.sin(a) * rIn);
    g.lineTo(cx + Math.cos(a) * rOut, cy + Math.sin(a) * rOut);
    g.stroke();
  }

  // Sunburst Dark Navy Dial Face
  const dialGrad = g.createRadialGradient(cx, cy, 0, cx, cy, dialR);
  dialGrad.addColorStop(0, '#1a2636');
  dialGrad.addColorStop(0.75, '#0d1520');
  dialGrad.addColorStop(1, '#050a10');

  g.fillStyle = dialGrad;
  g.beginPath(); g.arc(cx, cy, dialR, 0, TAU); g.fill();

  // Dial Outer Chapter Ring
  g.strokeStyle = '#d4af37'; g.lineWidth = S * 0.005;
  g.beginPath(); g.arc(cx, cy, dialR * 0.96, 0, TAU); g.stroke();

  // Hour Indices & Minute Track
  for (let i = 0; i < 60; i++) {
    const a = -Math.PI / 2 + (i / 60) * TAU;
    const isHour = i % 5 === 0;

    if (isHour) {
      // Applied Gold Hour Markers
      const rIn = dialR * 0.78, rOut = dialR * 0.92;
      g.strokeStyle = '#d4af37';
      g.lineWidth = S * 0.018;
      g.beginPath();
      g.moveTo(cx + Math.cos(a) * rIn, cy + Math.sin(a) * rIn);
      g.lineTo(cx + Math.cos(a) * rOut, cy + Math.sin(a) * rOut);
      g.stroke();

      // Luminous Dot at tip of marker
      g.fillStyle = '#66ffb2';
      g.beginPath();
      g.arc(cx + Math.cos(a) * dialR * 0.74, cy + Math.sin(a) * dialR * 0.74, S * 0.008, 0, TAU);
      g.fill();
    } else {
      // Minute Ticks
      const rIn = dialR * 0.88, rOut = dialR * 0.92;
      g.strokeStyle = 'rgba(200, 215, 230, 0.5)';
      g.lineWidth = S * 0.004;
      g.beginPath();
      g.moveTo(cx + Math.cos(a) * rIn, cy + Math.sin(a) * rIn);
      g.lineTo(cx + Math.cos(a) * rOut, cy + Math.sin(a) * rOut);
      g.stroke();
    }
  }

  // 3 Sub-Dials:
  // 1. Seconds Sub-dial (Bottom, 6 o'clock)
  const secF = t.s + t.ms / 1000;
  drawSubDial(g, cx, cy + dialR * 0.42, dialR * 0.26, 'SEC', secF, 60);

  // 2. Minutes Sub-dial (Left, 9 o'clock)
  drawSubDial(g, cx - dialR * 0.42, cy, dialR * 0.26, 'MIN', t.m, 60);

  // 3. 24-Hour Sub-dial (Top, 12 o'clock)
  drawSubDial(g, cx, cy - dialR * 0.42, dialR * 0.26, '24H', t.h, 24);

  // Date Window at 3 o'clock
  const dateX = cx + dialR * 0.45;
  const dateY = cy;
  const dateW = S * 0.13;
  const dateH = S * 0.09;

  g.fillStyle = '#d4af37';
  g.fillRect(dateX - dateW / 2 - 2, dateY - dateH / 2 - 2, dateW + 4, dateH + 4);

  g.fillStyle = '#f8f9fa';
  g.fillRect(dateX - dateW / 2, dateY - dateH / 2, dateW, dateH);

  const dayStr = WEEKDAY3[cal.day] ?? 'SU';
  g.fillStyle = '#111';
  g.font = `700 ${Math.round(S * 0.045)}px "Segoe UI", sans-serif`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(`${dayStr} ${cal.date}`, dateX, dateY);

  // Brand / Zone Emblem text
  g.fillStyle = '#d4af37';
  g.font = `700 ${Math.round(S * 0.042)}px "Georgia", serif`;
  g.fillText('CHRONOGRAPH', cx, cy - dialR * 0.16);

  g.fillStyle = '#8a9ba8';
  g.font = `600 ${Math.round(S * 0.035)}px sans-serif`;
  g.fillText(c.z.label.toUpperCase(), cx, cy + dialR * 0.16);

  // Main Hands: Hour, Minute, Chrono Seconds
  const minF = t.m + secF / 60;
  const hourF = (t.h % 12) + minF / 60;

  const drawMainHand = (frac: number, len: number, w: number, color: string, lume = true): void => {
    const a = -Math.PI / 2 + frac * TAU;
    const cos = Math.cos(a), sin = Math.sin(a);

    g.save();
    g.strokeStyle = color; g.lineWidth = w; g.lineCap = 'round';
    g.beginPath();
    g.moveTo(cx - cos * len * 0.15, cy - sin * len * 0.15);
    g.lineTo(cx + cos * len, cy + sin * len);
    g.stroke();

    if (lume) {
      g.strokeStyle = '#66ffb2'; g.lineWidth = w * 0.4;
      g.beginPath();
      g.moveTo(cx + cos * len * 0.25, cy + sin * len * 0.25);
      g.lineTo(cx + cos * len * 0.85, cy + sin * len * 0.85);
      g.stroke();
    }
    g.restore();
  };

  // Hour Hand
  drawMainHand(hourF / 12, dialR * 0.52, S * 0.024, '#e2e8f0', true);
  // Minute Hand
  drawMainHand(minF / 60, dialR * 0.76, S * 0.018, '#e2e8f0', true);
  // Sweeping Chrono Second Hand
  drawMainHand(secF / 60, dialR * 0.88, S * 0.008, '#e63946', false);

  // Center Cap Pin
  g.fillStyle = '#d4af37';
  g.beginPath(); g.arc(cx, cy, S * 0.022, 0, TAU); g.fill();
  g.fillStyle = '#111';
  g.beginPath(); g.arc(cx, cy, S * 0.01, 0, TAU); g.fill();
};

const def: FaceDef = {
  id: 'watch',
  label: '⌚ Luxury Chronograph Watch',
  short: 'WATCH',
  order: 65,
  fit: [1, 1],
  draw,
};

export default def;
