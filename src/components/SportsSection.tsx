'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const SPORTS = [
  {
    id: 'afl',
    name: 'AFL',
    tagline: 'Explosive Game-Breaking Athleticism',
    description: 'T-APEX trains the explosive qualities that win contested possessions, break lines, and cover ground faster than opponents.',
    color: '#e0231f',
    metrics: [
      { label: 'Sprint Speed', value: '+23%', sub: 'Over 20m sprints' },
      { label: 'Contested Marks', value: '+19%', sub: 'Vertical leap power' },
      { label: 'Repeat Sprint Ability', value: '+31%', sub: 'Over 4 quarters' },
      { label: 'Contest Strength', value: '+27%', sub: 'Tackle & marking force' },
    ],
    live: [
      { label: 'TOP SPEED', value: '10.42 m/s' },
      { label: 'PEAK POWER', value: '9.11 kW' },
      { label: 'ACCEL', value: '3.21 m/s²' },
      { label: 'FORCE', value: '5.42 kN' },
    ],
  },
  {
    id: 'nrl',
    name: 'NRL',
    tagline: 'Dominance From Every Position',
    description: 'Professional rugby league demands explosive power in every collision. T-APEX builds the force, speed, and conditioning to dominate.',
    color: '#e0231f',
    metrics: [
      { label: 'Tackle Impact Force', value: '+28%', sub: 'Ground-level collisions' },
      { label: 'Line Speed', value: '+22%', sub: 'Defensive line speed' },
      { label: 'Post-Contact Metres', value: '+35%', sub: 'Carry strength' },
      { label: 'Conditioning Output', value: '+18%', sub: '80-minute output' },
    ],
    live: [
      { label: 'TOP SPEED', value: '10.18 m/s' },
      { label: 'PEAK POWER', value: '11.2 kW' },
      { label: 'ACCEL', value: '4.05 m/s²' },
      { label: 'FORCE', value: '7.1 kN' },
    ],
  },
  {
    id: 'rugby',
    name: 'Rugby Union',
    tagline: 'Set Piece to Open Field Dominance',
    description: 'From scrum power to backline speed, T-APEX delivers the technical resistance training that builds elite Test-level athletes.',
    color: '#e0231f',
    metrics: [
      { label: 'Scrum Force', value: '+34%', sub: 'Set-piece power' },
      { label: 'Lineout Jump', value: '+21%', sub: 'Explosive elevation' },
      { label: 'Open Field Speed', value: '+17%', sub: 'Backline velocity' },
      { label: 'Work Rate', value: '+26%', sub: 'Sustained intensity' },
    ],
    live: [
      { label: 'TOP SPEED', value: '9.84 m/s' },
      { label: 'PEAK POWER', value: '12.8 kW' },
      { label: 'ACCEL', value: '3.78 m/s²' },
      { label: 'FORCE', value: '8.4 kN' },
    ],
  },
  {
    id: 'football',
    name: 'Football',
    tagline: 'Speed, Agility, Explosive Separation',
    description: 'Elite footballers are defined by their ability to create and close space. T-APEX trains the neuromuscular patterns that make the difference.',
    color: '#00A3FF',
    metrics: [
      { label: 'First Step Quickness', value: '+25%', sub: 'Separation speed' },
      { label: 'Directional Change', value: '+29%', sub: 'Agility metrics' },
      { label: 'Sprint Duration', value: '+22%', sub: 'High-speed running' },
      { label: 'Recovery Speed', value: '+19%', sub: 'Return sprint ability' },
    ],
    live: [
      { label: 'TOP SPEED', value: '11.2 m/s' },
      { label: 'PEAK POWER', value: '8.6 kW' },
      { label: 'ACCEL', value: '4.42 m/s²' },
      { label: 'FORCE', value: '4.8 kN' },
    ],
  },
  {
    id: 'basketball',
    name: 'Basketball',
    tagline: 'Vertical Power. Court Speed. Elite Reads.',
    description: 'Basketball performance is won in explosive moments. T-APEX trains the precise neuromuscular qualities that separate elite from ordinary.',
    color: '#00A3FF',
    metrics: [
      { label: 'Vertical Leap', value: '+25%', sub: 'Jump height & power' },
      { label: 'Lateral Quickness', value: '+31%', sub: 'Defensive position' },
      { label: 'First Step', value: '+27%', sub: 'Drive initiation speed' },
      { label: 'In-Air Strength', value: '+18%', sub: 'Contact stability' },
    ],
    live: [
      { label: 'TOP SPEED', value: '9.3 m/s' },
      { label: 'PEAK POWER', value: '7.4 kW' },
      { label: 'ACCEL', value: '5.1 m/s²' },
      { label: 'FORCE', value: '3.9 kN' },
    ],
  },
  {
    id: 'athletics',
    name: 'Athletics',
    tagline: 'Hundredths of a Second. World Records.',
    description: 'Track and field demands absolute precision. T-APEX delivers the marginal gains that separate Olympic finalists from champions.',
    color: '#e0231f',
    metrics: [
      { label: 'Block Clearance', value: '+18%', sub: 'First 10m output' },
      { label: 'Max Velocity', value: '+12%', sub: 'Top-end speed' },
      { label: 'Stride Power', value: '+24%', sub: 'Per-stride force' },
      { label: 'Sprint Efficiency', value: '+21%', sub: 'Energy output' },
    ],
    live: [
      { label: 'TOP SPEED', value: '12.8 m/s' },
      { label: 'PEAK POWER', value: '5.8 kW' },
      { label: 'ACCEL', value: '6.2 m/s²' },
      { label: 'FORCE', value: '3.1 kN' },
    ],
  },
  {
    id: 'olympic',
    name: 'Olympic Programs',
    tagline: 'The Margin Between Gold and Silver',
    description: 'Olympic performance exists at the edge of human capability. T-APEX is trusted by national programs targeting podium performance.',
    color: '#e0231f',
    metrics: [
      { label: 'Peak Power Output', value: '+17%', sub: 'Competition day' },
      { label: 'Force-Velocity', value: '+23%', sub: 'Curve optimisation' },
      { label: 'Recovery Rate', value: '+28%', sub: 'Inter-session speed' },
      { label: 'Technical Precision', value: '+19%', sub: 'Movement quality' },
    ],
    live: [
      { label: 'TOP SPEED', value: '13.1 m/s' },
      { label: 'PEAK POWER', value: '6.4 kW' },
      { label: 'ACCEL', value: '7.0 m/s²' },
      { label: 'FORCE', value: '2.8 kN' },
    ],
  },
  {
    id: 'sc',
    name: 'Strength & Conditioning',
    tagline: 'Scientific Programming. Measurable Outcomes.',
    description: 'T-APEX gives S&C professionals real-time data to program with precision — tracking every variable that drives athletic development.',
    color: '#7B2FBE',
    metrics: [
      { label: 'Training Volume', value: '+38%', sub: 'With equal recovery' },
      { label: 'Load Tolerance', value: '+32%', sub: 'Progressive overload' },
      { label: 'Power-to-Weight', value: '+26%', sub: 'Functional output' },
      { label: 'Program Accuracy', value: '+44%', sub: 'vs conventional' },
    ],
    live: [
      { label: 'AVG POWER', value: '4.8 kW' },
      { label: 'PEAK FORCE', value: '1.2 kN' },
      { label: 'WORK DONE', value: '8.4 kJ' },
      { label: 'EFFICIENCY', value: '94%' },
    ],
  },
]

export default function SportsSection() {
  const [activeSport, setActiveSport] = useState('afl')
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-15% 0px' })

  const sport = SPORTS.find(s => s.id === activeSport) ?? SPORTS[0]

  return (
    <section id="sports" className="relative bg-apex-black-2 py-24 md:py-36 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `radial-gradient(circle at 50% 80%, rgba(224,35,31,0.06) 0%, transparent 55%)`
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Section label */}
        <div ref={titleRef} className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-apex-red" />
          <span className="text-apex-red font-mono text-[10px] tracking-[0.3em] uppercase font-medium">
            05 — Sports Applications
          </span>
        </div>

        <motion.h2
          className="font-display font-black text-apex-white leading-[0.88] mb-4"
          style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          BUILT FOR<br /><span className="text-apex-red">EVERY CODE</span>
        </motion.h2>

        <motion.p
          className="text-apex-grey font-body mb-12 max-w-xl leading-relaxed"
          style={{ fontSize: 'clamp(0.88rem, 1.2vw, 1rem)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Select your sport. See exactly how T-APEX transforms performance outcomes across every metric that matters.
        </motion.p>

        {/* Sport selector tabs */}
        <motion.div
          className="flex flex-wrap gap-2 mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {SPORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSport(s.id)}
              className={`relative text-[11px] font-display font-bold tracking-[0.12em] uppercase px-4 py-2 rounded-lg border transition-all duration-300 cursor-pointer ${
                activeSport === s.id
                  ? 'text-white border-transparent'
                  : 'text-apex-grey border-apex-line hover:border-apex-grey/40 hover:text-apex-white'
              }`}
              style={activeSport === s.id ? { background: s.color, borderColor: s.color } : {}}
            >
              {s.name}
              {activeSport === s.id && (
                <motion.div
                  layoutId="sport-indicator"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: s.color }}
                  initial={false}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <span className="relative z-10">{s.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Sport content panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSport}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Left: Sport info */}
            <div className="bg-apex-panel border border-apex-line rounded-2xl p-8 flex flex-col">
              <div className="mb-2">
                <span
                  className="inline-block text-[10px] font-mono font-semibold tracking-[0.2em] uppercase px-2.5 py-1 rounded border"
                  style={{ color: sport.color, borderColor: `${sport.color}40`, background: `${sport.color}12` }}
                >
                  {sport.name}
                </span>
              </div>

              <h3
                className="font-display font-black text-apex-white mt-4 mb-3 leading-tight"
                style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
              >
                {sport.tagline}
              </h3>

              <p className="text-apex-grey font-body text-sm leading-relaxed mb-8 flex-1">
                {sport.description}
              </p>

              {/* Performance improvement bars */}
              <div className="flex flex-col gap-3">
                {sport.metrics.map(({ label, value, sub }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-display font-bold text-apex-white tracking-wide">{label}</span>
                      <span className="text-[11px] font-mono font-semibold" style={{ color: sport.color }}>{value}</span>
                    </div>
                    <div className="text-[10px] text-apex-grey-dim font-body">{sub}</div>
                    <div className="mt-1.5 h-px bg-apex-line">
                      <motion.div
                        className="h-full"
                        style={{ background: sport.color }}
                        initial={{ width: 0 }}
                        animate={{ width: value }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Live metrics display */}
            <div className="flex flex-col gap-4">
              {/* HUD-style metric panels */}
              <div className="grid grid-cols-2 gap-4">
                {sport.live.map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-apex-panel border border-apex-line rounded-xl p-5 relative overflow-hidden group hover:border-opacity-60 transition-colors duration-300"
                    style={{ '--hover-color': sport.color } as React.CSSProperties}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(ellipse at bottom, ${sport.color}08, transparent 70%)` }}
                    />
                    <div
                      className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full"
                      style={{ background: sport.color }}
                    />
                    <div className="pl-3">
                      <div className="text-[9px] font-mono tracking-[0.2em] uppercase text-apex-grey-dim mb-2">
                        {label}
                      </div>
                      <div className="font-mono font-semibold text-apex-white leading-none metric-value"
                        style={{ fontSize: 'clamp(1.4rem, 2vw, 1.8rem)' }}>
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Session outcome card */}
              <div
                className="flex-1 rounded-2xl p-8 flex flex-col justify-end relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, #0f0f12 0%, #141418 60%, ${sport.color}15 100%)`, border: `1px solid ${sport.color}30` }}
              >
                <div
                  className="absolute top-0 right-0 w-48 h-48 opacity-10 rounded-full"
                  style={{ background: sport.color, filter: 'blur(60px)' }}
                />
                <div className="relative">
                  <div className="text-[9px] font-mono tracking-[0.25em] uppercase mb-3" style={{ color: sport.color }}>
                    Training Outcome
                  </div>
                  <div
                    className="font-display font-black text-apex-white leading-tight mb-4"
                    style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)' }}
                  >
                    Elite Performance<br />Unlocked.
                  </div>
                  <button
                    className="inline-flex items-center gap-2 text-[11px] font-display font-bold tracking-[0.12em] uppercase px-5 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                    style={{ color: sport.color, borderColor: `${sport.color}50` }}
                  >
                    Download Program
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
