'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ElectricAura from './ElectricAura'

// ─── Hero scene — the full hero artwork, brought alive ────────────────────────
// Renders the supplied hero artwork (/hero-scene.png, 3:2) as a fixed-aspect
// stage on lg+ screens. Because every overlay is positioned in % of the stage,
// alignment with the baked-in artwork holds at any viewport width. All
// coordinates below are measured against the 1536×1023 original.
//
// Layers of life on top of the still image:
//   • slow Ken Burns push on the whole scene
//   • right-to-left speed streaks (background light passing the athlete)
//   • an energy pulse travelling up the tow cable, machine → harness
//   • the baked HUD card: pulsing LIVE dot, a glint tracing the force graph,
//     and a breathing border glow
//   • electric aura + light sheen over the baked headline
//   • pulsing LIVE dot + flickering bolt icon in the baked stat bar
//
// When an AI-generated video of this artwork exists, swap the <img> for a
// <video> with the same src framing — every overlay stays valid.

const SCENE = '/hero-scene.png'

function Pulse({ x, y, color, size = 8, dur = 2 }: { x: number; y: number; color: string; size?: number; dur?: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        background: color,
        boxShadow: `0 0 ${size * 1.5}px ${size / 3}px ${color}`,
      }}
      animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.15, 0.8] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
    />
  )
}

export default function HeroScene() {
  const stageRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const sceneY = useTransform(scrollY, [0, 700], [0, -45])

  return (
    <div ref={stageRef} className="relative w-full overflow-hidden bg-apex-black" style={{ aspectRatio: '1536 / 1023' }}>
      {/* The artwork, with a slow cinematic push */}
      <motion.div className="absolute inset-0" style={{ y: sceneY, willChange: 'transform' }}>
        <motion.img
          src={SCENE}
          alt="T-Apex athlete training with adaptive resistance"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transformOrigin: '58% 40%', willChange: 'transform' }}
          animate={{ scale: [1, 1.045] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />

        {/* Speed streaks — background light passing the sprinting athlete */}
        <div
          className="absolute h-[2px] w-[34vw] top-[27%]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.45), transparent)',
            animation: 'energy-streak-rtl 8s linear infinite',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute h-[3px] w-[42vw] top-[44%]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(214,31,38,0.4), transparent)',
            animation: 'energy-streak-rtl 11s linear infinite',
            animationDelay: '2.8s',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute h-px w-[28vw] top-[60%]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,59,48,0.35), transparent)',
            animation: 'energy-streak-rtl 9s linear infinite',
            animationDelay: '5.5s',
          }}
          aria-hidden="true"
        />

        {/* Energy pulse travelling up the tow cable: machine → harness */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 7,
            height: 7,
            marginLeft: -3.5,
            marginTop: -3.5,
            background: '#ffd9d6',
            boxShadow: '0 0 10px 3px rgba(255,59,48,0.85), 0 0 26px 8px rgba(214,31,38,0.4)',
          }}
          animate={{
            left: ['31.5%', '60.8%'],
            top: ['66%', '37.5%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.6, ease: 'easeIn', times: [0, 0.15, 0.85, 1] }}
          aria-hidden="true"
        />

        {/* ── Baked HUD card, brought alive ── */}
        {/* Breathing border glow around the card */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: '75.2%',
            top: '50.3%',
            width: '22.8%',
            height: '28.4%',
            boxShadow: 'inset 0 0 24px rgba(0,174,239,0.12), 0 0 30px rgba(0,174,239,0.10)',
            animation: 'energy-breathe 5s ease-in-out infinite',
          }}
          aria-hidden="true"
        />
        {/* LIVE DATA dot */}
        <Pulse x={81.5} y={53.7} color="#00AEEF" size={7} dur={1.8} />
        {/* Glint tracing the force graph */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 5,
            height: 5,
            marginLeft: -2.5,
            marginTop: -2.5,
            background: '#ff8d86',
            boxShadow: '0 0 8px 2px rgba(255,59,48,0.9)',
          }}
          animate={{
            left: ['77.2%', '97.3%'],
            top: ['67.4%', '66.2%', '67.0%', '65.6%', '66.6%', '64.8%', '65.9%', '64.2%'],
            opacity: [0, 1, 1, 1, 1, 1, 1, 0],
          }}
          transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 0.4, ease: 'linear' }}
          aria-hidden="true"
        />

        {/* ── Baked stat bar, brought alive ── */}
        {/* LIVE system dot */}
        <Pulse x={81.2} y={90.1} color="#00AEEF" size={8} dur={2} />
        {/* Bolt icon energy flicker */}
        <Pulse x={5.4} y={90.0} color="rgba(214,31,38,0.55)" size={26} dur={3.2} />

        {/* ── Baked headline, brought alive ── */}
        {/* Light sheen sweeping across the metallic letters */}
        <div className="absolute overflow-hidden pointer-events-none" style={{ left: '2.5%', top: '13.5%', width: '50%', height: '27%' }} aria-hidden="true">
          <div
            className="absolute inset-y-0 w-[18%]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)',
              mixBlendMode: 'overlay',
              animation: 'sheen-sweep 7s ease-in-out infinite',
            }}
          />
        </div>
        {/* Electric aura living around the headline */}
        <div className="absolute" style={{ left: '2.5%', top: '13%', width: '50%', height: '28%' }} aria-hidden="true">
          <ElectricAura appearDelay={1.2} />
        </div>
      </motion.div>

      {/* CTA hotspots over the baked buttons */}
      <a
        href="#solution"
        aria-label="Explore technology"
        className="absolute block cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_30px_4px_rgba(214,31,38,0.45)]"
        style={{ left: '3.4%', top: '52.6%', width: '15.8%', height: '5.4%' }}
      />
      <a
        href="#product"
        aria-label="View system"
        className="absolute block cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_30px_4px_rgba(0,174,239,0.4)]"
        style={{ left: '20.6%', top: '52.6%', width: '11.6%', height: '5.4%' }}
      />

      {/* Seating: vignette under the navbar, fade into the next section */}
      <div
        className="absolute top-0 inset-x-0 h-[14%] pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(5,5,5,0.85), transparent)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 inset-x-0 h-[6%] pointer-events-none"
        style={{ background: 'linear-gradient(0deg, #050505, transparent)' }}
        aria-hidden="true"
      />

      {/* Top performance line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #D61F26 18%, #D61F26 82%, transparent 100%)' }}
        aria-hidden="true"
      />
    </div>
  )
}
