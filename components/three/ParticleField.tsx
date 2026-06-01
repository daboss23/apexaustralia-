"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* Drifting particle volume + light trails. Reacts to pointer for depth. */
function Particles({ count = 1800 }: { count?: number }) {
  const points = useRef<THREE.Points>(null!);
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
      speeds[i] = 0.6 + Math.random() * 1.8;
    }
    return { positions, speeds };
  }, [count]);

  const pointer = useRef({ x: 0, y: 0 });
  useThree(({ gl }) => gl.setClearColor(0x000000, 0));

  useFrame((state, delta) => {
    const p = points.current;
    if (!p) return;
    const arr = p.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += delta * speeds[i] * 0.6;
      if (arr[i * 3] > 12) arr[i * 3] = -12;
    }
    p.geometry.attributes.position.needsUpdate = true;

    // pointer parallax
    pointer.current.x += (state.pointer.x - pointer.current.x) * 0.04;
    pointer.current.y += (state.pointer.y - pointer.current.y) * 0.04;
    p.rotation.y = pointer.current.x * 0.25;
    p.rotation.x = -pointer.current.y * 0.18;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={"#22d3ee"}
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* Horizontal light streaks evoking motion / sprint trails. */
function Trails() {
  const group = useRef<THREE.Group>(null!);
  const lines = useMemo(
    () =>
      Array.from({ length: 9 }).map(() => ({
        y: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 6,
        speed: 2 + Math.random() * 3,
        len: 2 + Math.random() * 4,
        x: (Math.random() - 0.5) * 20,
      })),
    []
  );
  useFrame((_, delta) => {
    group.current?.children.forEach((c, i) => {
      c.position.x += delta * lines[i].speed;
      if (c.position.x > 12) c.position.x = -12;
    });
  });
  return (
    <group ref={group}>
      {lines.map((l, i) => (
        <mesh key={i} position={[l.x, l.y, l.z]}>
          <boxGeometry args={[l.len, 0.012, 0.012]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#0a84ff" : "#22d3ee"} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export default function ParticleField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.8]}
      style={{ position: "absolute", inset: 0 }}
    >
      <fog attach="fog" args={["#000000", 8, 22]} />
      <Particles />
      <Trails />
    </Canvas>
  );
}
