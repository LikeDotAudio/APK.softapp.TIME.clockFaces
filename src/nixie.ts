// src/nixie.ts — Vintage IN-14 Nixie Tube Clock Face.
// Warm neon gas-discharge digits glowing inside glass tubes with wire mesh anodes.
import { type FaceDef, type FaceCtx, zoneTime, formatTime, type FaceDraw } from './shared.js';
import { PAL, alpha } from './palette.js';

function drawNixieTube(
  g: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  digit: string, glowing: boolean
): void {
  g.save();

  // Glass tube outline + subtle reflections
  const tubeGrad = g.createLinearGradient(x, y, x + w, y);
  tubeGrad.addColorStop(0, alpha(PAL.sky20, 0.85));
  tubeGrad.addColorStop(0.15, alpha(PAL.sky39s20, 0.4));
  tubeGrad.addColorStop(0.5, alpha(PAL.sky10, 0.9));
  tubeGrad.addColorStop(0.85, alpha(PAL.sky39s20, 0.4));
  tubeGrad.addColorStop(1, alpha(PAL.sky20, 0.85));

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
  g.strokeStyle = alpha(PAL.orange79, 0.08);
  g.lineWidth = 1;
  const gridStep = 4;
  for (let gx = x + 4; gx < x + w - 4; gx += gridStep) {
    g.beginPath(); g.moveTo(gx, y + 4); g.lineTo(gx, y + h - 4); g.stroke();
  }

  // Top/Bottom metal caps
  g.fillStyle = PAL.grey13;
  g.fillRect(x + 2, y, w - 4, 4);
  g.fillRect(x + 2, y + h - 4, w - 4, 4);

  if (digit === ':') {
    // Colon separator dots
    if (glowing) {
      g.shadowColor = PAL.orange50s100;
      g.shadowBlur = 12;
      g.fillStyle = PAL.orange70;
      g.beginPath(); g.arc(x + w / 2, y + h * 0.35, w * 0.12, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(x + w / 2, y + h * 0.65, w * 0.12, 0, Math.PI * 2); g.fill();
      g.shadowBlur = 0;
    } else {
      g.fillStyle = alpha(PAL.orange24, 0.3);
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
  g.fillStyle = alpha(PAL.orange17, 0.25);
  g.fillText(digit, x + w / 2 + 1, y + h / 2 + 2);

  // Glowing cathode digit
  if (glowing) {
    // Outer orange glow halo
    g.shadowColor = PAL.orange50_ff5500;
    g.shadowBlur = 20;
    g.fillStyle = PAL.orange63;
    g.fillText(digit, x + w / 2, y + h / 2);

    // Inner bright hot core
    g.shadowColor = PAL.amber75;
    g.shadowBlur = 6;
    g.fillStyle = PAL.white;
    g.fillText(digit, x + w / 2, y + h / 2);

    g.shadowBlur = 0;
  }

  // Glass tube specular highlight streak
  g.fillStyle = alpha(PAL.white, 0.12);
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
  bgGrad.addColorStop(0, PAL.orange07s37);
  bgGrad.addColorStop(1, PAL.orange03);
  g.fillStyle = bgGrad;
  g.fillRect(0, 0, S, S);

  // Wood / Bakelite bezel trim
  g.strokeStyle = PAL.orange15s53;
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
  g.fillStyle = PAL.orange51;
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
