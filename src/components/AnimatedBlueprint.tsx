'use client'

/**
 * AnimatedBlueprint
 * -----------------
 * Animates the locked, pixel-perfect T-APEX engineering blueprint image with
 * transparent overlay effects only. The image itself is NEVER recreated, moved,
 * blurred, cropped or zoomed — it is a static base layer (z-1) and every glow,
 * scan line and callout pulse lives on absolutely-positioned overlays above it
 * (z-2+), all with `pointer-events: none` and `mix-blend-mode: screen`.
 *
 * One seamless ~11s CSS loop, low motion intensity. The final frame fades back
 * to idle so the loop is invisible. Respects prefers-reduced-motion.
 */

// Approximate positions (as % of the full image) of the 13 circled callout
// numbers on the diagram — used only to place soft cyan glow dots over the
// EXISTING numbers. The numbers in the image are never redrawn.
const CALLOUTS: { x: number; y: number }[] = [
  { x: 25.9, y: 18.6 }, // 1  pull rod
  { x: 25.9, y: 30.3 }, // 2  counterweight holder
  { x: 28.2, y: 41.4 }, // 3  handle
  { x: 28.2, y: 49.5 }, // 4  control panel
  { x: 28.2, y: 57.7 }, // 5  emergency button
  { x: 28.2, y: 67.1 }, // 6  repair window
  { x: 28.2, y: 84.4 }, // 7  handle
  { x: 51.2, y: 35.8 }, // 8  pull rod length changer
  { x: 51.2, y: 40.5 }, // 9  pull rod detacher
  { x: 52.6, y: 55.8 }, // 10 battery compartment
  { x: 52.6, y: 64.0 }, // 11 accessory assembly
  { x: 52.6, y: 75.6 }, // 12 dust container
  { x: 70.9, y: 67.4 }, // 13 charge port
]

// Soft red glow points sitting over existing red elements in the image.
const RED_POINTS: { x: number; y: number; s: number }[] = [
  { x: 50.0, y: 4.5, s: 16 }, // T-APEX logo mark
  { x: 20.5, y: 57.5, s: 9 }, // emergency button (front)
  { x: 64.0, y: 63.5, s: 8 }, // charge port (inset)
  { x: 9.0, y: 44.0, s: 6 }, // front top-left red highlight
  { x: 23.5, y: 44.0, s: 6 }, // front top-right red highlight
]

export default function AnimatedBlueprint({
  src = '/accessories/engineering-blueprint.webp',
  alt = 'T-APEX engineering blueprint — front, rear and base views with 13 numbered components',
  className = '',
}: {
  src?: string
  alt?: string
  className?: string
}) {
  return (
    <div className={`ab-wrap ${className}`} aria-hidden={false}>
      {/* BASE LAYER — locked, pixel-perfect image. Never animated. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="ab-base" draggable={false} />

      {/* OVERLAYS — all transparent, pointer-events none, blended onto image */}
      <div className="ab-overlays" aria-hidden="true">
        {/* 1 / 8 — frame breathing glow + final system-active brighten */}
        <div className="ab-frame" />

        {/* 2 — diagnostic scan line, left → right */}
        <div className="ab-scan" />

        {/* 3 — blueprint energy pulses: front, then rear, then inset */}
        <div className="ab-pulse ab-pulse-front" />
        <div className="ab-pulse ab-pulse-rear" />
        <div className="ab-pulse ab-pulse-inset" />

        {/* 4 — red accent flicker over existing red elements */}
        {RED_POINTS.map((p, i) => (
          <span
            key={`red-${i}`}
            className="ab-red"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.s}%`,
              paddingBottom: `${p.s}%`,
              animationDelay: `${(i % 3) * 0.4}s`,
            }}
          />
        ))}

        {/* 5 — right component panel glassy edge glow */}
        <div className="ab-panel" />

        {/* 6 — callout highlight illusion, 1 → 13 in sequence */}
        {CALLOUTS.map((c, i) => (
          <span
            key={`cal-${i}`}
            className="ab-callout"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              animationDelay: `${3.4 + i * 0.32}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .ab-wrap {
          --cyan: #00eaff;
          --red: #ff2b2b;
          --dark: #020812;
          position: relative;
          width: 100%;
          line-height: 0;
          isolation: isolate;
        }
        .ab-base {
          position: relative;
          z-index: 1;
          display: block;
          width: 100%;
          height: auto;
          /* keep it crisp — no filters on the base image */
        }
        .ab-overlays {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }
        .ab-overlays > * {
          position: absolute;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        /* 1 / 8 — frame breathing glow + system-active brighten */
        .ab-frame {
          inset: 0;
          border-radius: 14px;
          box-shadow: inset 0 0 120px 8px rgba(0, 234, 255, 0.06);
          background: radial-gradient(
            ellipse 60% 60% at 50% 48%,
            rgba(0, 234, 255, 0.05),
            transparent 70%
          );
          opacity: 0.5;
          animation: ab-frame 11s ease-in-out infinite;
        }
        @keyframes ab-frame {
          0%,
          100% {
            opacity: 0.42;
          }
          45% {
            opacity: 0.7;
          }
          82% {
            opacity: 0.5;
          }
          /* system-active surge */
          88% {
            opacity: 1;
          }
          94% {
            opacity: 0.6;
          }
        }

        /* 2 — diagnostic scan line */
        .ab-scan {
          top: 0;
          bottom: 0;
          width: 22%;
          left: -22%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 234, 255, 0.04) 35%,
            rgba(0, 234, 255, 0.22) 50%,
            rgba(0, 234, 255, 0.04) 65%,
            transparent
          );
          filter: blur(2px);
          opacity: 0;
          animation: ab-scan 11s linear infinite;
        }
        @keyframes ab-scan {
          0% {
            left: -22%;
            opacity: 0;
          }
          8% {
            opacity: 0.9;
          }
          10% {
            left: -22%;
          }
          34% {
            left: 100%;
            opacity: 0.9;
          }
          38% {
            left: 100%;
            opacity: 0;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }

        /* 3 — blueprint energy pulses (soft radial glows) */
        .ab-pulse {
          border-radius: 50%;
          filter: blur(26px);
          background: radial-gradient(
            circle,
            rgba(0, 234, 255, 0.3),
            transparent 70%
          );
          opacity: 0;
        }
        .ab-pulse-front {
          left: 4%;
          top: 38%;
          width: 24%;
          padding-bottom: 24%;
          animation: ab-pulse 11s ease-in-out infinite;
          animation-delay: 3s;
        }
        .ab-pulse-rear {
          left: 33%;
          top: 38%;
          width: 22%;
          padding-bottom: 22%;
          animation: ab-pulse 11s ease-in-out infinite;
          animation-delay: 4.2s;
        }
        .ab-pulse-inset {
          left: 56%;
          top: 50%;
          width: 16%;
          padding-bottom: 16%;
          animation: ab-pulse 11s ease-in-out infinite;
          animation-delay: 5.2s;
        }
        @keyframes ab-pulse {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.9);
          }
          50% {
            opacity: 0.55;
            transform: scale(1);
          }
        }

        /* 4 — red accent flicker */
        .ab-red {
          border-radius: 50%;
          transform: translate(-50%, -50%);
          filter: blur(8px);
          background: radial-gradient(
            circle,
            rgba(255, 43, 43, 0.55),
            transparent 70%
          );
          opacity: 0.15;
          animation: ab-red 11s ease-in-out infinite;
        }
        @keyframes ab-red {
          0%,
          100% {
            opacity: 0.12;
          }
          40% {
            opacity: 0.18;
          }
          /* gentle powered-electronics flicker */
          44% {
            opacity: 0.5;
          }
          46% {
            opacity: 0.2;
          }
          49% {
            opacity: 0.6;
          }
          52% {
            opacity: 0.3;
          }
          /* settle, then join the final surge */
          88% {
            opacity: 0.7;
          }
          94% {
            opacity: 0.25;
          }
        }

        /* 5 — right component panel glassy edge glow */
        .ab-panel {
          left: 73.5%;
          right: 2.5%;
          top: 17%;
          bottom: 11%;
          border-radius: 10px;
          box-shadow: inset 0 0 0 1px rgba(0, 234, 255, 0.25),
            0 0 30px 2px rgba(0, 234, 255, 0.12);
          background: linear-gradient(
            180deg,
            rgba(0, 234, 255, 0.04),
            transparent 30%,
            transparent 70%,
            rgba(0, 234, 255, 0.04)
          );
          opacity: 0.4;
          animation: ab-panel 11s ease-in-out infinite;
        }
        @keyframes ab-panel {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
          88% {
            opacity: 0.85;
          }
        }

        /* 6 — callout highlight illusion (soft cyan dots over the numbers) */
        .ab-callout {
          width: 2.8%;
          padding-bottom: 2.8%;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          filter: blur(2.5px) drop-shadow(0 0 3px rgba(0, 234, 255, 0.5));
          background: radial-gradient(
            circle,
            rgba(160, 240, 255, 0.7) 0%,
            rgba(0, 234, 255, 0.5) 45%,
            transparent 68%
          );
          opacity: 0;
          animation: ab-callout 11s ease-in-out infinite;
        }
        @keyframes ab-callout {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          3% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1.08);
          }
          7% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
          }
          11% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          100% {
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce), (max-width: 767px) {
          .ab-frame,
          .ab-scan,
          .ab-pulse,
          .ab-red,
          .ab-panel,
          .ab-callout {
            animation: none;
          }
          .ab-scan {
            display: none;
          }
          .ab-frame {
            opacity: 0.5;
          }
          .ab-panel {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  )
}
