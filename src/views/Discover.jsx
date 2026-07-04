// The Steam-style storefront homepage: a featured hero, a personalized shelf,
// what's trending, which genres are heating up, what's new, and a browse-by-
// genre grid. This is the answer to "a flat quest list doesn't help the
// audience" — it's curation, ranked by the discovery engine.

import { useApp } from "../state/AppState.jsx";
import { useNav } from "../state/Nav.jsx";
import {
  featuredGame,
  recommendedGames,
  trendingGames,
  genreMomentum,
  newGames,
  heatScore,
  ratingSummary,
  gamesInGenre,
  allGenres,
} from "../engine/discovery.js";
import Cover from "../components/Cover.jsx";
import StarRating from "../components/StarRating.jsx";
import PixelIcon from "../components/PixelIcon.jsx";
import GameCard, { heatFooter } from "../components/GameCard.jsx";

function Shelf({ icon, title, sub, children }) {
  return (
    <section className="shelf">
      <div className="shelf-head">
        <h3>
          <PixelIcon name={icon} size={14} /> {title}
        </h3>
        {sub && <p className="shelf-sub">{sub}</p>}
      </div>
      <div className="shelf-row">{children}</div>
    </section>
  );
}

function FeaturedHero({ game }) {
  const { state } = useApp();
  const { openGame } = useNav();
  const rating = ratingSummary(game);
  return (
    <button className="hero" onClick={() => openGame(game.id)}>
      <Cover game={game} height={240} emojiSize={110} badge="FEATURED" />
      <div className="hero-body">
        <p className="hero-kicker">
          <PixelIcon name="flame" size={12} color="var(--neon-red)" /> Hottest quest on the board
        </p>
        <h2 className="hero-title">{game.title}</h2>
        <p className="hero-studio">{game.studio}</p>
        <p className="hero-pitch">{game.pitch}</p>
        <div className="hero-tags">
          {game.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <div className="hero-meta">
          {rating.count > 0 && <StarRating value={rating.avg} size={13} count={rating.count} />}
          <span className="hero-heat">
            <PixelIcon name="flame" size={12} color="var(--neon-red)" /> heat{" "}
            {Math.round(heatScore(state, game))}
          </span>
          <span className="hero-cta">View game →</span>
        </div>
      </div>
    </button>
  );
}

function MomentumRow({ row, onOpen }) {
  const pct = Math.round((row.growth - 1) * 100);
  return (
    <button className="momentum-row" onClick={() => onOpen(row.genre)}>
      <div className="momentum-main">
        <span className="momentum-genre">{row.genre}</span>
        <span className="momentum-count">
          {row.recent} wishlists this week · {row.games} game
          {row.games === 1 ? "" : "s"}
        </span>
      </div>
      <span className="momentum-growth">
        <PixelIcon name="rocket" size={12} color="var(--neon-green)" /> +{pct}%
      </span>
    </button>
  );
}

export default function Discover() {
  const { state } = useApp();
  const { browseGenre } = useNav();

  const featured = featuredGame(state);
  const rec = recommendedGames(state, 6);
  const trending = trendingGames(state, 6);
  const momentum = genreMomentum(state, 5);
  const fresh = newGames(state, 6);
  const genres = allGenres(state);

  // browse-by-genre: pick the 6 genres with the most games for a tidy grid
  const topGenres = genres
    .map((g) => ({ genre: g, n: gamesInGenre(state, g).length }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 8);

  const openGenre = browseGenre;

  return (
    <section className="discover">
      <div className="view-intro">
        <h2>
          <PixelIcon name="gem" size={18} /> Discover
        </h2>
        <p>
          {state.games ? Object.keys(state.games).length : 0} indie games, ranked
          so the good ones surface instead of drowning. Everything here is
          clickable — open a game to read reviews, meet the devs, and take the
          quest.
        </p>
      </div>

      {featured && <FeaturedHero game={featured} />}

      <Shelf
        icon="star"
        title={rec.cold ? "Popular right now" : "Picked for you"}
        sub={
          rec.cold
            ? "Accept a few quests and this shelf learns your taste — for now, here's what everyone's promoting."
            : "Based on the genres of quests you've already accepted."
        }
      >
        {rec.games.map((g) => (
          <GameCard key={g.id} game={g} footer={heatFooter(heatScore(state, g))} />
        ))}
      </Shelf>

      <div className="discover-split">
        <Shelf icon="flame" title="Trending now" sub="Recent wishlists + fresh promoter interest.">
          {trending.slice(0, 4).map((g) => (
            <GameCard key={g.id} game={g} footer={heatFooter(heatScore(state, g))} />
          ))}
        </Shelf>

        <section className="shelf momentum-panel">
          <div className="shelf-head">
            <h3>
              <PixelIcon name="rocket" size={14} /> Genres gaining pace
            </h3>
            <p className="shelf-sub">This week's wishlists vs last week's.</p>
          </div>
          <div className="momentum-list">
            {momentum.map((row) => (
              <MomentumRow key={row.genre} row={row} onOpen={openGenre} />
            ))}
          </div>
        </section>
      </div>

      <Shelf
        icon="rocket"
        title="New on QuestBoard"
        sub="Fresh indie listings — the exposure boost of being seen first."
      >
        {fresh.map((g) => (
          <GameCard key={g.id} game={g} footer={<span className="footer-day">day {g.listedDay}</span>} />
        ))}
      </Shelf>

      <section className="shelf">
        <div className="shelf-head">
          <h3>
            <PixelIcon name="map" size={14} /> Browse by genre
          </h3>
        </div>
        <div className="genre-grid">
          {topGenres.map(({ genre, n }) => (
            <button key={genre} className="genre-chip" onClick={() => openGenre(genre)}>
              <span>{genre}</span>
              <span className="genre-count">{n}</span>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}
