/**
 * A woman's profile facing right, echoing the face in the Luxe Clinique logo.
 * Normalised units: head height ≈ 1, origin near the mouth, +y up.
 * Shared by the 3D sculpture (extruded) and the SVG line art (stroked) so the
 * two always match.
 */
export type P = [number, number];

/** Crown → forehead → nose → lips → chin → neck → shoulder (the "face line"). */
export const FACE_LINE: P[] = [
  [-0.55, 0.95],
  [-0.1, 1.08],
  [0.25, 0.95],
  [0.38, 0.72],
  [0.42, 0.55],
  [0.4, 0.48],
  [0.56, 0.3],
  [0.44, 0.24],
  [0.47, 0.16],
  [0.42, 0.11],
  [0.45, 0.06],
  [0.38, -0.01],
  [0.4, -0.1],
  [0.28, -0.2],
  [0.22, -0.3],
  [0.2, -0.55],
  [0.32, -0.8],
  [0.75, -1.0],
];

/** Shoulder → back of neck → back of head → crown (closes the silhouette). */
export const BACK_LINE: P[] = [
  [-0.75, -1.0],
  [-0.25, -0.75],
  [-0.22, -0.35],
  [-0.55, 0.2],
  [-0.62, 0.6],
  [-0.55, 0.95],
];

/** Flowing hair strands sweeping back from the forehead, as in the logo. */
export const HAIR_STRANDS: P[][] = [
  [[0.22, 0.98], [-0.05, 1.18], [-0.45, 1.12], [-0.78, 0.78], [-0.9, 0.25], [-0.78, -0.25]],
  [[0.14, 0.9], [-0.12, 1.04], [-0.48, 0.96], [-0.7, 0.62], [-0.74, 0.1], [-0.58, -0.45]],
  [[0.3, 0.86], [0.02, 1.0], [-0.3, 0.98], [-0.56, 0.74], [-0.62, 0.34]],
];

/** Closed eye with lashes. */
export const EYE: P[] = [
  [0.2, 0.5],
  [0.27, 0.47],
  [0.34, 0.5],
];

/** Two leaves rising from the base, as in the logo mark. */
export const LEAVES: { base: P; tip: P; width: number }[] = [
  { base: [-0.35, -1.0], tip: [-0.95, -0.52], width: 0.17 },
  { base: [-0.3, -1.0], tip: [-0.62, -0.32], width: 0.14 },
];

/** Catmull-Rom spline → SVG cubic Bézier path through points (already in SVG space). */
export function smoothPath(pts: P[], closed = false) {
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return closed ? d + " Z" : d;
}

/** Leaf outline (pointed ellipse) between base and tip. */
export function leafOutline(base: P, tip: P, width: number, n = 24): P[] {
  const dx = tip[0] - base[0], dy = tip[1] - base[1];
  const len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const out: P[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const w = Math.sin(Math.PI * t) ** 0.9 * width * 0.5;
    out.push([base[0] + ux * len * t + nx * w, base[1] + uy * len * t + ny * w]);
  }
  for (let i = n - 1; i > 0; i--) {
    const t = i / n;
    const w = Math.sin(Math.PI * t) ** 0.9 * width * 0.5;
    out.push([base[0] + ux * len * t - nx * w, base[1] + uy * len * t - ny * w]);
  }
  return out;
}
