"use client";

import { motion } from "framer-motion";

/*
  Motion-capture sprint scene — sports-science aesthetic (Catapult / F1 telemetry).
  A mocap skeleton in a sprint stride, trailing "ghost" poses (motion trails),
  a ground force vector, a scanning measurement sweep and a sensor grid.

  ASSET SLOT: to use a real athlete cut-out, drop /public/images/hero-athlete.png
  and render it inside the .athlete wrapper; the overlays below still apply.
*/

// Joint coordinates for a forward-leaning sprint pose (viewBox 0 0 400 400).
const J = {
  head: [232, 92],
  neck: [218, 118],
  shoulder: [212, 124],
  hipC: [180, 196],
  // front (driving) arm
  elbowF: [248, 150],
  handF: [262, 120],
  // back arm
  elbowB: [176, 168],
  handB: [150, 196],
  // front (driving) leg — knee high
  kneeF: [224, 236],
  footF: [262, 224],
  // back leg — extended push-off
  kneeB: [150, 248],
  footB: [108, 300],
} as const;

const BONES: [keyof typeof J, keyof typeof J][] = [
  ["head", "neck"], ["neck", "shoulder"], ["shoulder", "hipC"],
  ["shoulder", "elbowF"], ["elbowF", "handF"],
  ["shoulder", "elbowB"], ["elbowB", "handB"],
  ["hipC", "kneeF"], ["kneeF", "footF"],
  ["hipC", "kneeB"], ["kneeB", "footB"],
];

function Skeleton({ opacity = 1, color = "#ff2d2d", glow = true }: { opacity?: number; color?: string; glow?: boolean }) {
  return (
    <g opacity={opacity} style={glow ? { filter: `drop-shadow(0 0 6px ${color})` } : undefined}>
      {BONES.map(([a, b], i) => (
        <line key={i} x1={J[a][0]} y1={J[a][1]} x2={J[b][0]} y2={J[b][1]} stroke={color} strokeWidth={3} strokeLinecap="round" />
      ))}
      {Object.values(J).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4} fill="#fff" stroke={color} strokeWidth={1.5} />
      ))}
    </g>
  );
}

export default function SprintScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* lab gradient floor + depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_45%,#1a1c22_0%,#08090b_60%,#000_100%)]" />
      <div className="lab-grid absolute inset-x-0 bottom-0 h-2/3 opacity-40 [transform:perspective(700px)_rotateX(62deg)] [mask-image:linear-gradient(to_top,#000,transparent)]" />

      {/* speed lines */}
      <div className="absolute inset-0">
        {[22, 38, 54, 70].map((top, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-red/40 to-transparent"
            style={{ top: `${top}%`, width: "40%" }}
            initial={{ x: "-60%", opacity: 0 }}
            animate={{ x: "260%", opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.6 + i * 0.2, repeat: Infinity, delay: i * 0.4, ease: "easeIn" }}
          />
        ))}
      </div>

      <div className="absolute left-1/2 top-1/2 w-[min(78vw,720px)] -translate-x-1/2 -translate-y-1/2">
        <svg viewBox="0 0 400 400" className="h-auto w-full">
          {/* ground line */}
          <line x1="0" y1="318" x2="400" y2="318" stroke="rgba(255,255,255,0.12)" />

          {/* motion-trail ghosts */}
          <g transform="translate(-46,6)"><Skeleton opacity={0.1} glow={false} /></g>
          <g transform="translate(-28,3)"><Skeleton opacity={0.18} glow={false} /></g>
          <g transform="translate(-13,1)"><Skeleton opacity={0.34} glow={false} /></g>

          {/* live skeleton with subtle drive */}
          <motion.g
            initial={{ x: -6 }}
            animate={{ x: [-6, 6, -6], y: [0, -3, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          >
            <Skeleton />
          </motion.g>

          {/* ground reaction force vector at push-off foot */}
          <motion.g
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          >
            <line x1={108} y1={300} x2={150} y2={250} stroke="#3b82f6" strokeWidth={2.5} markerEnd="url(#arrow)" />
            <text x={150} y={244} fill="#3b82f6" fontSize="11" fontFamily="monospace">842N</text>
          </motion.g>

          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#3b82f6" />
            </marker>
          </defs>
        </svg>

        {/* vertical scanning sweep */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 h-full w-24 animate-sweep bg-gradient-to-r from-transparent via-red/10 to-transparent" />
        </div>
      </div>
    </div>
  );
}
