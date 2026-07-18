# Commit 16 — The Player's Guide: a manual that can't lie

## What was done (in plain words)

Someone landing on QuestBoard cold had to reverse-engineer what it *is* from
five tabs of numbers. This commit gives the app a **Guide** tab — a manual
written like the booklet in an old game box, answering the questions in the
order a new player actually asks them: why does this exist, how does a run
play, how does the money math work, what is each screen for, and how much of
the demo is real.

### The one rule that keeps it honest

Documentation drifts. The moment a tuning commit changes a constant, every
hand-written explanation of it becomes a quiet lie. So this page refuses to
hard-code its numbers: the score weights, tier thresholds, streak bonus,
decay rate, daily cap, settlement window and payout multipliers are all
**imported from `src/engine/exposure.js` and rendered live**. The tier
ladder even *runs* `payoutMultiplier()` to print what each tier's doorstep
score pays (Newcomer 0.27×, Legend 2.99×). If the economy is ever rebalanced,
the manual updates itself in the same commit — it physically cannot disagree
with the game.

### What's on the page

1. **The problem / The bet** — two cards: ~19,000 Steam launches a year and
   invisible indies, versus flipping ad spend into pay-per-outcome bounties.
2. **How a run plays** — five pixel-numbered steps from "pick a quest" to
   "payout = bounty × multiplier", including why money waits 7 days.
3. **Your XP** — the payout formula printed like a cheat code, four mechanic
   cards (only outcomes score, streaks compound, no overnight rockets,
   silence rusts) and the tier ladder with live multipliers.
4. **The screens** — a map of all five tabs where every row is a real
   button: the manual can teleport you to the thing it's explaining.
5. **Time is a button / What's real, what's pretend** — the demo's clock
   controls, the seeded-replay honesty, and exactly what a PoC doesn't do
   (no backend, no payments, one illustrative fraud heuristic).

### A new pixel icon

The hand-drawn 8×8 set gains a `book` glyph (an open book seen from the
front) — used by the nav tab and the page header, same as every other screen
gets its own icon.

## Verified

Driven headless in real Chrome against the production build: the Guide tab
navigates; the engine-fed facts render (formula strip, `LEGEND score 900+
2.99×` in the ladder, `+1.5` key weight); all five screen-map rows exist and
clicking "Trust & Safety" really lands on the fraud panel; a 400px viewport
has zero horizontal overflow; zero console errors throughout.

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `src/views/Guide.jsx` | The whole manual — note the imports from `engine/exposure.js` doing the talking. |
| `src/components/PixelIcon.jsx` | The new `book` glyph. |
| `src/index.css` | The `player's guide` block: step list, mechanic cards, tier ladder, screen map. |

## How to see it

`npm run dev` → click **Guide** in the nav. Click the GO rows to jump to each
screen. Then open `src/engine/exposure.js`, change `MAX_MULT` to 5, and watch
the manual rewrite itself.

## Words introduced in this commit

- **Single source of truth:** keeping one authoritative copy of a fact (here,
  the engine constants) and deriving every display of it, so nothing can
  contradict it.
- **Doorstep multiplier:** what the payout curve pays at the minimum score of
  a tier — the number a player sees the moment they rank up.
