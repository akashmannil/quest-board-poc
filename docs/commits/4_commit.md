# Commit 4 — The Quest Board (the marketplace)

## What was done (in plain words)

The first real screen! The 🗺️ **Quest Board** tab now shows the marketplace
where the two sides of the platform meet:

- **Developers** put their game up as a *quest*, funded with a budget and
  priced per outcome ("I'll pay $0.45 for every verified wishlist").
- **Promoters** browse the quests, pick one, and hit **Accept quest**.

### What's on each game card

Reading a card top to bottom, you see the whole business model:

1. **Art + title + pitch** — the game selling itself, like a storefront.
2. **Bounty prices** — what the dev pays per ⭐ wishlist, ⬇️ demo, 🔑 key.
   Note these are *outcome* prices: nobody gets paid for posting, only for
   results. That's the whole thesis of the platform.
3. **The budget bar** — how much of the dev's money is left. It drains as
   promoters deliver outcomes, and when it hits zero the quest **closes**
   (try autoplaying \~40 days and watch cards grey out — just like a real ad
   campaign ending).
4. **Who's already promoting it** — the row of rival avatars.
5. **The Accept button**, which shows *your personal rate*: the bounty × your
   Exposure Score multiplier. As a newcomer you'll see roughly $0.12 per
   wishlist on a $0.45 bounty. Level up and that same button offers you more —
   the S-curve from commit 2, now visible in the UI.

### The tracked link (the key idea of this screen)

Accept a quest and the card flips to show something like:

```
questboard.gg/q/moonpetal?ref=you&utm_campaign=qb11
```

Click it to copy. This link is how a real platform would *prove* you caused an
outcome: everyone you send through it is tagged as yours (`ref=you`), so the
wishlist that follows is credited — and paid — to you. This is called
**attribution**, and it's what makes "pay for outcomes" possible at all.
(In this PoC the link doesn't go anywhere; the simulator from commit 3
invents the traffic it would have produced.)

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `src/views/QuestBoard.jsx` | The whole marketplace screen: cards, budget bars, accept flow, copy-link. |
| `src/index.css` | Grew the card styles (grid, budget bar, tags, closed state). |
| `src/App.jsx` | Now routes the first tab to the real Quest Board instead of a placeholder. |

## How to see it

`npm run dev` → the Quest Board is the opening tab. Accept a quest or two,
press **⏭ Advance day** a few times, and watch budget bars drain and your
wishlist counts appear. Then hit **↺ Reset** and it all plays back the same.

## Words introduced in this commit

- **Attribution:** proving which promoter caused an outcome, via a unique
  tracked link (`ref=you`). No attribution → no way to pay for results.
- **UTM parameters:** the `utm_campaign=...` part of the link — an industry
  standard for tagging where traffic came from; Steam's analytics can read
  these, which is what makes wishlist bounties plausible in the real world.
- **Quest closed:** the dev's budget is fully spent; the campaign is over.
