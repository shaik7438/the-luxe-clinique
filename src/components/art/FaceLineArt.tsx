"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BACK_LINE, EYE, FACE_LINE, HAIR_STRANDS, LEAVES, leafOutline, smoothPath, type P } from "./profile";

/** Map normalised profile units into a 400×500 SVG space. */
const toSvg = ([x, y]: P): P => [200 + x * 165, 255 - y * 165];

/**
 * Line-drawn profile of a woman with flowing hair and leaves — the brand's
 * signature illustration. Strokes draw themselves in when `animate` is set.
 */
export default function FaceLineArt({
  className = "",
  stroke = "#7B1734",
  accent = "#B87A89",
  animate = true,
  fill,
  title,
}: {
  className?: string;
  stroke?: string;
  accent?: string;
  animate?: boolean;
  fill?: string;
  title?: string;
}) {
  const reduced = useReducedMotion();
  const draw = animate && !reduced;
  const face = smoothPath(FACE_LINE.map(toSvg));
  const silhouette = smoothPath([...FACE_LINE, ...BACK_LINE].map(toSvg), true);
  const line = (d: string, i: number, color: string, width: number) => (
    <motion.path
      key={i}
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={draw ? { pathLength: 0, opacity: 0 } : false}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 2.2, delay: 0.2 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
    />
  );
  return (
    <svg viewBox="0 0 400 500" className={className} {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}>
      {fill && <path d={silhouette} fill={fill} />}
      {line(face, 0, stroke, 2.2)}
      {HAIR_STRANDS.map((s, i) => line(smoothPath(s.map(toSvg)), i + 1, i === 2 ? accent : stroke, i === 0 ? 2 : 1.4))}
      {line(smoothPath(EYE.map(toSvg)), 5, stroke, 1.6)}
      {[0, 1, 2].map((k) => {
        const [x, y] = toSvg(EYE[1]);
        return line(`M${x - 8 + k * 8} ${y + 1} l ${-2 + k * 2} 6`, 6 + k, stroke, 1.1);
      })}
      {LEAVES.map((l, i) => line(smoothPath(leafOutline(l.base, l.tip, l.width).map(toSvg), true), 9 + i, accent, 1.6))}
    </svg>
  );
}
