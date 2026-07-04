# QuestBoard — Indie Game Promotion Marketplace (PoC)

**The problem:** indie developers don't fail at making games — they fail at getting *seen*.
Roughly 19,000 games launch on Steam every year, storefront visibility is driven by
wishlists and sales velocity, and paid marketing costs more than most indie budgets.

**The idea:** a two-sided marketplace where devs pay for *outcomes* instead of upfront
marketing spend, and **anyone** — streamers, TikTokers, bloggers, or a total beginner
with zero followers — can earn money by promoting indie games.

- **Devs** list their game as a "quest" with a bounty (e.g. $0.45 per verified wishlist).
- **Promoters** accept quests, get a unique tracked link, and earn per verified outcome.
- An **Exposure Score** rewards consistent, quality promotion: everyone starts small,
  earnings grow steeply with proven work (an S-curve), then plateau at 3× — so the top
  1% can't eat the whole market and newcomers always have a ladder to climb.

This is a **proof of concept**: all traffic, payments and accounts are simulated in the
browser by a seeded day-by-day simulator. No backend, no real Steam integration.

## Run it

```bash
npm install
npm run dev
```

Then play the loop: browse the **Discover** homepage → open a game to read its
reviews and meet the devs → accept a few quests → hit **▶ Autoplay** → watch
**My Dashboard** climb the S-curve, check what the dev's money bought in
**Dev HQ**, and see the bot account get caught in **Trust & Safety**.

## The screens

| Tab | What it shows |
| --- | --- |
| 🔷 Discover | Steam-style homepage: featured hero, "picked for you", trending, genres gaining pace, new listings, browse by genre |
| 🗺️ Quest Board | Games as bounty-funded quests, sortable & genre-filterable; accept one to get your tracked link |
| 📈 My Dashboard | Exposure Score, tier, streak, the payout curve, daily earnings, leaderboard |
| 🎮 Dev HQ | Budget spent, cost per wishlist, and per-promoter attribution (the receipt) |
| 🛡️ Trust & Safety | The anti-fraud defenses and the live log of voided bot traffic |

Every game also has its own **detail page** — wishlists-over-time chart, the
quest action panel, a developer profile, top promoters, player reviews (write
your own), and related games.

## Commit-by-commit documentation

Every feature was built in its own commit, and every commit has a plain-language
write-up in [docs/commits/](docs/commits/) aimed at beginners and non-coders:

| Commit | Doc |
| ------ | --- |
| 1 | [Project skeleton & app shell](docs/commits/1_commit.md) |
| 2 | [The Exposure Score engine + seed data](docs/commits/2_commit.md) |
| 3 | [The traffic simulator & the "Advance day" button](docs/commits/3_commit.md) |
| 4 | [The Quest Board marketplace](docs/commits/4_commit.md) |
| 5 | [The Promoter Dashboard](docs/commits/5_commit.md) |
| 6 | [Dev HQ & the fraud-refund fix](docs/commits/6_commit.md) |
| 7 | [Trust & Safety panel](docs/commits/7_commit.md) |
| 8 | [Fixes found by actually playing the demo](docs/commits/8_commit.md) |
| 9 | [The neon arcade redesign (design system)](docs/commits/9_commit.md) |
| 10 | [Pixel icons in every screen + neon charts](docs/commits/10_commit.md) |
| 11 | [18-game catalogue + the discovery engine](docs/commits/11_commit.md) |
| 12 | [Steam-style Discover homepage + browsable Quest Board](docs/commits/12_commit.md) |
| 13 | [The full game page: stats, devs, reviews & related](docs/commits/13_commit.md) |
| 14 | [Line-height + scroll-to-top feel fixes](docs/commits/14_commit.md) |
| 15 | [Motion & feel: smooth animations everywhere](docs/commits/15_commit.md) |

## How the incentive math works (short version)

- **Payout = bounty × multiplier(score)**, where the multiplier follows a logistic
  S-curve from 0.25× (score 0) through 1.6× (score 400) to a 3× ceiling (score 1000).
- Score grows only from **verified outcomes** (wishlist +1.0, key +1.5, demo +0.5,
  click +0.02), boosted up to 3× by a daily **streak**, soft-capped at 15 points/day,
  and **decays** ~0.6% per inactive day.
- Earnings settle after a **7-day pending window** so fraud can be voided before
  money moves; voided traffic also refunds the developer's budget.

## Deliberate omissions (PoC honesty)

- **No real payments or auth** — earnings are simulated numbers.
- **No real Steam integration** — Steam has no affiliate program, so the real product
  would use UTM-tracked wishlist bounties + off-Steam rev-share; here traffic is
  simulated by `src/engine/simulation.js`.
- **Fraud detection is illustrative** — one heuristic (velocity spike + dead
  conversion), not a production system; the Trust & Safety tab lists what's missing.

## Tech & look

Vite + React 19, zero runtime dependencies beyond React. Charts are hand-rolled SVG
(~150 lines each) with CVD-validated colors. State is one reducer over a seeded,
deterministic simulation — every reset replays the same world.

The visual identity is **neon arcade × Minecraft**: Press Start 2P + VT323 pixel
fonts, a code-drawn pixel shield-and-sword logo, beveled push-in buttons, segmented
XP bars, CRT scanlines, and a hand-drawn 8×8 pixel icon set (`src/components/PixelIcon.jsx`)
— no icon libraries, no image assets.

Akash Mannil