# T-APEX Australia — Cinematic Performance Experience

A futuristic, data-driven homepage for **T-APEX** — intelligent resistance
training technology for elite Australian sport. Built to feel like Tesla /
Apple Vision Pro / F1 telemetry, not a Shopify store.

## Stack
- **Next.js 14** (App Router, TypeScript)
- **React Three Fiber + drei + three** — WebGL particle field, light trails, 3D exploded device
- **Framer Motion** — scroll-triggered reveals, parallax, page choreography
- **GSAP** — available for advanced scroll sequencing
- **Tailwind CSS** — design tokens (black / carbon / electric blue / cyan / white)

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Homepage sections (`app/page.tsx`)
1. **Preloader** — premium boot sequence
2. **Hero** — full-screen WebGL particles + floating holographic metrics, parallax headline "Train Beyond Human Limits"
3. **Telemetry** — animated acceleration / power / resistance curves
4. **How It Works** — 5-step scroll storytelling with sticky cinematic panel
5. **Product Showcase** — interactive 3D device, scroll-driven exploded view, hover hotspots
6. **Dashboard** — glassmorphism, live-updating metrics + velocity & symmetry
7. **Sport Selector** — immersive scene that recolours per sport
8. **Built For Elite Australian Performance** — AFL, Rugby League, Rugby Union, Cricket, Swimming, Track & Field
9. **Social Proof** — video wall + coach quotes + metric strip
10. **Final CTA** + footer

## Asset slots (search `ASSET SLOT`)
The build uses procedural WebGL + animated placeholders. Drop real media to upgrade:
- `/public/video/hero-athlete.webm` — hero athlete loop (`components/Hero.tsx`)
- `/public/video/how-it-works.webm` — process loop (`components/HowItWorks.tsx`)
- `/public/video/sport-{id}.webm` — per-sport loops (`components/SportSelector.tsx`)
- `/public/video/proof-{i}.webm` — athlete clips (`components/SocialProof.tsx`)
- `/public/models/*.glb` — real device model (`components/three/DeviceModel.tsx`)

## Legacy
The previous static multi-page site is preserved under `/legacy`.
