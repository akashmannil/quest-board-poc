# Commit 11 — A bigger catalogue + the discovery engine

## What was done (in plain words)

Up to now QuestBoard had six games and one flat list to show them in. A store
with six items doesn't have a discovery problem — but the *whole point* of the
platform is solving discovery when there are thousands of games. So this
commit does two things: it grows the catalogue, and it builds the brain that
decides **what to show you**, which the next two commits turn into screens.

### The catalogue trebled: 6 → 18 games

Twelve new indie games joined, spread across far more genres (Horror, Samurai
action, deckbuilders, cozy-horror, steampunk management, rhythm fighters…).
Each game — old and new — gained three new kinds of information:

1. **A developer profile** — studio location, team size, year founded, and a
   short human bio ("a married couple and their two very demanding cats").
   This powers the dev card on the game page.
2. **Seed reviews** — one or two written player comments with a star rating,
   so the reviews section isn't empty on day one.
3. **A listing date** — *when* the game joined QuestBoard. Six of the new
   games were listed *after* day 0, which is what makes a "New on QuestBoard"
   shelf possible and real: they literally appear as the simulated days pass.

The rival promoters were also given more games to push, so the bigger
catalogue feels alive instead of half-empty.

### The discovery engine (`src/engine/discovery.js`)

This is the new brain — a set of pure functions that rank and group games the
way a storefront's homepage does. None of them change anything; they just
answer questions:

- **Trending now** — games ranked by "heat": recent wishlists plus how many
  promoters just picked them up (a game lots of promoters grabbed is heating
  up *before* the wishlists even land).
- **New on QuestBoard** — newest listings first, with a NEW badge for the
  genuinely recent ones.
- **Genres gaining pace** — for every genre, this week's wishlists vs last
  week's, as a growth ratio. This is the shelf that gives a *small* genre its
  moment before the giant storefronts notice — exactly the exposure lever
  indies never get. (A little smoothing stops a genre going from 1→5
  wishlists from outranking one going 200→600.)
- **Picked for you** — learns your taste from the quests you've accepted
  (accept two cozy games and it leans cozy), then recommends unclaimed games
  that match. A brand-new player has no taste yet, so it *honestly* falls
  back to Trending — the "cold start" problem every recommender has, handled
  out loud instead of faked.
- **Related games** — games sharing the most genres with the one you're
  looking at, for the "you might also like" row on a game page.
- **Top promoters of a game** — who's actually driving a game's wishlists,
  for the game page's credits.

### Reviews you can write

State now carries each game's reviews as live data (seed reviews + anything
you add), and a new `POST_REVIEW` action lets the player leave their own
star-rated comment. The screen for it arrives in commit 13; the plumbing is
here.

### Navigation, without a router

A tiny `NavProvider` (`src/state/Nav.jsx`) tracks which screen you're on and
which game you've opened — 20 lines instead of a routing library, and kept
*separate* from the simulation so that pressing Reset never throws you off
the page you're reading.

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `src/data/seed.js` | 18 games now, each with dev profile, reviews, listing date; rival claims extracted here too. |
| `src/engine/discovery.js` | The whole ranking brain: trending, new, momentum, recommendations, related, top promoters. |
| `src/engine/simulation.js` | Unlisted games produce no traffic until their day; `postReview`; reviews seeded into state. |
| `src/state/Nav.jsx` | The minimal screen/game navigation store. |

## How to check it (for the curious)

The app looks the same for one more commit (the screens come next), but the
engine is testable from the terminal:

```bash
node -e "import('./src/engine/discovery.js').then(async d => {
  const s = (await import('./src/engine/simulation.js')).buildInitialState();
  console.log(d.genreMomentum(s, 4).map(m => m.genre + ' x' + m.growth.toFixed(1)));
})"
```

## Words introduced in this commit

- **Cold start:** a recommender's problem of having no data about a brand-new
  user yet. QuestBoard answers it by showing trending games until you've
  accepted enough quests to reveal a taste.
- **Heat / momentum:** short-term measures of what's rising *right now*,
  as opposed to all-time totals — how a storefront surfaces the new and the
  climbing instead of only the already-huge.
- **Taste vector:** the little tally of which genres you lean toward,
  inferred from your actions, used to personalise recommendations.
