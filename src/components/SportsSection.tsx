'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import SportTransitionStage from './SportTransitionStage'

const SPORTS = [
  {
    id: 'sprinting',
    name: 'Sprinting',
    tagline: 'Hundredths Of A Second',
    description: 'Track and field is decided by the smallest of margins. T-Apex supports the marginal gains that matter most at the highest level of competition.',
    color: '#D61F26',
    video: '/sports/sprinting.mp4',
    // Clip is a neon athlete on a near-black background — blend it into the
    // scene (drop the dark background) rather than boxing it in.
    videoBlend: true,
    focuses: [
      'Block clearance and early acceleration',
      'Maximum velocity development',
      'Stride power and force application',
      'Sprint efficiency and mechanics',
    ],
    applications: ['Acceleration', 'Max Velocity', 'Force', 'Mechanics'],
  },
  {
    id: 'swimming',
    name: 'Swimming',
    tagline: 'Power Off Every Wall',
    description: 'Swimming rewards explosive starts, fast turns and sustained propulsive force. T-Apex supports the dry-land power and force application that translate straight into the water.',
    color: '#00AEEF',
    video: '/sports/swimming.mp4',
    focuses: [
      'Start and push-off power',
      'Propulsive force development',
      'Turn and wall-drive explosiveness',
      'Stroke-specific strength',
    ],
    applications: ['Power', 'Force', 'Wall Drive', 'Strength'],
  },
  {
    id: 'afl',
    name: 'AFL',
    tagline: 'Explosive, Game-Breaking Athleticism',
    description: 'T-Apex supports the explosive qualities that win contested possessions, break lines, and cover ground — trained with more control and clearer feedback.',
    color: '#D61F26',
    video: '/sports/afl.mp4',
    focuses: [
      'Acceleration and repeat-sprint capacity',
      'Contest and aerial power development',
      'Change of direction under fatigue',
      'Movement efficiency across four quarters',
    ],
    applications: ['Speed', 'Repeat Effort', 'Change of Direction', 'Power'],
  },
  {
    id: 'skiing',
    name: 'Skiing',
    tagline: 'Control At Race Speed',
    description: 'Snow sports demand explosive power, control and resilience under high load. T-Apex helps build the strength and movement qualities that hold up edge-to-edge at race speed.',
    color: '#00AEEF',
    video: '/sports/skiing.mp4',
    focuses: [
      'Explosive leg drive out of the gate',
      'Eccentric load tolerance',
      'Edge-to-edge control and stability',
      'Sustained lower-body power',
    ],
    applications: ['Power', 'Control', 'Load Tolerance', 'Stability'],
  },
  {
    id: 'rugby-league',
    name: 'Rugby League',
    tagline: 'Power From Every Position',
    description: 'Rugby league demands explosive power in every collision. T-Apex helps develop the force, speed, and conditioning to compete for the full 80 minutes.',
    color: '#D61F26',
    video: '/sports/rugby-league.mp4',
    focuses: [
      'Collision and contact force development',
      'Defensive line-speed and acceleration',
      'Carry strength and post-contact drive',
      'Sustained conditioning output',
    ],
    applications: ['Force', 'Acceleration', 'Strength', 'Conditioning'],
  },
  {
    id: 'soccer',
    name: 'Soccer',
    tagline: 'Speed, Agility, Explosive Separation',
    description: 'Elite footballers are defined by their ability to create and close space. T-Apex helps train the movement qualities that make the difference.',
    color: '#00AEEF',
    video: '/sports/soccer.mp4',
    focuses: [
      'First-step quickness and separation',
      'Multi-directional acceleration',
      'High-speed running capacity',
      'Return-sprint and recovery speed',
    ],
    applications: ['Acceleration', 'Agility', 'Speed', 'Recovery'],
  },
  {
    id: 'basketball',
    name: 'Basketball',
    tagline: 'Vertical Power. Court Speed.',
    description: 'Basketball performance is won in explosive moments. T-Apex helps train the precise movement qualities that separate elite from ordinary.',
    color: '#00AEEF',
    video: '/sports/basketball.mp4',
    focuses: [
      'Vertical and take-off power',
      'Lateral quickness and defensive movement',
      'First-step drive initiation',
      'In-air control and stability',
    ],
    applications: ['Power', 'Lateral Speed', 'First Step', 'Control'],
  },
]

export default function SportsSection() {
  const [activeSport, setActiveSport] = useState('sprinting')
  const [userPicked, setUserPicked] = useState(false)
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-15% 0px' })

  const sport = SPORTS.find(s => s.id === activeSport) ?? SPORTS[0]

  // Auto-cycle through codes to showcase breadth — until the visitor takes over.
  useEffect(() => {
    if (userPicked) return
    const ids = SPORTS.map(s => s.id)
    const iv = setInterval(() => {
      setActiveSport(prev => ids[(ids.indexOf(prev) + 1) % ids.length])
    }, 3400)
    return () => clearInterval(iv)
  }, [userPicked])

  // Manual pick pauses the auto-cycle, which resumes after a spell of no
  // interaction so the stage is always "moving across the codes" on its own.
  const pickSport = (id: string) => {
    setUserPicked(true)
    setActiveSport(id)
    if (resumeRef.current) clearTimeout(resumeRef.current)
    resumeRef.current = setTimeout(() => setUserPicked(false), 8000)
  }

  return (
    <section id="sports" className="relative bg-apex-black-2 py-24 md:py-36 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `radial-gradient(circle at 50% 80%, rgba(214,31,38,0.06) 0%, transparent 55%)`
        }} />
      </div>

      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(214,31,38,0.25) 30%, rgba(214,31,38,0.25) 70%, transparent)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <motion.h2
          ref={titleRef}
          className="h-luxia t-silver leading-[0.88] mb-6"
          style={{ fontSize: 'clamp(2rem, 5.2vw, 4.3rem)' }}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          BUILT FOR<br /><span className="t-red">EVERY CODE</span>
        </motion.h2>

        {/* Intro copy */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-8 lg:gap-16 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p className="text-apex-grey font-body mb-5 leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}>
              T-Apex was never built for one narrow use case. It suits demanding programs that need
              a more adaptable way to train speed, force, control, and athlete progress across
              multiple sporting demands.
            </p>
            <p className="text-apex-grey font-body leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)' }}>
              Whether the goal is acceleration, repeat effort, change of direction, return-to-play,
              or movement efficiency, T-Apex gives coaches a more responsive tool that
              can translate across different athletes, codes, and phases of development.
            </p>
          </motion.div>

          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="border-l-2 border-apex-red pl-6">
              <p className="font-display font-black text-apex-white leading-tight"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}>
                One system. Broader application.{' '}
                <span className="text-apex-red">Smarter coaching potential.</span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Multi-sport transition stage — "one system, every code" */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.32 }}
        >
          <SportTransitionStage sports={SPORTS} sport={sport} activeId={activeSport} />
        </motion.div>

        <motion.p
          className="text-apex-grey-dim font-body mb-8 text-sm"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Select a code to lock the view — or watch how T-Apex translates across every one.
        </motion.p>

        {/* Sport selector tabs */}
        <motion.div
          className="flex flex-wrap gap-2 mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          {SPORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => pickSport(s.id)}
              className={`relative text-[11px] font-display font-bold tracking-[0.12em] uppercase px-4 py-2 border transition-all duration-300 cursor-pointer ${
                activeSport === s.id
                  ? 'text-white border-transparent'
                  : 'text-apex-grey border-apex-line hover:border-apex-grey/40 hover:text-apex-white'
              }`}
              style={{ borderRadius: 0, ...(activeSport === s.id ? { background: s.color, borderColor: s.color } : {}) }}
            >
              {activeSport === s.id && (
                <motion.div
                  layoutId="sport-indicator"
                  className="absolute inset-0"
                  style={{ background: s.color, borderRadius: 0 }}
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
            <div className="bg-apex-panel border border-apex-line p-8 flex flex-col" style={{ borderRadius: 0 }}>
              <div className="mb-2">
                <span
                  className="inline-block text-[10px] font-mono font-semibold tracking-[0.2em] uppercase px-2.5 py-1 border"
                  style={{ color: sport.color, borderColor: `${sport.color}40`, background: `${sport.color}12` }}
                >
                  {sport.name}
                </span>
              </div>

              <h3
                className="font-display font-black t-feature mt-4 mb-3 leading-tight"
                style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
              >
                {sport.tagline}
              </h3>

              <p className="text-apex-grey font-body text-sm leading-relaxed mb-8 flex-1">
                {sport.description}
              </p>

              {/* Training focuses — qualitative */}
              <div className="text-[9px] font-mono tracking-[0.22em] uppercase mb-4" style={{ color: sport.color }}>
                Where T-Apex Applies
              </div>
              <div className="flex flex-col gap-3">
                {sport.focuses.map((focus) => (
                  <div key={focus} className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-4 h-4 mt-0.5 border flex items-center justify-center"
                      style={{ borderColor: `${sport.color}50`, background: `${sport.color}12` }}
                    >
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke={sport.color}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span className="text-apex-grey font-body text-[13px] leading-snug">{focus}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: applications + outcome */}
            <div className="flex flex-col gap-4">
              {/* Application areas grid */}
              <div className="grid grid-cols-2 gap-4">
                {sport.applications.map((app) => (
                  <div
                    key={app}
                    className="bg-apex-panel border border-apex-line p-5 relative overflow-hidden group hover:border-opacity-60 transition-colors duration-300"
                    style={{ borderRadius: 0 }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(ellipse at bottom, ${sport.color}08, transparent 70%)` }}
                    />
                    <div
                      className="absolute left-0 top-3 bottom-3 w-[2px]"
                      style={{ background: sport.color }}
                    />
                    <div className="pl-3">
                      <div className="text-[9px] font-mono tracking-[0.2em] uppercase text-apex-grey-dim mb-2">
                        Application
                      </div>
                      <div className="font-display font-black t-feature leading-tight"
                        style={{ fontSize: 'clamp(1.1rem, 1.7vw, 1.4rem)' }}>
                        {app}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Outcome card */}
              <div
                className="flex-1 p-8 flex flex-col justify-end relative overflow-hidden"
                style={{ borderRadius: 0, background: `linear-gradient(135deg, #0A0D10 0%, #141418 60%, ${sport.color}15 100%)`, border: `1px solid ${sport.color}30` }}
              >
                <div
                  className="absolute top-0 right-0 w-48 h-48 opacity-10 rounded-full"
                  style={{ background: sport.color, filter: 'blur(60px)' }}
                />
                <div className="relative">
                  <div className="text-[9px] font-mono tracking-[0.25em] uppercase mb-3" style={{ color: sport.color }}>
                    Coaching Potential
                  </div>
                  <div
                    className="font-display font-black t-feature leading-tight mb-4"
                    style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)' }}
                  >
                    More precise.<br />More adaptable.
                  </div>
                  <button
                    className="inline-flex items-center gap-2 text-[11px] font-display font-bold tracking-[0.12em] uppercase px-5 py-2.5 border transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                    style={{ borderRadius: 0, color: sport.color, borderColor: `${sport.color}50` }}
                  >
                    Book Your Free Demo
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
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
