// src/palette.ts — every colour a clock face paints, in ONE file (the SPOG palette's twin,
// WEB.SPOG src/domain/palette.ts, ROAD-3449). Faces read `PAL.<name>`; no other file under
// src/ spells a hex (test/palette.test.mjs holds that at zero). Names say what the colour IS:
// hue family + HSL lightness % (`amber50` is a mid amber), with the saturation (`s<sat>`) or
// the hex appended only where two would collide. Pure data, like every file here: the OS
// bundle (build-faces.mjs) and SPOG both import it through the faces.

const P = {
  amber27: '#7a5a12', amber32: '#8c6a16', amber52: '#d4af37', amber53: '#e0b52e', amber53s96: '#facc15',
  amber56: '#d6b04a', amber57: '#e8c53a', amber64: '#fde047', amber75: '#ffe680', amber79: '#e8d6ac',
  amber80: '#e9d9ad', amber83: '#fff1a8', amber90: '#f7efd6', amber93: '#fbf5df', blue06: '#0a0d14',
  blue09: '#12161c', blue09s42: '#0d1520', blue10: '#0f1722', blue10s22: '#14181f', blue14: '#1a222d',
  blue14s26: '#1a202c', blue20: '#2c323b', blue23: '#243250', blue25: '#2a3a55', blue56: '#7d8ba0',
  blue65: '#9aa4b4', blue65s20: '#94a3b8', cyan25: '#006680', cyan40: '#00b3cc', cyan50: '#00f0ff',
  cyan90: '#ccffff', grey02: '#050505', grey04: '#0a0a0a', grey05: '#0d0d0d', grey05s0: '#0c0c0c',
  grey05s8: '#0b0b0d', grey07: '#111111', grey08: '#141414', grey09: '#161616', grey10: '#1a1a1a',
  grey10s8: '#17181b', grey13: '#222222', grey15: '#242629', grey16: '#26292b', grey18: '#2a2c30',
  grey20: '#2e3237', grey25: '#3a3f45', grey25s5: '#3c3e42', grey27: '#444444', grey31: '#4a4d52',
  grey35: '#505660', grey44: '#6a7076', grey58: '#88929e', grey64: '#9aa2ab', grey69: '#b3b9a6',
  grey69s12: '#b4baa8', grey70: '#a9b1ba', grey80: '#c8ccd2', grey87: '#dddddd', grey95: '#f4f4f2',
  grey96: '#f4f4f4', lime10: '#1b1f16', lime13: '#23271d', lime80: '#cfd4c6', lime80s15: '#cdd3c4',
  orange03: '#090604', orange07: '#1a1208', orange07s37: '#1a120c', orange08: '#1c130b', orange11: '#2a1c10',
  orange15: '#3a2a12', orange15s53: '#3a2212', orange16: '#3a2a18', orange26: '#6b4a1c', orange50: '#ff9900',
  orange50_ff5500: '#ff5500', orange50s100: '#ff6600', orange51: '#d9822b', orange51s82: '#e8801a',
  orange60: '#ffaa33', orange63: '#ffaa44', orange70: '#ffb366', red33: '#8a1f1f', red44: '#c02020',
  red47: '#e01010', red50: '#e21f1f', red55: '#ff1744', red56: '#e63946', red58: '#ff2b2b', red59: '#ff2f2f',
  red60: '#f43f5e', red71: '#ff6a6a', sky04: '#010d14', sky04s52: '#050a10', sky05: '#050c14',
  sky07: '#021824', sky16: '#1a2636', sky26: '#37474f', sky29: '#35485e', sky39: '#0284c7', sky43: '#2b6fb0',
  sky54: '#78909c', sky60: '#38bdf8', sky60s15: '#8a9ba8', sky62: '#90a4ae', sky63: '#40c4ff',
  sky73: '#b0bec5', sky75: '#80d8ff', sky82: '#ccd2d8', sky85: '#d0d7e0', sky91: '#e2e8f0', sky95: '#eef1f4',
  sky98: '#f8f9fa', teal50: '#00ffe5', teal70: '#66ffb2', violet65: '#a855f7', yellow94: '#f2f2ee',
  yellow96: '#f6f6f2', black: '#000000', white: '#ffffff',
} as const;

/** Typed as `#${string}` (not each literal) so a parameter defaulted from it stays any colour. */
export const PAL: { readonly [K in keyof typeof P]: `#${string}` } = P;
