# T-APEX Australia

Premium, high-tech marketing site for **T-APEX** — an intelligent, portable
resistance training device powered by Quasi Direct Drive (QDD) technology.

Static site — no build step. Open `index.html` or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Architecture

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Hero, why-it-matters, what it is, benefits, how it works, who it's for, why T-APEX Australia, comparison teaser, FAQ teaser, final CTA |
| Product / How It Works | `product.html` | Overview, training mechanics, intelligence/data, features, use cases, full comparison |
| Who It's For | `who.html` | Audience blocks + elite environments |
| About | `about.html` | T-APEX Australia positioning, Piero, trust pillars |
| FAQ | `faq.html` | Objection-handling accordion |
| Contact / Book Demo | `contact.html` | Enquiry form |
| Order / Enquire | `order.html` | Premium configure → enquire-to-order → confirmation flow |

Shared design system in `styles.css`, interaction layer in `script.js`.

## Design system
- **Palette:** black / white / red `#e0231f` with gold `#caa24a` accents
- **Type:** Space Grotesk (display) + Inter (body)
- **Motion:** scroll-driven reveals, mechanical assembly (parts locking into
  place), rotating QDD rotor, scanning schematic, count-up stats, marquee,
  scroll-progress rail. All respect `prefers-reduced-motion`.

Product facts sourced from myt-apex.com.
