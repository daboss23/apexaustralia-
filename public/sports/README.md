# Multi-Sport Transition — media drop-in

The "Built For Every Code" section (`SportTransitionStage`) renders a premium
engineered standby visual until real media is added. Drop assets here and they
appear automatically — no code changes required.

## Optional assets (all degrade gracefully if absent)

1. **Per-code looping clips** — `public/sports/<id>.mp4`
   The square clip that loops on the right of the stage while its code is
   active (muted, looped, object-cover). One per sport id, in display order:
   `sprinting, swimming, afl, skiing, rugby-league, soccer, basketball`
   Recommended: square (1:1) source, short seamless loop, dark/cinematic.

2. **Per-code athlete stills** — `public/sports/<id>.jpg`
   Optional background still, crossfades as the active code changes. Same ids
   as above. Recommended: 1920×1080+, dark/cinematic, athlete weighted to the
   right (left side is reserved for the headline + HUD overlay).

3. **AI athlete-morph loop** — `public/sports-transition.mp4`
   The hero media: athletes morphing between codes (sprinter → footballer →
   basketballer → rugby, etc.). Plays muted, looped, object-cover. When present
   it sits on top of the stills. Pair with `public/sports-transition-poster.jpg`.
   Recommended: H.264 MP4, ~10–20s seamless loop, 16:9 or 21:9.

Keep it premium and controlled — slow, fluid dissolves over fast/cheesy cuts.
