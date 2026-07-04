# Commit 8 — Fixes found by actually playing the demo

## What was done (in plain words)

Before calling the PoC done, the whole app was driven end-to-end in a real
(headless) Chrome browser: accept quests → advance 50 days → check every tab →
hover every chart → reset → resize to phone width. Everything worked and the
console stayed clean — but *looking* at the screenshots caught two things that
code alone didn't.

### Fix 1: the score chart squashed beginners (a real bug)

The axis-tick helper had a subtle flaw: asked for ticks up to 900, it could
stop at 500, so the "Partner" and "Legend" threshold lines were silently drawn
off the top of the chart. Worse, the chart scaled itself to the *thresholds*
instead of *your data* — so a brand-new promoter's score of 20 was a flat
line pinned to the bottom of a 0–900 chart. Demoralizing, and exactly the
wrong message for the screen meant to motivate newcomers.

Now the chart scales to your actual progress, and tier guides only fade in
as you get close to them — early on you see your line move on a 0–60 scale
from day one, and "🚀 Rising" appears on the horizon as you approach 100.

### Fix 2: fraud paid too well (a story bug)

After 50 simulated days, TurboClicks99 — the bot the Trust & Safety tab
brags about catching — sat at **#3 on the leaderboard earning $80/week**.
Its click-farm days were being voided correctly, but its ordinary days
still earned enough to climb. A fraud panel next to a leaderboard where
the cheater is winning is a platform nobody should trust.

Tuning, not new code: the score penalty per flagged day went from 5% to 10%,
and the bot now buys traffic every 4 days instead of 5 (more greed, more
flags). Re-running the same 50 days, the bot lands #4 with a visibly
suppressed score — caught *and* losing, which is the story the platform
needs to tell.

### The lesson worth writing down

Neither issue was findable by reading code or by the build passing. One
needed *eyes on the rendered chart*, the other needed *watching the economy
play out*. Simulations and UIs both need to be watched, not just compiled.

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `src/components/charts/utils.js` | Tick helper now always covers the max value. |
| `src/components/charts/LineChart.jsx` | Scales to data; out-of-range guides don't render. |
| `src/engine/simulation.js` | Fraud penalty 5%→10%, bot spikes every 4 days. |
| `.claude/skills/verify/SKILL.md` | The browser-drive recipe, saved for future sessions. |

## How to see it

`npm run dev` → accept a quest → advance ~10 days → **My Dashboard**: the
score chart now shows a lively line even at tiny scores. Then autoplay to
day ~60 and check the leaderboard: the 🤖 sits mid-pack, its Trust & Safety
fraud log long.
