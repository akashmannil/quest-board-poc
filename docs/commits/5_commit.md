# Commit 5 — The Promoter Dashboard (the heart of the demo)

## What was done (in plain words)

The 📈 **My Dashboard** tab is now real. This is the screen the whole platform
was designed around: what a *promoter* sees, because promoters are the side
that makes the marketplace grow. If this screen motivates a nobody-with-zero-
followers to keep going, the platform works.

### The top row: five stat tiles

- **Exposure Score** with your tier (🌱 Newcomer → 👑 Legend) and how far the
  next tier is.
- **Payout multiplier** — the number the S-curve gives you, made concrete:
  *"a $0.45 bounty pays you $0.13"*.
- **Streak** — consecutive active days, the compounding bonus from commit 2.
- **Pending / Settled money** — pending is earned but inside the 7-day
  anti-fraud window; settled is yours.

### The three charts

1. **Exposure Score over time** — your growth line, with the four tier
   thresholds marked. Accept quests, autoplay 60 days, and you can *watch*
   yourself climb out of Newcomer.
2. **The payout curve** — the S-curve itself, with every promoter on the
   platform sitting on it as a dot (you in purple, rivals in grey). This one
   chart explains the whole business model at a glance: the flat start, the
   steep middle you want to reach, and the 3× ceiling that keeps the top from
   running away with everything.
3. **Daily earnings** — 30 days of bars. Early on it's pennies; as your score
   compounds the bars visibly rise. That rising staircase *is* the pitch to
   promoters.

Every chart has a hover tooltip (move your mouse across it), and every number
in a chart is also available in a table — nobody should need a steady hand to
read data.

### The tables

- **Leaderboard** — all six promoters ranked by score, your row highlighted.
  Note how TurboClicks99 (🤖) lags despite constant activity: fraud penalties.
- **My quests** — per game: clicks, wishlists, demos, keys, and money earned.
- **Recent activity** — the raw feed: *"day 41: 3× Steam wishlist on Moonpetal
  Alley → $0.41, ⧗ pending"*.

### A note on the chart colors

The chart palette wasn't eyeballed. The four series colors were run through a
color-vision-deficiency validator against this app's exact dark background and
adjusted until they passed (contrast ≥ 3:1, distinguishable under all three
common forms of color blindness). The tweaked values live in `src/index.css`
as `--chart-1` … `--chart-4`.

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `src/views/PromoterDashboard.jsx` | The whole screen: tiles, charts, tables. |
| `src/components/charts/LineChart.jsx` | Hand-rolled SVG line chart with crosshair + tooltip. |
| `src/components/charts/BarChart.jsx` | Hand-rolled SVG bar chart, per-bar hover. |
| `src/engine/selectors.js` | Money questions answered from the ledger (pending/settled/weekly/per-quest). |
| `src/components/charts/utils.js` | Clean axis ticks ("0 / 50 / 100", never "0 / 47.3"). |

No chart library was used — each chart is ~150 lines of plain SVG, which keeps
the bundle small and shows exactly how charts work under the hood.

## How to see it

1. `npm run dev`, accept 2–3 quests on the Quest Board.
2. Switch to **My Dashboard** — mostly zeros and a nudge banner.
3. Hit **▶ Autoplay** and just watch: the score line climbs, your dot slides
   up the S-curve, the earnings bars grow, pending money turns settled.

## Words introduced in this commit

- **Selector:** a small function that answers a question about the app's data
  ("how much is pending?") without changing anything. Keeps math out of the UI.
- **SVG:** the browser's built-in vector drawing language — our charts are
  literally lines and rectangles described in code.
- **Crosshair tooltip:** the vertical guide that follows your mouse on a line
  chart and snaps to the nearest data point.
- **Tabular numbers:** a font setting making every digit the same width so
  columns of numbers align (used in the tables).
