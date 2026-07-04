# QuestBoard — Indie Game Promotion Marketplace (PoC)

**The problem:** indie developers don't fail at making games — they fail at getting *seen*.
Roughly 19,000 games launch on Steam every year, storefront visibility is driven by
wishlists and sales velocity, and paid marketing costs more than most indie budgets.

**The idea:** a two-sided marketplace where devs pay for *outcomes* instead of upfront
marketing spend, and **anyone** — streamers, TikTokers, bloggers, or a total beginner
with zero followers — can earn money by promoting indie games.

- **Devs** list their game as a "quest" with a bounty (e.g. $0.40 per verified wishlist).
- **Promoters** accept quests, get a unique tracked link, and earn per verified outcome.
- An **Exposure Score** rewards consistent, quality promotion: everyone starts small,
  earnings grow steeply with proven work (an S-curve), then plateau — so the top 1%
  can't eat the whole market and newcomers always have a ladder to climb.

This is a **proof of concept**: all traffic, payments, and accounts are simulated
in the browser. No backend, no real Steam integration (see *Deliberate omissions* below).

## Run it

```bash
npm install
npm run dev
```

## Commit-by-commit documentation

Every feature was built in its own commit, and every commit has a plain-language
write-up in [docs/commits/](docs/commits/) aimed at beginners and non-coders:

| Commit | Doc |
| ------ | --- |
| 1 | [Project skeleton & app shell](docs/commits/1_commit.md) |

## Deliberate omissions (PoC honesty)

- **No real payments or auth** — earnings are simulated numbers.
- **No real Steam integration** — Steam has no affiliate program, so the real product
  would use UTM-tracked wishlist bounties + off-Steam rev-share; here traffic is simulated.
- **Fraud detection is illustrative** — the Trust & Safety panel shows the *design*,
  not a production system.
