"use client";

/**
 * Procedural, tileable surface textures generated on a canvas at runtime.
 * They give materials believable micro-detail (plaster, microcement, woven
 * cotton, pebbled leather, skin pores, layered tissue) without shipping any
 * image files. Each texture is generated once and cached.
 */

import * as THREE from "three";

const cache = new Map<string, THREE.CanvasTexture>();

/* ───── Tileable value noise ───── */
function hash(x: number, y: number, seed: number) {
  let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
const fade = (t: number) => t * t * (3 - 2 * t);
function noise(x: number, y: number, period: number, seed: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const w = (a: number) => ((a % period) + period) % period;
  const a = hash(w(xi), w(yi), seed), b = hash(w(xi + 1), w(yi), seed);
  const c = hash(w(xi), w(yi + 1), seed), d = hash(w(xi + 1), w(yi + 1), seed);
  const u = fade(xf), v = fade(yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
/** Fractal noise in [0,1], tileable over the unit square. */
function fbm(u: number, v: number, base: number, octaves: number, seed: number) {
  let sum = 0, amp = 0.5, norm = 0, f = base;
  for (let o = 0; o < octaves; o++) {
    sum += noise(u * f, v * f, f, seed + o * 17) * amp;
    norm += amp;
    amp *= 0.5;
    f *= 2;
  }
  return sum / norm;
}
/** Tileable cellular (Worley) distance — used for leather grain and fat septa. */
function cellular(u: number, v: number, cells: number, seed: number) {
  const x = u * cells, y = v * cells;
  const xi = Math.floor(x), yi = Math.floor(y);
  let d1 = 9, d2 = 9;
  for (let j = -1; j <= 1; j++)
    for (let i = -1; i <= 1; i++) {
      const cx = xi + i, cy = yi + j;
      const wx = ((cx % cells) + cells) % cells, wy = ((cy % cells) + cells) % cells;
      const px = cx + hash(wx, wy, seed), py = cy + hash(wx, wy, seed + 9);
      const d = Math.hypot(px - x, py - y);
      if (d < d1) (d2 = d1), (d1 = d);
      else if (d < d2) d2 = d;
    }
  return { d1, d2 };
}

type Painter = (u: number, v: number) => [number, number, number];

function paint(key: string, size: number, painter: Painter, repeat: [number, number], color = true) {
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const img = g.createImageData(size, size);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const [r, gr, b] = painter(x / size, y / size);
      const i = (y * size + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = gr;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...repeat);
  t.anisotropy = 8;
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  cache.set(key, t);
  return t;
}

const grey = (n: number): [number, number, number] => {
  const v = Math.max(0, Math.min(255, n * 255));
  return [v, v, v];
};
const mix = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const hex = (h: string): [number, number, number] => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/* ───── Room surfaces ───── */
export const plasterBump = () => paint("plaster-bump", 256, (u, v) => grey(0.35 + fbm(u, v, 6, 5, 3) * 0.5), [4, 2], false);

export const microcement = () =>
  paint(
    "microcement",
    512,
    (u, v) => {
      const n = fbm(u, v, 3, 6, 11);
      const s = fbm(u, v, 24, 3, 5);
      return mix(hex("#E5D9D2"), hex("#F2EAE5"), n * 0.85 + s * 0.15);
    },
    [3, 3],
  );
export const microcementRough = () => paint("microcement-r", 256, (u, v) => grey(0.45 + fbm(u, v, 5, 4, 21) * 0.4), [3, 3], false);

/* ───── Textiles & upholstery ───── */
export const weaveBump = () =>
  paint(
    "weave",
    256,
    (u, v) => {
      const a = Math.sin(u * Math.PI * 2 * 64) * 0.5 + 0.5;
      const b = Math.sin(v * Math.PI * 2 * 64) * 0.5 + 0.5;
      const over = (Math.floor(u * 64) + Math.floor(v * 64)) % 2 ? a : b;
      return grey(0.35 + over * 0.4 + fbm(u, v, 16, 2, 2) * 0.25);
    },
    [6, 6],
    false,
  );

export const leatherBump = () =>
  paint(
    "leather",
    256,
    (u, v) => {
      const { d1, d2 } = cellular(u, v, 22, 4);
      const edge = Math.min(1, (d2 - d1) * 3.2);
      return grey(0.25 + edge * 0.6 + fbm(u, v, 20, 2, 8) * 0.15);
    },
    [5, 2],
    false,
  );

/* ───── Skin ───── */
export const skinBump = () =>
  paint(
    "skin-bump",
    256,
    (u, v) => {
      const { d1 } = cellular(u, v, 48, 31);
      const pore = d1 < 0.12 ? 0.25 + (d1 / 0.12) * 0.4 : 0.65;
      return grey(pore * 0.8 + fbm(u, v, 12, 3, 7) * 0.2);
    },
    [3, 3],
    false,
  );

/* ───── Beauty hero ───── */
export const marble = () =>
  paint(
    "marble",
    512,
    (u, v) => {
      const warp = fbm(u, v, 3, 5, 61) * 2.2;
      const vein = Math.abs(Math.sin((u * 2 + v * 1.2 + warp) * Math.PI * 2));
      const fine = Math.abs(Math.sin((u * 7 - v * 3 + warp * 1.7) * Math.PI * 2));
      let c = mix(hex("#FBF6F3"), hex("#F3E9E5"), fbm(u, v, 6, 4, 9));
      c = mix(c, hex("#D9C2BE"), Math.pow(1 - vein, 18) * 0.7);
      c = mix(c, hex("#E6D3CF"), Math.pow(1 - fine, 30) * 0.5);
      return c;
    },
    [1, 1],
  );

/** Vertical blush → champagne gradient with a soft bloom of light, for the hero backdrop. */
export const blushBackdrop = () =>
  paint(
    "blush-backdrop",
    256,
    (u, v) => {
      let c = mix(hex("#F8ECEA"), hex("#EEDCD2"), v);
      const glow = Math.max(0, 1 - Math.hypot(u - 0.55, v - 0.38) * 1.8);
      c = mix(c, hex("#FFF8F4"), glow * 0.7);
      return mix(c, hex("#F1D6DA"), Math.max(0, (u - 0.6) * (1 - v)) * 0.6);
    },
    [1, 1],
  );

/* ───── Tissue cross-sections (educational model) ───── */
/** Epidermis strata from surface (top of texture) to basal layer (bottom). */
export const epidermisStrata = () =>
  paint(
    "epi-strata",
    256,
    (u, v) => {
      const y = 1 - v; // 1 = surface
      const n = fbm(u, v, 18, 3, 13);
      const cells = cellular(u, v * 0.6, 40, 3);
      const membrane = Math.min(1, (cells.d2 - cells.d1) * 4);
      let c: [number, number, number];
      if (y > 0.86) c = mix(hex("#F7E3D3"), hex("#FBEDE2"), n); // stratum corneum
      else if (y > 0.7) c = mix(hex("#EFC9B0"), hex("#F3D2BC"), n); // granular
      else if (y > 0.18) c = mix(hex("#EBBFA6"), hex("#F1CBB3"), n * 0.6 + membrane * 0.4); // spinous
      else c = mix(hex("#C99076"), hex("#D9A58A"), n); // basal
      if (y < 0.86 && y > 0.18) c = mix(c, hex("#D9A48C"), (1 - membrane) * 0.25);
      return c;
    },
    [3, 1],
  );

export const dermisTissue = () =>
  paint(
    "dermis",
    512,
    (u, v) => {
      const warp = fbm(u, v, 4, 3, 41) * 0.35;
      const fibres = Math.sin((v + warp) * Math.PI * 2 * 28 + Math.sin(u * Math.PI * 2 * 3) * 2) * 0.5 + 0.5;
      const n = fbm(u, v, 10, 4, 19);
      let c = mix(hex("#E3A09D"), hex("#EDB8B3"), n);
      c = mix(c, hex("#F6D3CC"), Math.pow(fibres, 6) * 0.55);
      return c;
    },
    [2, 1],
  );

export const dermisBump = () =>
  paint(
    "dermis-bump",
    256,
    (u, v) => {
      const warp = fbm(u, v, 4, 3, 41) * 0.35;
      const f = Math.sin((v + warp) * Math.PI * 2 * 28) * 0.5 + 0.5;
      return grey(0.3 + Math.pow(f, 4) * 0.5 + fbm(u, v, 12, 3, 2) * 0.2);
    },
    [2, 1],
    false,
  );

export const fatTissue = () =>
  paint(
    "fat",
    512,
    (u, v) => {
      const { d1, d2 } = cellular(u, v, 14, 77);
      const septum = 1 - Math.min(1, (d2 - d1) * 6);
      const n = fbm(u, v, 8, 3, 5);
      let c = mix(hex("#F4DDA6"), hex("#F9EBC4"), n * 0.6 + (1 - d1) * 0.4);
      c = mix(c, hex("#E7B9A0"), Math.pow(septum, 3) * 0.8);
      return c;
    },
    [2, 1],
  );
