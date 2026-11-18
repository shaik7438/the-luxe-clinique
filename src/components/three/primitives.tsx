"use client";

import { useMemo, type ReactNode } from "react";
import * as THREE from "three";
import type { ThreeElements } from "@react-three/fiber";

type Vec = [number, number, number];

const UP = new THREE.Vector3(0, 1, 0);

/** A capsule stretched between two points — used for limbs, cables and fibres. */
export function Limb({
  from,
  to,
  radius,
  children,
  castShadow = true,
}: {
  from: Vec;
  to: Vec;
  radius: number;
  children: ReactNode;
  castShadow?: boolean;
}) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    const length = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize());
    return { position: a.add(b).multiplyScalar(0.5), quaternion: q, length };
  }, [from, to]);
  return (
    <mesh position={position} quaternion={quaternion} castShadow={castShadow} receiveShadow>
      <capsuleGeometry args={[radius, Math.max(0.001, length), 6, 16]} />
      {children}
    </mesh>
  );
}

/** Smooth tube through a list of points. */
export function Tube({
  points,
  radius,
  segments = 64,
  children,
  castShadow = false,
  ...rest
}: {
  points: Vec[];
  radius: number;
  segments?: number;
  children: ReactNode;
  castShadow?: boolean;
} & Omit<ThreeElements["mesh"], "children">) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return new THREE.TubeGeometry(curve, segments, radius, 10, false);
  }, [points, radius, segments]);
  return (
    <mesh geometry={geometry} castShadow={castShadow} {...rest}>
      {children}
    </mesh>
  );
}

/** Deterministic pseudo-random generator so procedural details are stable between renders. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
