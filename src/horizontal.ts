// src/horizontal.ts — Horizontal Linear Tape / Sliding Ruler Timeline Clock Face.
// A continuous linear timeline tape sliding past a fixed central hairline indicator.
import { type FaceDef, type FaceCtx, zoneTime, formatTime, type FaceDraw, pad } from './shared.js';
import { PAL } from './palette.js';

const draw: FaceDraw = (g: CanvasRenderingContext2D, S: number, c: FaceCtx): void => {
  const t = zoneTime(c.z);

  g.clearRect(0, 0, S, S);

  // Background chassis
  g.fillStyle = PAL.blue09;
  g.fillRect(0, 0, S, S);

  // Horizontal Ruler Window
  const trackY = S * 0.32;
  const trackH = S * 0.36;
  const centerY = trackY + trackH / 2;

  // Track Background
  g.fillStyle = PAL.blue14;
  g.fillRect(0, trackY, S, trackH);

  // Track Borders / Rails
  g.fillStyle = PAL.blue10;
  g.fillRect(0, trackY - S * 0.02, S, S * 0.02);
  g.fillRect(0, trackY + trackH, S, S * 0.02);

  g.strokeStyle = PAL.sky29;
  g.lineWidth = S * 0.004;
  g.beginPath();
  g.moveTo(0, trackY); g.lineTo(S, trackY);
  g.moveTo(0, trackY + trackH); g.lineTo(S, trackY + trackH);
  g.stroke();

  // Total seconds elapsed today (with millisecond precision)
  const totalSec = t.h * 3600 + t.m * 60 + t.s + t.ms / 1000;
  const pxPerSec = S * 0.04; // scale width
  const centerX = S / 2;

  // Draw sliding ticks (visible range around current time)
  const secStart = Math.floor(totalSec - (centerX / pxPerSec) - 2);
  const secEnd = Math.ceil(totalSec + (centerX / pxPerSec) + 2);

  g.textAlign = 'center';

  for (let sec = secStart; sec <= secEnd; sec++) {
    const normSec = ((sec % 86400) + 86400) % 86400;
    const h = Math.floor(normSec / 3600);
    const m = Math.floor((normSec % 3600) / 60);
    const s = normSec % 60;

    const x = centerX + (sec - totalSec) * pxPerSec;

    const isHour = s === 0 && m === 0;
    const isMinute = s === 0;
    const is5Sec = s % 5 === 0;

    if (isHour) {
      g.strokeStyle = PAL.orange50;
      g.lineWidth = S * 0.008;
      g.beginPath();
      g.moveTo(x, trackY + 2);
      g.lineTo(x, trackY + trackH - 2);
      g.stroke();

      g.fillStyle = PAL.orange60;
      g.font = `700 ${Math.round(S * 0.045)}px "Segoe UI", monospace`;
      g.fillText(`${pad(h)}:00`, x, trackY + trackH * 0.28);
    } else if (isMinute) {
      g.strokeStyle = PAL.sky63;
      g.lineWidth = S * 0.006;
      g.beginPath();
      g.moveTo(x, trackY + 4);
      g.lineTo(x, trackY + trackH - 4);
      g.stroke();

      g.fillStyle = PAL.sky75;
      g.font = `600 ${Math.round(S * 0.038)}px "Segoe UI", monospace`;
      g.fillText(`${pad(h)}:${pad(m)}`, x, trackY + trackH * 0.28);
    } else if (is5Sec) {
      g.strokeStyle = PAL.sky54;
      g.lineWidth = S * 0.004;
      g.beginPath();
      g.moveTo(x, trackY + trackH * 0.4);
      g.lineTo(x, trackY + trackH - 4);
      g.stroke();

      g.fillStyle = PAL.sky73;
      g.font = `500 ${Math.round(S * 0.03)}px monospace`;
      g.fillText(pad(s), x, trackY + trackH * 0.28);
    } else {
      g.strokeStyle = PAL.sky26;
      g.lineWidth = S * 0.003;
      g.beginPath();
      g.moveTo(x, trackY + trackH * 0.6);
      g.lineTo(x, trackY + trackH - 4);
      g.stroke();
    }
  }

  // Central Hairline Red Indicator Marker
  g.strokeStyle = PAL.red55;
  g.lineWidth = S * 0.008;
  g.beginPath();
  g.moveTo(centerX, trackY - S * 0.03);
  g.lineTo(centerX, trackY + trackH + S * 0.03);
  g.stroke();

  // Top Pointer Arrow
  g.fillStyle = PAL.red55;
  g.beginPath();
  g.moveTo(centerX - S * 0.02, trackY - S * 0.03);
  g.lineTo(centerX + S * 0.02, trackY - S * 0.03);
  g.lineTo(centerX, trackY + S * 0.02);
  g.closePath();
  g.fill();

  // Digital readout above track
  const timeStr = formatTime(t, c.res);
  g.fillStyle = PAL.white;
  g.font = `700 ${Math.round(S * 0.12)}px "Segoe UI", monospace`;
  g.textAlign = 'center';
  g.fillText(timeStr, S / 2, S * 0.2);

  // Bottom Zone & Info Label
  g.fillStyle = PAL.sky62;
  g.font = `600 ${Math.round(S * 0.045)}px "Segoe UI", sans-serif`;
  g.fillText(`HORIZONTAL TIMELINE ▪ ${c.z.label.toUpperCase()}`, S / 2, S * 0.82);
};

const def: FaceDef = {
  id: 'horizontal',
  label: '📏 Horizontal Ruler',
  short: 'HORIZ',
  order: 60,
  fit: [1, 1],
  draw,
};

export default def;
