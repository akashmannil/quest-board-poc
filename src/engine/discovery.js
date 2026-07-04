// ---------------------------------------------------------------------------
// The discovery engine — how QuestBoard decides what to *show*, not just what
// to pay for. Listing 19,000 games a year and calling it a store is the exact
// problem indies drown in; these functions are the anti-drowning layer.
//
// Everything here is a pure read over the world state, so the homepage and the
// Quest Board filters can compose them freely. All "recent" windows are in
// simulated days.
// ---------------------------------------------------------------------------

const RECENT_WINDOW = 7; // "trending" and "momentum" look at the last week
const NEW_WINDOW = 6; // listed within this many days = "new"

export function listedGames(state) {
  return Object.values(state.games).filter((g) => g.listedDay <= state.day);
}

export function allGenres(state) {
  const set = new Set();
  for (const g of listedGames(state)) for (const t of g.tags) set.add(t);
  return [...set].sort();
}

export function gamesInGenre(state, genre) {
  return listedGames(state).filter((g) => g.tags.includes(genre));
}

// --- review helpers -------------------------------------------------------

export function ratingSummary(game) {
  const rs = game.reviews;
  if (rs.length === 0) return { avg: 0, count: 0 };
  return {
    avg: rs.reduce((a, r) => a + r.rating, 0) / rs.length,
    count: rs.length,
  };
}

// --- per-game momentum ----------------------------------------------------

// Wishlists a game gained in the last `window` days (from its daily stats).
export function recentWishlists(game, currentDay, window = RECENT_WINDOW) {
  return game.dailyStats
    .filter((d) => d.day > currentDay - window)
    .reduce((a, d) => a + d.wishlists, 0);
}

// A "heat" score blends recent wishlists with how many promoters are pushing
// it — a game lots of promoters just picked up is heating up even before the
// wishlists land. Normalised loosely so the number reads 0–100-ish.
export function heatScore(state, game) {
  const recent = recentWishlists(game, state.day);
  const promoters = state.claims.filter((c) => c.gameId === game.id).length;
  return recent + promoters * 6;
}

// --- shelves --------------------------------------------------------------

// "Trending now": listed games ranked by heat.
export function trendingGames(state, limit = 6) {
  return listedGames(state)
    .map((g) => ({ game: g, heat: heatScore(state, g) }))
    .sort((a, b) => b.heat - a.heat)
    .slice(0, limit)
    .map((x) => x.game);
}

// "New on QuestBoard": most recently listed first. Always returns content
// (newest N) so the shelf never goes empty; `isNew()` says which still wear
// the NEW badge.
export function newGames(state, limit = 6) {
  return listedGames(state)
    .slice()
    .sort((a, b) => b.listedDay - a.listedDay)
    .slice(0, limit);
}

export function isNew(game, currentDay) {
  return game.listedDay >= currentDay - NEW_WINDOW;
}

// The single hero: the hottest game the player hasn't already claimed.
export function featuredGame(state) {
  const claimed = new Set(
    state.claims.filter((c) => c.promoterId === "you").map((c) => c.gameId)
  );
  const ranked = trendingGames(state, 20).filter((g) => !claimed.has(g.id));
  return ranked[0] ?? listedGames(state)[0] ?? null;
}

// --- genres gaining pace --------------------------------------------------

// For each genre, wishlists this recent window vs the window before it →
// a growth ratio. This is "what's getting hot", the shelf that gives a small
// genre its moment before the big storefronts notice.
export function genreMomentum(state, limit = 5) {
  const w = RECENT_WINDOW;
  const rows = allGenres(state).map((genre) => {
    const games = gamesInGenre(state, genre);
    let recent = 0;
    let prior = 0;
    for (const g of games) {
      for (const d of g.dailyStats) {
        if (d.day > state.day - w) recent += d.wishlists;
        else if (d.day > state.day - 2 * w) prior += d.wishlists;
      }
    }
    // +8 smoothing so a genre going 1→5 doesn't outrank 200→600.
    const growth = (recent + 8) / (prior + 8);
    return { genre, recent, prior, growth, games: games.length };
  });
  return rows
    .filter((r) => r.recent > 0)
    .sort((a, b) => b.growth - a.growth)
    .slice(0, limit);
}

// --- personalization ------------------------------------------------------

// Which genres the player leans toward, inferred from the quests they've
// accepted. A brand-new player has no taste vector yet — the homepage falls
// back to "trending" for them, which is the honest cold-start answer.
export function playerTasteGenres(state) {
  const mine = state.claims.filter((c) => c.promoterId === "you");
  const weights = {};
  for (const c of mine) {
    for (const t of state.games[c.gameId].tags) {
      weights[t] = (weights[t] ?? 0) + 1;
    }
  }
  return weights;
}

// "Picked for you": unclaimed games scored by overlap with the player's taste,
// tie-broken by heat. Empty taste → trending (the cold-start path).
export function recommendedGames(state, limit = 6) {
  const taste = playerTasteGenres(state);
  const claimed = new Set(
    state.claims.filter((c) => c.promoterId === "you").map((c) => c.gameId)
  );
  const candidates = listedGames(state).filter((g) => !claimed.has(g.id));

  if (Object.keys(taste).length === 0) {
    return { cold: true, games: trendingGames(state, limit) };
  }

  const scored = candidates
    .map((g) => {
      const affinity = g.tags.reduce((a, t) => a + (taste[t] ?? 0), 0);
      return { game: g, affinity, heat: heatScore(state, g) };
    })
    .filter((x) => x.affinity > 0)
    .sort((a, b) => b.affinity - a.affinity || b.heat - a.heat);

  return { cold: false, games: scored.slice(0, limit).map((x) => x.game) };
}

// --- related games (for the game page) ------------------------------------

// Games sharing the most tags with `game`, tie-broken by heat.
export function relatedGames(state, gameId, limit = 4) {
  const game = state.games[gameId];
  const tags = new Set(game.tags);
  return listedGames(state)
    .filter((g) => g.id !== gameId)
    .map((g) => ({
      game: g,
      shared: g.tags.filter((t) => tags.has(t)).length,
      heat: heatScore(state, g),
    }))
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.shared - a.shared || b.heat - a.heat)
    .slice(0, limit)
    .map((x) => x.game);
}

// --- top promoters of a game (for the game page) --------------------------

// Who is driving this game's outcomes, ranked by wishlists delivered.
export function topPromotersFor(state, gameId, limit = 5) {
  return state.claims
    .filter((c) => c.gameId === gameId)
    .map((c) => ({
      promoter: state.promoters[c.promoterId],
      wishlists: c.totals.wishlist,
      clicks: c.totals.click,
    }))
    .filter((r) => r.clicks > 0)
    .sort((a, b) => b.wishlists - a.wishlists)
    .slice(0, limit);
}
