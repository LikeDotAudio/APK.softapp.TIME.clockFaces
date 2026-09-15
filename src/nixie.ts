// src/nixie.ts — Vintage IN-14 Nixie Tube Clock Face.
// Warm neon gas-discharge digits glowing inside glass tubes with wire mesh anodes.
import { type FaceDef, type FaceCtx, zoneTime, formatTime, type FaceDraw } from './shared.js';

function drawNixieTube(
  g: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  digit: string, glowing: boolean
): void {
  g.save();

  // Glass tube outline + subtle reflections
  const tubeGrad = g.createLinearGradient(x, y, x + w, y);
  tubeGrad.addColorStop(0, 'rgba(40, 50, 60, 0.85)');
  tubeGrad.addColorStop(0.15, 'rgba(80, 100, 120, 0.4)');
  tubeGrad.addColorStop(0.5, 'rgba(20, 25, 30, 0.9)');
  tubeGrad.addColorStop(0.85, 'rgba(80, 100, 120, 0.4)');
  tubeGrad.addColorStop(1, 'rgba(40, 50, 60, 0.85)');

  // Tube body
  const r = Math.min(w * 0.4, 12);
  g.fillStyle = tubeGrad;
  g.beginPath();
  g.moveTo(x + r, y);
  g.lineTo(x + w - r, y);
  g.quadraticCurveTo(x + w, y, x + w, y + r);
  g.lineTo(x + w, y + h - r);
  g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  g.lineTo(x + r, y + h);
  g.quadraticCurveTo(x, y + h, x, y + h - r);
  g.lineTo(x, y + r);
  g.quadraticCurveTo(x, y, x + r, y);
  g.closePath();
  g.fill();

  // Metal anode mesh grid background inside tube
  g.strokeStyle = 'rgba(255, 200, 150, 0.08)';
  g.lineWidth = 1;
  const gridStep = 4;
  for (let gx = x + 4; gx < x + w - 4; gx += gridStep) {
    g.beginPath(); g.moveTo(gx, y + 4); g.lineTo(gx, y + h - 4); g.stroke();
  }

  // Top/Bottom metal caps
  g.fillStyle = '#222';
  g.fillRect(x + 2, y, w - 4, 4);
  g.fillRect(x + 2, y + h - 4, w - 4, 4);

  if (digit === ':') {
    // Colon separator dots
    if (glowing) {
      g.shadowColor = '#ff6600';
      g.shadowBlur = 12;
      g.fillStyle = '#ffb366';
      g.beginPath(); g.arc(x + w / 2, y + h * 0.35, w * 0.12, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(x + w / 2, y + h * 0.65, w * 0.12, 0, Math.PI * 2); g.fill();
      g.shadowBlur = 0;
    } else {
      g.fillStyle = 'rgba(100, 60, 20, 0.3)';
      g.beginPath(); g.arc(x + w / 2, y + h * 0.35, w * 0.1, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(x + w / 2, y + h * 0.65, w * 0.1, 0, Math.PI * 2); g.fill();
    }
    g.restore();
    return;
  }

  // Unlit stacked cathode digit shadow
  g.font = `700 ${Math.round(h * 0.72)}px "Courier New", monospace`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = 'rgba(60, 40, 25, 0.25)';
  g.fillText(digit, x + w / 2 + 1, y + h / 2 + 2);

  // Glowing cathode digit
  if (glowing) {
    // Outer orange glow halo
    g.shadowColor = '#ff5500';
    g.shadowBlur = 20;
    g.fillStyle = '#ffaa44';
    g.fillText(digit, x + w / 2, y + h / 2);

    // Inner bright hot core
    g.shadowColor = '#ffe680';
    g.shadowBlur = 6;
    g.fillStyle = '#ffffff';
    g.fillText(digit, x + w / 2, y + h / 2);

    g.shadowBlur = 0;
  }

  // Glass tube specular highlight streak
  g.fillStyle = 'rgba(255, 255, 255, 0.12)';
  g.beginPath();
  g.ellipse(x + w * 0.25, y + h * 0.5, w * 0.08, h * 0.38, 0, 0, Math.PI * 2);
  g.fill();

  g.restore();
}

const draw: FaceDraw = (g: CanvasRenderingContext2D, S: number, c: FaceCtx): void => {
  const t = zoneTime(c.z);
  const timeStr = formatTime(t, c.res);

  g.clearRect(0, 0, S, S);

  // Enclosure / chassis background
  const bgGrad = g.createRadialGradient(S / 2, S / 2, S * 0.1, S / 2, S / 2, S * 0.7);
  bgGrad.addColorStop(0, '#1a120c');
  bgGrad.addColorStop(1, '#090604');
  g.fillStyle = bgGrad;
  g.fillRect(0, 0, S, S);

  // Wood / Bakelite bezel trim
  g.strokeStyle = '#3a2212';
  g.lineWidth = S * 0.02;
  g.strokeRect(S * 0.04, S * 0.18, S * 0.92, S * 0.64);

  const tubeW = S * 0.095;
  const tubeH = S * 0.38;
  const spacing = S * 0.015;
  const startY = S * 0.28;

  const charCount = timeStr.length;
  const totalW = charCount * tubeW + (charCount - 1) * spacing;
  let startX = (S - totalW) / 2;

  for (let i = 0; i < charCount; i++) {
    const ch = timeStr[i] ?? '';
    const isColon = ch === ':';
    const w = isColon ? tubeW * 0.5 : tubeW;
    drawNixieTube(g, startX, startY, w, tubeH, ch, true);
    startX += w + spacing;
  }

  // Zone Label
  g.fillStyle = '#d9822b';
  g.font = `700 ${Math.round(S * 0.045)}px "Courier New", monospace`;
  g.textAlign = 'center';
  g.fillText(`NIXIE IN-14 ▪ ${c.z.label.toUpperCase()}`, S / 2, S * 0.76);
};

const def: FaceDef = {
  id: 'nixie',
  label: '🪔 Nixie Tube',
  short: 'NIX',
  order: 55,
  fit: [1, 1],
  draw,
};

export default def;
