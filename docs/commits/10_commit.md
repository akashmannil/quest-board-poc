# Commit 10 — Pixel icons in every screen + neon charts

## What was done (in plain words)

Commit 9 built the design system; this commit carries it into every corner of
the app so no screen still speaks the old visual language.

### Icons, everywhere

Every place that used an emoji as *interface* (rather than as game art) now
uses a hand-drawn pixel icon from the set:

- **Tier badges** — 🌱→ pixel sprout, 🚀→ rocket, ⚡→ bolt, 💠→ gem,
  👑→ crown. The leaderboard now reads like a game rank ladder.
- **Outcome types** — link click → pixel cursor, wishlist → star,
  demo → download arrow, key → key. Used in the quest tables, the activity
  feed and the bounty prices on quest cards. (Two new icons, `cursor` and
  `download`, were drawn for this.)
- **Money states** — pending → hourglass, settled → check,
  fraud/voided → skull. The skull also marks flagged accounts in the fraud
  log and the "voided as fraud" line in Dev HQ.
- **Stat tiles and panel titles** — each carries its own small icon
  (coin, flame, pickaxe…), and every view's heading matches its nav tab.
- **The accept button** now leads with a pixel sword — accepting a quest
  should feel like drawing a weapon.

Game art stays emoji on purpose: 🌙 for *Moonpetal Alley* is the game's
key art, not UI — pixelating it would cost charm for nothing.

### The XP bar

The Exposure Score tile now shows a real Minecraft-style XP bar: your
progress from the current tier to the next as a segmented, glowing green
bar, with "228 XP to Partner" underneath. Same math as before — the sub-text
just became a game HUD element.

### Neon charts

The score line and the payout curve now glow (a colored drop-shadow under
the 2px line), and bars light up when hovered. Important nuance: the glow is
*decoration on top of* the color-blind-validated series colors from commit 5
— the palette itself didn't change, so the accessibility guarantees hold.

### One text fix

The Trust & Safety defense card still claimed a flagged day docks the score
5% — commit 8 raised that to 10%. The card now tells the truth. (UI copy that
states tunable numbers drifts; this is why.)

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `src/components/PixelIcon.jsx` | +2 icons (cursor, download) and the outcome/tier icon mappings. |
| `src/views/PromoterDashboard.jsx` | XP bar, pixel tier chips, iconified tiles and tables. |
| `src/views/QuestBoard.jsx` | Pixel bounty icons, sword on the accept button. |
| `src/views/DevHQ.jsx` / `TrustSafety.jsx` | Iconified tiles, defense cards, skulls on fraud. |
| `src/components/charts/LineChart.jsx` / `BarChart.jsx` | The neon glow on marks. |

## How to see it

`npm run dev` → accept quests → autoplay ~45 days. The dashboard now reads
like a game character sheet: rank badge, XP bar to the next tier, glowing
earnings staircase, and a leaderboard of rivals. Check the Trust & Safety
fraud log for the skulls.

## Words introduced in this commit

- **HUD (heads-up display):** the always-visible game overlay (health, XP,
  score) — the design language the stat tiles now borrow from.
- **Drop shadow (glow):** a blurred colored copy drawn under a shape; layered
  glows are how neon is faked on screens.
