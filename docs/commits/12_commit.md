# Commit 12 — The Discover homepage + a browsable Quest Board

## What was done (in plain words)

This is the commit the user asked for: **"a flat quest list doesn't help the
audience."** QuestBoard now opens on a proper storefront homepage — think the
front page of Steam, but for indie discovery — and the Quest Board itself
became sortable and filterable instead of one long dump.

### The new front door: 🔷 Discover

Opening the app now lands on **Discover**, built entirely from the commit-11
discovery engine:

1. **A featured hero** — one big spotlight on the hottest game the player
   hasn't already grabbed. Clicking it opens that game's page.
2. **"Picked for you" / "Popular right now"** — a personalized shelf. For a
   brand-new player (no taste yet) it's honestly labelled *Popular right now*
   and shows trending games; once you've accepted a couple of quests the same
   shelf relabels to *Picked for you* and leans into your genres.
3. **Trending now** — games ranked by heat (recent wishlists + fresh promoter
   interest), side by side with…
4. **Genres gaining pace** — the standout feature. Each row is a genre with
   its week-over-week wishlist growth (*"Deckbuilder +1525%, 1 game"*). This
   is the shelf that hands a tiny or new genre a moment of exposure it would
   never get on a totals-ranked storefront — precisely the visibility lever
   indies lack.
5. **New on QuestBoard** — the newest listings, each wearing a green NEW
   badge, so a just-listed game is *seen first* instead of buried.
6. **Browse by genre** — a chip grid; click a genre to jump to the Quest
   Board pre-filtered to it.

Everything on the page is a clickable card that opens the game's page.

### The Quest Board grew a control bar

The board is no longer a fixed dump. Above the grid:

- **Sort:** Trending · Newest · Highest payout · Most budget left.
- **Genre filter:** a dropdown of every genre, plus a live count.
- Arriving from a "browse by genre" click on the homepage lands here with that
  genre already selected.

Each quest card's title is now a link, and a new "View details, reviews &
devs →" button opens the full game page.

### Game pages exist now (core version)

Every game is now its own page (`GamePage.jsx`): a back button, a big hero
(cover, studio, location, tags, pitch, star rating) and the **quest action
panel** — bounty prices, budget bar, and accept/tracked-link, so you can take
a quest straight from its page. The richer half of this page — a stats chart,
top promoters, the developer card, the full reviews section with a write-your-
own form, and related games — arrives in commit 13.

### Plumbing worth noting

- **Shared components** so every surface shows a game identically: `Cover`
  (the box art), `StarRating` (pixel stars, also an input), and `GameCard`
  (the compact clickable card used in every shelf and the browse grid).
- **Navigation** flows through the tiny `NavProvider` from commit 11 —
  clicking the logo or "Back to Discover" returns home, and none of it
  touches the simulation, so **Reset never knocks you off a game page**.

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `src/views/Discover.jsx` | The whole homepage: hero + five shelves. |
| `src/views/QuestBoard.jsx` | Now with sort chips, genre filter, and clickable cards. |
| `src/views/GamePage.jsx` | The game detail page (core; enriched next commit). |
| `src/components/GameCard.jsx` / `Cover.jsx` / `StarRating.jsx` | Shared game UI. |
| `src/App.jsx` | Route-driven shell with the new Discover tab. |

## How to see it

`npm run dev` opens on **Discover**. Click the featured game (or any card) to
see its page; hit **Browse by genre → Cozy** to land on the filtered board;
try the **Sort** chips. Accept a couple of cozy games, come back to Discover,
and watch the top shelf switch from "Popular right now" to "Picked for you".

## Words introduced in this commit

- **Storefront / shelf:** the row-of-cards layout stores use to curate many
  items into digestible, themed strips instead of one endless list.
- **Featured / hero:** the single large spotlight slot at the top of a
  storefront — the most valuable piece of exposure real estate.
- **Faceted browsing:** narrowing a catalogue by attributes (here: genre) and
  reordering it (sort) — the difference between a *list* and a *store*.
