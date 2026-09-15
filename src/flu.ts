// src/flu.ts — Vacuum Fluorescent Display (VFD / Fluorescent) Clock Face.
// Cyan-blue glowing phosphor segments over a dark vacuum glass envelope with grid wires.
import { type FaceDef, type FaceCtx, zoneTime, formatTime, type FaceDraw, roundRect } from './shared.js';

const draw: FaceDraw = (g: CanvasRenderingContext2D, S: number, c: FaceCtx): void => {
  const t = zoneTime(c.z);
  const timeStr = formatTime(t, c.res);

  g.clearRect(0, 0, S, S);

  // VFD Chassis Enclosure
  g.fillStyle = '#050c14';
  g.fillRect(0, 0, S, S);

  // Filtered Glass Face Window (dark cyan tint)
  const windowMargin = S * 0.05;
  const windowW = S * 0.9;
  const windowH = S * 0.65;
  const windowX = S * 0.05;
  const windowY = S * 0.175;

  const glassGrad = g.createLinearGradient(windowX, windowY, windowX, windowY + windowH);
  glassGrad.addColorStop(0, '#021824');
  glassGrad.addColorStop(1, '#010d14');
  g.fillStyle = glassGrad;
  roundRect(g, windowX, windowY, windowW, windowH, S * 0.03);
  g.fill();

  g.strokeStyle = '#006680';
  g.lineWidth = S * 0.008;
  g.stroke();

  // Subtle horizontal VFD filament heater lines
  g.strokeStyle = 'rgba(0, 255, 200, 0.06)';
  g.lineWidth = 1;
  for (let fy = windowY + S * 0.08; fy < windowY + windowH - S * 0.05; fy += S * 0.06) {
    g.beginPath();
    g.moveTo(windowX + 10, fy);
    g.lineTo(windowX + windowW - 10, fy);
    g.stroke();
  }

  // Draw VFD Phosphor Time Display
  g.save();
  g.shadowColor = '#00f0ff';
  g.shadowBlur = S * 0.03;
  g.fillStyle = '#00ffe5';
  g.font = `700 ${Math.round(S * 0.16)}px "Lucida Console", "Consolas", monospace`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(timeStr, S / 2, S * 0.46);

  // Extra intense core glow layer
  g.shadowColor = '#ffffff';
  g.shadowBlur = S * 0.008;
  g.fillStyle = '#ccffff';
  g.fillText(timeStr, S / 2, S * 0.46);
  g.restore();

  // Decorative VFD Grid mesh lines behind numbers
  g.strokeStyle = 'rgba(0, 200, 255, 0.04)';
  g.lineWidth = 1;
  const step = S * 0.02;
  for (let x = windowX + 5; x < windowX + windowW - 5; x += step) {
    g.beginPath(); g.moveTo(x, windowY + 5); g.lineTo(x, windowY + windowH - 5); g.stroke();
  }

  // VFD Header / Status Badges
  g.fillStyle = '#00b3cc';
  g.font = `600 ${Math.round(S * 0.04)}px "Segoe UI", sans-serif`;
  g.textAlign = 'left';
  g.fillText(`VFD-8000 ▪ FLUORESCENT`, windowX + S * 0.04, windowY + S * 0.08);

  g.textAlign = 'right';
  g.fillText(`${c.z.label.toUpperCase()} (${c.res.toUpperCase()})`, windowX + windowW - S * 0.04, windowY + S * 0.08);

  // Bottom Status Bar
  g.fillStyle = 'rgba(0, 255, 229, 0.15)';
  g.fillRect(windowX + S * 0.04, windowY + windowH - S * 0.12, windowW - S * 0.08, S * 0.04);

  g.fillStyle = '#00ffe5';
  g.font = `600 ${Math.round(S * 0.032)}px "Segoe UI", sans-serif`;
  g.textAlign = 'center';
  g.fillText(`● SYNCHRONIZED TO VACUUM GRID METRONOME`, S / 2, windowY + windowH - S * 0.09);
};

const def: FaceDef = {
  id: 'flu',
  label: '💡 VFD Fluorescent',
  short: 'FLU',
  order: 58,
  fit: [1, 1],
  draw,
};

export default def;
