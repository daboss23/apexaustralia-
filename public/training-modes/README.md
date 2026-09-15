# Training modes — media drop-in

`TrainingModesSection.tsx` ("One System, Multiple Ways To Train") renders three
cards. Each one looks for a photo here and uses it the moment the file exists —
no code change needed. Until then the card falls back to an engineered HUD
plate, so a missing photo never shows as a broken frame.

## Expected files

| File                                | Card                   |
| ----------------------------------- | ---------------------- |
| `constant-resistance.webp`          | Constant Resistance    |
| `directional-resistance.webp`       | Directional Resistance |
| `overspeed-training.webp`           | Overspeed Training     |

Filenames must match the `id` values in `MODES` in the component exactly.

## Recommended source

- **Portrait-ish**, ~1200×1500 or larger. The frame is `4 / 5` with
  `object-cover`, so any aspect ratio crops cleanly — but portrait sources lose
  the least.
- Dark / cinematic, athlete in action, with the T-APEX unit visible where
  possible.
- `.webp`, quality ~80. Keep each file under ~300 KB — three of these load
  together and the section sits mid-page.
- A dark scrim covers the bottom half of the frame for the title, so keep the
  athlete weighted to the **upper two thirds**.
