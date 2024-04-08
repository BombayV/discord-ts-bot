type ColorTypes = {
  rgb: string,
  hex: string,
  hsl: string,
  hsv: string,
  cmyk: string,
}

const hexToRgb = (hex: string): string => {
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}

// https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
// https://www.rapidtables.com/convert/color/rgb-to-hsv.html
const rgbToHslHsv = (r: number, g: number, b: number): [string, string] => {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;

  const min = Math.min(R, G, B);
  const max = Math.max(R, G, B);
  const delta = max - min;
  let L: string | number = (min + max) / 2;
  let S: string | number = min === max ? 0 : L <= 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
  let H: string | number = S === 0 ? 0 : (max === R ? (G - B) / (max - min) : max === G ? 2 + (B - R) / (max - min) : 4 + (R - G) / (max - min)) * 60;
  H = (H < 0 ? H + 360 : H).toFixed(2);
  S = (S * 100).toFixed(2);
  L = (L * 100).toFixed(2);

  let hsvS = (delta === 0 ? 0 : (delta / max) * 100).toFixed(2);
  let hsvV = (max * 100).toFixed(2);

  return [
    `hsl(${H}, ${S}, ${L})`,
    `hsv(${H}, ${hsvS}, ${hsvV})`
  ]
}

// https://www.rapidtables.com/convert/color/rgb-to-cmyk.html
const rgbToCMYK = (r: number, g: number, b: number): string => {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;

  const K = 1 - Math.max(R, G, B);
  const C = R === 0 ? 0 : ((1 - R - K) / (1 - K)).toFixed(2);
  const M = G === 0 ? 0 : ((1 - G - K) / (1 - K)).toFixed(2);
  const Y = B === 0 ? 0 : ((1 - B - K) / (1 - K)).toFixed(2);

  return `cmyk(${C}, ${M}, ${Y}, ${K.toFixed(2)})`;
}

export const colorTransformer = (color: string): {
  data: ColorTypes | undefined,
  error: boolean
} => {
  const fmtHex = color.replace('#', '').trim();
  if (fmtHex.length !== 6) {
    return {
      data: undefined,
      error: true
    }
  }

  let rgb = hexToRgb(fmtHex);
  const [r, g, b] = rgb.split(',').map(Number);
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return {
      data: undefined,
      error: true
    }
  }

  const [hsl, hsv] = rgbToHslHsv(r, g, b);
  const cmyk = rgbToCMYK(r, g, b);
  const hex = `#${fmtHex}`;
  rgb = `rgb(${rgb})`;

  return {
    data: {rgb, hsl, hex, hsv, cmyk},
    error: false
  }
}