"use client";

/**
 * Beauty hero: a rose-quartz glass sculpture of a woman's profile (echoing the
 * Luxe Clinique logo) on a marble plinth, surrounded by floating pearls, glass
 * serum droplets, a serum bottle, drifting rose petals and a satin ribbon.
 * Everything is procedural — no external assets.
 */

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { BACK_LINE, EYE, FACE_LINE, HAIR_STRANDS, LEAVES, leafOutline, type P } from "@/components/art/profile";
import { blushBackdrop, marble } from "./textures";

const v2 = ([x, y]: P) => new THREE.Vector2(x, y);
const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

function useMats(compact: boolean) {
  return useMemo(() => {
    const glass = (p: THREE.MeshPhysicalMaterialParameters) =>
      compact
        ? new THREE.MeshPhysicalMaterial({ transparent: true, opacity: 0.55, roughness: 0.08, clearcoat: 1, ...p, transmission: 0, thickness: 0 })
        : new THREE.MeshPhysicalMaterial({ transmission: 1, roughness: 0.06, ior: 1.45, clearcoat: 1, clearcoatRoughness: 0.05, ...p });
    return {
      quartz: compact
        ? new THREE.MeshPhysicalMaterial({ color: "#F4D3D8", roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08, sheen: 1, sheenColor: new THREE.Color("#FFE9EE"), iridescence: 0.35 })
        : new THREE.MeshPhysicalMaterial({
            color: "#FFF2F4",
            transmission: 1,
            thickness: 0.9,
            roughness: 0.1,
            ior: 1.46,
            attenuationColor: new THREE.Color("#E59DAF"),
            attenuationDistance: 1.7,
            iridescence: 0.65,
            iridescenceIOR: 1.3,
            clearcoat: 1,
            clearcoatRoughness: 0.04,
            specularIntensity: 1,
          }),
      satin: new THREE.MeshPhysicalMaterial({ color: "#7B1734", roughness: 0.32, sheen: 1, sheenColor: new THREE.Color("#E58FA6"), sheenRoughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2, side: THREE.DoubleSide }),
      satinBlush: new THREE.MeshPhysicalMaterial({ color: "#E7AEB8", roughness: 0.38, sheen: 1, sheenColor: new THREE.Color("#FFFFFF"), sheenRoughness: 0.35, side: THREE.DoubleSide }),
      pearl: new THREE.MeshPhysicalMaterial({ color: "#FBF4F0", roughness: 0.16, metalness: 0.05, iridescence: 1, iridescenceIOR: 1.6, iridescenceThicknessRange: [180, 620], clearcoat: 1, sheen: 0.6, sheenColor: new THREE.Color("#ffe4ec") }),
      droplet: glass({ color: "#FFF1F3", thickness: 0.35 }),
      bottleGlass: glass({ color: "#FCE9EC", thickness: 0.2 }),
      serum: new THREE.MeshPhysicalMaterial({ color: "#E9A1B1", roughness: 0.1, transmission: compact ? 0 : 0.7, thickness: 0.4, clearcoat: 1, attenuationColor: new THREE.Color("#B8506A"), attenuationDistance: 0.4 }),
      rubber: new THREE.MeshPhysicalMaterial({ color: "#6E1530", roughness: 0.55, clearcoat: 0.2 }),
      marble: new THREE.MeshPhysicalMaterial({ map: marble(), roughness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.2 }),
      petal: new THREE.MeshPhysicalMaterial({ color: "#F1B3C0", roughness: 0.5, sheen: 1, sheenColor: new THREE.Color("#FFE4EA"), sheenRoughness: 0.5, side: THREE.DoubleSide, transmission: compact ? 0 : 0.25, thickness: 0.02 }),
    };
  }, [compact]);
}
type Mats = ReturnType<typeof useMats>;

/* ─────────── Backdrop & halo ─────────── */

function Backdrop() {
  const tex = useMemo(() => blushBackdrop(), []);
  const ring = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(128, 128, 10, 128, 128, 128);
    grd.addColorStop(0, "rgba(255,250,246,1)");
    grd.addColorStop(0.55, "rgba(246,220,222,0.95)");
    grd.addColorStop(1, "rgba(238,205,210,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <group>
      <mesh position={[0, 0, -4]}>
        <planeGeometry args={[16, 12]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {/* Soft moon-like halo behind the profile, with a fine burgundy ring */}
      <mesh position={[0.12, 0.42, -1.2]}>
        <circleGeometry args={[1.45, 96]} />
        <meshBasicMaterial map={ring} transparent toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh position={[0.12, 0.42, -1.18]}>
        <torusGeometry args={[1.16, 0.006, 8, 160]} />
        <meshBasicMaterial color="#9C3A55" toneMapped={false} />
      </mesh>
      <mesh position={[0.12, 0.42, -1.19]} rotation-z={0.6}>
        <torusGeometry args={[1.24, 0.003, 6, 160, Math.PI * 1.2]} />
        <meshBasicMaterial color="#C98D9C" toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ─────────── Sculpture ─────────── */

function Sculpture({ m, animate }: { m: Mats; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const DEPTH = 0.26;

  const bust = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(...FACE_LINE[0]);
    s.splineThru(FACE_LINE.slice(1).map(v2));
    s.lineTo(...BACK_LINE[0]);
    s.splineThru(BACK_LINE.slice(1).map(v2));
    const g = new THREE.ExtrudeGeometry(s, { depth: DEPTH, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.045, bevelSegments: 10, curveSegments: 96 });
    g.translate(0, 0, -DEPTH / 2);
    g.computeVertexNormals();
    return g;
  }, []);

  const strands = useMemo(
    () =>
      [...HAIR_STRANDS, EYE].map((pts, i) => {
        const z = DEPTH / 2 + 0.075;
        const curve = new THREE.CatmullRomCurve3(pts.map(([x, y], k) => v3(x, y, z + (i < 3 ? Math.sin(k) * 0.02 : 0))));
        return new THREE.TubeGeometry(curve, 120, i === 3 ? 0.008 : i === 0 ? 0.016 : 0.011, 10, false);
      }),
    [],
  );

  const leaves = useMemo(
    () =>
      LEAVES.map((l) => {
        const s = new THREE.Shape(leafOutline(l.base, l.tip, l.width).map(v2));
        const g = new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.012, bevelSegments: 4, curveSegments: 24 });
        g.translate(0, 0, -0.015);
        return g;
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const targetY = animate ? Math.sin(t * 0.22) * 0.22 + pointer.x * 0.18 : -0.12;
    const targetX = animate ? pointer.y * -0.06 : 0;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group} position={[0.08, 0.12, 0]} scale={1.04}>
      <mesh geometry={bust} material={m.quartz} castShadow />
      {strands.map((g, i) => (
        <mesh key={i} geometry={g} material={m.satin} />
      ))}
      {leaves.map((g, i) => (
        <mesh key={i} geometry={g} material={i ? m.satinBlush : m.satin} position={[0, 0, 0.32 - i * 0.08]} rotation-y={-0.25 + i * 0.15} />
      ))}
      {/* Marble plinth */}
      <mesh position={[0, -1.13, 0]} material={m.marble} receiveShadow>
        <cylinderGeometry args={[0.98, 1.02, 0.24, 96]} />
      </mesh>
      <mesh position={[0, -1.005, 0]} rotation-x={Math.PI / 2} material={m.satin}>
        <torusGeometry args={[0.985, 0.008, 8, 128]} />
      </mesh>
    </group>
  );
}

/* ─────────── Objects ─────────── */

function SerumBottle({ m }: { m: Mats }) {
  const body = useMemo(
    () =>
      new THREE.LatheGeometry(
        [[0.001, 0], [0.16, 0], [0.19, 0.03], [0.2, 0.32], [0.17, 0.42], [0.08, 0.48], [0.07, 0.56], [0.001, 0.56]].map(([x, y]) => new THREE.Vector2(x, y)),
        48,
      ),
    [],
  );
  const liquid = useMemo(
    () => new THREE.LatheGeometry([[0.001, 0.02], [0.17, 0.02], [0.18, 0.05], [0.18, 0.26], [0.001, 0.26]].map(([x, y]) => new THREE.Vector2(x, y)), 48),
    [],
  );
  return (
    <group>
      <mesh geometry={body} material={m.bottleGlass} />
      <mesh geometry={liquid} material={m.serum} />
      <mesh position={[0, 0.6, 0]} material={m.satin}>
        <cylinderGeometry args={[0.085, 0.085, 0.09, 40]} />
      </mesh>
      <mesh position={[0, 0.74, 0]} scale={[1, 1.5, 1]} material={m.rubber}>
        <sphereGeometry args={[0.075, 32, 20]} />
      </mesh>
    </group>
  );
}

function Droplet({ m }: { m: Mats }) {
  const geo = useMemo(
    () =>
      new THREE.LatheGeometry(
        [[0.001, 0], [0.32, 0.06], [0.5, 0.26], [0.47, 0.5], [0.3, 0.76], [0.1, 0.94], [0.001, 1]].map(([x, y]) => new THREE.Vector2(x * 0.16, y * 0.26)),
        40,
      ),
    [],
  );
  return <mesh geometry={geo} material={m.droplet} />;
}

function Petals({ m, count, animate }: { m: Mats; count: number; animate: boolean }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.16, 0.2, 10, 10);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      const t = (y + 0.1) / 0.2;
      const w = Math.sin(Math.PI * Math.min(1, t * 0.95 + 0.05)) ** 0.7;
      p.setX(i, x * w);
      p.setZ(i, -(x * x) * 6 + Math.sin(t * Math.PI) * 0.02);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  const refs = useRef<THREE.Mesh[]>([]);
  const seeds = useMemo(() => Array.from({ length: count }, (_, i) => ({ x: -1.4 + ((i * 0.618) % 1) * 2.8, z: -0.3 + ((i * 0.37) % 1) * 1.4, phase: i * 1.7, speed: 0.06 + (i % 3) * 0.02 })), [count]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.current.forEach((p, i) => {
      if (!p) return;
      const s = seeds[i];
      const fall = animate ? ((t * s.speed + s.phase * 0.13) % 1) : (i / count);
      p.position.set(s.x + Math.sin(t * 0.6 + s.phase) * 0.15, 1.7 - fall * 3.4, s.z + Math.cos(t * 0.5 + s.phase) * 0.1);
      p.rotation.set(t * 0.4 + s.phase, t * 0.3 + s.phase, Math.sin(t * 0.7 + s.phase) * 0.8);
    });
  });
  return (
    <>
      {seeds.map((_, i) => (
        <mesh key={i} ref={(el) => void (el && (refs.current[i] = el))} geometry={geo} material={m.petal} />
      ))}
    </>
  );
}

function Ribbon({ m, animate }: { m: Mats; animate: boolean }) {
  const N = 180;
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [v3(-2.0, -0.95, 0.6), v3(-0.85, -0.88, 1.0), v3(0.45, -0.72, 0.95), v3(1.4, -0.2, 0.25), v3(1.3, 0.8, -0.75), v3(0.2, 1.5, -1.05), v3(-1.15, 1.15, -0.75), v3(-1.9, 0.35, 0.0)],
        false,
        "centripetal",
      ),
    [],
  );
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array((N + 1) * 2 * 3), 3));
    const idx: number[] = [];
    for (let i = 0; i < N; i++) {
      const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
      idx.push(a, c, b, b, c, d);
    }
    g.setIndex(idx);
    return g;
  }, []);
  const tmp = useMemo(() => ({ p: v3(0, 0, 0), t: v3(0, 0, 0), n: v3(0, 0, 0), b: v3(0, 0, 0), up: v3(0, 1, 0) }), []);
  const frame = useRef(0);
  useFrame(({ clock }) => {
    if (frame.current++ % 2 && animate) return;
    const time = animate ? clock.getElapsedTime() : 0;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      curve.getPointAt(u, tmp.p);
      curve.getTangentAt(u, tmp.t);
      tmp.n.crossVectors(tmp.t, tmp.up).normalize();
      tmp.b.crossVectors(tmp.n, tmp.t).normalize();
      const twist = u * 5 + Math.sin(time * 0.8 + u * 6) * 0.6;
      const dir = tmp.b.clone().multiplyScalar(Math.cos(twist)).add(tmp.n.clone().multiplyScalar(Math.sin(twist)));
      const w = 0.075 * Math.sin(Math.PI * Math.min(1, u * 1.08 + 0.02)) ** 0.4;
      tmp.p.y += Math.sin(time * 1.1 + u * 9) * 0.03;
      pos.setXYZ(i * 2, tmp.p.x + dir.x * w, tmp.p.y + dir.y * w, tmp.p.z + dir.z * w);
      pos.setXYZ(i * 2 + 1, tmp.p.x - dir.x * w, tmp.p.y - dir.y * w, tmp.p.z - dir.z * w);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
  });
  return <mesh geometry={geo} material={m.satin} frustumCulled={false} />;
}

/* ─────────── Scene ─────────── */

function Rig({ animate }: { animate: boolean }) {
  const { camera, pointer } = useThree();
  const look = useMemo(() => v3(0.0, 0.08, 0), []);
  useFrame(() => {
    const tx = animate ? pointer.x * 0.25 : 0;
    const ty = 0.2 + (animate ? pointer.y * 0.15 : 0);
    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (ty - camera.position.y) * 0.04;
    camera.lookAt(look);
  });
  return null;
}

export default function BeautyHeroScene({ compact, animate, active }: { compact: boolean; animate: boolean; active: boolean }) {
  return (
    <Canvas
      dpr={compact ? [1, 1.5] : [1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0.2, compact ? 8.4 : 7.7], fov: 30, near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      aria-hidden
    >
      <Scene compact={compact} animate={animate} />
    </Canvas>
  );
}

function Scene({ compact, animate }: { compact: boolean; animate: boolean }) {
  const m = useMats(compact);
  const F = animate ? 1 : 0;
  return (
    <>
      <Backdrop />
      <hemisphereLight args={["#FFF6F4", "#E9C9CF", 0.7]} />
      <spotLight position={[-3, 4.5, 4]} angle={0.5} penumbra={1} intensity={60} color="#FFF3EC" />
      <pointLight position={[2.6, 1.2, -1.5]} intensity={18} color="#F2A3B5" distance={8} />
      <pointLight position={[0, -1, 3]} intensity={6} color="#FFE9E1" distance={7} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[-3, 3, 3]} scale={[4, 3, 1]} color="#FFF5EE" />
        <Lightformer form="rect" intensity={2} position={[3.5, 1, 1]} rotation-y={-Math.PI / 2.5} scale={[3, 3, 1]} color="#F7C6D2" />
        <Lightformer form="ring" intensity={2.5} position={[0, 2.5, -3]} scale={2} color="#FFFFFF" />
        <Lightformer form="rect" intensity={1} position={[0, -3, 2]} rotation-x={Math.PI / 2} scale={[6, 2, 1]} color="#EED3D3" />
      </Environment>

      <Sculpture m={m} animate={animate} />

      <Float speed={1.4 * F} rotationIntensity={0.5 * F} floatIntensity={0.7 * F}>
        <group position={[-1.12, -0.62, 0.55]} rotation={[0.08, 0.4, -0.12]} scale={0.95}>
          <SerumBottle m={m} />
        </group>
      </Float>

      {[
        [1.05, -0.35, 0.7, 0.13],
        [-0.95, 0.85, 0.35, 0.09],
        [1.15, 0.95, -0.2, 0.07],
        [0.7, -0.9, 0.95, 0.06],
        [-1.35, 0.15, 0.2, 0.05],
        [0.35, 1.45, 0.1, 0.045],
      ].map(([x, y, z, r], i) => (
        <Float key={i} speed={(1 + i * 0.25) * F} floatIntensity={0.8 * F} rotationIntensity={0}>
          <mesh position={[x, y, z]} material={m.pearl}>
            <sphereGeometry args={[r, 48, 32]} />
          </mesh>
        </Float>
      ))}

      {!compact &&
        [
          [0.95, 0.2, 0.85, 0.3],
          [-0.6, 1.25, 0.6, -0.4],
          [1.3, -0.95, 0.2, 0.6],
        ].map(([x, y, z, rot], i) => (
          <Float key={i} speed={(1.2 + i * 0.3) * F} floatIntensity={0.9 * F} rotationIntensity={0.6 * F}>
            <group position={[x, y, z]} rotation={[Math.PI, 0, rot]}>
              <Droplet m={m} />
            </group>
          </Float>
        ))}

      <Ribbon m={m} animate={animate} />
      <Petals m={m} count={compact ? 5 : 11} animate={animate} />
      <Sparkles count={compact ? 18 : 40} scale={[4, 3.4, 2]} size={2.4} speed={animate ? 0.25 : 0} opacity={0.75} color="#FFF4E6" />
      <Rig animate={animate} />
    </>
  );
}
