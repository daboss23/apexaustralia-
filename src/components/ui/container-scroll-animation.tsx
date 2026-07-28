'use client'

import React, { useRef } from 'react'
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion'

// ─── Container scroll animation ───────────────────────────────────────────────
// A perspective card that starts tilted back on its X axis and lays flat as it
// scrolls into view, with the title drifting up behind it.
//
// This is the upstream (Aceternity) primitive kept generic and re-usable — it
// owns the motion, not the look. Every visual is overridable via `cardClassName`
// / `innerClassName` so a section can dress it in the T-APEX design tokens
// (square corners, apex.* surfaces) without forking the file. The defaults below
// are the upstream ones, so it still drops into any project unchanged.

// Derived from the hook so it tracks framer-motion's own type across upgrades.
type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>['offset']

export const ContainerScroll = ({
  titleComponent,
  children,
  className = 'h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20',
  cardClassName = 'max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl',
  innerClassName = 'h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4',
  offset,
}: {
  titleComponent: string | React.ReactNode
  children: React.ReactNode
  className?: string
  cardClassName?: string
  innerClassName?: string
  /**
   * Where the tilt starts and finishes relative to the viewport. Upstream leaves
   * this unset, which resolves to `['start start', 'end end']` — that only
   * completes once the container's bottom reaches the viewport bottom, which is
   * why the upstream demo needs ~1500px of dead padding to look right. Passing
   * an explicit offset (e.g. `['start end', 'center center']`) lets the card
   * finish flattening as it settles on screen, with no padding hack.
   */
  offset?: ScrollOffset
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    ...(offset ? { offset } : {}),
  })
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1]
  }

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0])
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions())
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <div className={className} ref={containerRef}>
      <div
        className="py-10 md:py-40 w-full relative"
        style={{
          perspective: '1000px',
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card
          rotate={rotate}
          translate={translate}
          scale={scale}
          cardClassName={cardClassName}
          innerClassName={innerClassName}
        >
          {children}
        </Card>
      </div>
    </div>
  )
}

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  )
}

export const Card = ({
  rotate,
  scale,
  children,
  cardClassName,
  innerClassName,
}: {
  rotate: MotionValue<number>
  scale: MotionValue<number>
  translate: MotionValue<number>
  children: React.ReactNode
  cardClassName?: string
  innerClassName?: string
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
      }}
      className={cardClassName}
    >
      <div className={innerClassName}>{children}</div>
    </motion.div>
  )
}
