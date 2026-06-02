# Multi-Sport Transition — media drop-in

The "Built For Every Code" section (`SportTransitionStage`) renders a premium
engineered standby visual until real media is added. Drop assets here and they
appear automatically — no code changes required.

## Optional assets (all degrade gracefully if absent)

1. **Per-code athlete stills** — `public/sports/<id>.jpg`
   Crossfades as the active code changes. One per sport id:
   `afl, nrl, rugby, football, basketball, athletics, olympic, sc`
   Recommended: 1920×1080+, dark/cinematic, athlete weighted to the right
   (left side is reserved for the headline + HUD overlay).

2. **AI athlete-morph loop** — `public/sports-transition.mp4`
   The hero media: athletes morphing between codes (sprinter → footballer →
   basketballer → rugby, etc.). Plays muted, looped, object-cover. When present
   it sits on top of the stills. Pair with `public/sports-transition-poster.jpg`.
   Recommended: H.264 MP4, ~10–20s seamless loop, 16:9 or 21:9.

Keep it premium and controlled — slow, fluid dissolves over fast/cheesy cuts.
