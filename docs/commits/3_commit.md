# Commit 3 — The traffic simulator & the "Advance day" button

## What was done (in plain words)

A real QuestBoard would get its numbers from the internet: people clicking
promoters' tracked links, wishlisting games on Steam, redeeming keys. This
proof of concept has no real users — so this commit builds a **fake internet**:
a simulator that invents one believable day of traffic every time you press
**⏭ Advance day** in the top bar (now visible in the app!).

### What one simulated day does

For every promoter who is "working" that day, the simulator plays out a little
funnel, like water flowing through ever-narrower pipes:

```
audience sees the post  →  some click the link  →  some wishlist the game
   (impressions)              (~6–11%)                  (~15–30%)
                                                →  some download the demo
                                                →  a few redeem a game key
```

Then the money and reputation move:

- The **developer's budget** is charged the bounty for each verified outcome
  (and when a game's budget runs out, its quest closes — like a real ad campaign).
- The **promoter earns** bounty × their Exposure Score multiplier, recorded as
  *pending* for 7 days before it settles (the anti-fraud delay from commit 2).
- The **promoter's score grows** from the outcomes — which increases tomorrow's
  audience, which produces more outcomes. That feedback loop *is* the
  "work compounds" promise of the platform.

### Making it believable

- **Personalities:** each rival promoter has a pattern — PixelPriya streams
  almost daily, CozyCarlos is a weekend YouTuber, NightOwlNina posts in rare
  viral bursts, and TurboClicks99 (the 🤖) buys fake clicks every few days.
- **The fraud trap already works:** a day with a huge click spike that converts
  to almost no wishlists gets **voided** — the money never moves, the score is
  docked 5%. The Trust & Safety tab will visualize this in a later commit.
- **A seeded dice roll:** the simulator's randomness starts from a fixed seed,
  so every reset replays the exact same "movie". Great for demos — and it makes
  bugs reproducible.
- **The demo opens on day 14**, because the world simulates two weeks of rival
  activity before you arrive. A marketplace that starts empty looks dead.

### Balance tuning (an honest note)

The first version of this simulator was hilariously broken: budgets emptied in
days and the top streamer's score hit 4,698 (the scale tops out around 1,000).
Three fixes, all visible in the code:

1. **A daily score-gain cap** (`tanh` soft cap): big accounts can't gain more
   than ~15 points/day, so reputation must be earned over weeks, not bought in
   an afternoon.
2. **Realistic audiences:** reach numbers now mean "engaged daily viewers",
   not "total followers".
3. **Bigger budgets**, so quests live for weeks.

After tuning, a 90-day test run shows a brand-new promoter growing from
**$3.50/week to $30/week** — slow start, steep middle, plateau ahead. Exactly
the S-curve promised in commit 2.

### Also in this commit: global state

`src/state/AppState.jsx` holds the entire simulated world (day number, games,
promoters, claims, money ledger, fraud flags) in one place. Any part of the UI
can read it, and the only ways to change it are three *actions*:
**ADVANCE_DAY**, **CLAIM_QUEST**, and **RESET**. One-way data flow like this
keeps a growing app predictable.

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `src/engine/simulation.js` | The fake internet: the daily funnel, budgets, fraud trap, seeded RNG. |
| `src/state/AppState.jsx` | The single shared "world state" and the three actions that change it. |
| `src/components/DayControls.jsx` | The Day badge + Advance / Autoplay / Reset buttons in the top bar. |
| `src/engine/exposure.js` | Gained the daily-gain soft cap during balance tuning. |
| `src/data/seed.js` | Budgets and audience sizes retuned. |

## How to see it

Run `npm run dev`, look at the top-right of the page: **Day 14**, ⏭ Advance
day, ▶ Autoplay, ↺ Reset. Press Advance and watch the day tick up. The tabs
are still placeholders — the next commits give this engine a face.

## Words introduced in this commit

- **Funnel:** the narrowing path from "saw it" to "acted on it" — 1,000 people
  see a post, 80 click, 20 wishlist.
- **Ledger:** the append-only list of every payable outcome — who earned what,
  from which game, on which day, and whether it settled or was voided.
- **Seeded randomness:** dice that always roll the same sequence from the same
  starting seed; randomness you can replay.
- **Reducer / actions:** a pattern where all changes to app state go through
  one function handling named commands — the app's single rulebook.
