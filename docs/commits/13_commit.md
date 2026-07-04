# Commit 13 — The full game page: stats, devs, reviews & related games

## What was done (in plain words)

Commit 12 gave every game a page with a hero and a "take the quest" panel.
This commit fills in everything else the user asked for — so a game page is now
a real destination, the way a Steam store page is, not just a bigger card.

Open any game (from Discover, the Quest Board, a related row, anywhere) and
below the hero you now get a two-column layout:

### The main column

1. **Wishlists per day** — a bar chart of this specific game's traffic over
   the last 30 days, headlined by its totals: *"1,163 wishlists · 650 demos ·
   30 keys · $858 paid out to promoters."* A dev can see their campaign's
   pulse; a promoter can see whether a game still has momentum worth joining.
2. **Player reviews** — the star average, the full list of comments, and — the
   interactive part — **a form to write your own**: pick a star rating, type
   up to 280 characters, post. Your review appears instantly, pinned to the
   top and highlighted as yours. (You can only review a game once.) This is the
   "comments or reviews from the person" the user wanted, and it's fully live
   thanks to the `POST_REVIEW` plumbing from commit 11.

### The sidebar

3. **Take the quest** — the same accept / tracked-link panel from commit 12.
4. **The developer** — the studio card: location, team size, year founded, and
   the human bio ("Three marine-biology dropouts who kept the fish obsession").
   Indies live and die on personal connection; this is where the audience meets
   the people, not just the product.
5. **Top promoters** — who is actually driving this game's wishlists, ranked,
   with the player highlighted if they're on the board. This answers "who is
   popular" for a game and doubles as social proof.

### Below everything: Related games

A "you might also like" shelf of games sharing the most genres, each a
clickable card — so one game page leads naturally to the next, which is how
discovery is supposed to feel.

### Verified by actually playing it

Driven end-to-end in a headless browser: advanced 30 simulated days, opened the
featured game, **posted a review and watched the count go 2 → 3**, confirmed
the top-promoters list, the dev card, and the related-games row (Deep Sea Diner
→ Clockwork Bakery & Star Depot, both Management games). Zero console errors,
no horizontal overflow at phone width.

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `src/views/GamePage.jsx` | The full page: hero, stats, reviews + write form, dev card, top promoters, related. |
| `src/index.css` | The two-column game layout, dev card, promoter list, and review styles. |

## How to see it

`npm run dev` → open any game → advance a few days for the chart to fill →
scroll down, read the reviews, and **post your own** with a star rating. Click
a related game at the bottom to hop to the next page.

## Words introduced in this commit

- **Store page:** a per-item destination gathering everything about one thing —
  media, stats, the maker, and community reviews — in one place.
- **Social proof:** signals that others value something (ratings, "top
  promoters", review counts) that help a newcomer trust it.
- **Controlled input:** a form field whose value lives in app state (the review
  text and star rating), so the UI and the data can never disagree.
