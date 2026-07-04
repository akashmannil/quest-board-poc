# Commit 6 — Dev HQ (the developer's side)

## What was done (in plain words)

The 🎮 **Dev HQ** tab now shows the marketplace from the other side: you are
the indie developer, and this screen answers the only question that matters to
someone spending scarce money — **"what exactly did my budget buy?"**

This screen is deliberately smaller than the promoter dashboard. The promoter
side is the novel idea of this platform; the dev side just has to prove the
money is accounted for.

### What's on it

1. **A game picker** — pretend to be the dev of any of the six seeded games.
2. **Four stat tiles** — budget spent, wishlists bought (the metric Steam's
   own ranking algorithm rewards), **cost per wishlist**, and demo/key counts.
   Cost per wishlist is the number a dev would use to compare QuestBoard
   against ads: indie Facebook/Reddit ads often land at $1–3 per wishlist,
   so an outcome-priced $0.45–0.60 is a good story.
3. **Wishlists per day** — a bar chart of the campaign's pulse. You can see
   weekends when CozyCarlos posts, bursts when NightOwlNina goes viral, and
   the flatline when the budget runs out.
4. **The attribution table** — the receipt. Every promoter on this game, how
   many clicks and wishlists their personal link produced, their conversion
   rate, and what they cost. This table only exists because of the tracked
   links from commit 4 — attribution is what makes outcome pricing possible.

### A fairness fix in the simulator (found while building this screen)

Building the dev's "what did I pay" table exposed a bug: when the fraud trap
voided TurboClicks99's fake traffic, the promoter (correctly) wasn't paid —
but the developer's budget (incorrectly) stayed charged, and the fake
wishlists stayed in the public counts. That would mean **devs pay for fraud**,
the exact thing the platform promises can't happen.

Now a voided day refunds the dev's budget and strips the fake outcomes out of
every count. The attribution table shows this honestly: TurboClicks99's row
displays "+$X voided as fraud, refunded" so the dev can see the defense
working. (This is why building the *second* side of a marketplace is always
worth it — each side audits the other.)

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `src/views/DevHQ.jsx` | The dev screen: game picker, tiles, daily chart, attribution table. |
| `src/engine/simulation.js` | The fraud-refund fix described above. |

## How to see it

`npm run dev` → autoplay \~30 days → **Dev HQ** tab. Try *GRIDRUNNER://* —
that's a game TurboClicks99 is "promoting", so its attribution table shows the
voided-and-refunded fraud line under the 🤖 row.

## Words introduced in this commit

- **Cost per wishlist (CPW):** total spend ÷ wishlists gained; the dev's
  yardstick for whether marketing money is working.
- **Conversion rate:** what fraction of clicks became wishlists. Real fans
  convert at 20%+; bot traffic converts at almost 0% — which is exactly how
  the fraud trap smells it.
- **Attribution table:** the per-promoter receipt showing who caused which
  outcomes, and therefore who gets paid what.
