"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

/*
  Engineering exploded view of the T-APEX unit — recognizable proportions:
  armored case with signature X-brace face, control panel + red e-stop,
  internal resistance drum, battery block, wheeled base, and the tow weight-plate.

  Driven by `progress` (0..1) so layers separate on scroll.
  ASSET SLOT: drop /public/images/product.png (transparent) to overlay a real
  photo of the assembled unit on the left while keeping these callouts.
*/

const STEEL = "#2a2e35";
const STEEL_D = "#16181d";
const STEEL_L = "#3a3f47";

export default function ProductExploded({ progress }: { progress: MotionValue<number> }) {
  // separation offsets
  const yTop = useTransform(progress, [0, 1], [0, -70]);
  const yPanel = useTransform(progress, [0, 1], [0, -24]);
  const yDrum = useTransform(progress, [0, 1], [0, 6]);
  const yBattery = useTransform(progress, [0, 1], [0, 64]);
  const xPlate = useTransform(progress, [0, 1], [0, 60]);
  const lineOpacity = useTransform(progress, [0.15, 0.5], [0, 1]);

  return (
    <svg viewBox="0 0 520 560" className="h-full w-full">
      {/* faint measurement frame */}
      <g stroke="rgba(255,255,255,0.08)">
        <line x1="40" y1="40" x2="40" y2="520" />
        <line x1="40" y1="40" x2="60" y2="40" />
        <line x1="40" y1="520" x2="60" y2="520" />
      </g>
      <text x="18" y="285" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="monospace" transform="rotate(-90 18 285)">
        420 mm · 20 kg
      </text>

      {/* TOW WEIGHT PLATE (separates right) */}
      <motion.g style={{ x: xPlate }}>
        <ellipse cx="430" cy="430" rx="58" ry="58" fill={STEEL_D} stroke={STEEL_L} strokeWidth="2" />
        <ellipse cx="430" cy="430" rx="36" ry="36" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
        <circle cx="430" cy="430" r="11" fill="#a50f0c" stroke="#ff2d2d" strokeWidth="2" />
        <line x1="372" y1="430" x2="320" y2="430" stroke={STEEL} strokeWidth="10" strokeLinecap="round" />
      </motion.g>

      {/* WHEELED BASE */}
      <motion.g style={{ y: yBattery }}>
        <rect x="150" y="468" width="220" height="34" rx="8" fill={STEEL_D} stroke={STEEL_L} strokeWidth="1.5" />
        <circle cx="178" cy="510" r="16" fill="#0a0b0e" stroke={STEEL_L} strokeWidth="3" />
        <circle cx="342" cy="510" r="16" fill="#0a0b0e" stroke={STEEL_L} strokeWidth="3" />
      </motion.g>

      {/* INTERNAL RESISTANCE DRUM (motor/engine) */}
      <motion.g style={{ y: yDrum }}>
        <rect x="205" y="250" width="110" height="150" rx="10" fill="url(#drum)" stroke={STEEL_L} strokeWidth="1.5" />
        <ellipse cx="260" cy="250" rx="55" ry="16" fill={STEEL_L} />
        <ellipse cx="260" cy="250" rx="34" ry="9" fill="#a50f0c" />
        {[280, 310, 340, 370].map((y) => (
          <line key={y} x1="215" y1={y} x2="305" y2={y} stroke="rgba(255,255,255,0.07)" />
        ))}
      </motion.g>

      {/* CASE BODY with X-brace face */}
      <motion.g style={{ y: yPanel }}>
        {/* side depth */}
        <path d="M340,150 L380,128 L380,398 L340,420 Z" fill={STEEL_D} stroke={STEEL_L} strokeWidth="1.5" />
        {/* front face */}
        <rect x="150" y="150" width="190" height="270" rx="12" fill="url(#face)" stroke={STEEL_L} strokeWidth="2" />
        {/* X brace */}
        <g stroke="rgba(255,255,255,0.10)" strokeWidth="10" strokeLinecap="round">
          <line x1="172" y1="172" x2="318" y2="398" />
          <line x1="318" y1="172" x2="172" y2="398" />
        </g>
        {/* logo */}
        <text x="168" y="404" fill="#ff2d2d" fontSize="20" fontFamily="monospace" fontWeight="bold">T·APEX</text>
        {/* control strip */}
        <rect x="150" y="150" width="190" height="34" rx="12" fill={STEEL_D} />
        <circle cx="176" cy="167" r="7" fill="#2fd07a" />
        <circle cx="198" cy="167" r="7" fill="#ff2d2d" />
        <circle cx="222" cy="167" r="9" fill={STEEL_L} stroke="#fff" strokeWidth="1" />
        {[244, 254, 264, 274, 284].map((x, i) => (
          <rect key={x} x={x} y="162" width="5" height="10" fill={i < 3 ? "#3b82f6" : "rgba(255,255,255,0.2)"} />
        ))}
      </motion.g>

      {/* TOP CAP + handle + red spool button */}
      <motion.g style={{ y: yTop }}>
        <rect x="158" y="118" width="174" height="30" rx="10" fill={STEEL} stroke={STEEL_L} strokeWidth="1.5" />
        <rect x="214" y="104" width="62" height="12" rx="6" fill={STEEL_D} stroke={STEEL_L} strokeWidth="1.5" />
        <circle cx="300" cy="118" r="12" fill="#a50f0c" stroke="#ff2d2d" strokeWidth="2.5" />
      </motion.g>

      {/* connection / callout leaders */}
      <motion.g style={{ opacity: lineOpacity }} stroke="#ff2d2d" strokeWidth="1" strokeDasharray="3 3">
        <line x1="300" y1="48" x2="300" y2="92" />
        <line x1="245" y1="167" x2="430" y2="120" />
        <line x1="260" y1="320" x2="120" y2="300" />
        <line x1="430" y1="430" x2="430" y2="380" />
        <line x1="260" y1="485" x2="120" y2="500" />
      </motion.g>
      <motion.g style={{ opacity: lineOpacity }} fill="#ff2d2d" fontSize="10" fontFamily="monospace">
        <text x="270" y="44">04 · SPOOL HUB</text>
        <text x="436" y="118">01 · MOTOR / CONTROL</text>
        <text x="44" y="298">02 · RESISTANCE DRUM</text>
        <text x="402" y="372">TOW PLATE</text>
        <text x="44" y="504">05 · BATTERY / BASE</text>
      </motion.g>

      <defs>
        <linearGradient id="face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={STEEL_L} />
          <stop offset="100%" stopColor={STEEL_D} />
        </linearGradient>
        <linearGradient id="drum" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={STEEL} />
          <stop offset="50%" stopColor={STEEL_L} />
          <stop offset="100%" stopColor={STEEL_D} />
        </linearGradient>
      </defs>
    </svg>
  );
}
