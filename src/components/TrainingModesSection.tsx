'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { GlowCard } from '@/components/ui/spotlight-card'
import LazyVideo from '@/components/LazyVideo'

/* ── One System, Multiple Ways To Train ───────────────────────────────────────
   Sits between the multi-sport section and the "MORE THAN A SPRINT RESISTANCE
   TOOL" framing: having just shown *who* it's for, this shows *what it does* —
   the three training modes — right before the 1080 comparison argues the
   category. Three modes, one machine, so the comparison lands with the range
   already established.

   MEDIA — drop-in, same convention as public/sports/ (see the README there).
   Each card looks for `public/training-modes/<id>.webp` and renders it if it
   loads. If the file isn't there the <img> errors, `failed` flips, and the card
   falls back to an engineered HUD plate so the section never ships with a
   broken frame or an empty box. Drop the three photos in and they take over —
   no code change needed. `object-cover` frames them, so the source aspect
   ratio doesn't have to match.

   A card can also carry a clip: set `video` and it plays
   `public/training-modes/<id>.mp4` through <LazyVideo/> (loads near the
   viewport, pauses off screen), with `<id>.webp` as its poster (a representative frame). The clips are
   pre-cut to the 4:5 frame with a follow-pan that keeps the athlete in shot —
   see the README. ─────────────────────────────────────────────────────────── */

type Mode = {
  id: string
  index: string
  title: string
  body: string
  /** Accent: red = resistance / output, blue = the technology signal. */
  accent: string
  alt: string
  /** Plays `/training-modes/<id>.mp4` instead of the still. */
  video?: boolean
}

const MODES: Mode[] = [
  {
    id: 'constant-resistance',
    index: '01',
    title: 'Constant Resistance',
    body:
      'Continuous, precisely held load through the whole sprint — from block clearance to top-end velocity, without the drag spikes of a sled.',
    accent: '#D61F26',
    alt: 'Athlete accelerating against constant T-APEX resistance on an indoor field',
    video: true,
  },
  {
    id: 'directional-resistance',
    index: '02',
    title: 'Directional Resistance',
    body:
      'Load applied on the angles the game is actually played on — cuts, decelerations and change of direction trained under control.',
    accent: '#D61F26',
    alt: 'Athlete training change of direction against angled T-APEX resistance',
    video: true,
  },
  {
    id: 'overspeed-training',
    index: '03',
    title: 'Overspeed Training',
    body:
      'Assistance instead of resistance. Athletes hold speeds above their own ceiling long enough for the nervous system to learn them.',
    accent: '#00AEEF',
    alt: 'Sprinter running assisted overspeed reps on a track',
    video: true,
  },
]

/** One mode card: photo when present, engineered HUD plate when it isn't. */
function ModeCard({ mode, i, inView }: { mode: Mode; i: number; inView: boolean }) {
  const [failed, setFailed] = useState(false)

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
      transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Media frame — a spotlight card: the border lights up in the mode's
          own accent (red / blue) where the cursor is. */}
      <GlowCard
        glowColor={mode.accent}
        className="overflow-hidden border border-apex-line bg-apex-panel"
        style={{ aspectRatio: '4 / 5' }}
      >
        {mode.video ? (
          <LazyVideo
            src={`/training-modes/${mode.id}.mp4`}
            poster={`/training-modes/${mode.id}.webp`}
            aria-label={mode.alt}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out md:group-hover:scale-[1.04]"
          />
        ) : !failed ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={`/training-modes/${mode.id}.webp`}
            alt={mode.alt}
            onError={() => setFailed(true)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out md:group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          /* Engineered standby plate — carbon weave + accent wash + a tapered
             rule, so a missing photo still reads as designed surface. */
          <div className="absolute inset-0 carbon-weave" aria-hidden="true">
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${mode.accent}1F, transparent 70%)`,
              }}
            />
            <div
              className="absolute left-0 right-0 top-1/2 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${mode.accent}59 40%, ${mode.accent}59 60%, transparent)`,
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(245,247,250,1) 1px, transparent 1px)',
                backgroundSize: '26px 26px',
              }}
            />
          </div>
        )}

        {/* Footage is far brighter than the stills — shade the top edge so the
            MODE index stays readable over it. */}
        {mode.video && (
          <div
            className="absolute inset-x-0 top-0 h-1/4 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(5,5,5,0.7), transparent)' }}
            aria-hidden="true"
          />
        )}

        {/* Legibility scrim under the title */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(5,5,5,0.82) 62%, rgba(5,5,5,0.94))' }}
          aria-hidden="true"
        />

        {/* Accent hairline along the top edge — the card's mode signal */}
        <div
          className="absolute top-0 left-0 h-[2px] w-16 md:w-0 md:group-hover:w-24 transition-all duration-500"
          style={{ background: mode.accent }}
          aria-hidden="true"
        />

        {/* Index */}
        <div className="absolute top-4 left-5 font-mono text-[10px] tracking-[0.3em] uppercase text-apex-grey-dim">
          Mode {mode.index}
        </div>

        {/* Title — Inter black + white, the site's convention for short labels
            sitting over imagery (the metallic serif loses too much contrast
            against a photo). */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <h3
            className="font-display font-black text-apex-white leading-tight"
            style={{ fontSize: 'clamp(1.15rem, 1.9vw, 1.5rem)' }}
          >
            {mode.title}
          </h3>
        </div>
      </GlowCard>

      {/* Support copy */}
      <p
        className="text-apex-grey font-body leading-relaxed mt-4 pl-3 border-l"
        style={{ fontSize: 'clamp(0.9rem, 1.25vw, 1rem)', borderColor: `${mode.accent}66` }}
      >
        {mode.body}
      </p>
    </motion.div>
  )
}

export default function TrainingModesSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true, margin: '-10% 0px' })

  return (
    <section id="training-modes" className="relative bg-apex-black-2 py-16 md:py-36 overflow-hidden">
      {/* Top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(214,31,38,0.25) 30%, rgba(214,31,38,0.25) 70%, transparent)' }}
        aria-hidden="true"
      />

      {/* Ambient red wash behind the headline */}
      <div
        className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(214,31,38,0.07), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Eyebrow */}
        <div ref={titleRef} className="flex items-center gap-3 mb-6 justify-center">
          <div className="kicker-line kicker-line--l bg-apex-red" />
          <span className="text-apex-red font-mono text-[12px] tracking-[0.3em] uppercase font-medium">
            Training Modes
          </span>
          <div className="kicker-line kicker-line--r bg-apex-red" />
        </div>

        {/* Headline — centred, "ONE SYSTEM," white, the rest performance red */}
        <motion.h2
          className="h-luxia leading-[0.95] text-center mx-auto max-w-6xl mb-5"
          style={{ fontSize: 'clamp(1.9rem, 4.6vw, 3.9rem)', letterSpacing: '0.035em' }}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="t-white">ONE SYSTEM,</span>
          <br />
          <span className="t-red">MULTIPLE WAYS TO TRAIN</span>
        </motion.h2>

        <motion.p
          className="text-apex-grey font-body text-center max-w-2xl mx-auto mb-10 md:mb-16 leading-relaxed"
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          T-APEX supports resistance and assistance training for acceleration, directional control,
          and overspeed work — all in one machine.
        </motion.p>

        {/* The three modes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {MODES.map((mode, i) => (
            <ModeCard key={mode.id} mode={mode} i={i} inView={inView} />
          ))}
        </div>

        {/* Closing banner — same Inter/bold/white + blue-emphasis
            convention as the site's other closing lines. */}
        <motion.div
          className="mt-12 md:mt-20 text-center"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <p
            className="font-display font-black text-apex-white leading-tight max-w-4xl mx-auto"
            style={{ fontSize: 'clamp(1.25rem, 2.3vw, 1.75rem)' }}
          >
            Three training modes, one machine. No swapping kit between blocks, just a{' '}
            <span className="text-apex-blue">single Adaptive Resistance Intelligence system</span>{' '}
            that covers the whole speed program.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
