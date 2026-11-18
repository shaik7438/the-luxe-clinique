"use client";

/**
 * Signature hero: a laser hair reduction appointment, modelled procedurally.
 *
 * Realism features
 *  • Anatomical lathe-profiled limbs, sculpted heads (nose, lips, ears, brows),
 *    gloved hands that grip the handpiece.
 *  • A treatment sheet draped over the patient from a body heightfield, with
 *    side overhang and vertical folds.
 *  • Procedural surface detail: plaster, microcement, woven cotton, pebbled
 *    leather, skin pores.
 *  • Window daylight (rect-area light + emissive glass + sheer curtains),
 *    soft PCSS shadows, ambient occlusion, bloom, vignette (desktop).
 *  • Motion: the clinician's arm follows the handpiece with two-bone IK while
 *    it glides along the shin in a pulse-and-lift "stamping" rhythm; the
 *    console counts pulses; patient and clinician breathe; torso and head
 *    track the treatment area; the camera drifts slowly.
 *
 * Deliberately no visible "beam". When NEXT_PUBLIC_HERO_GLB is set, that
 * production model replaces the procedural figures.
 */

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, RoundedBox, useGLTF } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { leatherBump, microcement, microcementRough, plasterBump, skinBump, weaveBump } from "./textures";

type V3 = [number, number, number];
const UP = new THREE.Vector3(0, 1, 0);
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

const BED_TOP = 0.675;
const BED_HALF = 0.37;
const LEG_Z = -0.075; // treated (far) leg, nearest the clinician
const KNEE: V3 = [0.5, 0.728, LEG_Z];
const ANKLE: V3 = [0.98, 0.712, LEG_Z * 0.92];
const SHIN_PROFILE: [number, number][] = [
  [0, 0.052],
  [0.12, 0.056],
  [0.3, 0.058],
  [0.62, 0.044],
  [0.88, 0.034],
  [1, 0.032],
];

/* ═════════════════════ Materials ═════════════════════ */

function useMaterials() {
  return useMemo(() => {
    const m = (p: THREE.MeshPhysicalMaterialParameters) => new THREE.MeshPhysicalMaterial(p);
    const skinB = skinBump();
    const weave = weaveBump();
    return {
      wall: m({ color: "#F2E9E4", roughness: 0.95, bumpMap: plasterBump(), bumpScale: 0.6 }),
      floor: m({ map: microcement(), roughnessMap: microcementRough(), roughness: 0.75, clearcoat: 0.35, clearcoatRoughness: 0.45 }),
      blush: m({ color: "#E9D2D3", roughness: 0.92, bumpMap: plasterBump(), bumpScale: 0.4 }),
      burgundy: m({ color: "#7B1734", roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.3 }),
      leather: m({ color: "#FAF6F3", roughness: 0.5, bumpMap: leatherBump(), bumpScale: 0.5, clearcoat: 0.35, clearcoatRoughness: 0.4, sheen: 0.3 }),
      plinth: m({ color: "#E3D8D2", roughness: 0.55, metalness: 0.05 }),
      skinP: m({ color: "#C99579", roughness: 0.56, bumpMap: skinB, bumpScale: 0.25, sheen: 0.5, sheenColor: new THREE.Color("#F0B9A0"), sheenRoughness: 0.45, clearcoat: 0.08, clearcoatRoughness: 0.6 }),
      skinC: m({ color: "#B98163", roughness: 0.56, bumpMap: skinB, bumpScale: 0.25, sheen: 0.5, sheenColor: new THREE.Color("#E3A98D"), sheenRoughness: 0.45, clearcoat: 0.08 }),
      lips: m({ color: "#A86560", roughness: 0.45, clearcoat: 0.3 }),
      brow: m({ color: "#2A1D19", roughness: 0.8 }),
      hair: m({ color: "#24180F", roughness: 0.42, sheen: 1, sheenColor: new THREE.Color("#6B4B3B"), sheenRoughness: 0.35, clearcoat: 0.2 }),
      coat: m({ color: "#FDFDFC", roughness: 0.82, bumpMap: weave, bumpScale: 0.18, sheen: 0.6, sheenColor: new THREE.Color("#ffffff") }),
      scrubs: m({ color: "#38323A", roughness: 0.85, bumpMap: weave, bumpScale: 0.25 }),
      shoe: m({ color: "#F4F1EF", roughness: 0.45, clearcoat: 0.3 }),
      glove: m({ color: "#CFC7EA", roughness: 0.32, clearcoat: 0.35, clearcoatRoughness: 0.25 }),
      sheet: m({ color: "#F1DEDF", roughness: 0.9, bumpMap: weave, bumpScale: 0.35, sheen: 0.8, sheenColor: new THREE.Color("#ffffff"), sheenRoughness: 0.6, side: THREE.DoubleSide }),
      pillow: m({ color: "#FFFFFF", roughness: 0.9, bumpMap: weave, bumpScale: 0.2, sheen: 0.6 }),
      shields: m({ color: "#16141A", roughness: 0.18, metalness: 0.2, clearcoat: 1 }),
      safetyGlass: m({ color: "#2E7D62", roughness: 0.04, transmission: 0.75, thickness: 0.01, ior: 1.5, transparent: true, opacity: 0.9 }),
      frame: m({ color: "#1F2A26", roughness: 0.4 }),
      device: m({ color: "#FCFAF8", roughness: 0.24, clearcoat: 0.9, clearcoatRoughness: 0.12 }),
      deviceDark: m({ color: "#2A252A", roughness: 0.45, clearcoat: 0.3 }),
      sapphire: m({ color: "#E2EEF4", roughness: 0.02, transmission: 0.92, thickness: 0.04, ior: 1.76, transparent: true }),
      chrome: m({ color: "#DCD6D4", metalness: 1, roughness: 0.18 }),
      plant: m({ color: "#71856B", roughness: 0.62, sheen: 0.4, sheenColor: new THREE.Color("#a7c19b"), side: THREE.DoubleSide }),
      pot: m({ color: "#E7DCD5", roughness: 0.7, bumpMap: plasterBump(), bumpScale: 0.3 }),
      mask: m({ color: "#D3E2EB", roughness: 0.92, bumpMap: weave, bumpScale: 0.3 }),
      curtain: m({ color: "#FFFFFF", roughness: 0.95, transmission: 0.55, thickness: 0.01, transparent: true, opacity: 0.8, side: THREE.DoubleSide, sheen: 0.6 }),
      windowFrame: m({ color: "#F7F2EE", roughness: 0.5 }),
    };
  }, []);
}
type Mats = ReturnType<typeof useMaterials>;

/* ═════════════════════ Geometry helpers ═════════════════════ */

/** Unit-length lathe (y ∈ [0,1]) from a [t, radius] profile, with closed ends. */
function latheGeometry(profile: [number, number][], radial = 28) {
  const pts = [new THREE.Vector2(0.0001, profile[0][0]), ...profile.map(([t, r]) => new THREE.Vector2(r, t)), new THREE.Vector2(0.0001, profile[profile.length - 1][0])];
  return new THREE.LatheGeometry(pts, radial);
}

/** Orient an object so its local +Y runs from a to b, scaled to the distance. */
function placeAlong(obj: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3) {
  const d = b.clone().sub(a);
  const len = d.length();
  obj.position.copy(a);
  obj.quaternion.setFromUnitVectors(UP, d.normalize());
  obj.scale.set(1, len, 1);
}

function LatheLimb({ from, to, profile, material, flatten = 1 }: { from: V3; to: V3; profile: [number, number][]; material: THREE.Material; flatten?: number }) {
  const geo = useMemo(() => latheGeometry(profile), [profile]);
  const ref = useRef<THREE.Group>(null);
  useEffect(() => {
    if (ref.current) placeAlong(ref.current, v(...from), v(...to));
  }, [from, to]);
  return (
    <group ref={ref}>
      <mesh geometry={geo} material={material} scale={[1, 1, flatten]} castShadow receiveShadow />
    </group>
  );
}

function radiusAt(profile: [number, number][], t: number) {
  for (let i = 1; i < profile.length; i++) {
    const [t0, r0] = profile[i - 1], [t1, r1] = profile[i];
    if (t <= t1) return r0 + ((t - t0) / (t1 - t0)) * (r1 - r0);
  }
  return profile[profile.length - 1][1];
}

/** Two-bone IK: returns the elbow position for shoulder S reaching target T. */
function solveElbow(S: THREE.Vector3, T: THREE.Vector3, a: number, b: number, pole: THREE.Vector3) {
  const st = T.clone().sub(S);
  const d = Math.min(st.length(), a + b - 0.002);
  const dir = st.normalize();
  const x = (a * a - b * b + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, a * a - x * x));
  const p = pole.clone().sub(S);
  p.sub(dir.clone().multiplyScalar(p.dot(dir))).normalize();
  return S.clone().add(dir.multiplyScalar(x)).add(p.multiplyScalar(h));
}

/* ═════════════════════ Heads ═════════════════════ */

/** Sculpted head. Local frame: +Y crown, +Z face. */
function Head({ m, skin, eyes, bun = true }: { m: Mats; skin: THREE.Material; eyes: "shields" | "glasses"; bun?: boolean }) {
  return (
    <group>
      <mesh scale={[0.84, 1, 0.94]} material={skin} castShadow>
        <sphereGeometry args={[0.096, 48, 36]} />
      </mesh>
      {/* Jaw and chin */}
      <mesh position={[0, -0.052, 0.028]} scale={[0.78, 0.72, 0.86]} material={skin} castShadow>
        <sphereGeometry args={[0.072, 36, 24]} />
      </mesh>
      {/* Cheekbones */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.04 * s, -0.012, 0.062]} scale={[0.9, 0.7, 0.6]} material={skin}>
          <sphereGeometry args={[0.03, 20, 14]} />
        </mesh>
      ))}
      {/* Nose */}
      <mesh position={[0, -0.012, 0.094]} rotation-x={Math.PI / 2 + 0.25} material={skin} castShadow>
        <coneGeometry args={[0.014, 0.04, 16]} />
      </mesh>
      <mesh position={[0, -0.03, 0.098]} scale={[1.2, 0.8, 0.9]} material={skin}>
        <sphereGeometry args={[0.012, 16, 12]} />
      </mesh>
      {/* Lips */}
      <mesh position={[0, -0.056, 0.086]} rotation-z={Math.PI / 2} scale={[0.55, 1, 0.6]} material={m.lips}>
        <capsuleGeometry args={[0.008, 0.026, 6, 12]} />
      </mesh>
      {/* Ears */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.08 * s, -0.008, -0.004]} scale={[0.35, 1, 0.7]} material={skin} castShadow>
          <sphereGeometry args={[0.024, 16, 12]} />
        </mesh>
      ))}
      {/* Brows */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.03 * s, 0.03, 0.083]} rotation={[0, 0.25 * s, Math.PI / 2 - 0.12 * s]} material={m.brow}>
          <capsuleGeometry args={[0.0035, 0.024, 4, 8]} />
        </mesh>
      ))}
      {/* Hair */}
      <mesh position={[0, 0.012, -0.006]} scale={[0.9, 1.02, 1]} material={m.hair} castShadow>
        <sphereGeometry args={[0.1, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
      </mesh>
      <mesh position={[0, -0.01, -0.03]} scale={[0.88, 0.95, 0.9]} material={m.hair} castShadow>
        <sphereGeometry args={[0.1, 40, 24, Math.PI * 1.15, Math.PI * 0.7, Math.PI * 0.35, Math.PI * 0.45]} />
      </mesh>
      {bun && (
        <mesh position={[0, 0.025, -0.105]} scale={[1, 0.85, 0.8]} material={m.hair} castShadow>
          <sphereGeometry args={[0.045, 24, 18]} />
        </mesh>
      )}
      {eyes === "shields" ? (
        <>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[0.032 * s, 0.006, 0.083]} scale={[1, 0.62, 0.45]} material={m.shields}>
              <sphereGeometry args={[0.022, 24, 16]} />
            </mesh>
          ))}
          <mesh position={[0, 0.006, 0.004]} rotation-x={Math.PI / 2} scale={[0.86, 0.95, 1]} material={m.shields}>
            <torusGeometry args={[0.091, 0.0035, 6, 64]} />
          </mesh>
        </>
      ) : (
        <>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[0.032 * s, 0.006, 0.08]} scale={[1, 0.8, 0.4]} material={m.brow}>
              <sphereGeometry args={[0.01, 12, 10]} />
            </mesh>
          ))}
          {/* Wraparound laser-safety glasses */}
          <mesh position={[0, 0.008, 0.0]} rotation={[Math.PI / 2, 0, Math.PI * 0.125]} scale={[0.92, 1.08, 1]} material={m.safetyGlass}>
            <torusGeometry args={[0.094, 0.016, 10, 48, Math.PI * 0.75]} />
          </mesh>
          <mesh position={[0, 0.008, 0.0]} rotation={[Math.PI / 2, 0, Math.PI * 0.875]} scale={[0.92, 1.08, 1]} material={m.frame}>
            <torusGeometry args={[0.096, 0.003, 6, 48, Math.PI * 1.25]} />
          </mesh>
          {/* Surgical mask */}
          <mesh position={[0, -0.045, 0.06]} scale={[1, 0.75, 0.62]} material={m.mask}>
            <sphereGeometry args={[0.072, 32, 20, Math.PI * 0.08, Math.PI * 0.84, Math.PI * 0.32, Math.PI * 0.4]} />
          </mesh>
        </>
      )}
    </group>
  );
}

/* ═════════════════════ Room ═════════════════════ */

function Room({ m, detailed }: { m: Mats; detailed: boolean }) {
  const arch = useMemo(() => {
    const s = new THREE.Shape();
    const w = 0.8, h = 2.2;
    s.moveTo(-w, 0);
    s.lineTo(-w, h);
    s.absarc(0, h, w, Math.PI, 0, true);
    s.lineTo(w, 0);
    s.lineTo(-w, 0);
    return new THREE.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 3 });
  }, []);
  const archLine = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const w = 0.92, h = 2.2;
    pts.push(v(-w, 0, 0), v(-w, h, 0));
    for (let i = 0; i <= 40; i++) {
      const a = Math.PI - (i / 40) * Math.PI;
      pts.push(v(Math.cos(a) * w, h + Math.sin(a) * w, 0));
    }
    pts.push(v(w, 0, 0));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.02), 220, 0.011, 8, false);
  }, []);
  const curtain = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.9, 2.6, 80, 10);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      p.setZ(i, Math.sin(x * 24) * 0.03 + Math.sin(x * 9 + 1.1) * 0.02 + (y < -1.1 ? (y + 1.1) * 0.05 : 0));
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow material={m.floor}>
        <planeGeometry args={[14, 10]} />
      </mesh>
      <mesh position={[0, 2.5, -2.2]} receiveShadow material={m.wall}>
        <planeGeometry args={[14, 5]} />
      </mesh>
      <mesh position={[-3.2, 2.5, 0]} rotation-y={Math.PI / 2} receiveShadow material={m.wall}>
        <planeGeometry args={[10, 5]} />
      </mesh>
      <mesh position={[0, 0.06, -2.18]} material={m.plinth}>
        <boxGeometry args={[14, 0.12, 0.04]} />
      </mesh>

      {/* Window with daylight and sheer curtains on the side wall */}
      <group position={[-3.18, 1.55, 0.2]} rotation-y={Math.PI / 2}>
        <mesh>
          <planeGeometry args={[1.7, 2.3]} />
          <meshBasicMaterial color={[2.6, 2.5, 2.35]} toneMapped={false} />
        </mesh>
        {[-0.86, 0.86].map((x) => (
          <mesh key={x} position={[x, 0, 0.03]} material={m.windowFrame}>
            <boxGeometry args={[0.06, 2.4, 0.06]} />
          </mesh>
        ))}
        {[-1.17, 1.17, 0].map((y) => (
          <mesh key={y} position={[0, y, 0.03]} material={m.windowFrame}>
            <boxGeometry args={[1.78, y === 0 ? 0.035 : 0.06, 0.06]} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.03]} material={m.windowFrame}>
          <boxGeometry args={[0.035, 2.3, 0.05]} />
        </mesh>
        {detailed && (
          <>
            <mesh geometry={curtain} position={[-0.95, 0.05, 0.14]} material={m.curtain} />
            <mesh geometry={curtain} position={[0.95, 0.05, 0.14]} material={m.curtain} />
          </>
        )}
      </group>

      {/* Arched niche with burgundy outline */}
      <mesh geometry={arch} position={[-1.3, 0, -2.2]} material={m.blush} receiveShadow />
      <mesh geometry={archLine} position={[-1.3, 0, -2.13]} material={m.burgundy} />

      {/* Fluted wall panel */}
      {detailed &&
        Array.from({ length: 16 }).map((_, i) => (
          <RoundedBox key={i} args={[0.075, 2.6, 0.05]} radius={0.03} smoothness={4} position={[0.75 + i * 0.1, 1.3, -2.17]} material={m.device} receiveShadow castShadow />
        ))}

      {/* Cabinet, towels, bottle */}
      <group position={[-2.35, 0, -1.65]}>
        <RoundedBox args={[1.1, 0.9, 0.5]} radius={0.04} smoothness={5} position={[0, 0.45, 0]} material={m.device} castShadow receiveShadow />
        <mesh position={[0, 0.45, 0.252]} material={m.plinth}>
          <boxGeometry args={[0.004, 0.84, 0.002]} />
        </mesh>
        {[-0.2, 0.2].map((x) => (
          <mesh key={x} position={[x * 0.4, 0.62, 0.262]} rotation-x={Math.PI / 2} material={m.burgundy}>
            <cylinderGeometry args={[0.008, 0.008, 0.02, 12]} />
          </mesh>
        ))}
        {[0, 1, 2].map((i) => (
          <RoundedBox key={i} args={[0.36, 0.055, 0.27]} radius={0.025} smoothness={4} position={[-0.25, 0.93 + i * 0.058, 0]} material={i === 1 ? m.blush : m.pillow} castShadow />
        ))}
        <mesh position={[0.28, 1.02, 0]} material={m.pot} castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.22, 32]} />
        </mesh>
        <mesh position={[0.28, 1.16, 0]} material={m.chrome}>
          <cylinderGeometry args={[0.014, 0.014, 0.06, 16]} />
        </mesh>
      </group>

      {/* Plant: curved leaves */}
      {detailed && <Plant m={m} />}

      {/* Pendant lights */}
      {[-0.35, 0.75].map((x) => (
        <group key={x} position={[x, 0, -0.1]}>
          <mesh position={[0, 3.35, 0]} material={m.deviceDark}>
            <cylinderGeometry args={[0.005, 0.005, 1.1, 6]} />
          </mesh>
          <mesh position={[0, 2.78, 0]} material={m.burgundy} castShadow>
            <sphereGeometry args={[0.16, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          <mesh position={[0, 2.76, 0]}>
            <sphereGeometry args={[0.065, 24, 16]} />
            <meshBasicMaterial color={[3, 2.6, 2.1]} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Plant({ m }: { m: Mats }) {
  const leaf = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.11, 0.5, 6, 16);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i) + 0.25;
      const w = Math.sin((y / 0.5) * Math.PI) ** 0.8; // leaf outline
      p.setX(i, x * w);
      p.setZ(i, -Math.pow(y / 0.5, 2) * 0.14 + Math.abs(x) * 0.25);
      p.setY(i, y);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <group position={[-2.75, 0, -0.9]}>
      <mesh position={[0, 0.25, 0]} material={m.pot} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.16, 0.5, 40]} />
      </mesh>
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2 + (i % 2) * 0.3;
        return <mesh key={i} geometry={leaf} position={[Math.cos(a) * 0.05, 0.48 + (i % 3) * 0.05, Math.sin(a) * 0.05]} rotation={[0, -a + Math.PI / 2, 0.35 + (i % 4) * 0.12]} material={m.plant} castShadow />;
      })}
    </group>
  );
}

/* ═════════════════════ Bed ═════════════════════ */

function Bed({ m }: { m: Mats }) {
  return (
    <group>
      <RoundedBox args={[1.2, 0.46, 0.44]} radius={0.06} smoothness={5} position={[0, 0.27, 0]} material={m.plinth} castShadow receiveShadow />
      <RoundedBox args={[1.45, 0.06, 0.6]} radius={0.025} smoothness={4} position={[0, 0.03, 0]} material={m.deviceDark} receiveShadow />
      <RoundedBox args={[2.05, 0.16, 0.74]} radius={0.065} smoothness={8} position={[0, 0.595, 0]} material={m.leather} castShadow receiveShadow />
      <mesh position={[0, 0.53, 0]} material={m.burgundy}>
        <boxGeometry args={[1.98, 0.018, 0.752]} />
      </mesh>
      {/* Pillow */}
      <RoundedBox args={[0.36, 0.09, 0.46]} radius={0.045} smoothness={6} position={[-0.84, 0.71, 0]} material={m.pillow} castShadow receiveShadow />
    </group>
  );
}

/* ═════════════════════ Patient ═════════════════════ */

/** Body heightfield above the mattress (metres), smooth-maxed so the sheet tents between forms. */
function bodyHeight(x: number, z: number) {
  const ell = (cx: number, cz: number, rx: number, rz: number, h: number) => {
    const q = 1 - ((x - cx) / rx) ** 2 - ((z - cz) / rz) ** 2;
    return q > 0 ? h * Math.sqrt(q) : 0;
  };
  const cap = (x0: number, x1: number, cz: number, r: number, h: number) => {
    const t = Math.max(0, Math.min(1, (x - x0) / (x1 - x0)));
    const dx = x - (x0 + (x1 - x0) * t), dz = z - cz;
    const q = 1 - (dx * dx + dz * dz) / (r * r);
    return q > 0 ? h * Math.sqrt(q) : 0;
  };
  const parts = [
    ell(-0.6, 0, 0.12, 0.21, 0.11), // shoulders
    ell(-0.46, 0, 0.17, 0.165, 0.165), // chest
    ell(-0.24, 0, 0.17, 0.15, 0.125), // abdomen
    ell(-0.02, 0, 0.17, 0.19, 0.135), // hips
    cap(0.08, 0.58, 0.085, 0.078, 0.115), // thighs
    cap(0.08, 0.58, -0.085, 0.078, 0.115),
    cap(-0.6, -0.05, 0.215, 0.05, 0.075), // arms
    cap(-0.6, -0.05, -0.215, 0.05, 0.075),
  ];
  const k = 0.022;
  let s = Math.exp(0.004 / k);
  for (const p of parts) s += Math.exp(p / k);
  return k * Math.log(s);
}

function Drape({ m }: { m: Mats }) {
  const { geometry, hems } = useMemo(() => {
    const X0 = -0.71, X1 = 0.6, ZS = 0.52;
    const NX = 120, NZ = 84;
    const g = new THREE.PlaneGeometry(X1 - X0, ZS * 2, NX, NZ);
    const p = g.attributes.position as THREE.BufferAttribute;
    const fold = (x: number) => Math.sin(x * 31 + Math.sin(x * 7) * 1.4) * 0.6 + Math.sin(x * 13 + 0.7) * 0.4;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) + (X0 + X1) / 2;
      const zs = -p.getY(i);
      const az = Math.abs(zs), sg = Math.sign(zs) || 1;
      const wr = 0.0025 * Math.sin(x * 55 + zs * 30) * Math.sin(zs * 21);
      if (az <= BED_HALF) {
        p.setXYZ(i, x, bodyHeight(x, zs) + 0.008 + wr, zs);
      } else {
        const over = az - BED_HALF;
        const edgeH = bodyHeight(x, sg * BED_HALF) + 0.008;
        const bend = Math.min(1, over / 0.045);
        const y = edgeH - over * bend - (1 - bend) * over * 0.4;
        const z = sg * (BED_HALF + 0.018 * Math.sin(bend * Math.PI * 0.5)) + sg * fold(x) * 0.012 * bend;
        p.setXYZ(i, x, y - 0.002 * fold(x * 1.7) * bend, z);
      }
    }
    g.computeVertexNormals();
    const hemLine = (x: number) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 40; i++) {
        const zs = -BED_HALF + (i / 40) * BED_HALF * 2;
        pts.push(v(x, bodyHeight(x, zs) + 0.012, zs));
      }
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.011, 8, false);
    };
    return { geometry: g, hems: [hemLine(X0 + 0.004), hemLine(X1 - 0.004)] };
  }, []);
  return (
    <group>
      <mesh geometry={geometry} material={m.sheet} castShadow receiveShadow />
      {hems.map((h, i) => (
        <mesh key={i} geometry={h} material={m.sheet} castShadow />
      ))}
    </group>
  );
}

const patientHeadQuat = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(v(0, 0, -1), v(-1, 0, 0), v(0, 1, 0)));

function Patient({ m, animate }: { m: Mats; animate: boolean }) {
  const breath = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (breath.current && animate) breath.current.scale.y = 1 + Math.sin(clock.getElapsedTime() * ((Math.PI * 2) / 4.6)) * 0.022;
  });
  const footProfile: [number, number][] = [
    [0, 0.033],
    [0.25, 0.038],
    [0.6, 0.04],
    [0.85, 0.034],
    [1, 0.022],
  ];
  return (
    <group>
      {/* Head on pillow, face up, eye shields on */}
      <group position={[-0.83, 0.835, 0]} quaternion={patientHeadQuat}>
        <Head m={m} skin={m.skinP} eyes="shields" bun={false} />
      </group>
      {/* Hair fanned on the pillow */}
      <mesh position={[-0.94, 0.765, 0]} scale={[1.25, 0.28, 1.15]} material={m.hair} castShadow>
        <sphereGeometry args={[0.1, 40, 24]} />
      </mesh>
      {/* Neck */}
      <LatheLimb from={[-0.76, 0.78, 0]} to={[-0.66, 0.765, 0]} profile={[[0, 0.044], [0.5, 0.041], [1, 0.05]]} material={m.skinP} />
      {/* Breathing sheet */}
      <group position={[0, BED_TOP, 0]}>
        <group ref={breath}>
          <Drape m={m} />
        </group>
      </group>
      {/* Exposed lower legs and feet */}
      {[LEG_Z, -LEG_Z].map((z) => {
        const knee: V3 = [KNEE[0], KNEE[1], z];
        const ankle: V3 = [ANKLE[0], ANKLE[1], z * 0.92];
        return (
          <group key={z}>
            <LatheLimb from={knee} to={ankle} profile={SHIN_PROFILE} material={m.skinP} flatten={0.92} />
            <mesh position={[ANKLE[0] + 0.012, ANKLE[1] - 0.012, z * 0.92]} material={m.skinP} castShadow>
              <sphereGeometry args={[0.034, 24, 18]} />
            </mesh>
            <LatheLimb from={[ANKLE[0] + 0.02, ANKLE[1] - 0.005, z * 0.92]} to={[ANKLE[0] + 0.065, ANKLE[1] + 0.13, z * (z < 0 ? 1.05 : 1.1)]} profile={footProfile} material={m.skinP} flatten={0.75} />
          </group>
        );
      })}
    </group>
  );
}

/* ═════════════════════ Clinician + handpiece (animated) ═════════════════════ */

const BODY_X = 0.72;
const BODY_Z = -0.62;
const HIP_Y = 0.95;
const UPPER = 0.3;
const FORE = 0.285;

function shinSurface(x: number) {
  const t = (x - KNEE[0]) / (ANKLE[0] - KNEE[0]);
  const cy = KNEE[1] + (ANKLE[1] - KNEE[1]) * t;
  const cz = KNEE[2] + (ANKLE[2] - KNEE[2]) * t;
  const r = radiusAt(SHIN_PROFILE, t) * 0.98;
  const n = v(0, 0.86, -0.51).normalize(); // upper-outer face of the shin, toward the clinician
  return { point: v(x, cy, cz).add(n.clone().multiplyScalar(r)), normal: n };
}

interface Pose {
  contact: THREE.Vector3;
  axis: THREE.Vector3;
  pulse: number; // 0..1 flash intensity
}

function useTreatmentPose(animate: boolean, onPulse: () => void) {
  const pose = useRef<Pose>({ contact: v(0.7, 0.78, -0.11), axis: v(0, 1, 0), pulse: 0 });
  const lastPhase = useRef(0);
  useFrame(({ clock }) => {
    const t = animate ? clock.getElapsedTime() : 3.2;
    const glide = 0.5 - 0.5 * Math.cos((t * Math.PI * 2) / 11);
    const x = 0.6 + glide * 0.27;
    const phase = (t * 1.05) % 1;
    const lift = phase < 0.58 ? 0 : Math.sin(((phase - 0.58) / 0.42) * Math.PI) * 0.007;
    if (animate && phase < lastPhase.current) onPulse();
    lastPhase.current = phase;
    const { point, normal } = shinSurface(x);
    const tilt = v(0, 0.28, -0.32).add(v((glide - 0.5) * -0.12, 0, 0));
    pose.current.axis.copy(normal).multiplyScalar(0.85).add(tilt).normalize();
    pose.current.contact.copy(point).add(normal.clone().multiplyScalar(0.018 + lift));
    pose.current.pulse = animate ? Math.max(0, 1 - phase / 0.18) : 0.6;
  });
  return pose;
}

function Handpiece({ m, pose }: { m: Mats; pose: React.RefObject<Pose> }) {
  const group = useRef<THREE.Group>(null);
  const led = useRef<THREE.MeshBasicMaterial>(null);
  const body = useMemo(
    () =>
      latheGeometry([
        [0, 0.022],
        [0.12, 0.026],
        [0.4, 0.024],
        [0.62, 0.021],
        [0.85, 0.023],
        [1, 0.016],
      ]),
    [],
  );
  useFrame(() => {
    const g = group.current;
    if (!g) return;
    g.position.copy(pose.current.contact);
    g.quaternion.setFromUnitVectors(UP, pose.current.axis);
    if (led.current) led.current.color.setRGB(1 + pose.current.pulse * 3.5, 0.35 + pose.current.pulse * 0.8, 0.45 + pose.current.pulse);
  });
  return (
    <group ref={group}>
      {/* Treatment head with cooled sapphire window resting on the skin */}
      <RoundedBox args={[0.07, 0.036, 0.058]} radius={0.012} smoothness={5} material={m.device} castShadow />
      <mesh position={[0, -0.0185, 0]} material={m.sapphire}>
        <boxGeometry args={[0.05, 0.004, 0.036]} />
      </mesh>
      <mesh position={[0, 0.006, 0]} material={m.burgundy}>
        <boxGeometry args={[0.072, 0.006, 0.06]} />
      </mesh>
      <group position={[0, 0.016, 0]} scale={[1, 0.21, 1]}>
        <mesh geometry={body} material={m.device} castShadow />
      </group>
      <mesh position={[0, 0.1, 0.0]} rotation-x={Math.PI / 2} material={m.deviceDark}>
        <torusGeometry args={[0.0235, 0.004, 8, 32]} />
      </mesh>
      <mesh position={[0, 0.17, 0.02]}>
        <sphereGeometry args={[0.0045, 12, 10]} />
        <meshBasicMaterial ref={led} color={[1.5, 0.5, 0.6]} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Cable({ m, pose }: { m: Mats; pose: React.RefObject<Pose> }) {
  const mesh = useRef<THREE.Mesh>(null);
  const frame = useRef(0);
  const port = useMemo(() => v(1.47, 0.86, -0.32), []);
  useFrame(() => {
    if (!mesh.current || frame.current++ % 2) return;
    const tail = pose.current.contact.clone().add(pose.current.axis.clone().multiplyScalar(0.23));
    const out = tail.clone().add(pose.current.axis.clone().multiplyScalar(0.08));
    const mid = tail.clone().lerp(port, 0.5);
    mid.y = Math.min(tail.y, port.y) - 0.32;
    const curve = new THREE.CatmullRomCurve3([tail, out, mid, port.clone().add(v(-0.05, -0.1, 0)), port]);
    const old = mesh.current.geometry;
    mesh.current.geometry = new THREE.TubeGeometry(curve, 56, 0.0095, 8, false);
    old.dispose();
  });
  return (
    <mesh ref={mesh} castShadow material={m.deviceDark}>
      <bufferGeometry />
    </mesh>
  );
}

function GlovedHand({ m, curl = 1 }: { m: Mats; curl?: number }) {
  // Local frame: +Y along fingers, +Z back of hand, palm faces −Z.
  return (
    <group>
      <RoundedBox args={[0.072, 0.082, 0.026]} radius={0.012} smoothness={4} material={m.glove} castShadow />
      {[-0.026, -0.009, 0.009, 0.026].map((x, i) => (
        <group key={x} position={[x, 0.04, 0]} rotation-x={-0.9 * curl}>
          <mesh position={[0, 0.026 - Math.abs(i - 1.5) * 0.003, 0]} material={m.glove} castShadow>
            <capsuleGeometry args={[0.0085, 0.036 - Math.abs(i - 1.5) * 0.005, 4, 10]} />
          </mesh>
          <group position={[0, 0.05, 0]} rotation-x={-0.9 * curl}>
            <mesh position={[0, 0.014, 0]} material={m.glove} castShadow>
              <capsuleGeometry args={[0.008, 0.018, 4, 10]} />
            </mesh>
          </group>
        </group>
      ))}
      <group position={[-0.036, -0.012, -0.008]} rotation={[-0.5 * curl, 0, 0.8]}>
        <mesh position={[0, 0.026, 0]} material={m.glove} castShadow>
          <capsuleGeometry args={[0.0095, 0.036, 4, 10]} />
        </mesh>
      </group>
    </group>
  );
}

function Clinician({ m, pose, animate }: { m: Mats; pose: React.RefObject<Pose>; animate: boolean }) {
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const armR = useRef<{ upper: THREE.Group | null; fore: THREE.Group | null; elbow: THREE.Mesh | null; hand: THREE.Group | null }>({ upper: null, fore: null, elbow: null, hand: null });
  const armL = useRef<{ upper: THREE.Group | null; fore: THREE.Group | null; elbow: THREE.Mesh | null; hand: THREE.Group | null }>({ upper: null, fore: null, elbow: null, hand: null });

  const coatTorso = useMemo(
    () =>
      latheGeometry([
        [0, 0.205],
        [0.12, 0.185],
        [0.2, 0.172],
        [0.32, 0.188],
        [0.4, 0.192],
        [0.45, 0.17],
        [0.49, 0.11],
        [0.52, 0.06],
      ], 40),
    [],
  );
  const skirt = useMemo(() => latheGeometry([[0, 0.255], [0.45, 0.228], [1, 0.205]], 40), []);
  const trouser = useMemo(() => latheGeometry([[0, 0.042], [0.2, 0.05], [0.5, 0.058], [0.8, 0.07], [1, 0.078]]), []);
  const sleeveUpper = useMemo(() => latheGeometry([[0, 0.054], [0.5, 0.048], [1, 0.045]]), []);
  const sleeveFore = useMemo(() => latheGeometry([[0, 0.045], [0.7, 0.038], [0.94, 0.036], [1, 0.034]]), []);

  const shoulderLocal = useMemo(() => ({ R: v(-0.17, 0.415, 0.0), L: v(0.17, 0.415, 0.0) }), []);
  const handRestL = useMemo(() => v(0.99, 0.785, -0.12), []);
  const tmp = useMemo(() => ({ s: v(0, 0, 0), w: v(0, 0, 0), e: v(0, 0, 0), m: new THREE.Matrix4() }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const P = pose.current;
    const T = torso.current;
    if (!T) return;
    // Torso leans over the bed and turns gently with the handpiece.
    T.rotation.order = "YXZ";
    T.rotation.y = (P.contact.x - 0.73) * -0.55;
    T.rotation.x = 0.42 + (animate ? Math.sin(t * 0.7) * 0.01 : 0);
    T.scale.set(1, 1 + (animate ? Math.sin((t * Math.PI * 2) / 4.1) * 0.006 : 0), 1);
    T.updateWorldMatrix(true, false);
    if (head.current) {
      head.current.rotation.order = "YXZ";
      head.current.rotation.y = (P.contact.x - 0.73) * -0.8;
      head.current.rotation.x = 0.38;
    }

    // Right hand grips the handpiece; left hand steadies the skin near the ankle.
    const grip = P.contact.clone().add(P.axis.clone().multiplyScalar(0.115));
    const solve = (side: "R" | "L", wrist: THREE.Vector3, pole: THREE.Vector3, arm: typeof armR.current, handBasis: (h: THREE.Group, w: THREE.Vector3, e: THREE.Vector3) => void) => {
      const S = T.localToWorld(shoulderLocal[side].clone());
      const E = solveElbow(S, wrist, UPPER, FORE, pole);
      if (arm.upper) placeAlong(arm.upper, S, E);
      if (arm.fore) placeAlong(arm.fore, E, wrist);
      arm.elbow?.position.copy(E);
      if (arm.hand) handBasis(arm.hand, wrist, E);
    };

    const toClin = v(BODY_X, 1.3, BODY_Z).sub(grip);
    toClin.sub(P.axis.clone().multiplyScalar(toClin.dot(P.axis))).normalize();
    const wristR = grip.clone().add(toClin.clone().multiplyScalar(0.03)).add(P.axis.clone().multiplyScalar(0.07));
    solve("R", wristR, v(BODY_X - 0.6, 0.7, BODY_Z - 0.3), armR.current, (h) => {
      const y = grip.clone().sub(wristR).normalize();
      const z = toClin.clone().sub(y.clone().multiplyScalar(toClin.dot(y))).normalize();
      const x = y.clone().cross(z);
      tmp.m.makeBasis(x, y, z);
      h.position.copy(wristR).add(y.clone().multiplyScalar(0.02));
      h.quaternion.setFromRotationMatrix(tmp.m);
    });

    const wristL = handRestL.clone().add(v(-0.06, 0.03, -0.04));
    solve("L", wristL, v(BODY_X + 0.7, 0.75, BODY_Z - 0.3), armL.current, (h) => {
      const y = handRestL.clone().sub(wristL).normalize();
      const z = v(0, 1, 0).sub(y.clone().multiplyScalar(y.y)).normalize();
      const x = y.clone().cross(z);
      tmp.m.makeBasis(x, y, z);
      h.position.copy(wristL).add(y.clone().multiplyScalar(0.03));
      h.quaternion.setFromRotationMatrix(tmp.m);
    });
  });

  const armMeshes = (arm: typeof armR) => (
    <>
      <group ref={(g) => void (arm.current.upper = g)}>
        <mesh geometry={sleeveUpper} material={m.coat} castShadow />
      </group>
      <mesh ref={(e) => void (arm.current.elbow = e)} material={m.coat} castShadow>
        <sphereGeometry args={[0.046, 20, 16]} />
      </mesh>
      <group ref={(g) => void (arm.current.fore = g)}>
        <mesh geometry={sleeveFore} material={m.coat} castShadow />
      </group>
      <group ref={(g) => void (arm.current.hand = g)}>
        <GlovedHand m={m} curl={arm === armR ? 1 : 0.25} />
      </group>
    </>
  );

  return (
    <group>
      {/* Legs and shoes */}
      {[-0.085, 0.085].map((dx) => (
        <group key={dx}>
          <group position={[BODY_X + dx, 0.07, BODY_Z - 0.02]} scale={[1, 0.86, 1]}>
            <mesh geometry={trouser} material={m.scrubs} castShadow receiveShadow />
          </group>
          <RoundedBox args={[0.09, 0.06, 0.22]} radius={0.028} smoothness={4} position={[BODY_X + dx, 0.03, BODY_Z + 0.03]} material={m.shoe} castShadow />
        </group>
      ))}
      {/* Coat skirt (static), then torso pivoting at the hips */}
      <group position={[BODY_X, 0.56, BODY_Z]} scale={[1, 0.42, 0.74]}>
        <mesh geometry={skirt} material={m.coat} castShadow receiveShadow />
      </group>
      <group ref={torso} position={[BODY_X, HIP_Y, BODY_Z]}>
        <group scale={[1, 1, 0.72]}>
          <mesh geometry={coatTorso} material={m.coat} castShadow receiveShadow />
        </group>
        {/* Burgundy collar piping and chest pocket with pen */}
        <mesh position={[0, 0.47, 0.03]} rotation-x={Math.PI / 2 + 0.3} scale={[1, 0.8, 1]} material={m.burgundy}>
          <torusGeometry args={[0.062, 0.008, 8, 40]} />
        </mesh>
        <mesh position={[0.085, 0.33, 0.135]} rotation-x={-0.1} material={m.burgundy}>
          <boxGeometry args={[0.07, 0.006, 0.006]} />
        </mesh>
        <mesh position={[0.1, 0.35, 0.137]} material={m.chrome}>
          <cylinderGeometry args={[0.004, 0.004, 0.05, 8]} />
        </mesh>
        {/* Shoulder caps */}
        {[-0.17, 0.17].map((x) => (
          <mesh key={x} position={[x, 0.415, 0]} material={m.coat} castShadow>
            <sphereGeometry args={[0.058, 24, 18]} />
          </mesh>
        ))}
        <LatheLimb from={[0, 0.48, 0.0]} to={[0, 0.57, 0.02]} profile={[[0, 0.05], [0.5, 0.042], [1, 0.044]]} material={m.skinC} />
        <group ref={head} position={[0, 0.66, 0.04]}>
          <group position={[0, 0.0, 0]}>
            <Head m={m} skin={m.skinC} eyes="glasses" />
          </group>
        </group>
      </group>
      {armMeshes(armR)}
      {armMeshes(armL)}
    </group>
  );
}

/* ═════════════════════ Laser console ═════════════════════ */

function Console({ m, pulses }: { m: Mats; pulses: React.RefObject<number> }) {
  const { tex, draw } = useMemo(() => {
    const cvs = document.createElement("canvas");
    cvs.width = 512;
    cvs.height = 320;
    const g = cvs.getContext("2d")!;
    const tex = new THREE.CanvasTexture(cvs);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const draw = (count: number) => {
      const grd = g.createLinearGradient(0, 0, 512, 320);
      grd.addColorStop(0, "#26131c");
      grd.addColorStop(1, "#4a1426");
      g.fillStyle = grd;
      g.fillRect(0, 0, 512, 320);
      g.strokeStyle = "rgba(255,255,255,0.14)";
      g.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        g.beginPath();
        g.arc(130, 165, 50 + i * 26, 0, Math.PI * 2);
        g.stroke();
      }
      g.strokeStyle = "#E7A3B4";
      g.lineWidth = 8;
      g.beginPath();
      g.arc(130, 165, 76, -Math.PI / 2, -Math.PI / 2 + ((count % 60) / 60) * Math.PI * 2);
      g.stroke();
      g.fillStyle = "#fff";
      g.font = "700 34px Inter, sans-serif";
      g.textAlign = "center";
      g.fillText(String(count), 130, 177);
      g.textAlign = "left";
      g.fillStyle = "rgba(255,255,255,0.9)";
      g.font = "600 24px Inter, sans-serif";
      g.fillText("Skin type", 250, 100);
      g.fillText("Cooling", 250, 170);
      g.fillText("Pulses", 250, 240);
      g.fillStyle = "rgba(255,255,255,0.3)";
      [114, 184].forEach((y) => g.fillRect(250, y, 210, 6));
      g.fillStyle = "#E7A3B4";
      g.fillRect(250, 114, 140, 6);
      g.fillRect(250, 184, 180, 6);
      g.fillStyle = "rgba(255,255,255,0.6)";
      g.font = "500 20px Inter, sans-serif";
      g.fillText("Session in progress", 250, 270);
      tex.needsUpdate = true;
    };
    draw(0);
    return { tex, draw };
  }, []);
  const last = useRef(-1);
  useFrame(() => {
    if (pulses.current !== last.current) {
      last.current = pulses.current;
      draw(pulses.current);
    }
  });
  return (
    <group position={[1.62, 0, -0.42]} rotation-y={-0.55}>
      <RoundedBox args={[0.52, 0.07, 0.52]} radius={0.025} smoothness={4} position={[0, 0.1, 0]} material={m.deviceDark} castShadow />
      {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map(([x, z]) => (
        <group key={`${x}${z}`} position={[x, 0.04, z]}>
          <mesh rotation-z={Math.PI / 2} material={m.deviceDark}>
            <cylinderGeometry args={[0.04, 0.04, 0.03, 24]} />
          </mesh>
          <mesh rotation-z={Math.PI / 2} material={m.chrome}>
            <cylinderGeometry args={[0.015, 0.015, 0.034, 12]} />
          </mesh>
        </group>
      ))}
      <RoundedBox args={[0.44, 0.86, 0.42]} radius={0.08} smoothness={8} position={[0, 0.56, 0]} material={m.device} castShadow receiveShadow />
      {/* Vents */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0, 0.25 + i * 0.03, 0.211]} material={m.plinth}>
          <boxGeometry args={[0.24, 0.008, 0.002]} />
        </mesh>
      ))}
      <mesh position={[0, 0.74, 0.212]} material={m.burgundy}>
        <boxGeometry args={[0.44, 0.05, 0.004]} />
      </mesh>
      <mesh position={[0.13, 0.99, 0.1]} material={m.burgundy}>
        <cylinderGeometry args={[0.024, 0.027, 0.02, 32]} />
      </mesh>
      <mesh position={[0.24, 0.85, -0.05]} rotation-z={-0.25} material={m.chrome}>
        <cylinderGeometry args={[0.035, 0.03, 0.12, 24]} />
      </mesh>
      <group position={[0, 1.15, 0.04]} rotation-x={-0.45}>
        <RoundedBox args={[0.4, 0.27, 0.035]} radius={0.015} smoothness={4} material={m.deviceDark} castShadow />
        <mesh position={[0, 0, 0.0185]}>
          <planeGeometry args={[0.37, 0.235]} />
          <meshBasicMaterial map={tex} color={[1.25, 1.25, 1.25]} toneMapped={false} />
        </mesh>
      </group>
      <mesh position={[0, 1.02, 0]} material={m.chrome}>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 16]} />
      </mesh>
    </group>
  );
}

/* ═════════════════════ Optional production model ═════════════════════ */

function ProductionModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

/* ═════════════════════ Camera ═════════════════════ */

function CameraRig({ animate, compact }: { animate: boolean; compact: boolean }) {
  const { camera, pointer } = useThree();
  const base = useMemo(() => (compact ? v(3.25, 1.95, 3.55) : v(2.85, 1.72, 2.95)), [compact]);
  const target = useMemo(() => v(compact ? 0.35 : 0.22, 0.84, -0.05), [compact]);
  const look = useRef(target.clone());
  const intro = useRef(animate ? 0 : 1);
  const desired = useMemo(() => v(0, 0, 0), []);
  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    intro.current = Math.min(1, intro.current + dt * 0.28);
    const e = 1 - Math.pow(1 - intro.current, 3);
    const swayX = animate ? Math.sin(t * 0.1) * 0.14 + pointer.x * 0.16 : 0;
    const swayY = animate ? Math.sin(t * 0.075) * 0.05 + pointer.y * 0.07 : 0;
    desired.set(base.x + swayX + (1 - e) * 1.1, base.y + swayY + (1 - e) * 0.45, base.z + (1 - e) * 1.0);
    camera.position.lerp(desired, animate ? 1 - Math.pow(0.001, dt) : 1);
    look.current.lerp(target, 0.05);
    camera.lookAt(look.current);
  });
  return null;
}

/* ═════════════════════ Scene ═════════════════════ */

export default function HeroScene({ compact, animate, active }: { compact: boolean; animate: boolean; active: boolean }) {
  const glb = process.env.NEXT_PUBLIC_HERO_GLB;
  return (
    <Canvas
      shadows={compact ? false : { type: THREE.PCFShadowMap }}
      dpr={compact ? [1, 1.5] : [1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: compact ? 36 : 31, near: 0.1, far: 40, position: [3.6, 2.2, 4] }}
      gl={{ antialias: compact, powerPreference: "high-performance", alpha: false, stencil: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
      }}
      aria-hidden
    >
      <Scene compact={compact} animate={animate} glb={glb} />
    </Canvas>
  );
}

function Scene({ compact, animate, glb }: { compact: boolean; animate: boolean; glb?: string }) {
  const m = useMaterials();
  const pulses = useRef(0);
  const pose = useTreatmentPose(animate, () => (pulses.current += 1));
  useMemo(() => RectAreaLightUniformsLib.init(), []);

  return (
    <>
      <color attach="background" args={compact ? ["#F3EAE6"] : [1.38, 1.27, 1.22]} />
      <fog attach="fog" args={["#F3EAE6", 6.5, 14]} />

      <hemisphereLight args={["#FFF6F0", "#E3D0CB", compact ? 0.95 : 0.5]} />
      {/* Daylight through the window */}
      <rectAreaLight position={[-3.1, 1.55, 0.2]} rotation-y={-Math.PI / 2} width={1.7} height={2.3} intensity={7} color="#FFF4E8" />
      <directionalLight
        position={[-3.4, 4.2, 1.6]}
        intensity={1.6}
        color="#FFF1E2"
        castShadow={!compact}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-2.2}
        shadow-camera-right={2.6}
        shadow-camera-top={2.4}
        shadow-camera-bottom={-1.6}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
        shadow-bias={-0.0005}
        shadow-radius={5}
        shadow-normalBias={0.035}
      />
      {/* Key fill from camera side and warm pendants */}
      <directionalLight position={[3, 3, 3.5]} intensity={compact ? 0.9 : 0.55} color="#FFF8F2" />
      <pointLight position={[-0.35, 2.7, -0.1]} intensity={2.2} color="#FFD9B8" distance={4} decay={2} />
      <pointLight position={[0.75, 2.7, -0.1]} intensity={2.2} color="#FFD9B8" distance={4} decay={2} />
      <pointLight position={[-2, 2.2, -1.6]} intensity={1.6} color="#E7A3B4" distance={5} />

      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2} position={[0, 4, 2]} scale={[6, 2, 1]} color="#fff" />
        <Lightformer form="rect" intensity={3} position={[-5, 1.6, 0]} rotation-y={Math.PI / 2} scale={[2, 2.4, 1]} color="#FFF4E8" />
        <Lightformer form="rect" intensity={0.8} position={[4, 2, -2]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} color="#F3D7DD" />
        <Lightformer form="ring" intensity={1.2} position={[3, 2, 3]} scale={1.4} color="#fff" />
      </Environment>

      {glb ? (
        <Suspense fallback={null}>
          <ProductionModel url={glb} />
        </Suspense>
      ) : (
        <>
          <Room m={m} detailed={!compact} />
          <Bed m={m} />
          <Patient m={m} animate={animate} />
          <Clinician m={m} pose={pose} animate={animate} />
          <Handpiece m={m} pose={pose} />
          <Cable m={m} pose={pose} />
          <Console m={m} pulses={pulses} />
        </>
      )}
      <ContactShadows position={[0, 0.002, 0]} opacity={0.4} scale={8} blur={2.4} far={2.2} resolution={512} frames={1} color="#4D0C20" />
      <CameraRig animate={animate} compact={compact} />

      {!compact && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <N8AO halfRes aoRadius={0.55} distanceFalloff={0.9} intensity={2.4} color="#3A1A24" />
          <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.45} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <SMAA />
          <Vignette offset={0.3} darkness={0.34} />
        </EffectComposer>
      )}
    </>
  );
}
