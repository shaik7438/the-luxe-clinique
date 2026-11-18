"use client";

/**
 * Procedural skin cross-section used by every educational module.
 * One parametric scene (SkinState) drives skin anatomy, laser, pigmentation,
 * acne, collagen and hair-cycle sequences. Conceptual, not to scale.
 */

import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { EffectComposer, N8AO, SMAA, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { SkinState, StructureId } from "@/content/education";
import { structures as structureInfo } from "@/content/education";
import { seeded, Tube } from "./primitives";
import { dermisBump, dermisTissue, epidermisStrata, fatTissue, skinBump } from "./textures";

const W = 3.2; // block width (x)
const D = 1.3; // block depth (z), front face at z = 0
const EPI = [0.8, 0.95] as const;
const DERM = [-0.2, 0.8] as const;
const SUB = [-1.0, -0.2] as const;
const FOLLICLES = [-1.0, -0.4, 0.2, 0.85];
const SCAR_X = 0.52;

type Phase = "anagen" | "catagen" | "telogen";

/** A 3D point a DOM label follows. Mutated in place; read every frame by LabelProjector. */
interface Anchor {
  obj: THREE.Object3D;
  side: "left" | "right" | "center";
  hidden: boolean;
}
type Anchors = Map<string, Anchor>;

interface Ctx {
  selected: StructureId | null;
  select: (id: StructureId) => void;
  labels: Set<StructureId>;
  showLabels: boolean;
  anchors: Anchors;
}
const SceneCtx = createContext<Ctx>({ selected: null, select: () => {}, labels: new Set(), showLabels: true, anchors: new Map() });

/* ─────────── Helpers ─────────── */

function useHighlight(id: StructureId, base: string, opts: THREE.MeshPhysicalMaterialParameters = {}) {
  const { selected } = useContext(SceneCtx);
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: base, roughness: 0.6, ...opts }), [base]); // eslint-disable-line react-hooks/exhaustive-deps
  useFrame(() => {
    const target = selected === id ? 0.35 : 0;
    mat.emissive.set("#7B1734");
    mat.emissiveIntensity += (target - mat.emissiveIntensity) * 0.15;
  });
  return mat;
}

function usePick(id: StructureId) {
  const { select } = useContext(SceneCtx);
  return {
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      select(id);
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      document.body.style.cursor = "";
    },
  };
}

/**
 * Registers a 3D anchor for a DOM label. The label itself is ordinary React DOM
 * rendered beside the canvas (see LabelOverlay) and positioned each frame by
 * LabelProjector. This avoids drei's <Html>, which attaches nodes inside the
 * canvas container and throws "removeChild" errors when a page unmounts the
 * scene during client-side navigation.
 */
function Anchor3D({ id, position, side = "right", hidden = false }: { id: string; position: [number, number, number]; side?: Anchor["side"]; hidden?: boolean }) {
  const { anchors } = useContext(SceneCtx);
  const ref = useRef<THREE.Object3D>(null);
  useEffect(() => {
    const obj = ref.current;
    if (!obj) return;
    anchors.set(id, { obj, side, hidden });
    return () => {
      if (anchors.get(id)?.obj === obj) anchors.delete(id);
    };
  }, [anchors, id, side]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const a = anchors.get(id);
    if (a) a.hidden = hidden;
  });
  return <object3D ref={ref} position={position} />;
}

function Label({ id, position, side = "right", hidden = false }: { id: StructureId; position: [number, number, number]; side?: "left" | "right"; hidden?: boolean }) {
  const { labels } = useContext(SceneCtx);
  if (!labels.has(id)) return null;
  return <Anchor3D id={id} position={position} side={side} hidden={hidden} />;
}

function LabelProjector({ anchors, elements, show }: { anchors: Anchors; elements: React.RefObject<Map<string, HTMLElement>>; show: boolean }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    elements.current.forEach((el, key) => {
      const a = anchors.get(key);
      if (!a || a.hidden || !show) {
        el.style.visibility = "hidden";
        return;
      }
      a.obj.getWorldPosition(v).project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      const dx = a.side === "left" ? "-100%" : a.side === "center" ? "-50%" : "0%";
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(${dx}, -50%)`;
      el.style.visibility = v.z < 1 ? "visible" : "hidden";
    });
  });
  return null;
}

const PHASE_NAMES = ["anagen", "catagen", "anagen", "telogen"] as const;

/** DOM labels laid over the canvas. Decorative duplicates of the accessible structure buttons. */
function LabelOverlay({
  ids,
  selected,
  onSelect,
  elements,
}: {
  ids: StructureId[];
  selected: StructureId | null;
  onSelect: (id: StructureId) => void;
  elements: React.RefObject<Map<string, HTMLElement>>;
}) {
  const reg = (key: string) => (el: HTMLElement | null) => {
    if (el) elements.current.set(key, el);
    else elements.current.delete(key);
  };
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {ids.map((id) => {
        const active = selected === id;
        return (
          <button
            key={id}
            ref={reg(id)}
            type="button"
            tabIndex={-1}
            onClick={() => onSelect(id)}
            style={{ visibility: "hidden" }}
            className={`pointer-events-auto absolute left-0 top-0 flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-md transition-colors will-change-transform ${
              active ? "border-burgundy bg-burgundy text-white" : "border-white/80 bg-white/75 text-charcoal hover:bg-white"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-white" : "bg-burgundy"}`} />
            {structureInfo[id].label}
          </button>
        );
      })}
      {PHASE_NAMES.map((name, i) => (
        <span
          key={i}
          ref={reg(`phase-${i}`)}
          style={{ visibility: "hidden" }}
          className="absolute left-0 top-0 whitespace-nowrap rounded-full bg-charcoal/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white will-change-transform"
        >
          {name}
        </span>
      ))}
    </div>
  );
}

/**
 * Slab whose top/bottom edges follow functions of x (for the scar depression),
 * spanning z ∈ [−D, 0]. Built directly from quads because both edges are
 * x-monotone — more robust than triangulating an extruded shape.
 */
function layerGeometry(bottom: (x: number) => number, top: (x: number) => number, yRange: readonly [number, number]) {
  const N = 80;
  const v: number[] = [];
  const uv: number[] = [];
  // Cross-section faces map v to depth within the layer (so strata textures line up);
  // horizontal faces map v to z.
  const uvOf = (p: number[], horizontal: boolean) => [(p[0] + W / 2) / W, horizontal ? -p[2] / D : (p[1] - yRange[0]) / (yRange[1] - yRange[0])];
  const quad = (a: number[], b: number[], c: number[], d: number[], horizontal = false) => {
    v.push(...a, ...b, ...c, ...a, ...c, ...d);
    for (const p of [a, b, c, a, c, d]) uv.push(...uvOf(p, horizontal));
  };
  for (let i = 0; i < N; i++) {
    const x0 = -W / 2 + (i / N) * W;
    const x1 = -W / 2 + ((i + 1) / N) * W;
    const b0 = bottom(x0), b1 = bottom(x1), t0 = top(x0), t1 = top(x1);
    quad([x0, b0, 0], [x1, b1, 0], [x1, t1, 0], [x0, t0, 0]); // front
    quad([x1, b1, -D], [x0, b0, -D], [x0, t0, -D], [x1, t1, -D]); // back
    quad([x0, t0, 0], [x1, t1, 0], [x1, t1, -D], [x0, t0, -D], true); // top
    quad([x1, b1, 0], [x0, b0, 0], [x0, b0, -D], [x1, b1, -D], true); // bottom
  }
  const L = -W / 2, R = W / 2;
  quad([L, bottom(L), -D], [L, bottom(L), 0], [L, top(L), 0], [L, top(L), -D]); // left end
  quad([R, bottom(R), 0], [R, bottom(R), -D], [R, top(R), -D], [R, top(R), 0]); // right end
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.computeVertexNormals();
  return g;
}

const dent = (scar: number) => (x: number) => scar * 0.17 * Math.exp(-((x - SCAR_X) ** 2) / (2 * 0.2 ** 2));

/* ─────────── Layers ─────────── */

function Epidermis({ scar, melanin }: { scar: number; melanin: number }) {
  const d = dent(scar);
  const geo = useMemo(() => layerGeometry((x) => EPI[0] - d(x) * 0.8, (x) => EPI[1] - d(x), EPI), [scar]); // eslint-disable-line react-hooks/exhaustive-deps
  const mat = useHighlight("epidermis", "#FFFFFF", {
    map: epidermisStrata(),
    bumpMap: skinBump(),
    bumpScale: 0.6,
    roughness: 0.42,
    sheen: 0.6,
    sheenColor: new THREE.Color("#fff1e8"),
    clearcoat: 0.35,
    clearcoatRoughness: 0.35,
  });
  const pick = usePick("epidermis");
  const dots = useMemo(() => {
    const r = seeded(7);
    const n = Math.round(110 * melanin);
    return Array.from({ length: n }, () => {
      const x = -W / 2 + 0.05 + r() * (W - 0.1);
      return [x, EPI[0] + 0.02 + r() * 0.05 - d(x) * 0.8, 0.004 + r() * 0.01] as [number, number, number];
    });
  }, [melanin, scar]); // eslint-disable-line react-hooks/exhaustive-deps
  const melMat = useHighlight("melanin", "#4A2B1D", { roughness: 0.5 });
  const pickMel = usePick("melanin");
  return (
    <group>
      <mesh geometry={geo} material={mat} {...pick} castShadow receiveShadow />
      <Instances positions={dots} radius={0.022} material={melMat} pick={pickMel} />
      <Label id="epidermis" position={[-W / 2 + 0.04, EPI[1] + 0.1, 0.02]} />
      <Label id="melanin" position={[-0.7, EPI[0] + 0.04, 0.02]} />
    </group>
  );
}

function Dermis({ scar, collagen, dermalMelanin }: { scar: number; collagen: number; dermalMelanin: number }) {
  const d = dent(scar);
  const geo = useMemo(() => layerGeometry(() => DERM[0], (x) => DERM[1] - d(x) * 0.8, DERM), [scar]); // eslint-disable-line react-hooks/exhaustive-deps
  const mat = useHighlight("dermis", "#FFFFFF", {
    map: dermisTissue(),
    bumpMap: dermisBump(),
    bumpScale: 1.2,
    roughness: 0.62,
    sheen: 0.5,
    sheenColor: new THREE.Color("#ffd9d6"),
    clearcoat: 0.15,
  });
  const pick = usePick("dermis");

  const fibres = useMemo(() => {
    const r = seeded(11);
    const n = Math.round(46 * collagen);
    return Array.from({ length: n }, () => {
      const x0 = -W / 2 + 0.1 + r() * (W - 1.0);
      const len = 0.5 + r() * 0.8;
      const y0 = DERM[0] + 0.12 + r() * 0.7;
      const z = 0.012 + r() * 0.02;
      const amp = 0.025 + r() * 0.03;
      const pts: [number, number, number][] = [];
      for (let k = 0; k <= 6; k++) {
        const x = Math.min(W / 2 - 0.05, x0 + (k / 6) * len);
        pts.push([x, Math.min(DERM[1] - 0.06 - d(x), y0 + Math.sin(k * 1.4 + x0 * 5) * amp), z]);
      }
      return pts;
    });
  }, [collagen, scar]); // eslint-disable-line react-hooks/exhaustive-deps
  const colMat = useHighlight("collagen", "#FFF4F0", { roughness: 0.35, sheen: 0.5, sheenColor: new THREE.Color("#ffffff") });
  const pickCol = usePick("collagen");

  const deep = useMemo(() => {
    const r = seeded(23);
    const n = Math.round(60 * dermalMelanin);
    return Array.from({ length: n }, () => [-0.3 + r() * 1.5, DERM[1] - 0.12 - r() * 0.4, 0.006 + r() * 0.012] as [number, number, number]);
  }, [dermalMelanin]);
  const melMat = useHighlight("melanin", "#5B3A2A");
  const pickMel = usePick("melanin");

  return (
    <group>
      <mesh geometry={geo} material={mat} {...pick} receiveShadow />
      {fibres.map((pts, i) => (
        <Tube key={i} points={pts} radius={0.011} segments={24} material={colMat} {...pickCol}>
          <primitive object={colMat} attach="material" />
        </Tube>
      ))}
      <Instances positions={deep} radius={0.027} material={melMat} pick={pickMel} />
      <Label id="dermis" position={[-W / 2 + 0.04, 0.62, 0.02]} />
      <Label id="collagen" position={[-0.05, 0.12, 0.04]} />
    </group>
  );
}

function Subcutis() {
  const geo = useMemo(() => layerGeometry(() => SUB[0], () => SUB[1], SUB), []);
  const mat = useHighlight("subcutis", "#FFFFFF", { map: fatTissue(), roughness: 0.5, sheen: 0.4, sheenColor: new THREE.Color("#fff3d6"), clearcoat: 0.2 });
  const lobMat = useHighlight("subcutis", "#F8E6B6", { roughness: 0.22, clearcoat: 0.8, clearcoatRoughness: 0.2, sheen: 0.5, sheenColor: new THREE.Color("#fff8e0") });
  const pick = usePick("subcutis");
  const lobules = useMemo(() => {
    const r = seeded(3);
    const out: [number, number, number][] = [];
    for (let x = -W / 2 + 0.13; x < W / 2 - 0.1; x += 0.23)
      for (let y = SUB[0] + 0.14; y < SUB[1] - 0.08; y += 0.21) out.push([x + (r() - 0.5) * 0.05, y + (r() - 0.5) * 0.04, -0.03]);
    return out;
  }, []);
  return (
    <group>
      <mesh geometry={geo} material={mat} {...pick} receiveShadow />
      <Instances positions={lobules} radius={0.11} material={lobMat} pick={pick} />
      <Label id="subcutis" position={[-W / 2 + 0.04, (SUB[0] + SUB[1]) / 2, 0.12]} />
    </group>
  );
}

function Instances({
  positions,
  radius,
  material,
  pick,
}: {
  positions: [number, number, number][];
  radius: number;
  material: THREE.Material;
  pick?: ReturnType<typeof usePick>;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    positions.forEach((p, i) => {
      o.position.set(...p);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.count = positions.length;
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  }, [positions]);
  if (!positions.length) return null;
  return (
    <instancedMesh key={positions.length} ref={ref} args={[undefined, undefined, positions.length]} material={material} {...pick}>
      <sphereGeometry args={[radius, 12, 10]} />
    </instancedMesh>
  );
}

/* ─────────── Follicle ─────────── */

const PHASE_GEO: Record<Phase, { len: number; bulb: number }> = {
  anagen: { len: 1.12, bulb: 0.11 },
  catagen: { len: 0.72, bulb: 0.075 },
  telogen: { len: 0.48, bulb: 0.06 },
};

function Follicle({
  x,
  index,
  phase,
  tone,
  state,
  pulseT,
}: {
  x: number;
  index: number;
  phase: Phase;
  tone: "dark" | "light";
  state: SkinState;
  pulseT: React.MutableRefObject<number>;
}) {
  const tilt = 0.22 + (index % 2) * 0.06;
  const { len, bulb } = PHASE_GEO[phase];
  const sheathMat = useHighlight("follicle", "#F3C3B9", { roughness: 0.5, transparent: true, opacity: 0.92 });
  const bulbMat = useHighlight("bulb", tone === "dark" ? "#6B4A3C" : "#D9BE91", { roughness: 0.45 });
  const shaftMat = useHighlight("shaft", tone === "dark" ? "#2A1C17" : "#D8BF8C", { roughness: 0.35, clearcoat: 0.6 });
  const glandMat = useHighlight("sebaceous", "#F4D27A", { roughness: 0.3, clearcoat: 0.5 });
  const pickF = usePick("follicle");
  const pickB = usePick("bulb");
  const pickS = usePick("shaft");
  const pickG = usePick("sebaceous");
  const glow = useRef<THREE.MeshBasicMaterial>(null);

  const absorbs = !!state.pulse && tone === "dark";
  const responsive = absorbs && phase === "anagen";
  const acne = index === 2;
  const gland = (acne ? state.glandScale ?? 1 : 1) * (phase === "telogen" ? 0.85 : 1);

  useFrame(() => {
    if (!glow.current) return;
    const p = pulseT.current; // 0..1 cycle; absorption peaks after the wave reaches the bulb
    const k = responsive ? Math.max(0, Math.sin(Math.min(1, Math.max(0, (p - 0.5) / 0.45)) * Math.PI)) : absorbs ? 0.25 * Math.max(0, Math.sin(p * Math.PI)) : 0;
    glow.current.opacity = Math.min(1, k * 0.95);
  });

  const hideForScar = (state.scar ?? 0) > 0 && Math.abs(x - SCAR_X) < 0.4;
  return (
    <group position={[x, EPI[1], 0.02]} rotation-z={tilt} visible={!hideForScar}>
      {/* Follicle sheath */}
      <mesh position={[0, -len / 2, 0]} material={sheathMat} {...pickF}>
        <cylinderGeometry args={[0.07, 0.085, len, 20, 1, true]} />
      </mesh>
      {/* Bulb */}
      <mesh position={[0, -len, 0]} material={bulbMat} {...pickB} scale={[1, 1.15, 1]}>
        <sphereGeometry args={[bulb, 24, 16]} />
      </mesh>
      {/* Conceptual absorption glow at the bulb */}
      <mesh position={[0, -len, 0]} scale={2.6}>
        <sphereGeometry args={[bulb, 20, 14]} />
        <meshBasicMaterial ref={glow} color="#FF8A50" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      {/* Shaft — runs from bulb through the follicle and out above the surface */}
      <mesh position={[0, (-len + 0.7) / 2, 0]} material={shaftMat} {...pickS}>
        <cylinderGeometry args={[0.02, 0.026, len + 0.7, 10]} />
      </mesh>
      {/* Sebaceous gland */}
      <group position={[0.11, -0.3, 0]} scale={gland}>
        {[
          [0, 0, 0, 0.06],
          [0.06, -0.05, 0.01, 0.05],
          [0.03, -0.1, -0.01, 0.045],
        ].map(([gx, gy, gz, r], i) => (
          <mesh key={i} position={[gx, gy, gz]} material={glandMat} {...pickG}>
            <sphereGeometry args={[r, 16, 12]} />
          </mesh>
        ))}
      </group>
      {/* Acne: plug and inflammation */}
      {acne && state.plug && (
        <mesh position={[0, -0.06, 0]}>
          <sphereGeometry args={[0.085, 18, 14]} />
          <meshStandardMaterial color="#CDB26A" roughness={0.6} />
        </mesh>
      )}
      {acne && state.plug && (
        <mesh position={[0, 0.0, 0]}>
          <sphereGeometry args={[0.05, 14, 10]} />
          <meshStandardMaterial color="#3E3127" roughness={0.6} />
        </mesh>
      )}
      {acne && state.inflammation && <Inflammation />}
      {index === 1 && <Label id="follicle" position={[0.09, -0.55, 0.06]} hidden={hideForScar} />}
      {index === 0 && <Label id="shaft" position={[0.03, 0.55, 0.02]} hidden={hideForScar} />}
      {index === 3 && <Label id="bulb" position={[0.12, -len, 0.06]} hidden={hideForScar || phase !== "anagen"} />}
      {index === 1 && <Label id="sebaceous" position={[0.2, -0.32, 0.06]} hidden={hideForScar} />}
      <Anchor3D id={`phase-${index}`} position={[-0.08, -len - 0.2, 0.05]} side="center" hidden={!state.phases || hideForScar} />
    </group>
  );
}

function Inflammation() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 1.6) * 0.04);
  });
  return (
    <mesh ref={ref} position={[0, -0.38, 0]}>
      <sphereGeometry args={[0.36, 28, 20]} />
      <meshStandardMaterial color="#E0465A" transparent opacity={0.28} depthWrite={false} roughness={0.8} />
    </mesh>
  );
}

/* ─────────── Glands and vessels ─────────── */

function SweatGland() {
  const mat = useHighlight("sweat", "#A9CFDD", { roughness: 0.3, clearcoat: 0.6 });
  const pick = usePick("sweat");
  const duct = useMemo<[number, number, number][]>(
    () => [
      [1.35, -0.18, 0.03],
      [1.3, 0.05, 0.03],
      [1.38, 0.3, 0.03],
      [1.3, 0.55, 0.03],
      [1.36, 0.78, 0.03],
      [1.33, EPI[1] + 0.01, 0.03],
    ],
    [],
  );
  return (
    <group>
      <mesh position={[1.35, -0.3, 0.03]} rotation-x={Math.PI / 2} material={mat} {...pick}>
        <torusKnotGeometry args={[0.085, 0.024, 96, 10, 2, 5]} />
      </mesh>
      <Tube points={duct} radius={0.016} segments={48} material={mat} {...pick}>
        <primitive object={mat} attach="material" />
      </Tube>
      <Label id="sweat" position={[1.48, -0.3, 0.05]} side="left" />
    </group>
  );
}

function Vessels() {
  const art = useHighlight("vessels", "#C8414F", { roughness: 0.3, clearcoat: 0.6 });
  const vein = useHighlight("vessels", "#6A6FB0", { roughness: 0.3, clearcoat: 0.6 });
  const pick = usePick("vessels");
  const path = (y: number, z: number, loops: boolean): [number, number, number][] => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 16; i++) {
      const x = -W / 2 + 0.05 + (i / 16) * (W - 0.1);
      const lift = loops && i % 4 === 2 ? 0.5 : 0;
      pts.push([x, y + Math.sin(i * 0.9) * 0.04 + lift, z]);
    }
    return pts;
  };
  const a = useMemo(() => path(-0.05, 0.035, true), []); // eslint-disable-line react-hooks/exhaustive-deps
  const v = useMemo(() => path(-0.12, 0.05, false), []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <group>
      <Tube points={a} radius={0.026} segments={160} {...pick}>
        <primitive object={art} attach="material" />
      </Tube>
      <Tube points={v} radius={0.03} segments={120} {...pick}>
        <primitive object={vein} attach="material" />
      </Tube>
      <BloodFlow points={a} />
      <Label id="vessels" position={[0.55, -0.08, 0.06]} />
    </group>
  );
}

/** Red cells drifting along the arteriole with a gentle pulsatile (≈72 bpm) rhythm. */
function BloodFlow({ points }: { points: [number, number, number][] }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const N = 46;
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), [points]);
  const travel = useRef(0);
  const o = useMemo(() => new THREE.Object3D(), []);
  const tan = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ clock }, dt) => {
    const m = ref.current;
    if (!m) return;
    const beat = Math.pow(Math.max(0, Math.sin(clock.getElapsedTime() * Math.PI * 2 * 1.2)), 6);
    travel.current = (travel.current + dt * (0.012 + beat * 0.03)) % 1;
    for (let i = 0; i < N; i++) {
      const u = (i / N + travel.current + Math.sin(i * 12.9) * 0.004) % 1;
      curve.getPointAt(u, o.position);
      curve.getTangentAt(u, tan);
      o.position.z += 0.022 + Math.sin(i * 3.1) * 0.006;
      o.position.y += Math.sin(i * 7.7) * 0.008;
      o.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), tan);
      o.rotateX(i * 0.7);
      o.scale.set(1.15, 0.5, 1.15); // biconcave-ish disc
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, N]} frustumCulled={false}>
      <sphereGeometry args={[0.011, 10, 8]} />
      <meshPhysicalMaterial color="#B3262F" roughness={0.3} clearcoat={0.7} sheen={0.4} sheenColor="#ff8a8a" />
    </instancedMesh>
  );
}

/* ─────────── Conceptual light pulse ─────────── */

function PulseWave({ pulseT, active, animate }: { pulseT: React.MutableRefObject<number>; active: boolean; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mats = useRef<THREE.MeshBasicMaterial[]>([]);
  useFrame((_, dt) => {
    pulseT.current = animate ? (pulseT.current + dt / 2.8) % 1 : 0.7;
    if (!group.current) return;
    group.current.visible = active;
    if (!active) return;
    const p = pulseT.current;
    // Wavefronts travel from above the skin down to bulb depth, fading as they go deeper.
    group.current.children.forEach((c, i) => {
      const local = Math.min(1, Math.max(0, (p - i * 0.06) / 0.62));
      c.position.y = 1.65 - local * 1.95;
      const m = mats.current[i];
      if (m) m.opacity = local > 0 && local < 1 ? Math.sin(local * Math.PI) * (0.62 - i * 0.14) * (c.position.y > EPI[1] ? 1 : 0.7) : 0;
    });
  });
  return (
    <group ref={group}>
      {[0, 1, 2].map((i) => (
        // A thin band on the cross-section face, so the wavefront reads clearly from the front.
        <mesh key={i} position={[0, 1.6, 0.09]}>
          <planeGeometry args={[W * 0.98, 0.06 - i * 0.012]} />
          <meshBasicMaterial
            ref={(m) => {
              if (m) mats.current[i] = m;
            }}
            color="#FFB38F"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─────────── Rig: model rotation, explode, reset ─────────── */

function Model({ state, rotation, animate }: { state: SkinState; rotation: number; animate: boolean }) {
  const root = useRef<THREE.Group>(null);
  const epi = useRef<THREE.Group>(null);
  const sub = useRef<THREE.Group>(null);
  const pulseT = useRef(0);
  const explode = state.explode ?? 0;

  useFrame(() => {
    const k = animate ? 0.08 : 1;
    if (root.current) root.current.rotation.y += (rotation - root.current.rotation.y) * k;
    if (epi.current) epi.current.position.y += (explode * 0.38 - epi.current.position.y) * k;
    if (sub.current) sub.current.position.y += (-explode * 0.38 - sub.current.position.y) * k;
  });

  const tones: ("dark" | "light")[] =
    state.hairTone === "light" ? ["light", "light", "light", "light"] : state.hairTone === "mixed" ? ["dark", "light", "dark", "light"] : ["dark", "dark", "dark", "dark"];
  const phases: Phase[] = state.phases ? ["anagen", "catagen", "anagen", "telogen"] : ["anagen", "anagen", "anagen", "anagen"];

  return (
    <group ref={root}>
      <group ref={epi}>
        <Epidermis scar={state.scar ?? 0} melanin={state.melaninEpi ?? 0.35} />
      </group>
      <group>
        <Dermis scar={state.scar ?? 0} collagen={state.collagen ?? 0.7} dermalMelanin={state.melaninDermal ?? 0} />
        {FOLLICLES.map((x, i) => (
          <Follicle key={i} x={x} index={i} phase={phases[i]} tone={tones[i]} state={state} pulseT={pulseT} />
        ))}
        <SweatGland />
        <Vessels />
      </group>
      <group ref={sub}>
        <Subcutis />
      </group>
      <PulseWave pulseT={pulseT} active={!!state.pulse} animate={animate} />
    </group>
  );
}

/** Where the camera's attention drifts when a structure is in focus (subtle, not a zoom). */
const FOCUS: Partial<Record<StructureId, [number, number, number]>> = {
  epidermis: [-0.6, 0.85, 0],
  melanin: [-0.5, 0.82, 0],
  dermis: [0, 0.35, 0],
  collagen: [0, 0.3, 0],
  follicle: [-0.3, 0.3, 0],
  shaft: [-0.6, 1.1, 0],
  bulb: [0.7, -0.15, 0],
  sebaceous: [-0.25, 0.55, 0],
  sweat: [1.3, -0.2, 0],
  vessels: [0.4, -0.05, 0],
  subcutis: [0, -0.6, 0],
};

function CameraRig({ resetKey, focus, controls, animate }: { resetKey: number; focus: StructureId | null; controls: React.RefObject<OrbitControlsImpl | null>; animate: boolean }) {
  const { camera } = useThree();
  const home = useMemo(() => new THREE.Vector3(0.5, 1.25, 4.9), []);
  const base = useMemo(() => new THREE.Vector3(0, 0, -0.4), []);
  const desired = useMemo(() => new THREE.Vector3(), []);
  const resetting = useRef(false);
  useEffect(() => {
    if (resetKey > 0) resetting.current = true;
  }, [resetKey]);
  useFrame(({ clock }) => {
    const c = controls.current;
    const f = focus && FOCUS[focus];
    desired.copy(base);
    if (f) desired.lerp(new THREE.Vector3(f[0], f[1], -0.2), 0.32);
    if (c) {
      c.target.lerp(desired, animate ? 0.035 : 1);
      if (resetting.current) {
        camera.position.lerp(home, 0.12);
        if (camera.position.distanceTo(home) < 0.01) resetting.current = false;
      } else if (animate) {
        // Very slow idle drift so the model feels alive without demanding attention.
        camera.position.y += Math.sin(clock.getElapsedTime() * 0.35) * 0.0006;
      }
      c.update();
    }
  });
  return null;
}

export interface SkinSceneProps {
  state: SkinState;
  selected: StructureId | null;
  onSelect: (id: StructureId) => void;
  labelIds: StructureId[];
  showLabels: boolean;
  rotation: number;
  resetKey: number;
  active: boolean;
  animate: boolean;
  allowDrag: boolean;
  /** Optional extra 3D objects (e.g. treatment props) placed in the model's world space. */
  extras?: React.ReactNode;
}

export default function SkinScene(p: SkinSceneProps) {
  const controls = useRef<OrbitControlsImpl>(null);
  const anchors = useRef<Anchors>(new Map()).current;
  const labelEls = useRef(new Map<string, HTMLElement>());
  const ctx = useMemo<Ctx>(
    () => ({ selected: p.selected, select: p.onSelect, labels: new Set(p.labelIds), showLabels: p.showLabels, anchors }),
    [p.selected, p.onSelect, p.labelIds, p.showLabels, anchors],
  );
  return (
    <div className="absolute inset-0">
    <Canvas
      dpr={[1, 1.75]}
      frameloop={p.active ? "always" : "never"}
      camera={{ position: [0.5, 1.25, 4.9], fov: 38, near: 0.1, far: 30 }}
      gl={{ antialias: !p.allowDrag, alpha: !p.allowDrag, stencil: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
      onPointerMissed={() => (document.body.style.cursor = "")}
    >
      <SceneCtx.Provider value={ctx}>
        {/* Pre-compensated for ACES tone mapping so it lands on the ivory panel colour. */}
        {p.allowDrag && <color attach="background" args={[1.42, 1.33, 1.3]} />}
        <hemisphereLight args={["#FFF8F4", "#E8D2CE", 0.75]} />
        <directionalLight position={[2.5, 4, 5]} intensity={1.7} color="#FFF4EC" />
        <directionalLight position={[-4, 2, 2]} intensity={0.55} color="#F3C9D3" />
        <directionalLight position={[0, -1, 4]} intensity={0.35} color="#FFE6DF" />
        <pointLight position={[0, 2.5, 2]} intensity={5} distance={7} color="#FFFFFF" />
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={2} position={[0, 3, 4]} scale={[6, 2, 1]} color="#fff" />
          <Lightformer form="rect" intensity={1} position={[-4, 1, 1]} rotation-y={Math.PI / 2} scale={[3, 2, 1]} color="#F7D7DD" />
        </Environment>
        <group position={[0, 0, 0]}>
          <Model state={p.state} rotation={p.rotation} animate={p.animate} />
          {p.extras}
        </group>
        <OrbitControls
          ref={controls}
          enabled={p.allowDrag}
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          target={[0, 0, -0.4]}
          minAzimuthAngle={-0.75}
          maxAzimuthAngle={0.75}
          minPolarAngle={0.95}
          maxPolarAngle={1.75}
        />
        <CameraRig resetKey={p.resetKey} focus={p.selected} controls={controls} animate={p.animate} />
        {p.allowDrag && (
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <N8AO halfRes aoRadius={0.35} distanceFalloff={0.6} intensity={2.2} color="#4A1A26" />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
            <SMAA />
          </EffectComposer>
        )}
        <LabelProjector anchors={anchors} elements={labelEls} show={p.showLabels} />
      </SceneCtx.Provider>
    </Canvas>
    <LabelOverlay ids={p.labelIds} selected={p.selected} onSelect={p.onSelect} elements={labelEls} />
    </div>
  );
}
