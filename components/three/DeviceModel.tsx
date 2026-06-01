"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { PRODUCT_HOTSPOTS } from "@/lib/site";

/*
  ASSET SLOT: when a real GLB of the device is supplied, drop it in /public/models
  and replace <ProceduralDevice/> with a <useGLTF> loader + the same <Hotspot> Html
  markers anchored to the model's named parts. The exploded `factor` logic stays.
*/

function Hotspot({ position, title, body }: { position: [number, number, number]; title: string; body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Html position={position} center distanceFactor={8} zIndexRange={[20, 0]}>
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="relative -translate-x-1/2 -translate-y-1/2"
        aria-label={title}
      >
        <span className="block h-3.5 w-3.5 rounded-full bg-cyan shadow-[0_0_14px_4px_rgba(34,211,238,0.7)]" />
        <span className="absolute inset-0 -m-1 animate-ping rounded-full bg-cyan/40" />
        {open && (
          <div className="glass-strong absolute left-5 top-1/2 w-52 -translate-y-1/2 rounded-lg p-3 text-left">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">{title}</p>
            <p className="mt-1 text-xs leading-snug text-white/70">{body}</p>
          </div>
        )}
      </button>
    </Html>
  );
}

function ProceduralDevice({ exploded }: { exploded: number }) {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.18;
  });

  const metal = (color: string, emissive = "#000") => (
    <meshStandardMaterial color={color} metalness={0.85} roughness={0.32} emissive={emissive} emissiveIntensity={0.4} />
  );

  return (
    <group ref={group}>
      {/* Housing */}
      <mesh position={[0, -exploded * 1.2, 0]} castShadow>
        <boxGeometry args={[2.4, 0.9, 1.6]} />
        {metal("#13171d")}
        <Hotspot position={[0, -0.6, 0.9]} {...PRODUCT_HOTSPOTS[2]} />
      </mesh>

      {/* Resistance engine ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.78, 0.16, 24, 64]} />
        {metal("#1c2128", "#0a84ff")}
        <Hotspot position={[0.9, 0, 0]} {...PRODUCT_HOTSPOTS[1]} />
      </mesh>

      {/* Motor core */}
      <mesh position={[0, exploded * 0.9, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.7, 48]} />
        {metal("#22d3ee", "#22d3ee")}
        <Hotspot position={[0, exploded * 0.9 + 0.5, 0]} {...PRODUCT_HOTSPOTS[0]} />
      </mesh>

      {/* AI board */}
      <mesh position={[exploded * 1.6, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.06, 1.4, 1.0]} />
        {metal("#0a84ff", "#0a84ff")}
        <Hotspot position={[exploded * 1.6, 0.95, 0]} {...PRODUCT_HOTSPOTS[3]} />
      </mesh>

      {/* Battery */}
      <mesh position={[0, exploded * 1.7, -0.1]}>
        <boxGeometry args={[1.6, 0.4, 1.0]} />
        {metal("#0a0c10", "#22d3ee")}
        <Hotspot position={[-0.9, exploded * 1.7, 0]} {...PRODUCT_HOTSPOTS[4]} />
      </mesh>
    </group>
  );
}

export default function DeviceModel({ exploded = 0 }: { exploded?: number }) {
  return (
    <Canvas
      camera={{ position: [4, 1.5, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.8]}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.5} />
      <spotLight position={[6, 8, 6]} angle={0.3} intensity={120} color="#22d3ee" />
      <pointLight position={[-6, -2, -4]} intensity={40} color="#0a84ff" />
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.4}>
        <ProceduralDevice exploded={exploded} />
      </Float>
      <Environment preset="night" />
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} />
    </Canvas>
  );
}
